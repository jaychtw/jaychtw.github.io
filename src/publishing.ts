import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import MarkdownIt from "markdown-it";
import { parseDocument } from "yaml";
import { object, text, tags, slug, localAsset, httpsURL } from "./catalog.ts";
import type { Article, Collection, Media } from "./model.ts";

function safeLink(url: string): boolean {
  if (/^[#]/u.test(url)) return !/[\s\\]/u.test(url);
  if (/^\/(?!\/)/u.test(url))
    return (
      !/[\\\s]/u.test(url) &&
      !/%(?:2e|2f|5c|0[0-9a-f]|1[0-9a-f])/iu.test(url) &&
      !url.split(/[/?#]/u).includes("..")
    );
  if (/^mailto:[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/u.test(url))
    return true;
  try {
    httpsURL(url, "Markdown link");
    return true;
  } catch {
    return false;
  }
}
const parser = () => {
  const md = new MarkdownIt({
    html: false,
    linkify: false,
    typographer: false,
  });
  md.validateLink = safeLink;
  return md;
};
export function parseArticle(
  source: string,
  id: string,
  collection: string,
  publicDir: string,
): Article {
  slug(id, "article filename");
  const match = source.match(
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/u,
  );
  if (!match) throw new Error(`${id}: expected YAML front matter`);
  const doc = parseDocument(match[1], { uniqueKeys: true });
  if (doc.errors.length)
    throw new Error(`${id}: invalid YAML: ${doc.errors[0].message}`);
  const meta = object(doc.toJS({ maxAliasCount: 0 }), `${id}: front matter`);
  const allowed = ["title", "date", "status", "excerpt", "tags", "cover"];
  for (const key of Object.keys(meta))
    if (!allowed.includes(key))
      throw new Error(`${id}: unknown front matter field ${key}`);
  const title = text(meta.title, `${id}.title`),
    date = text(meta.date, `${id}.date`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/u.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw new Error(`${id}: invalid date`);
  const status = meta.status ?? "draft";
  if (status !== "draft" && status !== "published")
    throw new Error(`${id}: invalid status`);
  const excerpt =
    meta.excerpt === undefined ? "" : text(meta.excerpt, `${id}.excerpt`);
  const articleTags = tags(meta.tags ?? [], `${id}.tags`);
  const cover =
    meta.cover === undefined || meta.cover === null
      ? null
      : localAsset(meta.cover, publicDir);
  const markdown = match[2];
  if (status === "published" && !markdown.trim())
    throw new Error(`${id}: published article is empty`);
  const images: string[] = [];
  const walk = (tokens: ReturnType<ReturnType<typeof parser>["parse"]>) => {
    for (const t of tokens) {
      if (t.type === "image")
        images.push(localAsset(t.attrGet("src"), publicDir));
      if (t.children) walk(t.children);
    }
  };
  walk(parser().parse(markdown, {}));
  return {
    id,
    collection,
    title,
    date,
    status,
    excerpt,
    tags: articleTags,
    cover,
    markdown,
    images,
  };
}
export function loadArticles(
  root: string,
  collections: Collection[],
): Article[] {
  const base = resolve(root, "content/articles");
  if (!existsSync(base)) return [];
  const files = readdirSync(base, { recursive: true, encoding: "utf8" })
    .filter((p) => p.endsWith(".md"))
    .sort();
  return files.map((file) => {
    const parts = String(file).split("/");
    if (
      parts.length !== 2 ||
      !collections.some((c) => c.id === parts[0] && c.type === "editorial")
    )
      throw new Error(`Unknown article collection/path: ${file}`);
    return parseArticle(
      readFileSync(resolve(base, file), "utf8"),
      parts[1].slice(0, -3),
      parts[0],
      resolve(root, "public"),
    );
  });
}
export function renderMarkdown(
  article: Article,
  images: Map<string, Media>,
): string {
  const md = parser();
  const image = md.renderer.rules.image!;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx],
      source = String(token.attrGet("src"));
    const media = images.get(source);
    if (!media) throw new Error(`Unbuilt article image: ${source}`);
    token.attrSet("src", media.src);
    token.attrSet("srcset", media.srcset);
    token.attrSet("sizes", "(max-width: 760px) calc(100vw - 40px), 720px");
    token.attrSet("width", String(media.width));
    token.attrSet("height", String(media.height));
    token.attrSet("loading", "lazy");
    token.attrSet("decoding", "async");
    return image(tokens, idx, options, env, self);
  };
  return md.render(article.markdown);
}

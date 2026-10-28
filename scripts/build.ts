import {
  existsSync,
  readFileSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { loadContent, published, sha256, localAsset } from "../src/catalog.ts";
import {
  collectionPage,
  compatibility,
  detail,
  detailPath,
  articlePage,
} from "../src/render.ts";
import { loadArticles } from "../src/publishing.ts";
import { page } from "../src/components/html.ts";
import type { RenderContext, Media } from "../src/model.ts";
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function build(inputRoot = root): Promise<void> {
  const output = resolve(inputRoot, "dist"),
    artifact = resolve(inputRoot, ".artifacts"),
    ownership = resolve(artifact, "build-owner.json");
  const owned =
    existsSync(ownership) &&
    JSON.parse(readFileSync(ownership, "utf8")).directory === output;
  if (
    existsSync(output) &&
    !owned &&
    !existsSync(resolve(output, ".possibility-build"))
  )
    throw new Error("Refusing to replace an unrecognized dist directory");
  const { site, projects, collections } = loadContent(inputRoot);
  const articles = loadArticles(inputRoot, collections).filter(
    (a) => a.status === "published",
  );
  const activeCollections = new Set([
    ...published(projects).map((p) => p.category),
    ...articles.map((a) => a.collection),
  ]);
  if (!activeCollections.has(site.homepageCollection))
    throw new Error("Homepage collection must contain published content");
  // Build into memory first. Invalid metadata or images cannot destroy the last valid preview.
  const files = new Map<string, string | Buffer>();
  const put = (name: string, data: string | Buffer) => {
    if (!name.startsWith("/") || name.includes("..") || files.has(name))
      throw new Error(`Unsafe or duplicate output route: ${name}`);
    files.set(name, data);
  };
  const fingerprint = (source: string, kind: string) => {
    const bytes = readFileSync(resolve(inputRoot, source));
    const path = `/assets/possibility/${kind}.${sha256(bytes).slice(0, 12)}.${extname(source).slice(1)}`;
    put(path, bytes);
    return path;
  };
  const ctx: RenderContext = {
    site,
    collections,
    activeCollections,
    images: new Map(),
    style: fingerprint("src/styles/platform.css", "site"),
    script: fingerprint("src/client/site.js", "site"),
    themeScript: fingerprint("src/client/theme.js", "theme"),
    favicon: fingerprint("public/favicon.svg", "favicon"),
  };
  const assets: Record<string, unknown>[] = [];
  const cache = new Map<string, Media>();
  async function image(
    path: string,
    source: Media["source"],
    crop = true,
  ): Promise<Media> {
    const key = path + ":" + crop;
    const existing = cache.get(key);
    if (existing) return { ...existing, source };
    localAsset(path, resolve(inputRoot, "public"));
    const bytes = readFileSync(resolve(inputRoot, "public", "." + path));
    const meta = await sharp(bytes, { limitInputPixels: 40000000 }).metadata();
    if (!meta.width || !meta.height || (meta.pages || 1) > 1)
      throw new Error(`Invalid or animated image: ${path}`);
    const widths = [480, 960, 1600].filter((w) => w <= meta.width!);
    if (!widths.length) widths.push(meta.width);
    const variants: {
      src: string;
      width: number;
      height: number;
      sha256: string;
    }[] = [];
    for (const width of widths) {
      const result = await sharp(bytes, { limitInputPixels: 40000000 })
        .rotate()
        .resize({
          width,
          ...(crop
            ? {
                height: Math.round((width * 9) / 16),
                fit: "cover" as const,
                position: "centre",
              }
            : {}),
          withoutEnlargement: true,
        })
        .webp({ quality: 82, effort: 5 })
        .toBuffer({ resolveWithObject: true });
      const hash = sha256(result.data),
        target = path.replace(
          /\.[^.]+$/u,
          `.${width}.${hash.slice(0, 12)}.webp`,
        );
      if (!files.has(target)) put(target, result.data);
      variants.push({
        src: target,
        width: result.info.width,
        height: result.info.height,
        sha256: hash,
      });
    }
    const selected =
      variants.find((v) => v.width >= 960) || variants[variants.length - 1];
    const media: Media = {
      src: selected.src,
      srcset: variants.map((v) => `${v.src} ${v.width}w`).join(", "),
      width: selected.width,
      height: selected.height,
      source,
    };
    cache.set(key, media);
    assets.push({
      sourcePath: path,
      sourceSha256: sha256(bytes),
      kind: source,
      crop: crop ? "16:9 center crop" : "original proportions",
      variants,
    });
    return media;
  }
  for (const p of published(projects)) {
    const cover = `/assets/covers/${p.category}/${p.id}.webp`;
    const screenshot = p.thumbnail
      ? await image(p.thumbnail.path, "screenshot")
      : null;
    let custom: Media | null = null;
    if (existsSync(resolve(inputRoot, "public", "." + cover))) {
      // Malformed images do not remove an otherwise functional published project.
      try {
        custom = await image(cover, "cover");
      } catch (error) {
        if (
          String(error).includes("escapes") ||
          String(error).includes("Unsafe")
        )
          throw error;
        assets.push({
          sourcePath: cover,
          invalid: true,
          fallback: screenshot ? "screenshot" : "placeholder",
          reason: String(error),
        });
        console.warn(
          `Invalid cover for ${p.id}; using ${screenshot ? "screenshot" : "placeholder"}.`,
        );
      }
    }
    const media = custom
      ? {
          ...custom,
          ...(screenshot
            ? { fallback: screenshot.src, fallbackAlt: p.thumbnail?.alt }
            : {}),
        }
      : screenshot;
    if (media) ctx.images.set(`project:${p.id}`, media);
    assets.push({
      project: p.id,
      selected: custom ? "cover" : screenshot ? "screenshot" : "placeholder",
      source: custom ? cover : p.thumbnail?.path || null,
    });
  }
  for (const a of articles) {
    if (a.cover && !ctx.images.has(`cover:${a.cover}`))
      ctx.images.set(`cover:${a.cover}`, await image(a.cover, "article"));
    for (const path of a.images)
      if (!ctx.images.has(path))
        ctx.images.set(path, await image(path, "article", false));
  }
  const routes: string[] = [];
  for (const c of collections.filter((c) => activeCollections.has(c.id))) {
    const path = c.id === site.homepageCollection ? "/" : `/${c.id}/`;
    put(path + "index.html", collectionPage(c, projects, articles, ctx));
    routes.push(path);
    if (path === "/") put(`/${c.id}/index.html`, compatibility(c.id, ctx));
  }
  for (const p of published(projects)) {
    const path = detailPath(p);
    put(path + "index.html", detail(p, ctx));
    routes.push(path);
  }
  for (const a of articles) {
    const path = `/${a.collection}/${a.id}/`;
    put(path + "index.html", articlePage(a, ctx));
    routes.push(path);
  }
  put(
    "/404.html",
    page(ctx, {
      title: "Page not found · Possibility",
      description: "This page could not be found.",
      path: "/404.html",
      noindex: true,
      body: '<main id="main" class="site-main" tabindex="-1"><h1>Page not found</h1><p><a href="/">Return to Possibility</a></p></main>',
    }),
  );
  put(
    "/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      routes
        .map((p) => `<url><loc>${site.canonicalOrigin + p}</loc></url>`)
        .join("") +
      "</urlset>\n",
  );
  put(
    "/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${site.canonicalOrigin}/sitemap.xml\n`,
  );
  put("/.nojekyll", "");
  put("/favicon.svg", readFileSync(resolve(inputRoot, "public/favicon.svg")));
  const commit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  const dirty =
    execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], {
      cwd: root,
      encoding: "utf8",
    }).trim().length > 0;
  const version = JSON.parse(
    readFileSync(resolve(inputRoot, "package.json"), "utf8"),
  ).version;
  put(
    "/build-info.json",
    JSON.stringify(
      {
        name: site.name,
        version,
        sourceCommit: commit,
        sourceDirty: dirty || inputRoot !== root,
        ...(inputRoot !== root ? { fixtureOnly: true } : {}),
        designVersion: site.designVersion,
        designAuthority: "Platform v1.0 textual amendment",
        homepageCollection: site.homepageCollection,
        routes,
        compatibility: [`/${site.homepageCollection}/`],
      },
      null,
      2,
    ) + "\n",
  );
  rmSync(output, { recursive: true, force: true });
  mkdirSync(artifact, { recursive: true });
  writeFileSync(
    ownership,
    JSON.stringify({ directory: output, site: "Possibility" }) + "\n",
  );
  for (const [path, data] of files) {
    const target = resolve(output, "." + path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, data);
  }
  writeFileSync(
    resolve(artifact, "asset-evidence.json"),
    JSON.stringify(assets, null, 2) + "\n",
  );
  console.log(
    `Built ${routes.length} canonical routes; ${published(projects).length} projects; ${articles.length} articles. No public deployment.`,
  );
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();

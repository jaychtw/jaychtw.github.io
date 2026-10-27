import type { Project, RenderContext, Collection, Article } from "./model.ts";
import { published } from "./catalog.ts";
import { page, escape, collectionPath } from "./components/html.ts";
import {
  gallery,
  thumbnail,
  picture,
  readingImageSizes,
} from "./components/gallery.ts";
import { renderMarkdown } from "./publishing.ts";
export const detailPath = (p: Project) => `/${p.category}/${p.id}/`;
export function collectionPage(
  c: Collection,
  projects: Project[],
  articles: Article[],
  ctx: RenderContext,
): string {
  const path = collectionPath(c.id, ctx);
  const work = published(projects).filter((p) => p.category === c.id);
  const entries = articles
    .filter((a) => a.collection === c.id && a.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  const body =
    c.type === "gallery"
      ? `<h1 class="visually-hidden">${escape(c.title)}</h1>${work.length ? gallery(work, ctx) : "<p>No published projects are available.</p>"}`
      : `<header class="editorial-heading"><h1>${escape(c.title)}</h1><p>${escape(c.description)}</p></header><div class="article-index">${entries.map((a) => `<article>${a.cover ? `<a href="/${a.collection}/${a.id}/" tabindex="-1" aria-hidden="true">${picture(ctx.images.get(`cover:${a.cover}`)!, "", false, readingImageSizes)}</a>` : ""}<time datetime="${a.date}">${a.date}</time><h2><a href="/${a.collection}/${a.id}/">${escape(a.title)}</a></h2>${a.excerpt ? `<p>${escape(a.excerpt)}</p>` : ""}${a.tags.length ? `<p class="card-tags">${a.tags.map(escape).join(" · ")}</p>` : ""}</article>`).join("")}</div>`;
  return page(ctx, {
    title: path === "/" ? ctx.site.name : `${c.title} · ${ctx.site.name}`,
    description: c.description,
    path,
    active: c.id,
    className: c.id === "what-now" ? "editorial what-now" : `${c.type}-page`,
    body: `<main id="main" class="site-main" tabindex="-1">${body}</main>`,
  });
}
export function compatibility(id: string, ctx: RenderContext): string {
  return page(ctx, {
    title: `${ctx.collections.find((c) => c.id === id)!.title} · ${ctx.site.name}`,
    description: "Continue to the collection.",
    path: `/${id}/`,
    redirect: "/",
    active: id,
    body: '<main id="main" class="site-main" tabindex="-1"><p><a href="/">Continue to the gallery</a></p></main>',
  });
}
export function detail(p: Project, ctx: RenderContext): string {
  const languages = p.languages
    .map((l) => ({ en: "English", "zh-TW": "Traditional Chinese" })[l] || l)
    .join(", ");
  return page(ctx, {
    title: `${p.title} · ${ctx.site.name}`,
    description: p.summary,
    path: detailPath(p),
    active: p.category,
    image: ctx.images.get(`project:${p.id}`)?.src,
    body: `<main id="main" class="detail" tabindex="-1"><article><a class="back-link" href="${collectionPath(p.category, ctx)}">Back to ${escape(ctx.collections.find((c) => c.id === p.category)!.title)}</a><h1>${escape(p.title)}</h1><p class="card-tags">${p.tags.map(escape).join(" · ")}</p><p>${escape(p.summary)}</p>${thumbnail(p, ctx, true, readingImageSizes)}<a class="primary-action" href="${escape(p.destination.url)}" rel="external noopener noreferrer">${p.destination.action === "play" ? "Play" : "Open"} ${escape(p.title)}</a><dl>${p.controls ? `<dt>Controls</dt><dd>${escape(p.controls)}</dd>` : ""}${languages ? `<dt>Languages</dt><dd>${escape(languages)}</dd>` : ""}${p.limitations ? `<dt>Before you ${p.category === "games" ? "play" : "open"}</dt><dd>${escape(p.limitations)}</dd>` : ""}</dl>${p.repositoryUrl ? `<p><a href="${escape(p.repositoryUrl)}" rel="external noopener noreferrer">Source on GitHub</a></p>` : ""}</article></main>`,
  });
}
export function articlePage(a: Article, ctx: RenderContext): string {
  const c = ctx.collections.find((c) => c.id === a.collection)!;
  return page(ctx, {
    title: `${a.title} · ${c.title} · ${ctx.site.name}`,
    description: a.excerpt || a.title,
    path: `/${a.collection}/${a.id}/`,
    active: a.collection,
    image: a.cover ? ctx.images.get(`cover:${a.cover}`)?.src : undefined,
    className: a.collection === "what-now" ? "editorial what-now" : "editorial",
    body: `<main id="main" class="article-page" tabindex="-1"><article><header><a class="back-link" href="${collectionPath(c.id, ctx)}">${escape(c.title)}</a><h1>${escape(a.title)}</h1><time datetime="${a.date}">${a.date}</time>${a.tags.length ? `<p class="card-tags">${a.tags.map(escape).join(" · ")}</p>` : ""}</header>${a.cover ? `<div class="article-cover">${picture(ctx.images.get(`cover:${a.cover}`)!, `${a.title} cover`, true, readingImageSizes)}</div>` : ""}<div class="prose">${renderMarkdown(a, ctx.images)}</div></article></main>`,
  });
}

import type { Project, RenderContext } from "./model.ts";
import { published } from "./catalog.ts";
import { page, escape } from "./components/html.ts";
import { sunlight } from "./components/sunlight.ts";
import { gallery, thumbnail } from "./components/gallery.ts";
export const detailPath = (p: Project) => `/${p.category}/${p.id}/`;
export function home(projects: Project[], ctx: RenderContext): string {
  const work = published(projects).filter((p) => p.featured);
  return page(ctx, {
    title: ctx.site.name,
    description: ctx.site.description,
    path: "/",
    className: "home",
    body: `<main>${sunlight(ctx.site, work.length > 0)}${work.length ? `<section id="portfolio" class="portfolio portfolio-inline" aria-labelledby="portfolio-heading" tabindex="-1"><h2 id="portfolio-heading" class="visually-hidden">Creative work</h2>${gallery(work, ctx, 3)}</section>` : ""}</main>`,
  });
}
export function games(projects: Project[], ctx: RenderContext): string {
  const work = published(projects).filter((p) => p.category === "games");
  return page(ctx, {
    title: `Games · ${ctx.site.name}`,
    description: "Games to explore and play.",
    path: "/games/",
    body: `<header class="portfolio-header"><a class="wordmark" href="/">${escape(ctx.site.name)}</a></header><main><h1 class="visually-hidden">Games</h1>${work.length ? gallery(work, ctx, 2) : '<p class="catalog-error">No published games are available.</p>'}</main>`,
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
    image: p.thumbnail ? ctx.images.get(p.thumbnail.path) : undefined,
    body: `<main class="detail"><nav aria-label="Site"><a href="/">${escape(ctx.site.name)}</a>${p.category === "games" ? '<a href="/games/">Games</a>' : ""}</nav><article><h1>${escape(p.title)}</h1><p>${escape(p.summary)}</p>${thumbnail(p, ctx, true)}<a class="primary-action" href="${escape(p.destination.url)}" rel="external noopener noreferrer">${escape(p.destination.action[0].toUpperCase() + p.destination.action.slice(1))} ${escape(p.title)} <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 13 13 3M3 3h10v10" stroke="currentColor" stroke-width="1.2"/></svg></a><dl>${p.controls ? `<dt>Controls</dt><dd>${escape(p.controls)}</dd>` : ""}${languages ? `<dt>Languages</dt><dd>${escape(languages)}</dd>` : ""}${p.limitations ? `<dt>${p.category === "games" ? "Before you play" : "Notes"}</dt><dd>${escape(p.limitations)}</dd>` : ""}</dl>${p.repositoryUrl ? `<footer><a href="${escape(p.repositoryUrl)}" rel="external noopener noreferrer">Source${new URL(p.repositoryUrl).hostname === "github.com" ? " on GitHub" : ""}</a></footer>` : ""}</article></main>`,
  });
}

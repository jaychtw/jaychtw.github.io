import type { Project, RenderContext, Media } from "../model.ts";
import { escape } from "./html.ts";
export function initials(title: string): string {
  return title
    .split(/[^\p{L}\p{N}]+/u)
    .filter((s) => s && !["the", "of", "a"].includes(s.toLowerCase()))
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}
export const readingImageSizes =
  "(max-width: 639px) calc(100vw - 40px), (max-width: 799px) calc(100vw - 80px), 720px";
export function picture(
  media: Media,
  alt: string,
  eager = false,
  sizes = "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 72px) / 2), (max-width: 1279px) calc((100vw - 144px) / 3), 379px",
): string {
  return `<img src="${escape(media.src)}" srcset="${escape(media.srcset)}" sizes="${escape(sizes)}" width="${media.width}" height="${media.height}" alt="${escape(alt)}" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async" data-image${media.fallback ? ` data-fallback="${escape(media.fallback)}" data-fallback-alt="${escape(media.fallbackAlt || alt)}"` : ""}>`;
}
export function thumbnail(
  p: Project,
  ctx: RenderContext,
  eager = false,
  sizes?: string,
): string {
  const media = ctx.images.get(`project:${p.id}`);
  return `<div class="work-media${media ? "" : " is-fallback"}"><span class="image-placeholder" aria-hidden="true">${escape(initials(p.title))}</span>${media ? picture(media, media.source === "cover" ? `${p.title} cover artwork` : p.thumbnail?.alt || `${p.title} screenshot`, eager, sizes) : `<span class="visually-hidden">${escape(p.title)} — preview unavailable</span>`}</div>`;
}
export function gallery(projects: Project[], ctx: RenderContext): string {
  const allTags = [...new Set(projects.flatMap((p) => p.tags))];
  const filters = ["All", ...allTags]
    .map(
      (tag, i) =>
        `<button type="button" class="filter" data-filter="${escape(tag)}" aria-pressed="${i === 0}" aria-controls="project-grid">${escape(tag)}</button>`,
    )
    .join("");
  return `<div class="filters" role="group" aria-label="Filter projects by tag" hidden>${filters}</div><p class="visually-hidden" role="status" aria-live="polite" data-filter-status></p><div class="gallery" id="project-grid">${projects.map((p, i) => `<article class="work" data-project="${escape(p.id)}" data-tags="${escape(JSON.stringify(p.tags))}"><a class="cover-link" href="${escape(p.destination.url)}" aria-label="${escape(`${p.destination.action === "play" ? "Play" : "Open"} ${p.title}`)}" rel="external noopener noreferrer">${thumbnail(p, ctx, i === 0)}</a><h2><a href="${escape(p.destination.url)}" rel="external noopener noreferrer">${escape(p.title)}</a></h2>${p.tags.length ? `<p class="card-tags">${p.tags.map(escape).join(' <span aria-hidden="true">·</span> ')}</p>` : ""}<p class="card-description">${escape(p.summary)}</p><a class="launch" href="${escape(p.destination.url)}" rel="external noopener noreferrer" aria-label="${escape(`${p.destination.action === "play" ? "Play" : "Open"} ${p.title}`)}">${p.destination.action === "play" ? "Play" : "Open"}</a></article>`).join("")}</div>`;
}

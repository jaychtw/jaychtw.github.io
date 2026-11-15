import type { Project, RenderContext, Media } from "../model.ts";
import { editorialOrder } from "../catalog.ts";
import { escape, zh, chineseText } from "./html.ts";
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
  const translatedAlt = chineseText(alt) || alt.replace(/ cover artwork$/, " 封面插畫").replace(/ screenshot$/, " 遊戲畫面");
  return `<img data-zh-alt="${escape(translatedAlt)}" src="${escape(media.src)}" srcset="${escape(media.srcset)}" sizes="${escape(sizes)}" width="${media.width}" height="${media.height}" alt="${escape(alt)}" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async" data-image${media.fallback ? ` data-fallback="${escape(media.fallback)}" data-fallback-alt="${escape(media.fallbackAlt || alt)}" data-fallback-zh="${escape(chineseText(media.fallbackAlt || alt) || translatedAlt)}"` : ""}>`;
}
export function thumbnail(
  p: Project,
  ctx: RenderContext,
  eager = false,
  sizes?: string,
): string {
  const media = ctx.images.get(`project:${p.id}`);
  return `<div class="work-media${media ? "" : " is-fallback"}"><span class="image-placeholder" aria-hidden="true">${escape(initials(p.title))}</span>${media ? picture(media, media.source === "cover" ? p.coverAlt || `${p.title} cover artwork` : p.thumbnail?.alt || `${p.title} screenshot`, eager, sizes) : `<span class="visually-hidden" data-zh="${escape(p.title)} 暫無預覽圖">${escape(p.title)} — preview unavailable</span>`}</div>`;
}
export function gallery(projects: Project[], ctx: RenderContext): string {
  const allTags = [
    ...new Set([...projects].sort(editorialOrder).flatMap((p) => p.tags)),
  ];
  const filters = ["All", ...allTags]
    .map(
      (tag, i) =>
        `<button type="button" class="filter" data-filter="${escape(tag)}" aria-pressed="${i === 0}" aria-controls="project-grid"${zh(tag)}>${escape(tag)}</button>`,
    )
    .join("");
  return `<div class="filters" role="group" aria-label="Filter projects by tag" data-zh-label="依標籤篩選作品" hidden>${filters}</div><p class="visually-hidden" role="status" aria-live="polite" data-filter-status></p><div class="gallery" id="project-grid">${projects.map((p, i) => `<a class="work" data-project="${escape(p.id)}" data-tags="${escape(JSON.stringify(p.tags))}" href="${escape(p.destination.url)}" aria-label="${escape(`${p.destination.action === "play" ? "Play" : "Open"} ${p.title}`)}" data-zh-label="${p.destination.action === "play" ? "遊玩" : "開啟"} ${escape(p.title)}" rel="external noopener noreferrer">${thumbnail(p, ctx, i === 0)}<h2>${escape(p.title)}</h2>${p.tags.length ? `<p class="card-tags">${p.tags.map((tag) => `<span${zh(tag)}>${escape(tag)}</span>`).join(' <span aria-hidden="true">·</span> ')}</p>` : ""}<p class="card-description" lang="en"${zh(p.summary, p.summaryZhTW)}>${escape(p.summary)}</p></a>`).join("")}</div>`;
}

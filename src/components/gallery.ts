import type { Project, RenderContext } from "../model.ts";
import { escape } from "./html.ts";
export function thumbnail(
  project: Project,
  ctx: RenderContext,
  eager: boolean,
): string {
  const src = project.thumbnail ? ctx.images.get(project.thumbnail.path) : null;
  const initials = project.title
    .split(/\s+/u)
    .filter(
      (word) => !["a", "an", "the", "of", "and"].includes(word.toLowerCase()),
    )
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();
  return `<span class="work-media${src ? "" : " is-fallback"}">${src ? `<img data-thumbnail src="${escape(src)}" alt="${escape(project.thumbnail!.alt)}" width="640" height="640" decoding="async" loading="${eager ? "eager" : "lazy"}">` : ""}<span class="thumb-fallback" aria-hidden="true">${escape(initials)}</span></span>`;
}
export function gallery(
  projects: Project[],
  ctx: RenderContext,
  level: 2 | 3,
): string {
  if (!projects.length) return "";
  return `<ul class="gallery${projects.length > 4 ? " many" : ""}" aria-label="Creative work portfolio">${projects.map((p, i) => `<li class="work" data-project-id="${escape(p.id)}"><a class="work-link" href="${escape(p.destination.url)}" rel="external noopener noreferrer" aria-label="${escape(p.destination.action[0].toUpperCase() + p.destination.action.slice(1) + " " + p.title + " (external site)")}">${thumbnail(p, ctx, i < 2)}<h${level} class="work-title">${escape(p.title)}</h${level}></a></li>`).join("\n")}</ul>`;
}

import type { RenderContext } from "../model.ts";
export const escape = (value: string) =>
  value.replace(
    /[&<>"']/gu,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export const collectionPath = (id: string, ctx: RenderContext) =>
  id === ctx.site.homepageCollection ? "/" : `/${id}/`;
export function header(ctx: RenderContext, active?: string): string {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="wordmark" href="/">${escape(ctx.site.name)}</a><div class="header-actions"><nav aria-label="Collections">${ctx.collections
    .filter((c) => ctx.activeCollections.has(c.id))
    .map(
      (c) =>
        `<a href="${collectionPath(c.id, ctx)}"${active === c.id ? ' aria-current="page"' : ""}>${escape(c.title)}</a>`,
    )
    .join(
      "",
    )}</nav><button type="button" class="theme-toggle" aria-label="Switch to light theme" title="Switch to light theme" hidden><span class="theme-orb" aria-hidden="true"></span></button></div></header>`;
}
export function page(
  ctx: RenderContext,
  options: {
    title: string;
    description: string;
    path: string;
    body: string;
    className?: string;
    image?: string;
    noindex?: boolean;
    active?: string;
    redirect?: string;
  },
): string {
  const canonical =
    ctx.site.canonicalOrigin + (options.redirect || options.path);
  return `<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; img-src 'self' data:; script-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">
<title>${escape(options.title)}</title><meta name="description" content="${escape(options.description)}"><meta name="color-scheme" content="dark light"><meta name="theme-color" content="#202120">
${options.noindex ? '<meta name="robots" content="noindex">' : ""}${options.redirect ? `<meta http-equiv="refresh" content="0;url=${escape(options.redirect)}">` : ""}<link rel="canonical" href="${escape(canonical)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${escape(ctx.site.name)}"><meta property="og:title" content="${escape(options.title)}"><meta property="og:description" content="${escape(options.description)}"><meta property="og:url" content="${escape(canonical)}">
${options.image ? `<meta property="og:image" content="${escape(ctx.site.canonicalOrigin + options.image)}"><meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><script src="${escape(ctx.themeScript)}"></script><link rel="stylesheet" href="${escape(ctx.style)}"><script src="${escape(ctx.script)}" defer></script>
</head><body class="${escape(options.className || "")}" data-design-version="${escape(ctx.site.designVersion)}">${header(ctx, options.active)}${options.body}</body></html>\n`;
}

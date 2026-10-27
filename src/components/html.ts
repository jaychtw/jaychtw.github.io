import type { RenderContext } from "../model.ts";
export const escape = (value: string) =>
  value.replace(
    /[&<>"']/gu,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
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
  },
): string {
  const canonical = ctx.site.canonicalOrigin + options.path;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; img-src 'self' data:; script-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">
<title>${escape(options.title)}</title><meta name="description" content="${escape(options.description)}">
<meta name="color-scheme" content="light"><meta name="theme-color" content="#ece5d6">
${options.noindex ? '<meta name="robots" content="noindex">' : ""}<link rel="canonical" href="${escape(canonical)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${escape(ctx.site.name)}"><meta property="og:title" content="${escape(options.title)}"><meta property="og:description" content="${escape(options.description)}"><meta property="og:url" content="${escape(canonical)}">
${options.image ? `<meta property="og:image" content="${escape(ctx.site.canonicalOrigin + options.image)}"><meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${escape(ctx.style)}"><script type="module" src="${escape(ctx.script)}"></script>
</head><body class="${escape(options.className || "portfolio")}" data-design-version="${escape(ctx.site.designVersion)}">${options.body}</body></html>\n`;
}

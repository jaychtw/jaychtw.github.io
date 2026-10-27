import {
  existsSync,
  readFileSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  copyFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadContent, published, sha256 } from "../src/catalog.ts";
import { home, games, detail, detailPath } from "../src/render.ts";
import { page } from "../src/components/html.ts";
import type { RenderContext } from "../src/model.ts";
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export function build(): void {
  const output = resolve(root, "dist");
  const ownership = resolve(root, ".artifacts/build-owner.json");
  const owned =
    existsSync(ownership) &&
    JSON.parse(readFileSync(ownership, "utf8")).directory === output;
  if (
    existsSync(output) &&
    !owned &&
    !existsSync(resolve(output, ".possibility-build"))
  )
    throw new Error("Refusing to replace an unrecognized dist directory");
  const { site, projects } = loadContent(root); // validate before deleting an existing valid build
  const css = ["tokens", "base", "sunlight", "gallery", "details"]
    .map(
      (n) =>
        `/* ${n} */\n` +
        readFileSync(resolve(root, `src/styles/${n}.css`), "utf8"),
    )
    .join("\n");
  const js = readFileSync(resolve(root, "src/client/site.js"), "utf8");
  const style = `/assets/possibility/site.${sha256(css).slice(0, 12)}.css`,
    script = `/assets/possibility/site.${sha256(js).slice(0, 12)}.js`;
  const ctx: RenderContext = { site, style, script, images: new Map() };
  rmSync(output, { recursive: true, force: true });
  const put = (name: string, data: string | Buffer) => {
    const target = resolve(output, "." + name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, data);
  };
  mkdirSync(dirname(ownership), { recursive: true });
  writeFileSync(
    ownership,
    JSON.stringify({ directory: output, site: "Possibility" }) + "\n",
  );
  put(style, css);
  put(script, js);
  for (const p of published(projects))
    if (p.thumbnail && !ctx.images.has(p.thumbnail.path)) {
      const bytes = readFileSync(
        resolve(root, "public", "." + p.thumbnail.path),
      );
      const target = p.thumbnail.path.replace(
        /\.(webp|png|jpg)$/u,
        `.${sha256(bytes).slice(0, 12)}.$1`,
      );
      put(target, bytes);
      ctx.images.set(p.thumbnail.path, target);
    }
  put("/index.html", home(projects, ctx));
  put("/games/index.html", games(projects, ctx));
  for (const p of published(projects))
    put(detailPath(p) + "index.html", detail(p, ctx));
  put(
    "/404.html",
    page(ctx, {
      title: "Page not found · Possibility",
      description: "This page could not be found.",
      path: "/404.html",
      noindex: true,
      body: '<main class="detail"><h1>Page not found</h1><p><a href="/">Possibility</a> · <a href="/games/">Games</a></p></main>',
    }),
  );
  const paths = ["/", "/games/", ...published(projects).map(detailPath)];
  put(
    "/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths
        .map((p) => `<url><loc>${site.canonicalOrigin + p}</loc></url>`)
        .join("") +
      "</urlset>\n",
  );
  put(
    "/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${site.canonicalOrigin}/sitemap.xml\n`,
  );
  put("/.nojekyll", "");
  copyFileSync(
    resolve(root, "public/favicon.svg"),
    resolve(output, "favicon.svg"),
  );
  const commit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  const dirty =
    execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], {
      cwd: root,
      encoding: "utf8",
    }).trim().length > 0;
  put(
    "/build-info.json",
    JSON.stringify(
      {
        name: site.name,
        version: (
          JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
            version: string;
          }
        ).version,
        sourceCommit: commit,
        sourceDirty: dirty,
        approvedVisualBaseline: site.approvedBaseline,
        designVersion: site.designVersion,
        routes: paths,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Built ${paths.length} routes; ${published(projects).length} released works; no runtime catalog/API dependency.`,
  );
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  build();

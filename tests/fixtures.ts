// Synthetic content exists only under ignored .artifacts; it is never shipped.
import {
  cpSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { build, root } from "../scripts/build.ts";
import { readProjects } from "../src/catalog.ts";
import sharp from "sharp";
export const fixtureRoot = resolve(root, ".artifacts/fixtures/publishing");
export async function prepareFixtures(): Promise<string> {
  rmSync(fixtureRoot, { recursive: true, force: true });
  mkdirSync(fixtureRoot, { recursive: true });
  for (const name of ["src", "public", "content", "package.json"])
    cpSync(resolve(root, name), resolve(fixtureRoot, name), {
      recursive: true,
    });
  rmSync(resolve(fixtureRoot, "content/projects"), { recursive: true });
  const p = structuredClone(
    readProjects(root).find((p: any) => p.id === "republic-of-chickens"),
  ) as any;
  mkdirSync(resolve(fixtureRoot, "content/projects/games"), {
    recursive: true,
  });
  writeFileSync(
    resolve(fixtureRoot, `content/projects/games/${p.id}.json`),
    JSON.stringify(p),
  );
  const app = {
    ...p,
    id: "local-app-fixture",
    title: "Local application fixture",
    category: "apps",
    destination: { action: "open", url: "https://example.org/test-only/" },
    controls: null,
    languages: [],
    release: { version: null, commit: null },
  };
  mkdirSync(resolve(fixtureRoot, "content/projects/apps"), { recursive: true });
  writeFileSync(
    resolve(fixtureRoot, "content/projects/apps/local-app-fixture.json"),
    JSON.stringify(app),
  );
  const verified = JSON.parse(
    readFileSync(
      resolve(fixtureRoot, "content/link-verification.json"),
      "utf8",
    ),
  );
  verified.push({
    id: app.id,
    url: app.destination.url,
    finalUrl: app.destination.url,
    status: 200,
    checkedAt: new Date().toISOString(),
    method: "Synthetic test fixture; not a public verification claim.",
  });
  writeFileSync(
    resolve(fixtureRoot, "content/link-verification.json"),
    JSON.stringify(verified),
  );
  for (const collection of ["blog", "what-now"]) {
    const folder = resolve(fixtureRoot, "content/articles", collection);
    mkdirSync(folder, { recursive: true });
    writeFileSync(
      resolve(folder, "publishing-fixture.md"),
      `---\ntitle: "${collection === "blog" ? "Blog" : "Discovery"} publishing fixture"\ndate: 2000-01-01\nstatus: published\nexcerpt: "Synthetic publishing test, never production content."\ntags: [Technology]\ncover: ${p.thumbnail.path}\n---\n\n## A test heading\n\nA **Markdown** paragraph with a [safe link](https://example.org/).\n\n![Documented gameplay capture used only as a publishing fixture.](${p.thumbnail.path})\n\n- One\n- Two\n\n<script>alert('unsafe')</script>\n\n[unsafe](javascript:alert(1))\n`,
    );
    writeFileSync(
      resolve(folder, "private-draft.md"),
      '---\ntitle: "PRIVATE DRAFT FIXTURE"\ndate: 2000-01-02\nstatus: draft\n---\nPrivate fixture content.\n',
    );
  }
  await build(fixtureRoot);
  return fixtureRoot;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(import.meta.filename)
) {
  await prepareFixtures();
  if (process.argv.includes("--cover")) {
    const cover = resolve(
      fixtureRoot,
      "public/assets/covers/games/republic-of-chickens.webp",
    );
    mkdirSync(resolve(cover, ".."), { recursive: true });
    await sharp({
      create: { width: 1600, height: 900, channels: 3, background: "#324653" },
    })
      .webp()
      .toFile(cover);
    await build(fixtureRoot);
  }
}

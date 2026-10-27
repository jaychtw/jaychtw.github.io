import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
} from "node:fs";
import sharp from "sharp";
import { parseArticle, renderMarkdown } from "../src/publishing.ts";
import { build, root } from "../scripts/build.ts";
import { prepareFixtures } from "./fixtures.ts";
const publicDir = resolve(root, "public");
const doc = (body: string, meta = "") =>
  `---\ntitle: "Fixture"\ndate: 2000-01-01\n${meta}\n---\n${body}`;
test("Markdown supports authoring and rejects malformed/ambiguous metadata", () => {
  const a = parseArticle(
    doc("## Heading\n\n**Strong**", "status: published\ntags: [Technology]"),
    "stable-slug",
    "blog",
    publicDir,
  );
  assert.match(renderMarkdown(a, new Map()), /<strong>Strong<\/strong>/);
  assert.equal(a.id, "stable-slug");
  for (const source of [
    "missing front matter",
    doc("test", "date: 2000-01-02"),
    doc("test", "status: unknown"),
    doc("test", "cover: /assets/../secret.png"),
    doc("test", "extra: typo"),
    doc("test", "tags: [a, a]"),
  ])
    assert.throws(() => parseArticle(source, "stable", "blog", publicDir));
});
test("raw HTML, unsafe URLs, external images and YAML aliases cannot inject active content", () => {
  const a = parseArticle(
    doc(
      "<script>alert(1)</script>\n\n[x](javascript:alert(1))\n\n[x](data:text/html,evil)\n\n[x](https://example.org/)",
    ),
    "safe",
    "blog",
    publicDir,
  );
  const html = renderMarkdown(a, new Map());
  assert(!html.includes("<script>"));
  assert(!html.includes('href="javascript:'));
  assert(!html.includes('href="data:'));
  assert(html.includes('href="https://example.org/"'));
  assert.throws(() =>
    parseArticle(
      doc("![x](https://example.org/remote.png)"),
      "safe",
      "blog",
      publicDir,
    ),
  );
  assert.throws(() =>
    parseArticle(
      doc("test", "tags: &list [a]\nexcerpt: *list"),
      "safe",
      "blog",
      publicDir,
    ),
  );
});
test("publication, cover replacement, Apps and homepage changes work through content only", async () => {
  const fixture = await prepareFixtures();
  const get = (path: string) =>
    readFileSync(resolve(fixture, "dist", path), "utf8");
  assert(
    existsSync(resolve(fixture, "dist/blog/publishing-fixture/index.html")),
  );
  assert(
    existsSync(resolve(fixture, "dist/what-now/publishing-fixture/index.html")),
  );
  assert(!existsSync(resolve(fixture, "dist/blog/private-draft")));
  assert(!get("blog/index.html").includes("PRIVATE DRAFT"));
  assert.match(get("blog/index.html"), /Blog publishing fixture/);
  assert.match(get("what-now/index.html"), /what-now/);
  assert.match(get("index.html"), /href="\/apps\/"/);
  assert.match(get("apps/index.html"), /Open Local application fixture/);
  const proof = () =>
    JSON.parse(
      readFileSync(resolve(fixture, ".artifacts/asset-evidence.json"), "utf8"),
    );
  assert.equal(
    proof().find((a: any) => a.project === "republic-of-chickens").selected,
    "screenshot",
  );
  const cover = resolve(
    fixture,
    "public/assets/covers/games/republic-of-chickens.webp",
  );
  mkdirSync(resolve(cover, ".."), { recursive: true });
  // Clearly synthetic solid colors test replacement mechanics, never final artwork.
  await sharp({
    create: { width: 1600, height: 900, channels: 3, background: "#324653" },
  })
    .webp()
    .toFile(cover);
  await build(fixture);
  const first = get("index.html");
  assert.equal(
    proof().find((a: any) => a.project === "republic-of-chickens").selected,
    "cover",
  );
  const fingerprint = first.match(/src="([^"]*covers\/games\/[^"]+)"/u)![1];
  await sharp({
    create: { width: 1600, height: 900, channels: 3, background: "#765234" },
  })
    .webp()
    .toFile(cover);
  await build(fixture);
  const second = get("index.html");
  const replacement = second.match(/src="([^"]*covers\/games\/[^"]+)"/u)![1];
  assert(!second.includes(fingerprint));
  assert(second.includes("data-fallback="));
  writeFileSync(
    resolve(root, ".artifacts/publishing-proof.json"),
    JSON.stringify(
      {
        scope:
          "Local synthetic fixtures only; no production article or custom artwork published.",
        cover: {
          sourcePath: "public/assets/covers/games/republic-of-chickens.webp",
          first: fingerprint,
          replacement,
          changed: fingerprint !== replacement,
          priority: "custom cover > authentic screenshot > neutral placeholder",
        },
        markdown: {
          published: [
            "/blog/publishing-fixture/",
            "/what-now/publishing-fixture/",
          ],
          draftOmitted: true,
          indexesGenerated: true,
          sharedEngine: true,
        },
        passed: true,
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(cover, "invalid image");
  await build(fixture);
  assert.equal(
    proof().find(
      (a: any) =>
        a.sourcePath === "/assets/covers/games/republic-of-chickens.webp" &&
        a.invalid,
    ).fallback,
    "screenshot",
  );
  rmSync(cover);
  await build(fixture);
  const file = resolve(fixture, "content/articles/blog/publishing-fixture.md");
  writeFileSync(
    file,
    readFileSync(file, "utf8").replace(
      "Blog publishing fixture",
      "Revised fixture title",
    ),
  );
  await build(fixture);
  assert.match(
    get("blog/publishing-fixture/index.html"),
    /Revised fixture title/,
  );
  const sitePath = resolve(fixture, "content/site.json"),
    site = JSON.parse(readFileSync(sitePath, "utf8"));
  site.homepageCollection = "blog";
  writeFileSync(sitePath, JSON.stringify(site));
  await build(fixture);
  assert.match(get("index.html"), /Revised fixture title/);
  assert.match(get("blog/index.html"), /http-equiv="refresh"/);
  assert.match(get("games/index.html"), /data-project/);
  // Restore a predictable, isolated browser fixture after destructive test cases.
  await prepareFixtures();
});

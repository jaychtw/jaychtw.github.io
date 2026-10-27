import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import {
  validateCatalog,
  published,
  httpsURL,
  siteConfig,
} from "../src/catalog.ts";
import { home, games, detail } from "../src/render.ts";
import type { Project, RenderContext } from "../src/model.ts";
const root = resolve(import.meta.dirname, "..");
const load = (name: string): unknown =>
  JSON.parse(readFileSync(resolve(root, "content", name), "utf8"));
const data = () => structuredClone(load("projects.json")) as Project[];
const validate = (
  entries: unknown,
  verification = load("link-verification.json"),
) =>
  validateCatalog(
    entries,
    verification,
    load("asset-provenance.json"),
    resolve(root, "public"),
  );
const ctx: RenderContext = {
  site: siteConfig(load("site.json")),
  style: "/style.css",
  script: "/site.js",
  images: new Map(data().map((p) => [p.thumbnail!.path, p.thumbnail!.path])),
};
test("curated catalog has four evidence-backed entries in explicit editorial order", () => {
  const p = published(validate(data()));
  assert.equal(p.length, 4);
  assert.equal(p[0].id, "republic-of-chickens");
  assert.equal(
    p[0].destination.url,
    "https://jaychtw.github.io/reppublic-of-chickens/",
  );
  assert.equal(p[0].publishedAt, null);
});
test("duplicate IDs, malformed required fields and accidental field names fail clearly", () => {
  const a = data();
  a[1].id = a[0].id;
  assert.throws(() => validate(a), /duplicate/);
  for (const key of [
    "title",
    "summary",
    "controls",
    "languages",
    "order",
    "featured",
    "status",
    "destination",
    "thumbnail",
  ]) {
    const entries = data() as unknown as Record<string, unknown>[];
    delete entries[0][key];
    assert.throws(() => validate(entries), key);
  }
  assert.throws(
    () => validate([{ ...data()[0], publishedDate: "2026-10-27" }]),
    /Unknown project field/,
  );
});
test("unsafe URL protocols, credentials, control characters and implicit hosts are rejected", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com/",
    "//example.com",
    "https://user:pass@example.com",
    " https://example.com",
    "https://example.com/%0a",
    "https://example.com:444/",
    "https:\\example.com",
  ])
    assert.throws(() => httpsURL(url, "test"), url);
  assert.equal(
    httpsURL("https://example.com/real-work/?v=1", "test"),
    "https://example.com/real-work/?v=1",
  );
});
test("published entries require matching, successful, dated verification", () => {
  assert.throws(() => validate(data(), []), /verified release evidence/);
  const v = load("link-verification.json") as Record<string, unknown>[];
  v[0].status = 404;
  assert.throws(() => validate(data(), v), /verified release evidence/);
  const p = data();
  p[0].destination.url = "https://example.com/changed";
  assert.throws(() => validate(p), /verified release evidence/);
});
test("invalid statuses, dates, languages, actions and release commits fail", () => {
  for (const mutation of [
    (p: Project) => {
      p.status = "unreleased" as Project["status"];
    },
    (p: Project) => {
      p.publishedAt = "2026-02-31";
    },
    (p: Project) => {
      p.languages = ["en", "en"];
    },
    (p: Project) => {
      p.destination.action = "visit";
    },
    (p: Project) => {
      p.release.commit = "main";
    },
  ]) {
    const p = data();
    mutation(p[0]);
    assert.throws(() => validate(p));
  }
});
test("thumbnail traversal/missing required files/unrecorded checksums fail; explicit null uses honest fallback", () => {
  for (const path of [
    "/assets/possibility/images/../private.webp",
    "https://example.com/art.webp",
    "/assets/possibility/images/missing.webp",
  ]) {
    const p = data();
    p[0].thumbnail!.path = path;
    assert.throws(() => validate(p));
  }
  const p = data();
  p[0].thumbnail = null;
  const valid = validate(p);
  assert.match(home(valid, ctx), /work-media is-fallback/);
  assert.match(home(valid, ctx), /RC<\/span>/);
  const provenance = load("asset-provenance.json") as Record<string, unknown>[];
  provenance[0].sha256 = "0".repeat(64);
  assert.throws(
    () =>
      validateCatalog(
        data(),
        load("link-verification.json"),
        provenance,
        resolve(root, "public"),
      ),
    /checksum/,
  );
});
test("draft, approved and archived work never leaks into published cards or home content", () => {
  const p = data();
  p[0].status = "draft";
  p[1].status = "approved";
  p[2].status = "archived";
  validate(p);
  const html = home(p, ctx);
  assert(!html.includes("Republic of Chickens"));
  assert(!html.includes("Wonderlands"));
  assert(!html.includes("Squirrel Control"));
  assert(html.includes("The Last Lantern"));
  assert.equal((games(p, ctx).match(/class="work"/gu) || []).length, 1);
});
test("empty catalogs omit the home portfolio/cue and do not invent future branches", () => {
  const html = home([], ctx);
  assert(!html.includes('id="portfolio"'));
  assert(!html.includes('class="scroll-cue"'));
  assert(html.includes("Possibility"));
  assert(!html.includes("Coming soon"));
  assert(games([], ctx).includes("No published games"));
});
test("rendered catalog text is escaped, and the gallery has no descriptions or metadata", () => {
  const p = data();
  p[0].title = "<img src=x onerror=alert(1)>";
  validate(p);
  const html = home(p, ctx);
  assert(!html.includes("<img src=x"));
  assert(html.includes("&lt;img src=x onerror=alert(1)&gt;"));
  assert(!html.includes(p[0].summary));
  assert(!html.includes("2026-10-25"));
  assert(!html.includes("catalog.json"));
  assert(detail(p[0], ctx).includes(p[0].controls!));
});
test("medium/action model supports an actual new medium without prebuilding empty categories", () => {
  const p = data();
  p[0].category = "writing";
  p[0].destination.action = "read";
  p[0].controls = null;
  p[0].limitations = null;
  p[0].repositoryUrl = null;
  p[0].languages = [];
  p[0].release.version = null;
  const valid = validate(p);
  assert(home(valid, ctx).includes("Read Republic of Chickens"));
  assert(!games(valid, ctx).includes("Republic of Chickens"));
});
test("site metadata cannot introduce invalid canonical origins, email injections or abbreviated baselines", () => {
  const s = load("site.json") as Record<string, unknown>;
  assert.throws(() =>
    siteConfig({ ...s, email: "hello@example.com?subject=bad" }),
  );
  assert.throws(() =>
    siteConfig({ ...s, canonicalOrigin: "https://example.com/subpath/" }),
  );
  assert.throws(() => siteConfig({ ...s, approvedBaseline: "f99940e" }));
});

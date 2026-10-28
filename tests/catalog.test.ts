import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import {
  loadContent,
  validateCatalog,
  published,
  httpsURL,
  siteConfig,
  readJSON,
  readProjects,
} from "../src/catalog.ts";
import { collectionPage } from "../src/render.ts";
import type { Project, RenderContext } from "../src/model.ts";
const root = resolve(import.meta.dirname, "..");
const load = (name: string) => readJSON(resolve(root, "content", name));
const data = () => structuredClone(readProjects(root)) as Project[];
const validate = (p: unknown, v = load("link-verification.json")) =>
  validateCatalog(p, v, load("asset-provenance.json"), resolve(root, "public"));
const content = loadContent(root);
const ctx: RenderContext = {
  site: content.site,
  collections: content.collections,
  activeCollections: new Set(["games"]),
  images: new Map(),
  style: "/style.css",
  script: "/site.js",
  themeScript: "/theme.js",
  favicon: "/favicon.svg",
};
test("published projects retain verified current URLs and respect editable editorial order", () => {
  const p = published(validate(data()));
  assert(p.length > 0);
  assert(p.every((v, i) => i === 0 || p[i - 1].order <= v.order));
  const custom = data();
  custom[0].order = 0;
  assert.equal(published(custom)[0].id, custom[0].id);
  for (const old of JSON.parse(
    readFileSync(
      resolve(root, "docs/platform-v1/previous-projects.json"),
      "utf8",
    ),
  )) {
    const current = p.find((p) => p.id === old.id)!;
    assert(current);
    assert.deepEqual(current.destination, old.destination);
  }
});
test("unsafe URLs are rejected, including credential and encoded-control injection", () => {
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
});
test("duplicates, missing metadata, reserved tags and typo fields fail clearly", () => {
  const a = data();
  a.push(a[0]);
  assert.throws(() => validate(a), /duplicate/);
  for (const key of [
    "title",
    "summary",
    "order",
    "featured",
    "status",
    "destination",
    "thumbnail",
    "tags",
    "maturity",
  ]) {
    const p = data() as unknown as Record<string, unknown>[];
    delete p[0][key];
    assert.throws(() => validate(p), key);
  }
  const p = data();
  p[0].tags = ["Commercial"];
  assert.throws(() => validate(p), /tag/);
  assert.throws(
    () => validate([{ ...data()[0], publishedDate: "2000-01-01" }]),
    /Unknown project field/,
  );
});
test("published links require matching dated evidence; acceptance and visibility remain distinct", () => {
  assert.throws(() => validate(data(), []), /verified release evidence/);
  const a = data();
  a[0].destination.url = "https://example.org/changed/";
  assert.throws(() => validate(a), /verified release evidence/);
  const animal = content.projects.find((p) => p.id === "animal-match")!;
  assert.equal(animal.maturity, "evolving");
  assert.match(animal.limitations!, /pending/);
});
test("invalid dates, statuses, language duplicates and implicit commit versions fail", () => {
  for (const patch of [
    { publishedAt: "2026-02-31" },
    { status: "hidden" },
    { languages: ["en", "en"] },
    { release: { version: null, commit: "main" } },
    { destination: { action: "open", url: "https://example.org/" } },
  ]) {
    const a = data();
    Object.assign(a[0], patch);
    assert.throws(() => validate(a));
  }
});
test("traversal/missing screenshot assets fail; null selects an honest placeholder", () => {
  for (const path of [
    "/assets/screenshots/games/../secret.webp",
    "https://example.org/art.webp",
    "/assets/screenshots/games/missing.webp",
  ]) {
    const a = data();
    a[0].thumbnail = { path, alt: "Test" };
    assert.throws(() => validate(a));
  }
  assert.match(
    collectionPage(content.collections[0], content.projects, [], ctx),
    /image-placeholder/,
  );
});
test("draft/approved/archived projects stay out of galleries", () => {
  const p = published(data());
  p[0].status = "draft";
  p[1].status = "approved";
  p[2].status = "archived";
  const html = collectionPage(content.collections[0], p, [], ctx);
  for (const id of ["republic-of-chickens", "wonderlands", "squirrel-control"])
    assert(!html.includes(`data-project="${id}"`));
});
test("gallery escapes metadata, includes complete cards, and hides empty navigation", () => {
  const p = data();
  p[0].title = '<img src=x onerror="alert(1)">';
  const html = collectionPage(content.collections[0], p, [], ctx);
  assert(!html.includes("<img src=x"));
  assert(html.includes("&lt;img"));
  assert.equal(
    (html.match(/data-project=/gu) || []).length,
    published(p).length,
  );
  assert(html.includes(p[0].summary));
  assert(!html.includes('href="/apps/"'));
  assert(!html.includes("landing-scene"));
});
test("identity settings reject email injection, subpath origins and unknown homepage", () => {
  const s = load("site.json") as any;
  assert.throws(() => siteConfig({ ...s, email: "a@example.com?subject=bad" }));
  assert.throws(() =>
    siteConfig({ ...s, canonicalOrigin: "https://example.org/subpath/" }),
  );
  assert.throws(() => siteConfig({ ...s, homepageCollection: "../games" }));
});

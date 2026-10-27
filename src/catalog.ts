import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import type { Project, Site, Verification } from "./model.ts";
export const sha256 = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
export const readJSON = (path: string): unknown =>
  JSON.parse(readFileSync(path, "utf8"));
function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${label}: expected object`);
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value !== value.trim() ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)
  )
    throw new Error(`${label}: expected nonempty clean text`);
  return value;
}
export function httpsURL(value: unknown, label: string): string {
  const string = text(value, label);
  if (/[\s\\]/u.test(string) || /%(?:0[0-9a-f]|1[0-9a-f]|7f)/iu.test(string))
    throw new Error(`${label}: unsafe URL`);
  let url: URL;
  try {
    url = new URL(string);
  } catch {
    throw new Error(`${label}: invalid URL`);
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    !url.hostname.includes(".") ||
    url.port
  )
    throw new Error(`${label}: expected credential-free HTTPS URL`);
  return url.href;
}
export function siteConfig(value: unknown): Site {
  const s = object(value, "site");
  for (const key of [
    "name",
    "email",
    "description",
    "designVersion",
    "approvedBaseline",
  ])
    text(s[key], `site.${key}`);
  if (
    !/^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/u.test(String(s.email))
  )
    throw new Error("site.email: invalid email");
  const url = new URL(httpsURL(s.canonicalOrigin, "site.canonicalOrigin"));
  if (url.pathname !== "/" || url.search || url.hash)
    throw new Error("site.canonicalOrigin: expected origin only");
  if (!/^[a-f0-9]{40}$/u.test(String(s.approvedBaseline)))
    throw new Error("site.approvedBaseline: expected full SHA");
  return { ...s, canonicalOrigin: url.origin } as unknown as Site;
}
export function validateCatalog(
  value: unknown,
  verificationValue: unknown,
  provenanceValue: unknown,
  publicDir: string,
): Project[] {
  if (
    !Array.isArray(value) ||
    !Array.isArray(verificationValue) ||
    !Array.isArray(provenanceValue)
  )
    throw new Error("Catalog, verification and provenance must be arrays");
  const seen = new Set<string>();
  const verifications = verificationValue.map((v) => object(v, "verification"));
  const provenance = provenanceValue.map((v) => object(v, "provenance"));
  for (const raw of value) {
    const p = object(raw, "project");
    const allowed = [
      "id",
      "title",
      "category",
      "summary",
      "status",
      "featured",
      "order",
      "publishedAt",
      "destination",
      "repositoryUrl",
      "languages",
      "controls",
      "limitations",
      "approval",
      "release",
      "thumbnail",
    ];
    for (const key of Object.keys(p))
      if (!allowed.includes(key))
        throw new Error(`Unknown project field: ${key}`);
    for (const key of ["id", "title", "category", "summary", "status"])
      text(p[key], `project.${key}`);
    const id = String(p.id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id) || seen.has(id))
      throw new Error(`Invalid or duplicate project id: ${id}`);
    seen.add(id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(String(p.category)))
      throw new Error(`${id}: invalid category`);
    if (
      !["draft", "approved", "published", "archived"].includes(String(p.status))
    )
      throw new Error(`${id}: invalid status`);
    if (
      typeof p.featured !== "boolean" ||
      !Number.isSafeInteger(p.order) ||
      Number(p.order) < 0
    )
      throw new Error(`${id}: invalid curation fields`);
    if (p.publishedAt !== null) {
      const date = text(p.publishedAt, `${id}.publishedAt`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/u.test(date) ||
        !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date
      )
        throw new Error(`${id}: invalid publication date`);
    }
    const dest = object(p.destination, `${id}.destination`);
    if (!/^[a-z][a-z-]*$/u.test(text(dest.action, `${id}.action`)))
      throw new Error(`${id}: invalid action`);
    const url = httpsURL(dest.url, `${id}.destination`);
    if (p.category === "games" && dest.action !== "play")
      throw new Error(`${id}: game action must be play`);
    if (p.repositoryUrl !== null)
      httpsURL(p.repositoryUrl, `${id}.repositoryUrl`);
    for (const key of ["controls", "limitations"])
      if (p[key] !== null || p.category === "games")
        text(p[key], `${id}.${key}`);
    if (
      !Array.isArray(p.languages) ||
      (p.category === "games" && p.languages.length === 0) ||
      !p.languages.every(
        (v) =>
          typeof v === "string" && /^[a-z]{2}(?:-[A-Za-z]{2,4})?$/u.test(v),
      ) ||
      new Set(p.languages).size !== p.languages.length
    )
      throw new Error(`${id}: invalid languages`);
    const approval = object(p.approval, `${id}.approval`);
    httpsURL(approval.url, `${id}.approval.url`);
    text(approval.note, `${id}.approval.note`);
    const release = object(p.release, `${id}.release`);
    if (release.version !== null || p.category === "games")
      text(release.version, `${id}.release.version`);
    if (
      release.commit !== null &&
      !/^[a-f0-9]{40}$/u.test(String(release.commit))
    )
      throw new Error(
        `${id}: release commit must be full SHA or explicit null`,
      );
    if (p.thumbnail !== null) {
      const thumb = object(p.thumbnail, `${id}.thumbnail`);
      text(thumb.alt, `${id}.thumbnail.alt`);
      const image = text(thumb.path, `${id}.thumbnail.path`);
      if (
        !/^\/assets\/possibility\/images\/[a-z0-9-]+\.(?:webp|png|jpg)$/u.test(
          image,
        )
      )
        throw new Error(`${id}: unsafe thumbnail path`);
      const path = resolve(publicDir, "." + image);
      if (!existsSync(path))
        throw new Error(`${id}: missing required thumbnail ${image}`);
      const proof = provenance.find((a) => a.path === image);
      if (
        !proof ||
        !/^[a-f0-9]{64}$/u.test(String(proof.sha256)) ||
        sha256(readFileSync(path)) !== proof.sha256
      )
        throw new Error(`${id}: thumbnail provenance/checksum mismatch`);
      httpsURL(proof.source, `${id}.thumbnail source`);
    }
    if (p.status === "published") {
      const v = verifications.find((v) => v.id === id && v.url === url);
      if (
        !v ||
        v.status !== 200 ||
        v.finalUrl !== url ||
        typeof v.checkedAt !== "string" ||
        !Number.isFinite(Date.parse(v.checkedAt)) ||
        Date.parse(v.checkedAt) > Date.now() + 60000 ||
        typeof v.method !== "string"
      )
        throw new Error(
          `${id}: published destination lacks matching verified release evidence`,
        );
    }
  }
  return value as Project[];
}
export const published = (projects: Project[]) =>
  projects
    .filter((p) => p.status === "published")
    .sort(
      (a, b) => a.order - b.order || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
export function loadContent(root: string): {
  site: Site;
  projects: Project[];
  verifications: Verification[];
} {
  const verifications = readJSON(
    resolve(root, "content/link-verification.json"),
  );
  return {
    site: siteConfig(readJSON(resolve(root, "content/site.json"))),
    projects: validateCatalog(
      readJSON(resolve(root, "content/projects.json")),
      verifications,
      readJSON(resolve(root, "content/asset-provenance.json")),
      resolve(root, "public"),
    ),
    verifications: verifications as Verification[],
  };
}

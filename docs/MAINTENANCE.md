# Publishing and maintenance

Routine edits require GitHub file changes, not application-code changes. **Currently, commits validate only.** Automatic production publication remains disabled until separately authorized. These instructions prepare content today; automatic delivery after a commit is a tested local/CI build capability, not a claim that the new public workflow has been activated.

## Replace artwork

1. Export an owner-approved WebP, ideally 1600×900 or larger, retaining the focal point and avoiding unnecessary embedded text. Keep the approved high-resolution original in your separate artwork archive.
2. In GitHub, upload/replace `public/assets/covers/games/<project-id>.webp` (or `apps/<project-id>.webp`). Match the ID in its metadata filename.
3. Commit. No metadata, code, or checksum edit is required. The custom cover automatically takes priority; 480/960/1600px renditions are generated when the source permits, and every rendition gets a content fingerprint. Smaller sources are not enlarged.
4. Review the check results. After publication is authorized, deployment serves the HTML pointing to the new fingerprint. Reload the page normally; if a CDN briefly retains older HTML, wait for the successful deployment/build identity, then hard-refresh. Do not repeatedly rename the source file or edit code to defeat caching.

Removing the custom cover restores the screenshot; no screenshot yields a neutral monogram. A malformed custom file produces a warning and uses the same fallback chain. Runtime image failure also retains a usable Play/Open action. Portal covers never require a game-repository change.

## Add or edit a project

Create `content/projects/games/<id>.json`, using a neighboring entry as the template. Apps uses `content/projects/apps/<id>.json`. Keep the filename, ID and category consistent. Edit title, summary, optional tags, explicit numeric order, destination/action, source reference and documented limitations. `publishedAt` is the actual known publication date or `null`, not today's date by default. Unknown release versions/commits remain `null`.

Use `draft` until the URL and identity are verified; published means visible and available, not automatic certification of final acceptance. Preserve honest `maturity` (`released`, `public`, `evolving`) and source notes. For a screenshot, upload a local image and record its source URL/commit in `content/asset-provenance.json`; a neutral fallback is permitted. See [the complete contract](CATALOG.md).

For a newly published destination, add a matching record to `content/link-verification.json`: `id`, `url`, `finalUrl`, `status: 200`, actual ISO `checkedAt`, and factual `method`. This is an ordinary data edit, not a hidden tool requirement. An operator with the local tooling can instead run `python3 scripts/verify-links.py --record`. CI repeats fresh URL/resource checks; an invented verification record does not bypass that release check. Do not use a repository URL as the Play URL.

Reorder cards by editing their `order` values. Numbers need not be consecutive. Ties sort by stable ID. No test hardcodes the total catalog size or provisional order; additions and reorderings require no test edits.

## Publish an article

Create `content/articles/blog/my-readable-slug.md`, or use `what-now` for that collection:

```markdown
---
title: "Your actual article title"
date: 2026-10-28
status: draft
excerpt: "A short, factual introduction."
tags: [Technology]
cover: /assets/covers/blog/my-readable-slug.webp
---

Article text in **Markdown**.
```

The date above is illustrative; supply your actual intended publication date. Omit `cover` if you have none; an included path must exist locally. Omit excerpt/tags when unnecessary. Status defaults to draft. Set `status: published` and commit only when ready. The build creates `/blog/my-readable-slug/` plus its index entry and navigation. What Now? uses the same fields and engine at `/what-now/<slug>/`.

Drafts generate no public page, asset or index entry. A published future date is displayed as supplied: this is not a scheduled-publishing service. Rename a published filename only with an explicit URL migration; changing the title/body preserves its URL. Duplicate front-matter keys and unknown fields fail clearly.

Markdown supports headings, emphasis, lists, block quotes, tables, code and links. Raw HTML renders as text. Links use HTTPS, local site paths, anchors or basic mailto addresses. Article images must be local under `/assets/`, with useful Markdown alt text; remote image embeds, scripts and HTML components are intentionally unavailable. No authoring dashboard is required.

## Check and publish

GitHub checks expose failures; fix content and recommit, or revert a bad change. Locally: `npm ci`, then `npm run check` and `npm run verify:links`. The current manual release gate remains in force. [Deployment](DEPLOYMENT.md) explains the separately authorized production steps and rollback. Once automatic delivery is explicitly enabled and verified, an ordinary approved commit to main will run those checks and publish without local commands.

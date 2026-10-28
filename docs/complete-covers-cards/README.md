# Cover completion and single-link cards — interim candidate

**Not release ready: the 18-cover attachment could not be downloaded because it exceeds the executor's 32 MiB transfer limit.** Its README, manifest, checksums and artwork mappings have therefore not been inspected. No additional approved artwork has been imported, substituted or generated. Supply the same files in ZIPs smaller than 32 MiB each to finish the authorized work.

## Implemented independently of the attachment

Each gallery card is one native anchor containing its cover, heading, tags and description. The separate Play link, nested title link and duplicate cover link are removed. The native link has the original destination and a concise `Play <title>` / `Open <title>` accessible name. Keyboard focus outlines the entire card; hover underlines its title; the description and image both navigate. No JavaScript click handler or extra keyboard stop is needed. Cover enlargement on hover was removed so interaction does not clip artwork.

The favicon is a black square with four white outward arrows. The shared document references a content-fingerprinted SVG so a replacement changes its URL; `/favicon.svg` remains available for compatibility. [Preview](favicon-preview.png).

The four Batch 01 cover files remain byte-for-byte unchanged. Catalog data, order, tags, navigation, independent games and deployment workflows remain unchanged. The old cover-POC capture helper now reads the full-card link rather than the removed Play element.

## Local validation and interim screenshots

`npm run check` passed: TypeScript, ESLint, formatting, 12 content/publishing tests, 10 responsive/theme cases, 76 filters, 13 accessibility scans with zero violations or incomplete checks, 8 contrast cases, 13 behavioral scenarios and 5 isolated collection/editorial fixture routes. The updated smoke script was separately linted and passed locally; exact local output integrity also passed.

Tests verify all 22 native card anchors, exact destinations and accessible names, no nested anchors or redundant Play links, mouse navigation from every description, cover clicks, one Tab stop per card, Enter activation, visible focus, emulated touch navigation, and retained image fallbacks. Navigation-event tests use clearly isolated responses at the expected destination; fresh real destination checks run in hosted CI. Physical-device certification is not claimed.

- [Browser test report](browser-results.json)
- [Local smoke receipt](local-smoke.json)
- [Desktop light](gallery-1440-light.png) · [desktop dark](gallery-1440-dark.png)
- [Mobile light](gallery-390-light.png) · [mobile dark](gallery-390-dark.png)

These screenshots show the card changes with **existing artwork**, including four Batch 01 covers. They do not represent integration or approval of the inaccessible 18 new covers. Local captures were made in the changed working tree based on `7ddebf6`; hosted CI validates the eventual exact commit.

## Finish and publish

Main was `7ddebf60be381873b087d4aea481041f84661578` before this work. GitHub records successful manual [run 40642695668](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40642695668) with that exact source in its public-verification artifact name. No public deployment is performed for this partial candidate.

After the split attachment is accessible: verify every supplied checksum, reconcile the 18 proposed paths against real catalog IDs, archive originals and provenance following Batch 01, copy the approved publishing bytes unchanged, verify all 22 custom-cover selections and preserved fallbacks, refresh desktop/mobile light/dark screenshots, and run the full release checks. Preserve the four existing covers and all catalog data. The owner has already authorized publication once these requirements pass; no further creative approval is required.

Push the completed development commit and wait for exact-SHA CI. Merge without losing unrelated main changes, wait for the resulting main SHA's CI, and run the existing **Publish approved Possibility release** from main with that **full resulting SHA** and `PUBLISH POSSIBILITY`. A new dispatch is required; rerunning a previous workflow reuses its old input SHA. Require prepare, publish and public verification to succeed, with `build-info.json` identifying the intended clean source. Retain the pre-release and established rollback commits. No ongoing automatic-publishing policy is activated by this change.

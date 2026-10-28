# Complete cover gallery release candidate

The three reissued archives are fully integrated: 18 original PNG masters are archived here, and their supplied lossless WebPs are copied unchanged into the existing custom-cover pipeline. Together with four byte-for-byte retained Batch 01 sources, all 22 published games now select their correct owner-approved cover. No game repository, metadata, catalog order, tags or navigation is changed.

## Artwork identity and mapping

All three archives contain byte-identical manifests. Every one of the 36 supplied image SHA-256 checksums and dimensions matches [the original manifest](manifest.json), and each WebP's decoded RGBA pixels exactly match its PNG master. [Provenance](provenance.json) records the archive names, archive hashes, original asset IDs, real catalog IDs, target paths, retained Batch 01 checksums and the 11 owner-uploaded root PNGs preserved from main. The [masters directory](masters/) contains the untouched originals. Supplied publishing bytes live at the actual public source paths; redundant archival WebP copies are unnecessary because their exact hashes and original ZIP member names are recorded.

Only two proposed names required reconciliation:

| Supplied name | Existing catalog ID / actual publishing filename |
| --- | --- |
| `jeremys-odyssey` | `jeremy-odyssey` / `jeremy-odyssey.webp` |
| `jasmines-odyssey` | `jasmine-odyssey` / `jasmine-odyssey.webp` |

All other proposed IDs already match. `kaiju-tournament` maps to **World Kaiju Tournament**, `animal-match` to **Cute Animal Match**, and `snacks-match-raohe` to **Snacks Match – Raohe**. Preserve approved image lettering such as “Snack Match” and the historical catalog spelling `the-other-ninty-percent`; neither requires metadata changes. All 18 original masters were visually inspected against the intended titles/scenes. No mapping remains uncertain.

The earlier handwritten handoff's favicon deferral and approval wording are historical source material. The current user request explicitly preserves the implemented arrow favicon and authorizes production publication after validation; those current instructions govern this release.

## Preserved behavior and implementation

The complete-card anchor implementation, its keyboard focus, hover indication, accessible names and touch behavior remain exactly as implemented in `f85f194`. There is one native destination link per game card and no separate Play link or nested title/image links. The black-square/four-white-arrow favicon and content-fingerprinted icon URL are also unchanged.

No original publishing WebP or master was resized, cropped, recolored or regenerated. The existing responsive delivery builder remains unchanged: it generates optimized 480/960/1600px variants without upscaling and keeps the existing screenshot/placeholder fallback chain. Its existing 16:9 pixel normalization affects at most approximately 1.063 source pixels vertically for these nearly 16:9 inputs; there is no new compositional crop, overlay or typography treatment. The original source files retain every supplied pixel.

Root PNGs recently uploaded by the owner are retained in place and match their archived originals. They are outside the public build. Archival masters and multi-megabyte publishing sources are also absent from the generated site; only optimized delivery renditions are served.

## Validation and screenshots

- [Artwork validation](artwork-validation.json): 36 input checksums, 18 lossless decoded pairs, four unchanged Batch 01 files, all 22 custom-cover selections, generated fingerprints and no enlargement.
- [Browser results](browser-results.json): TypeScript/lint/format and 12 content/publishing tests passed; browser suite passed 10 responsive/theme layouts, 76 filter cases, 13 accessibility scans with **zero violations and zero incomplete checks**, 8 contrast cases, 13 behavioral scenarios and 5 isolated collection/editorial fixture routes.
- [Fallback validation](fallback-validation.json): 44 actual-card cases, covering all 22 covers failing and all 22 cover/screenshot chains failing. Screenshot or neutral-placeholder recovery and the original full-card destination are preserved in every case.
- [Local smoke](local-smoke.json): all 22 card destinations, names and image identities verified at 390px and 1440px in both themes; no redundant links, no JavaScript errors, no horizontal overflow, persistent theme, `/games/` compatibility redirect and exact favicon bytes verified.
- [Local integrity](local-integrity.json): all 130 generated files match the locally served build byte-for-byte. This is explicitly local evidence, not public CDN verification.

| Layout | Light | Dark |
| --- | --- | --- |
| Desktop 1440px | [Full gallery](gallery-1440-light.png) | [Full gallery](gallery-1440-dark.png) |
| Mobile 390px | [Full gallery](gallery-390-light.png) | [Full gallery](gallery-390-dark.png) |

These four images are **local captures of the completed production code and artwork**, not screenshots of the public site. Their receipts identify the changed working-tree base. Hosted CI validates the eventual exact source commit separately, including fresh real destination/resource checks and clean-source packaging.

## Production release and verification

The user explicitly authorizes this completed revision's merge and publication once checks pass; no additional creative approval or publication confirmation is required. The inactive proposal for ongoing commit-driven automatic publication is not activated. Existing manual-workflow security checks and exact-SHA confirmation inputs remain intact.

1. Push `platform/complete-covers-cards`, require its successful exact-SHA **Validate release candidate** run, and retain unrelated main changes.
2. Merge into main and require the resulting exact main SHA's CI to pass.
3. Dispatch **Publish approved Possibility release** from main with that full SHA as `release_commit` and `PUBLISH POSSIBILITY` as `authorization`. Start a fresh dispatch; rerunning an older run reuses its old input SHA.
4. Require prepare, publish and public verification to pass. The enhanced smoke script verifies the public build identity, all rendered image identities and destinations, no redundant links, both themes, responsive behavior, redirect and actual favicon response. It saves four production screenshots under `.artifacts/public-gallery/`, alongside `.artifacts/site-smoke.json`; the established workflow uploads these in `possibility-public-verification-<release-SHA>`.
5. Confirm public `/build-info.json` identifies that exact source with `sourceDirty: false`. Keep the pre-release main SHA `329ab77e1ced01c295155a48a0e7421c72c198f7`, pre-cover platform SHA `7ddebf60be381873b087d4aea481041f84661578`, and established rollback baseline `56f5a997ef12b66cce4948b770c92bc3e8c5db81` in history.

The cloud session currently receives proxy HTTP 403 errors for `api.github.com` despite the network permission grant. If that remains unchanged, workflow dispatch and public verification are genuine runtime-access blockers, not missing owner authorization. Do not describe a source merge, a local test or a denied dispatch as successful public deployment.

For a future single cover, follow [the existing one-file owner procedure](../MAINTENANCE.md#replace-artwork): preserve its approved master, replace `public/assets/covers/games/<existing-id>.webp`, commit and validate, then publish the resulting exact main SHA through the established workflow. No JSON, checksum or application-code edit is needed for an ordinary replacement. This batch's archived checksums describe its frozen release inputs rather than prohibiting future owner-approved replacements.

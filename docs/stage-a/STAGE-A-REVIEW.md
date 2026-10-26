# Possibility — Stage A review

Review date: **2026-10-27 (Asia/Taipei)**. Scope: read-only reconnaissance, art-direction studies, and implementation proposal. **Awaiting visual approval; Stage B has not started.**

## Decision in view

Recommend **A · Open Folio**: a warm, spacious editorial gallery. It gives the actual work the strongest presence while retaining an identity suitable for writing, software, or other media later. The homepage stands on its own with three actual works and a single populated Games route.

- [A — desktop/mobile board](board-a.png), [desktop full size](concept-a-1440.png), [mobile full size](concept-a-390.png).
- [B — desktop/mobile board](board-b.png), [desktop full size](concept-b-1440.png), [mobile full size](concept-b-390.png).
- [C — desktop/mobile board](board-c.png), [desktop full size](concept-c-1440.png), [mobile full size](concept-c-390.png).
- [Offline review index](index.html) and [repository inventory](repository-inventory.csv).

These are static compositions, not an implementation or release candidate. Their action labels are illustrative. All art in the compositions is from genuine repository gameplay screenshots. Screenshot cropping and working copy are proposals, not changes to a game. No AI-generated substitute gameplay, invented releases, empty future branches, metrics, or publication dates were added. “View game” proposes a portal detail/preview action; production **Play** actions remain subject to reachable-release checks.

## Verified findings and their limits

The public repository listing at `https://github.com/jaychtw?tab=repositories` exposed **25 repositories**, with no next-page link. All 25 public repository pages and READMEs were inspected, including default branch and top-level file inventory. This is public discovery, not a claim about private repositories. Exact inspected commits are recorded in the CSV. The documentation fork and headless match-3 engine are not games to put in the gallery.

The four works below have explicit acceptance/release records and successful public GitHub Actions runs independently observed during this audit. For each, the workflow at its deployment-run commit was inspected: public verification is a required post-deployment step, not a disabled or allowed-to-fail check. Those workflow files are retained under `evidence/<repository>/release-workflow.yml`.

| Proposed work | Canonical destination from release evidence | Corroboration | Proposed role |
| --- | --- | --- | --- |
| Republic of Chickens · 雞窩共和國 | https://jaychtw.github.io/reppublic-of-chickens/ | [Release/deployment record](https://github.com/jaychtw/reppublic-of-chickens/blob/f5a2511ea87ba03c461d7e49222c25e1459a02f3/docs/DEPLOYMENT.md); [successful run 40372417744](https://github.com/jaychtw/reppublic-of-chickens/actions/runs/40372417744). Required public check covers assets, five hall routes, dialogue and language. | Homepage lead for A/B; Games candidate. Preserve **reppublic** spelling in URL. |
| Squirrel Control — Room 1 | https://jaychtw.github.io/squirrel-control/ | [Publication/acceptance record](https://github.com/jaychtw/squirrel-control/blob/main/docs/DEPLOYMENT.md); [successful run 40126699586](https://github.com/jaychtw/squirrel-control/actions/runs/40126699586). Public release/hash and actual mouse/touch wins checked. | Supporting feature; Games candidate. Publication date explicitly recorded as 2026-10-25, Asia/Taipei. |
| Wonderlands | https://jaychtw.github.io/wonderlands/ | [Release record](https://github.com/jaychtw/wonderlands/blob/33f262a5be41d118d4ebd90ca955fbb2eb2ccb25/docs/PAGES-RELEASE.md); [successful run 40311862602](https://github.com/jaychtw/wonderlands/actions/runs/40311862602). Exact release files, terrain edits, save/reload and language verified publicly. | Homepage lead for C; supporting feature for A/B; Games candidate. |
| The Last Lantern | https://jaychtw.github.io/the-last-lantern/ | [1.0.0 acceptance/release record](https://github.com/jaychtw/the-last-lantern/blob/main/docs/RELEASE-1.0.0.md); [successful run 40266335881](https://github.com/jaychtw/the-last-lantern/actions/runs/40266335881). Public file hashes, startup, touch movement and language checked. | Games candidate; screenshot inventoried, not used in the homepage studies. |

**Historical release evidence is verified; fresh direct live-site inspection is blocked.** All **21 documented Pages URLs** attempted (including the user-site root, a review gallery, and query variants) were rejected by the environment proxy at CONNECT with `403 Forbidden`. That is not the game returning HTTP 403, nor evidence that the site is down. [Exact requests/results](destination-checks.json). No local browser playthrough of the current public sites is claimed. The GitHub API was likewise blocked; GitHub's public web and raw-file hosts worked. No new remote workflow was triggered to work around this limitation.

A network draft preserving the existing package-manager preset adds only **`jaychtw.github.io` and `api.github.com`**. The save returned `status: saved`, `requires_publish: true`. To enable direct checks, review/save those changes in environment settings and publish the **cloud environment configuration/snapshot** as required by that UI. This is separate from publishing the Possibility website. Saving the draft alone did not change runtime access; a subsequent check remained blocked. No secret is required for these public reads.

Fresh checks of the shortlisted destinations, actual assets/basic interactions, root behavior and Pages settings remain open. This prevents a claim that the live-destination audit is fully complete or that launch Play links are currently verified. It does not prevent selecting an art direction or subsequently building a local candidate.

### Additional candidates and deliberate exclusions

- **Snacks Match: Raohe** has explicit acceptance/release evidence, a documented publication time on 2026-10-24, and [successful deployment/public-check run 40090182305](https://github.com/jaychtw/snacks-match-raohe/actions/runs/40090182305), corroborated here. It may join Games after the same fresh link check and curation; it is not automatically added.
- **Shape Match** has explicit G5 acceptance, a `v1.0.0` tag/release, and linked approved-build public-check evidence in [its release report](https://github.com/jaychtw/shape-match/blob/main/docs/RELEASE-v1.0.0.md). Those additional run/tag outcomes were not independently inspected in this bounded shortlist audit. Verify them if selected.
- **Junctioneer** has corroborated successful production deployment and rich public-check records; its documentation distinguishes approved direction from final human art acceptance. Hold from the launch selection until that status is resolved.
- **Animal Match** reports a public deployment, but its QA report explicitly leaves final creative acceptance pending. **Kaiju Tournament** is a release candidate whose documentation explicitly says the expected URL is not verified. Neither is presented as an approved released entry here.
- **Kaiju Demolition** and **Typhoon Defender** document manual publication rather than a verified hosted release. Other game repositories remain candidates, not inferred published works. See the 25-row inventory for individual findings.
- **Formosa Quest → `/side-scroller-01/`**, **Jeremy’s Odyssey → `/vertical-scroller-01/`**, and **Tidelight → `/random-project-01/`** have documented historical paths different from current repository names. Do not guess replacement paths. Preserve `the-other-ninty-percent` and `nom_nom_boom` spelling as well.

## User-site conflict assessment

`jaychtw/jaychtw.github.io` **already exists**. The checkout and public `main` agree at **`e7f1961d648315ee2cce3dfc2eab65c9e4164b5b`** and contain only `README.md` (“Portal of jaychtw”). There is no tracked application, `.github` deployment workflow, `CNAME`, or `_config.yml` at this inspected commit. The working tree was clean at the original audit. This subsequent review change adds documentation and visual review artifacts, plus a README entry point. Do not create a duplicate user-site repository or reset this checkout.

This establishes no source-content conflict at the inspected HEAD. It does **not** establish that Pages is disabled, the root is unused, no external branch is serving it, or no custom domain is configured. Those are repository settings/live-response questions. The public repository page exposed no deployment section, which is inconclusive. No settings change or public deployment is authorized.

Before any eventual publication, inspect Pages source/build type, serving branch/path or workflow, canonical/custom domain/HTTPS, existing root response and redirects, and any existing `/games/` content. Existing project Pages paths must remain intact. No repository renames, game moves, root service worker, shared game storage migration, catch-all route, or changes to game workflows.

## Authentic visual inventory

[Asset provenance manifest](asset-provenance.json) records pinned raw URLs, full source commit and SHA-256 for four unmodified screenshots. Original PNGs are retained under `assets/`. Concepts crop them through CSS; none is falsely described as a fresh live capture.

| Asset | Provenance and suitability | Reuse consideration |
| --- | --- | --- |
| Republic overview | `docs/screenshots/overview-desktop.png`; documentation identifies it as actual overview gameplay. Strong golden light, busy illustrated setting. | Production artwork is documented as original project-generated layers. Do not reuse the supplied reference/concept sheet. Commercial quotation attribution remains a separate issue in the game’s notices. |
| Squirrel cottage | `docs/evidence/gameplay-1440-en-tidy.png`; README labels it Room 1 gameplay. Clear characters and soft purple/cream palette. | Original game illustration; use screenshot, not an unaccepted character study. Owner-portfolio reuse proposed, no new open license asserted. |
| Wonderlands edited world | `evidence/desktop-after.png`; README explicitly identifies actual pointer-painted gameplay. Ocean/terrain provides a distinct visual register. | Do not use the historical Stage A island: README explicitly excludes it from the shipped game. |
| The Last Lantern village | `docs/evidence/gameplay-1440-en.png`; README identifies running-game Hearthmere. | Asset documentation records source-authored 3D renders, a separate distant matte and locally licensed fonts. No claim of entirely handmade art or blanket commercial clearance. |

The brief authorizes identifying and using representative authentic imagery for these concepts. It does not create a new general license. Asset origins/notices were checked where supplied; no third-party commercial-rights certification is claimed. Stage B will copy only the selected screenshots into portal-local optimized thumbnails with this provenance. No runtime hotlinking to game assets or GitHub.

## Three homepage directions

| | A · Open Folio — recommended | B · Playful Editions | C · Afterlight |
| --- | --- | --- | --- |
| Identity | Oversized editorial serif wordmark, warm paper, thin olive rules. | Bold sans wordmark, staggered poster panels, ink outlines and small citron actions. | Compact serif identity, charcoal/green surround, cinematic image-led pacing. |
| Desktop composition | Republic lead image with side caption; two smaller paired supporting works; Games collection row. | Two unequal staggered posters, then a compact third work; heavier collection action. | Wide Wonderlands image, separate editorial caption, then two compact works. |
| Mobile composition | Wordmark + one short sentence; image first, caption next; supporting work rows. | Stacked full-width posters with large titles and clear action blocks. | Narrow intro, tall central world crop, title/action below, two supporting rows. |
| Strength | Clearest balance of work, restraint, and identity beyond games. | Most playful and memorable; direct invitation to explore. | Strongest sense of immersion and quiet atmosphere. |
| Tradeoff | Quieter; depends on good image selection and typographic detail. | More visually assertive; can feel like a games-only brand without restraint. | Dark frame changes the perceived warmth of pastel work; wide crops need careful checking. |

All three have only real works and Games, no speculative navigation or Recently Added. The initial homepage is deliberately not a repository directory. Recently Added stays omitted until verified chronology and editorial value warrant it. English UI is the proposed default; game language metadata is independent and must be verified. GitHub is a confirmed footer destination; no LinkedIn/contact details were invented. Working copy is not a permanently locked tagline.

## Proposed Stage B architecture

Use **Astro + TypeScript, static output**, a frozen npm lockfile and a locally validated JSON catalog. No React runtime, CMS, database, API keys, client router, analytics, remote font service or runtime GitHub API is necessary.

- `/` is the complete standalone Possibility portal; `/games/index.html` is a distinct directly bookmarkable Games experience. Optional `/games/<id>/index.html` pages provide concise preview/controls/accessibility notes without iframes. GitHub Pages serves each physical route on refresh.
- v1 Games shares the portal deployment as expressly permitted by the brief. Each existing game remains a separate, independently deployed project. No shared runtime or asset imports from those projects. Games can later be extracted to its own host with a planned redirect from the old gallery URL.
- `src/data/projects.json` owns curated entries. Stable IDs; extensible medium/collection; explicit status (`draft`, `approved`, `published`, `archived`); editorial order/featured flag; concise summary; typed destination action; local thumbnail; verified language/control notes; source/evidence metadata. No assumption that every future work has a Play action.
- Validate unique IDs, enums, required text, safe HTTPS destinations, optional dates, local asset existence, traversal-free paths and provenance. Escape rendered text and reject unsafe protocols. Missing optional art produces a designed typographic fallback; a supplied required asset path that cannot resolve is a build failure.
- Separate publication facts from `verifiedAt` evidence timestamps. Never substitute commit time for publication time. Keep legacy `publishedAt` explicitly unknown if evidence is absent; omit date/recent-order UI for such entries. Published/Play eligibility requires approval and a confirmed reachable destination. Do not silently treat an unrun or blocked link check as a pass.
- Generate all rendered catalog content at build time. No game/API requests required to render portal or gallery. Losing access to a game can disable its link without breaking portal assets/layout.
- Namespace any future portal storage; **no root service worker** (it could intercept other games on this same origin). Do not assume different project paths isolate localStorage; they share the origin. Keep portal CSS, scripts and deployment artifact scoped to portal content.
- Build a manual, approval-gated deployment workflow. Pushes/PRs validate; they do not automatically deploy. Public deployment still requires a fresh explicit instruction and any configured repository/environment approvals. No workflow dispatch or Pages settings changes in Stage A/B without release authorization.

[Future release-to-portal update contract](RELEASE-TO-PORTAL.md) is drafted in portable documentation, not installed into any other repository. It can be incorporated into the approved Stage B README/docs without altering a shared standards repository.

## Acceptance mapping and evidence

| Gate | Stage A result / Stage B plan |
| --- | --- |
| Visual options | Three genuinely distinct compositions, each captured at **1440px desktop and 390px mobile**. All use real gameplay captures. Creator selection pending. |
| Responsive concept sanity | Chromium **154.0.8037.57** composition checks at **320, 390, 768, 1440px**, 12 cases; every image decoded, no horizontal overflow or JavaScript page errors. `composition-checks.json`. These are layout checks, not finished-site QA. |
| Public release evidence | Four shortlisted approval/release records + successful hosted runs + required live-check workflow inspection. Current direct public checks blocked, not passed. |
| Root conflict | Existing repository and minimal source confirmed. Live root, Pages settings and potential `/games/` collision remain unverified. |
| Independent architecture | Proposed static rendering/local assets and independent external game links. Verify Stage B with network disabled after page load and with game destinations unavailable. |
| Functional Stage B | Direct/refresh `/games/` and detail routes; every catalog-driven card/action; all asset paths and metadata; missing art, empty collection and unpublished entry behavior; URL safety and malformed-catalog failures. |
| Quality Stage B | Frozen install, typecheck, build and meaningful catalog tests; Chromium at 320/390/768/1440, keyboard/focus manual checks, axe serious/critical issue resolution, reduced-motion and image-failure checks. Record exact browser/version; do not claim physical phones/Safari/Firefox/assistive technology without testing them. |
| Release candidate | Local production build, review screenshots, test record, selected catalog/evidence/provenance, README, manual deployment/rollback instructions and a reviewable diff. Not publicly deployed. |
| Public release | Separate explicit authorization after review, final live/root/settings verification and publication workflow checks. Any other-repository modification requires separate authorization. |

This change versions the Stage A review in `docs/stage-a/` and adds a root README entry point, following the creator’s explicit request to push the review to `main`. No game code, repository settings, release tags, deployment workflow or public site deployment is included. The original reconnaissance saved only an environment network draft; no install/start instructions were overwritten and no new public workflow runs or GitHub API writes were triggered by that audit.

## Approval boundary

Select A, B or C, or specify a focused combination/revision. Approval authorizes Stage B implementation in the existing Possibility repository and local candidate testing. It does **not** authorize public deployment or editing another repository. The fresh live/root checks still need the network-access change; those checks must be completed before a launch-ready claim.

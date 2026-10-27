# Possibility

A static creative portal with living window light, natural scrolling into a white portfolio, and an independent `/games/` URL. **Stage B release candidate: `1.0.0-rc.1`. Not publicly deployed.** The creator approved Stage A.2 Revision 2 (`f99940e`) as the v1.0 visual baseline; it is an evolving design, not a permanent freeze.

## Develop and review

Node **24**, npm, and Python **3** are required. Browser checks use system Chromium/Chrome; `CHROMIUM_PATH` can select an installed executable. There are no production npm dependencies.

```sh
npm ci
npm run dev
```

Local addresses after startup:

- http://localhost:4173/ — living-light landing and continuous portfolio.
- http://localhost:4173/games/ — independent game portfolio.
- http://localhost:4173/games/republic-of-chickens/ — an example shareable game fact sheet.

`dev` builds once and serves **only `dist/`**, not the repository. Rebuild after source edits; use `python3 scripts/serve.py --port 4174` if needed. Stop with Ctrl+C. Production output contains physical HTML files, local assets and minimal optional enhancement JavaScript. Galleries and links work with JavaScript disabled; no GitHub/game API, remote font, iframe, service worker, account or analytics is required.

```sh
npm run check          # typecheck, lint, catalog tests, build, production browser checks
npm run verify:links   # fresh normal-TLS requests to all published destinations
npm run build
npm run preview
```

`npm run test:browser` owns local ports 4173 and 8766; stop conflicting previews first. Its evidence goes to `.artifacts/browser/`. The visual reference is a small frozen test fixture, not a dependency on a running game or prototype.

## Production and release

[Stage B release report and screenshots](docs/release/README.md) · [Exact deployment and rollback steps](docs/DEPLOYMENT.md) · [Catalog/update contract](docs/CATALOG.md) · [Design architecture and future refinements](docs/DESIGN.md) · [Asset provenance](docs/ASSETS.md).

CI validates pushes/PRs and saves a review artifact; it **does not deploy**. A separate **manual** workflow publishes only an exact approved commit after explicit creator authorization. No deployment authorization is implied by a green CI run, a game release, or this release-candidate commit. Other-repository changes require separate authorization.

From a clean committed checkout, `npm run release:check` produces a deterministic ZIP, full file manifest and SHA-256 under `.artifacts/release/`; CI uploads those with browser/link evidence. A dirty checkout is intentionally not packageable as a release. Only generated `dist/` is a deployable site; review docs, prototype experiments, source, test fixtures and node_modules are excluded.

## Where changes belong

| Concern | Location |
| --- | --- |
| Curated work and release facts | `content/projects.json` |
| Public-link evidence / image provenance | `content/link-verification.json`, `content/asset-provenance.json` |
| Identity, canonical origin and design version | `content/site.json` |
| Sunlight and gallery markup | `src/components/` |
| Motion periods / individual visual systems | `src/styles/tokens.css`, `sunlight.css`, `gallery.css` |
| Static route composition | `src/render.ts` |
| Optional image resilience / offscreen motion | `src/client/site.js` |
| Validation, build, package and post-deploy verification | `src/catalog.ts`, `scripts/` |

The catalog's category and destination action support media beyond games. No empty future branches are built. Games retain their own repositories, assets, hosting and save namespaces; portal changes never rebuild or modify a game.

## Earlier research

[Approved Stage A.2 revision 2](docs/stage-a2/revision-2/README.md) · [Original reconnaissance](docs/stage-a/STAGE-A-REVIEW.md). Historical reports retain their original evidence limits; the production report is the current readiness record.

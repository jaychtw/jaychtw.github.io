# Possibility

A personal creative publishing platform. **Platform v1.0 is a development release candidate; the redesigned site is not publicly deployed.** The existing sunlight site remains live. The current workflow validates pushes and publishes only after manual authorization.

## Review and run

[Platform release report, inventory, screenshots and limits](docs/platform-v1/README.md) · [Routine publishing](docs/MAINTENANCE.md) · [Deployment gate](docs/DEPLOYMENT.md)

[Focused visual review](docs/cover-poc-v1/README.md): compact-filter comparisons are available; the supplied cover POC awaits its original downloadable image file.

```sh
# Node 24, Python 3 and a supported Chromium/Chrome for browser checks
npm ci
npm run dev
```

Open **http://localhost:4173/**. **http://localhost:4173/games/** redirects to the Games homepage. Example preserved fact sheet: **http://localhost:4173/games/republic-of-chickens/**. The server is local only; rebuild after edits with `npm run build`. No game repository or runtime external service is needed.

```sh
npm run check          # types, lint, catalog/publishing and local browser tests
npm run verify:links   # actual public destinations/resources, normal TLS
npm run release:check  # checks + clean exact-source review ZIP; never deploys
```

Browser checks use installed Chromium/Chrome (`CHROMIUM_PATH` override); GitHub CI uses runner Chrome. Test fixtures, screenshots, asset checksums, live-link receipts and review ZIPs are generated in ignored `.artifacts/`. CI uploads them as `possibility-review-<full-SHA>`. CI validates main, PRs and `platform/**` review branches; it has no publication job.

## Small, shared layers

- `content/site.json`, `collections.json`: identity, homepage collection and collection settings.
- `content/projects/<collection>/<id>.json`: editable project metadata, tags, status and order.
- `content/articles/blog/*.md`, `what-now/*.md`: Markdown authoring; no demonstration content shipped.
- `public/assets/covers/<collection>/<id>.webp`: optional same-path artwork overrides.
- `src/components`, `src/styles/platform.css`, `src/client`: shared layout, gallery, themes and progressive enhancements.
- `src/publishing.ts`, `scripts/build.ts`: one Node/TypeScript Markdown/static builder with fingerprinted responsive assets.
- `tests`: production behavior and isolated publishing fixtures. `tests/archive` and older visual references retain the previous design's historical checks.

[Catalog/update contract](docs/CATALOG.md) · [Design/refinement](docs/DESIGN.md) · [Asset provenance](docs/ASSETS.md)

Historical research remains under [Stage A](docs/stage-a/README.md), [Stage A.2](docs/stage-a2/README.md), [Revision 2](docs/stage-a2/revision-2/README.md) and [Stage B](docs/release/README.md). The active gallery follows the [new textual direction](docs/platform-v1/textual-design-amendment.md); the archived sunlight implementation is no longer the active homepage.

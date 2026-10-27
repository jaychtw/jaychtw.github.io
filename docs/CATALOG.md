# Catalog and release-to-portal update contract

The curated source is one JSON file per project: `content/projects/<collection>/<id>.json`. `collections.json` configures shared galleries/editorial collections; `site.json` selects the homepage. There is no runtime repository feed. [Owner editing instructions](MAINTENANCE.md).

## Project fields

| Field | Meaning |
| --- | --- |
| `id`, `category` | Stable lower-case hyphenated ID and configured gallery collection. Must match filename/directory. |
| `title`, `summary` | Accurate project name and concise description, displayed on complete cards. |
| `tags` | Ordered, optional descriptive labels. Single-selection filters are derived from published entries; All is reserved. No Commercial or Children. |
| `status` | `draft`, `approved`, `published`, `archived`; only published appears in pages/assets. |
| `maturity` | `released`, `public`, `evolving`. Public showcase visibility does not assert final creative acceptance. Preserve limitations honestly. |
| `order` | Editable nonnegative integer; ascending order, stable ID for ties. `featured` is retained legacy metadata, not a second homepage subset. |
| `publishedAt` | Actual known `YYYY-MM-DD` or null. Never infer from commit/repository dates. |
| `destination` | HTTPS URL and action; games use `play`, Apps normally `open`. Preserve exact independently published path/spelling. |
| `repositoryUrl` | Optional HTTPS source URL or null. |
| `languages`, `controls`, `limitations` | Documented capabilities and honest limits. Null controls are allowed rather than guessing. Empty languages are supported for non-game media. |
| `approval` | Source/acceptance URL and factual note. Existing approvals stay documented; evolving public projects need no invented certification. |
| `release` | Known version/full commit or explicit nulls. Do not label an unknown/evolving build final v1.0. |
| `thumbnail` | Authentic local screenshot `{path, alt}` or null. Custom covers are discovered automatically, independently of this screenshot field. |

`content/link-verification.json` holds dated successful public destination observations. The build requires matching evidence; release validation makes fresh normal-TLS requests. `content/asset-provenance.json` records screenshot origins/rights; its import checksum is a historical import observation, not a manual replacement lock. Current source/derivative checksums are generated in `.artifacts/asset-evidence.json` and the release manifest.

## Portable future update sequence

1. Independently release or otherwise make the project publicly available under its own authorized lifecycle. A portal change never authorizes game-repository changes or deployment.
2. Verify the real canonical destination, project identity, resource availability and representative interaction as appropriate. Distinguish HTTP observations, browser checks and human acceptance. Preserve known limitations and actual dates; a working evolving project may be accurately showcased.
3. Prepare its project JSON, authentic screenshot/source record or neutral fallback. Optional owner-approved cover goes at `public/assets/covers/<collection>/<id>.webp`; final artwork is created/reviewed separately. Do not depict nonexistent features as gameplay.
4. Record matching destination evidence using the documented JSON fields or `python3 scripts/verify-links.py --record`. Repeated updates use the same stable ID, never duplicate entries or reset dates.
5. Set published when the presentation is defensible. Run checks or commit for CI. CI validates images, catalog, rendering, accessible behavior and fresh public links. A failure does not alter the previous public portal or the independent project.
6. Review the change. While the current manual gate remains active, publish only after separate explicit authorization. After automatic publication is separately enabled, an approved main commit follows that configured policy.
7. Verify the public portal's build identity/routes/assets and destination. A portal rollback does not roll back any game.

This ordinary data/document contract is portable to other tools or human maintainers. No shared standards repository was changed. Apps shares the model; Blog and What Now? share the Markdown engine and derive navigation/indexes only from published articles. [Previous Stage B contract](platform-v1/previous-catalog.md) remains archived.

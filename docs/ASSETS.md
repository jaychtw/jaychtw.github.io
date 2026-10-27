# Artwork, screenshots and generated assets

The current candidate has **16 authentic documented gameplay captures and six neutral monogram fallbacks**. `content/asset-provenance.json` records pinned original URLs/commits, original/import checksums, dimensions, treatment and rights notes. `docs/platform-v1/migration-inventory.json` maps every migrated work to its identity source, screenshot or fallback. Existing four square derivatives/original Stage A captures remain archived; no historical evidence was deleted.

New source screenshots live under `public/assets/screenshots/games/`. They are resized WebP imports of actual documented game captures, not final promotional art. The builder generates centered 16:9 card crops at available 480/960/1600 widths without enlargement; article body images retain their proportions. Cover creation/approval remains with the creator and ChatGPT, separately from engineering. No stock art, example projects, or independently generated final covers are shipped.

## Priority and replacement

1. Valid custom WebP at `public/assets/covers/<collection>/<id>.webp`.
2. Metadata's authentic screenshot.
3. A neutral title monogram.

Owner-approved custom covers should be 16:9, preferably at least 1600×900. Keep high-resolution originals separately; only web delivery sources belong in this path. Replacing the same source automatically generates new content-fingerprinted URLs and responsive `srcset` output; no code or manual hash update is required. Invalid custom artwork warns and falls back. Runtime failure tries the available screenshot, then a monogram, retaining the open/play action.

`.artifacts/asset-evidence.json` records each build's actual source checksums, derivatives and priority selection; release manifests hash every emitted file. Historical import hashes do not pretend a replacement has the original bytes. A routine screenshot replacement must still be authentic and retain an accurate source record; a newly approved cover can be integrated through the dedicated owner-controlled path without editing the game.

Fonts use installed system serif/sans stacks. Only the small theme orb uses a glossy gradient; no ornamental background/arcade art is added. Project notices and third-party rights remain with their sources. Owner portfolio use does not assign a blanket open-source/commercial license to artwork. Code and tests are AI-assisted; no handcrafted-authorship claim is introduced.

[Owner replacement steps](MAINTENANCE.md) · [Historical asset record](platform-v1/previous-assets.md).

# Possibility — Cover Completion + Card UI Handoff

This package contains 18 approved/frozen cover artworks, each in its original PNG master and lossless WebP publishing format.

The first four published covers (Republic of Chickens, Wonderlands, Squirrel Control, The Last Lantern) are already on the site and are intentionally NOT duplicated here.

## Scope
1. Integrate the 18 approved cover artworks into the existing game gallery.
2. Remove the redundant 'Play' link beneath every game card, while keeping the whole card an accessible clickable link.

## Not in scope
- Favicon redesign. Explicitly deferred by owner.
- Changes to game mechanics, catalog ordering, navigation, tags, or metadata.
- Artwork regeneration or reinterpretation.

## Important
The IDs/paths in manifest.json are proposed publishing names, not an authoritative extraction from the repository. Resolve them against the real gallery catalog and asset mapping before modifying anything. Do not add duplicate catalog entries or rename existing game IDs.

Check that the 18 images correspond to the intended games by inspecting the master artwork and the manifest; report any uncertain mapping.

Preserve the approved images exactly: no crop, overlay, recoloring, or new title treatments. Use included lossless WebP files unless the existing pipeline requires otherwise.

Keep the current approved publishing/release gate: commit, test, report, and publish only with explicit owner authorization.

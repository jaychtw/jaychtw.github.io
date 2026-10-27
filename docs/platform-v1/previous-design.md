# Design and architecture

## v1.0 baseline, not a permanent freeze

The creator approved **Stage A.2 Revision 2, `f99940ec0de18544299f5095890042584b1b1bd7`**, then authorized Stage B production. Default: living Window light + Drift gallery. The title/email stay stationary within the first viewport; native scrolling reveals white, square, deliberately staggered linked thumbnails and titles. `/games/` is directly addressable. No tagline, manifesto, future categories, decorative controls or marketing panels were introduced.

Identity remains medium-independent. The root renders editor-selected published work, not a repository directory. Games is the first populated collection; future real work may use another category/action without pretending it is playable. No Recently Added area is rendered because verified chronology/editorial value is not established for the whole catalog.

## Small replaceable layers

- `content/site.json` records identity, the current design version and the approval reference. Catalog and provenance are version-controlled data, never a runtime API.
- `src/components/sunlight.ts` owns the decorative window shape and minimal identity/scroll cue. `sunlight.css` owns broad edge morphs, drift and slow illumination; periods are in `tokens.css`. Text is outside the animated layer.
- `gallery.ts` owns reusable image/title links and honest missing-art fallbacks. `gallery.css` owns the deterministic rhythm and responsive behavior. Both routes share these components and one catalog.
- `src/render.ts` composes physical HTML routes. Four optional, independently addressable game fact sheets expose concise controls/languages/limitations and Play/Source links; gallery tiles continue launching games directly, preserving the approved interaction.
- The tiny client module only handles failed images and pauses invisible light. Removing JavaScript retains all initial content, routes, native links, natural scrolling and the CSS reduced-motion fallback.
- The typed static builder validates before replacing its own generated output, fingerprints assets, creates metadata/sitemap/404, and copies only published production files. No framework server or client router is necessary.

This division permits later animation, composition, interaction and visitor-experience changes within a component. It does not require redesigning other components or rebuilding/redeploying games. An ordinary static build is still required to publish changed portal files; “modular” does not mean unreviewed runtime edits.

## Refinement workflow

1. Scope a small change against the current experience, noting any deliberate departures from the baseline.
2. Modify the relevant component/tokens. Use a local preview and real project art; do not add synthetic work to fill a layout.
3. Run checks at narrow/mobile/tablet/desktop sizes, reduced motion, keyboard and relevant failure states.
4. When the creator approves a changed visual direction, update the small `tests/visual-reference/` fixture, its approval metadata, and the design version/reference in `content/site.json`. Archive meaningful prior evidence. No prototype server or game repository must be changed to update production tests.
5. Prepare a new review artifact and release notes. Publication remains independently authorized.

The visual comparison is a regression guard for the currently approved version, not an argument against future creative changes. Deliberate approved changes should update its reference instead of disabling tests or pretending old/new screenshots are identical.

## Delivery and independence

The root and `/games/` share one static deployment, as allowed for v1. Each game is a separate site and lifecycle; there are no game script/asset imports, runtime GitHub calls, iframes or shared save keys. The portal writes no browser storage and installs **no root service worker**, which could otherwise intercept project Pages sites sharing this origin.

A future extraction of Games must preserve its identity and plan a redirect for the existing `/games/` and fact-sheet URLs. Adding a real branch is a curation/hosting decision, not a requirement to prebuild empty categories.

## Accessibility decisions

Semantic landmarks/headings, visible focus, native anchors, an optional accessible downward cue, descriptive image alternatives and named external actions retain the title-only visual gallery. Text-size reflow works without moving the title with the light; large text may wrap at narrow widths. Full viewport scene sizing uses `svh` to avoid browser-toolbar jumpiness.

Reduced motion is an attractive still scene; forced-colors mode suppresses decorative light. Two broad SVG paths provide a stable fallback where CSS path morphing is unsupported. Offscreen/hidden-tab light pauses without affecting scrolling or content. No audio, flashing, cursor-following, scroll snapping or intercepted input is used.

Complex-gradient axe contrast checks require a separate rendered-pixel/compositing review. Actual scope, numeric bounds and untested devices are recorded in the release report, not presented as certification.

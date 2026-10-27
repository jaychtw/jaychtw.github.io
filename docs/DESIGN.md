# Platform design and maintainability

The creator-approved **Platform v1.0 textual direction** supersedes the sunlight landing and staggered square gallery. [Authority and boundaries](platform-v1/inputs/implementation-authorization.md), with the [final amendment](platform-v1/textual-design-amendment.md) superseding its mockup-attachment gate. The design is a versioned baseline, not a permanent freeze.

## Current composition

Compact shared header, restrained wordmark, only published navigation and a small glossy theme orb. Games opens immediately at `/`. Centered wrapping pill buttons filter complete 16:9 image/title/tag/description/action cards. Three columns at 1024px+, two at 640–1023px, one below 640px. Dark charcoal initially; explicit user selection persists in `possibility:theme`. Pale neutral light mode, restrained rounding, no enclosing card boxes or heavy shadows.

`src/styles/platform.css` owns current tokens and composition. Earlier sunlight/gallery styles and the component remain archived, unused by the active builder; historical experiments and evidence are not deleted. `site.approvedBaseline` retains the prior sunlight approval SHA for provenance, not as the new visual authority. `designVersion` describes Platform v1.0; release build metadata records the textual authority.

## Replaceable modules

- `model.ts` / `catalog.ts`: typed, validated, data-driven identity and project collections.
- `components/html.ts`: shared header, semantic page, canonical metadata and restrictive CSP.
- `components/gallery.ts`: shared Games/Apps cards, filters and image fallbacks.
- `render.ts`: collection indexes, compatibility pages, project fact sheets and articles.
- `publishing.ts`: one safe Markdown/front-matter engine shared by Blog and What Now?. Collection settings and masthead classes preserve their editorial distinction.
- `client/theme.js`: tiny same-origin blocking script before CSS, applying only an explicit stored theme without a flash of the opposite appearance.
- `client/site.js`: theme interaction, single-selection filter, runtime image fallback. No client router, analytics, data fetch, service worker or external runtime dependency.
- `scripts/build.ts`: validate and render in memory before replacing recognized output, generate assets/evidence and static routes. It emits only published content, not source or test fixtures.

Homepage selection is `homepageCollection` in site settings. A collection must have published content before becoming home. Other indexes and stable detail/article URLs remain independent; the homepage collection's ordinary URL receives a compatibility page. No speculative section is exposed.

All projects render and open without JavaScript; enhanced controls stay hidden rather than pretending to work when JavaScript is disabled. Filters preserve source ordering, use `aria-pressed`, and announce result counts. Native buttons/links, a skip link, visible focus, reflow, reduced motion and forced colors support accessible browsing. The orb has a 44px target and an action label independent of its appearance.

## Future refinement

Change the relevant component or styles, inspect real content in both themes and responsive sizes, run checks, and capture fresh evidence. Update approved visual references when the creator approves a new direction; do not preserve obsolete pixel comparisons as a permanent freeze. Content additions, reorderings and cover replacement require ordinary data/assets, not component changes.

The portal and game sites remain independent deployments. No game assets/scripts are imported at runtime, no game storage is edited, and **no root service worker** is installed on the shared origin. The previous design document is [archived](platform-v1/previous-design.md).

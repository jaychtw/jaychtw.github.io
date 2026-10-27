# Possibility — Visual Direction Pivot / Codex Handoff v1.1

**Date:** 2026-10-27
**Status:** New direction to prototype; **not** visual approval for full Stage B or authorization to deploy
**Repository:** `jaychtw/jaychtw.github.io`
**Supersedes:** Stage A preference for A/Open Folio, B/Playful Editions, or C/Afterlight. Those are exploratory references, not selected art direction.
**Authority:** This handoff governs visual/interaction direction where it conflicts with the earlier CEDG v1.0. All non-conflicting principles, safety, content provenance, independent sites, and publication gates in CEDG remain in force.

## 1. Creative intent

Create a website that makes visitors sense **possibility and discovery**, without explaining those concepts in copy. Reduce the visual language to two contrasting experiences: an almost empty, atmospheric landing page, and a white, carefully irregular portfolio gallery. The site should feel finished even when few projects are present, and able to change over time without changing its identity.

**Design shorthand:** *Quiet light. Intentional irregularity. Discoverable work.*

Avoid an ordinary agency portfolio, a game-studio landing page, a magazine home page, and a hero full of CTAs or marketing language. Do not add philosophical slogans or biography.

## 2. Page A — landing (`/`)

### Binding requirements

- Full-viewport, responsive, visually complete composition.
- One dominant centered word: **Possibility** (exact casing).
- One small functional email link: **jay.yc.chen@gmail.com** with `mailto:jay.yc.chen@gmail.com`.
- No tagline, biography, paragraph, featured-project panels, hero carousel, fake content, or social links in the main composition.
- Background direction: **soft, shaded sunlight entering through a glass window**. Think translucent sunlight, gentle architectural shadows, diffusion, light shifting with time; not literal window stock photography, not exaggerated beams, glitter, lens flare, or moving geometric wallpaper.
- Keep text readable over all animation frames and on mobile.
- A visitor must be able to discover and reach the portfolio with keyboard, pointer, and touch. Prefer one minimal, discoverable navigation affordance (e.g. small `Explore` link, or a clearly indicated interactive title with a separate accessible link). **Do not make the title a hidden-only navigation trap.** This is the only permitted additional functional text/control beyond the title and email if needed for usability.
- If an `Explore` label is used, keep it discreet; avoid buttons styled as marketing CTAs.

### Suggested motion system — experiment, not mandate

Use layered CSS gradients and soft translucent shadow shapes, optionally SVG masks or lightweight canvas if it produces a demonstrably better result. Two or three independent, long-period movements may create an impression of changing daylight. Target slow, almost imperceptible movement (tens of seconds), never a distracting animation loop. The animation should not be necessary for the design to work.

- Implement `prefers-reduced-motion: reduce` as a stable, attractive still scene.
- Avoid huge video assets, heavy JS rendering, GPU-intensive blur stacks, cursor-chasing effects, autoplay audio, or network-dependent visual services.
- Evaluate contrast on the *brightest* and *darkest* frames, not just the default screenshot.
- On smaller screens, keep title optically centered and contact link visible without overlap or horizontal scrolling.

## 3. Page B — portfolio (`/games/` initially; scalable to other media)

### Binding requirements

- **White or nearly white background.** Generous negative space.
- Projects shown as **square 1:1 thumbnails**, using authentic images from verified released works. No synthetic images passed off as real projects.
- **Title and title only** accompanies each thumbnail. No descriptions, genre badges, dates, metadata, status labels, prominent buttons, or captions in the visual gallery.
- Thumbnails **must not form a conventional rigid grid**. Their placement should be staggered / juxtaposed / offset, with a coherent underlying rhythm and intentional whitespace. The visitor should see a pattern, but not rows of perfectly aligned cards.
- A tile is an obvious link to the verified playable destination or to a lightweight, purposeful detail view if required. The tile and title must be accessible to keyboard users and screen readers.
- Navigation back to Possibility should be minimal, visible, and consistent. Do not turn this into a header-heavy site.
- Responsive: desktop composition can use staggered columns and offsets; mobile should remain deliberate, scannable, and tap-friendly. Never rely on absolute pixel positioning that collides at different widths or content counts.
- If the collection is small, preserve calm composition; do not add fake projects or repeat thumbnails to fill gaps.

### Suggested layout mechanism — experiment, not mandate

Use CSS Grid or columns for structural placement, with constrained per-item vertical offsets (`translateY`, `margin-top`, or assigned placement tokens) to create irregularity. Define a small **deterministic** set of stagger patterns that work for 3, 4, 5, 8, and 12 items. Avoid `Math.random()` layout, overlap, chaotic masonry, or uneven reading order. DOM/tab order must remain logical even if the visual positions are offset.

Square image treatment is mandatory (`aspect-ratio: 1 / 1`, `object-fit: cover` with art-directed focal positions as needed). Use real screenshots and ensure cropping does not conceal key imagery. Labels can wrap naturally and remain legible.

## 4. Reference image and how to read it

See [`references/concept-reference-not-spec.png`](references/concept-reference-not-spec.png). It is a **mood/concept reference**, NOT a pixel-perfect spec, NOT the actual Codex Stage A art boards, and NOT approved project content.

**Keep from reference:** warm daylight, soft window-like shadowing, large quiet typography, whitespace, calm editorial feeling, and an intentionally staggered gallery.

**Correct before implementation:**

1. Landing must be even simpler: only centered `Possibility`, email, and at most a tiny necessary discovery affordance. No decorative divider required.
2. Portfolio thumbnails must be **square** (the reference contains portrait-ish tiles).
3. Gallery background should be **white** rather than a decorative panel.
4. Replace ALL illustrative project art and invented project titles with authentic, verified released work. The reference contains hypothetical entries (e.g. Sailing, Windows, Raindrop); **none are approved for publication**.
5. Avoid polaroid-like frames, excessive drop shadows, rounded-browser mockup chrome, or visual clutter unless a prototype demonstrates a compelling reason.
6. Motion is not visible in the still image; it must be judged in an interactive browser proof of concept.

## 5. Proposed Stage A.2 — interactive POC (new immediate task)

**Do this before full Stage B.** Build a lightweight interactive prototype of BOTH pages in the existing portal repository, preferably on a branch/PR or isolated preview path that does not publish the root site. If the user explicitly permits committing to `main`, ensure no deployment workflow is introduced or triggered.

Deliver:

1. A working local browser preview with routes for landing and gallery.
2. A moving-light background and a reduced-motion static fallback.
3. A portfolio populated with **verified** genuine screenshots, titles, and URLs from the audited release inventory. If release verification remains blocked, label data as *provisional in the development report*, not as live verified content in the public UI; do not invent live URLs.
4. Desktop and mobile screenshots of each page (at least 1440px and 390px viewports), plus a short video/GIF or exact local instructions for seeing the light motion.
5. Two restrained **background variants** for the landing (e.g. geometric window shadows vs softer diffused sunlight) **within the same layout**, not three unrelated website concepts.
6. One or two controlled gallery offset patterns for comparison, showing how they behave with different project counts.
7. An implementation note stating actual image provenance, browser support, accessibility checks, performance findings, and known limitations.
8. A clear request for user approval **of the chosen light and gallery composition** before beginning Stage B production.

No deploy, no edits to game repositories, no changes to existing public projects without separate approval.

## 6. Acceptance checks for POC

- [ ] Homepage has the word `Possibility`, the exact working `mailto:` email, and no marketing text.
- [ ] Portfolio discovery is possible with keyboard, mouse, and touch without guessing an invisible gesture.
- [ ] Light reads as sunlight/shadows through glass, not a slideshow or stock wallpaper.
- [ ] Animation is subtle; reduced-motion fallback works; text remains readable throughout.
- [ ] Gallery background is white; every thumbnail is square; only titles appear beneath/alongside images.
- [ ] Gallery is visibly offset but has a coherent composition and predictable DOM/tab order.
- [ ] Layout works at 390px, 768px, 1024px, and 1440px; no overlap or horizontal scrolling.
- [ ] Real project assets only; no fabricated work or unsupported claims of deployment.
- [ ] Accessible focus, semantic links, meaningful image alt text, and reasonable contrast.
- [ ] No automatic publishing or new deploy workflow; Stage B remains gated by user approval.

## 7. Implementation discretion

Codex may choose typography, exact light colors, shadow geometry, spacing tokens, stagger algorithm, and motion implementation after testing, provided all binding requirements remain intact. Do not ask the creator to choose dozens of minor settings. Make sound defaults and present a small, meaningful comparison. Keep code and assets portable, simple, and maintainable.

## 8. Copy/paste Codex instruction

> Please read `README.md` in this handoff and the included `CEDG-v1.0-background.md`, and inspect `references/concept-reference-not-spec.png`. This is a visual-direction pivot for Possibility, not authorization to start full Stage B or deploy. Implement **Stage A.2**, an interactive local proof of concept of (1) a minimal sunlit landing page with centered “Possibility” and email `jay.yc.chen@gmail.com`, and (2) a white portfolio of authentic square game thumbnails, titles only, in a deliberately staggered yet coherent arrangement. Include a minimal accessible path from landing to gallery. Explore two subtle light variants and one or two gallery offset patterns; show desktop/mobile evidence, reduced-motion behavior, and project asset provenance. Keep the existing CEDG architectural and release rules. Do not introduce or trigger GitHub Pages deployment, and request visual approval before Stage B.

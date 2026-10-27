# POSSIBiLITY
## Creative Ecosystem Design Guide (CEDG) — v1.0

**Status:** Approved vision; implementation specification and proposed defaults
**Date:** 2026-10-27
**Intended audience:** Creator, ChatGPT (design collaborator), Codex (implementation collaborator), and future tools
**Project name:** **Possibility** (display casing: **Possibility**)
**Initial deployment target:** GitHub Pages under the GitHub account `jaychtw`
**Purpose:** Build an independently valuable creative portal and a distinct, independently usable game portfolio. Preserve the freedom to introduce unforeseen creative branches later.

---

## 1. Product intent

Possibility is an evolving public home for completed creative work. It is **not** a résumé disguised as a website, a manifesto, a conventional game studio, or a directory of every repository. It offers a polished discovery experience and leads visitors to creations that stand on their own.

**Core design proposition:** **Continuity of identity. Freedom of evolution.**

**Editorial restraint:** The work should speak for itself (*res ipsa loquitur*). Show what exists and make it easy to experience. Do not over-explain the creator, force philosophical readings, or add grandiose claims. Practical orientation (what something is, how to launch it, whether it works on mobile) is welcome; unsolicited justification is not.

**Release philosophy:** Complete for now; never final by design. A new visitor should find a coherent finished site. A returning visitor may find new works, categories, or branches.

## 2. Binding design principles

1. **Portal autonomy.** Possibility is a useful, visually complete destination even if no external subsite is online. It can feature and contextualize work, but must not depend on another site's assets, scripts, API, authentication, or uptime to render.
2. **Branch autonomy.** Each branch has its own reason to exist, navigational identity, content, and hosting lifecycle. Direct visitors need not pass through the portal. A branch must remain usable if Possibility is offline.
3. **Work-first presentation.** Favor actual screenshots, playable links, clear titles, and concise descriptions over creator biography or explanatory philosophy. Allow visitors to infer connections.
4. **Medium independence.** Games are the first populated collection, not the definition of the ecosystem. Future writing, applications, visualizations, or unanticipated forms need not fit an existing taxonomy.
5. **Expansion without obligation.** Do not create empty cards, fake previews, countdowns, or placeholder branches. Add a branch when real content or a genuine standalone destination warrants it.
6. **Identity with variation.** The portal has a recognizable identity; each branch may use a different visual language. Consistency of linking and quality matters more than identical branding.
7. **Independent delivery.** Each site can be built, tested, deployed, and rolled back without rebuilding every other site.
8. **Release-gated publishing.** Only approved and publicly accessible works are marked playable/published. Approval of a game does not implicitly authorize publishing this new portal or changing another repository.
9. **Portable workflow.** Human-led conception, scoping, design approval, autonomous AI-assisted production, verification, and release apply across media. Acceptance checks are domain-specific.
10. **Honest representation.** No fabricated projects, testimonials, traffic figures, press quotes, awards, device support, or claims about who authored implementation code.

## 3. Scope and release boundaries

### Release 1.0 — required

- A **complete standalone Possibility landing page**, visually polished and responsive, with a succinct identity and a curated entry to Games.
- A **Games portfolio** with an attractive gallery, accessible game detail/preview information, and clearly labeled external **Play** links for verified live releases.
- Direct, bookmarkable URLs for the portal and Games portfolio.
- A **data-driven catalog** so adding a released game does not require hand-editing page layout.
- At least one **genuinely verified live game** in the launch catalog; expand to more only after checking each playable URL and release status. If none are live yet, build the site and catalog but **do not claim that Play links work or call the release complete**.
- A lightweight **Recently Added** area only if there are at least two meaningful published entries or one genuinely new release; otherwise omit it.
- Accessible navigation, mobile-first usability, good performance, meaningful metadata, and graceful handling of missing thumbnails.
- Documentation for adding a game and a repeatable validation/deployment workflow.

### Explicitly out of scope for 1.0

- Building or launching *What Now?*, its Ghost publication, or any other future branch.
- Accounts, comments, social feeds, payments, leaderboards, server-side APIs, or a CMS.
- Automatic inclusion of all GitHub repositories, unfinished prototypes, or speculative branches.
- Unrequested rewrites of existing games, renaming repositories, or moving game hosting.
- An elaborate autobiography, manifesto, or repeated explanations of the creator's philosophy.
- Automatically publishing to the internet without explicit authorization.

### Future-ready, not prebuilt

- New branch navigation entries (e.g., a separate editorial site, apps, experiments) as real destinations become available.
- A curated, cross-medium project registry and discovery feed.
- Optional project stories/case studies where they genuinely add value.
- Custom domain, analytics, search, RSS/Atom, or multilingual portal UI if later justified.

## 4. Information architecture

**Proposed URLs (confirm GitHub Pages availability and existing configuration before implementation):**

- `https://jaychtw.github.io/` — Possibility portal, if the `jaychtw.github.io` user-site repository can be created and Pages configured.
- `https://jaychtw.github.io/games/` — Games gallery as a section of the portal for v1.0. This is a **distinct user experience**, not necessarily a separate deployment on day one.
- Existing games remain at their **actual verified URLs**, often project Pages sites such as `https://jaychtw.github.io/<repository-name>/`. Do not infer a playable URL solely from a repository name.
- A future editorial branch such as *What Now?* may live on Ghost or a custom domain and is linked only when live.

**Architecture note:** “Independent branch” means independence of purpose and operation. For v1.0, Games can be hosted at `/games/` within the same deployment to minimize unnecessary infrastructure. If it later needs separate hosting, the catalog and route design must allow extraction without breaking its public identity; plan a redirect for any migrated URL.

**Portal navigation:** Wordmark **Possibility**; **Games**; optionally **About** as a small factual footer section, not a prominent manifesto. Do not display empty future categories.

**Portal homepage structure:**

1. **Opening:** strong typographic identity, one short line that orients visitors to a changing collection of creative work. Avoid locking in a tagline before visual exploration; candidate language may be tested, not treated as required copy.
2. **Featured work:** one or two editorially selected releases with authentic artwork, concise premise, and obvious next action.
3. **Explore:** a prominent route to the Games collection; future branch links appear here when real.
4. **Newly emerged:** optional small section based on genuine published additions, not artificial churn.
5. **Footer:** unobtrusive creator attribution, GitHub/LinkedIn links if confirmed, and optional contact link if provided. Do not invent contact information.

**Games gallery:**

- Responsive card grid with genuine screenshots/artwork, title, one-line description, optional genre/type, language support where verified, and a visible **Play** action.
- Optional **Source** link where the repository is intended to be public and relevant.
- Card or detail view can show a concise “About this game” note, controls/platform guidance, and known limitations, without an essay.
- Use simple filtering only if the catalog is large enough to warrant it; do not add complex search for a small first collection.
- Game launches should not be embedded in iframes by default. Open the verified destination directly, avoiding compatibility and accessibility surprises.

## 5. Visual direction

**Creative direction:** An **indie-studio aesthetic with a playful gallery and restrained editorial storytelling**, broadened to serve a medium-independent creative portal.

**Visual priorities:**

- Distinctive, confident typography; generous breathing room; high-quality project imagery; deliberate but subtle interaction.
- Inviting and curious, not childish; polished, not corporate; expressive, not noisy.
- The portal uses a coherent visual system; Games can be more vibrant and playful without becoming visually disconnected.
- Use project art as the primary source of color and personality. A restrained neutral base lets diverse creations coexist.
- Motion is optional and purposeful; respect `prefers-reduced-motion`. No autoplay sound, flashing, heavy parallax, or gimmicky loading sequence.
- Avoid decorative “coming soon” boxes, fake metrics, generic stock photos, and AI-generated imagery presented as actual gameplay.
- Treat **Possibility** as a simple wordmark at first. No invented mascot or complex logo requirement.

**Required art-direction checkpoint:** Before full build, present **2–3 genuinely distinct homepage concepts** using representative authentic game imagery (or clearly marked temporary placeholders), including desktop and mobile compositions. Provide a concise tradeoff comparison and recommend one. The creator selects the direction; thereafter Codex may implement autonomously within that approval.

**Accessibility:** Semantic landmarks, keyboard navigation, visible focus, sufficient contrast, alt text for informative imagery, labeled links/buttons, no color-only status cues, reduced-motion support. Target WCAG 2.2 AA where practical; report actual testing rather than claiming certification.

## 6. Content and editorial rules

**Tone:** Curious, confident, concise, welcoming. Let the audience discover meaning without coaching them toward it.

**Copy limits (guidelines, not rigid validators):**

- Homepage identity: one clear sentence, not multiple paragraphs.
- Game card: title + approximately 8–20 words of premise/experience description.
- Optional project detail: 1–3 short paragraphs, only when helpful.
- No automatic philosophical interpretations of every game. A playful game is allowed to be just playful.

**Authenticity:** Show actual screenshots from the released build whenever available. Do not substitute concept sheets without labeling them as such. Prefer descriptive, human-written summaries over autogenerated hype.

**Attribution:** Use accurate credit language. The creator leads concept, game/system design, narrative, creative direction, acceptance, and release decisions; AI tools may assist with implementation and testing. Do not falsely imply all code was personally handwritten. An unobtrusive methodology note may be included where relevant, but should not dominate the work.

## 7. Catalog schema and data ownership

Use a single version-controlled catalog in the Possibility repository, such as `src/data/projects.json` or `content/projects.json`. Choose a consistent schema and document it. Avoid requiring a database.

**Suggested entry:**

```json
{
  "id": "republic-of-chickens",
  "title": "Republic of Chickens",
  "subtitle": "雞窩共和國",
  "category": "games",
  "description": "A whimsical republic, competing narratives, and an uncertain future.",
  "status": "published",
  "featured": false,
  "publishedAt": "2026-10-27",
  "playUrl": "https://example.invalid/replace-with-verified-live-url",
  "repositoryUrl": "https://github.com/jaychtw/reppublic-of-chickens",
  "thumbnail": "/assets/games/republic-of-chickens.webp",
  "languages": ["en", "zh-TW"],
  "tags": ["simulation", "satire"]
}
```

**Important:** This object is a **schema illustration**, not a claim that the example play URL exists or that the project was publicly deployed on that date. Replace placeholder values with verified facts before publication. The actual repository name is spelled `reppublic-of-chickens` (two p's after `re`); do not silently “correct” live URLs.

**Validation rules:**

- `id` unique and stable; `category` extensible; `status` one of `draft`, `approved`, `published`, `archived`.
- Only `published` entries with a confirmed reachable public destination appear with a **Play** link.
- For non-game future branches, use a generic `destinationUrl` or typed action rather than assuming every project is playable.
- Local thumbnail path must resolve; if missing, use an honest typographic fallback.
- `publishedAt` is a verified publication date, not a guess based on commit time.
- `featured` is editorial selection, not inferred from stars or recent commits.
- Entries are curated; repo discovery may suggest candidates but cannot auto-publish them.
- Validate data during build and fail clearly on malformed required fields, duplicate IDs, unsafe URLs, or missing required assets.

**Asset strategy:** Store optimized portal thumbnails locally in the portal repository with rights/attribution checked. Existing game sites retain their own assets. No runtime dependency on GitHub's API for initial page rendering.

## 8. Cross-repository publishing contract

After a game is approved and its public deployment is verified, Codex can update the Possibility catalog. This is a **release-stage operation**, not a side effect of merely committing a game.

**Required handoff metadata:** title, canonical slug/ID, one-sentence description, category, verified public URL, repository URL, screenshot/thumbnail path, supported languages, actual publication date, and release status.

**Release sequence:**

1. Finish and test the project in its own repository.
2. Obtain the creator's approval for that project's release and any requested public deployment.
3. Deploy the game through its independent hosting workflow; verify the live URL, assets, routing, and basic interactions.
4. Prepare a catalog update in the Possibility repository, with optimized screenshot and validated metadata.
5. Run portal lint/typecheck/build, link checks, and responsive/accessibility smoke tests.
6. Submit a PR or equivalent reviewable change to Possibility; do not bypass repository permissions or branch protections.
7. Merge/deploy the portal update only under the previously agreed release authorization and repository policy; report the live result.

**Failure behavior:** If the game URL is not publicly accessible, the catalog entry must not be labeled playable. A failure to update the portal must not roll back or break an otherwise successful game release. The update is retryable and idempotent by stable project ID.

**Multi-agent portability:** This contract is plain documentation and data; no special reliance on Codex-only prompts or proprietary metadata. Other assistants or developers should be able to follow it.

## 9. Implementation recommendation

**Default technical choice:** Static, accessible website built with a lightweight front-end stack appropriate to Codex's strengths (e.g., Astro or Vite/React). Favor simplicity, maintainability, and reliable GitHub Pages deployment over framework novelty.

**Preferred deployment:** Dedicated `jaychtw.github.io` repository with GitHub Pages and GitHub Actions. Before creation, check whether it already exists or conflicts with current Pages configuration. Do not overwrite existing user-site content.

**Hosting requirements:**

- Base paths and asset references work for user-site hosting and local preview.
- Direct navigation to `/games/` works after refresh; avoid client-side routing configurations that fail on GitHub Pages.
- Responsive layouts at approximately 320px, 390px, tablet, and desktop widths.
- Production build requires no secret token to render public content; avoid exposing credentials.
- No external runtime dependencies for critical UI assets when reasonably avoidable.
- Keep images compressed, lazy-load below-the-fold imagery, and avoid oversized dependencies.
- Include README for local development, build, publishing, and catalog updates.
- Provide a simple recovery/rollback procedure using versioned commits and deployment history.

**Security:** Treat catalog fields as untrusted input; sanitize/escape content, validate URLs, use safe external link behavior, and keep GitHub Actions permissions minimal. Do not add unnecessary third-party trackers.

## 10. Quality gates and acceptance criteria

### Design gate

- [ ] Two or three meaningfully different homepage concepts shown at desktop and mobile sizes.
- [ ] Real project art used where available; placeholders clearly labeled.
- [ ] Creator approves one visual direction before full production.

### Functional gate

- [ ] Portal works and looks complete without external subsites.
- [ ] `/games/` works as a direct link and after browser refresh.
- [ ] Every visible **Play** URL has been verified against a live release.
- [ ] No draft, nonexistent, or unapproved project is misrepresented as published.
- [ ] All game entries can be edited through catalog data, without editing page markup.
- [ ] Empty categories and broken thumbnails degrade gracefully; no empty future-branch tiles.
- [ ] Independent game sites continue to function if portal is offline.

### Quality gate

- [ ] Typecheck/lint/build pass (where applicable).
- [ ] Desktop and mobile browser smoke tests pass; record browser/viewport used.
- [ ] Keyboard navigation and visible focus pass manual checks.
- [ ] Automated accessibility checks have no unresolved serious issues; document scope.
- [ ] No unintended horizontal overflow at narrow mobile widths.
- [ ] All assets, metadata, internal routes, and external release links checked.
- [ ] No secrets, broken image references, fabricated claims, or unexpected network dependencies.
- [ ] Reduced-motion behavior verified.

### Release gate

- [ ] Creator approves implementation/playtest.
- [ ] Creator explicitly authorizes public portal deployment (separate from permission to build).
- [ ] Deployment reports final URL, commit, tests, known limitations, and remaining manual checks.
- [ ] Updating another repository is separately authorized or performed via a reviewable PR under agreed permissions.

**Evidence standard:** Do not claim physical-device, Safari, Firefox, translation, or assistive-technology coverage unless actually tested. Report known gaps clearly without treating every gap as a blocker.

## 11. Proposed Codex execution plan

**Stage A — Reconnaissance and art direction**

- Inspect relevant public repositories and existing Pages deployments; identify actual released games and usable screenshots. Do not assume every repo is a game or deployed.
- Check whether `jaychtw.github.io` exists and whether there are conflicts.
- Produce a short content inventory, proposed stack, 2–3 desktop/mobile visual directions, and acceptance mapping.
- **Stop for the creator's art-direction approval.** Do not create a public site yet.

**Stage B — Autonomous implementation after visual approval**

- Build the portal and Games collection, catalog schema/validation, optimized assets, accessibility, tests, README, and deployment workflow.
- Add only verified published games; otherwise flag catalog candidates for approval.
- Run and fix tests, preview locally, and provide screenshots plus concise known limitations.
- Prepare deployment configuration, but do not publish until explicitly authorized.

**Stage C — Release and ongoing integration**

- After approval, deploy and verify live site.
- Add the cross-repository catalog update contract to shared game-development instructions only with permission to edit that standards repository.
- On each later approved game release, create a reviewable catalog update and verify the portal remains healthy.

## 12. Open decisions and recommended defaults

These are **implementation decisions**, not missing vision. Codex may recommend alternatives with reasons.

| Decision | Default | Change trigger |
| --- | --- | --- |
| Portal host | GitHub Pages user site | Existing configuration conflict or user preference |
| Portal framework | Astro/static-first or equivalently lightweight | Proven functional benefit |
| Games URL | `/games/` within portal | Need for independent deployment |
| Portal UI language | English initially | Audience need or explicit localization decision |
| Site branding | Typographic **Possibility** wordmark | Creator-approved visual concept |
| Visual tone | Playful indie gallery + restrained editorial style | Art-direction approval |
| Project ordering | Curated featured + recent published | Larger catalog warrants filters |
| Registry | Version-controlled JSON | Genuine need for editorial CMS |
| Deployment | Approval-gated GitHub Actions | Explicit release workflow change |
| Editorial publication | External independent site when ready | Publication launch |

## 13. Explicit non-goals and anti-patterns

Avoid:

- Defining the creator permanently as a game developer or game studio.
- Presenting the site as an AI technology showcase rather than a showcase of work.
- Overexplaining hidden meanings or writing lengthy personal manifestos.
- Inventing future branches to make the portal look larger.
- Building shared runtime dependencies between portal and branches.
- Publishing unfinished or unverified game links.
- Treating a concept illustration as a shipped game screenshot.
- Redesigning every site whenever a new branch appears.
- Overengineering automation before the first catalog update works reliably.

## 14. Handoff prompt for Codex

> Implement **Possibility** according to `Possibility_CEDG_v1.0.md`. Start with **Stage A only**: inspect the existing GitHub repositories and live Pages destinations, identify verifiable released games and authentic visual assets, check for user-site repository conflicts, and propose 2–3 distinct desktop/mobile homepage concepts with a brief recommendation. Honor the independent-site architecture, work-first editorial restraint, and medium-independent identity. Do not invent game releases, create empty future sections, alter existing games, or deploy publicly. Pause for my approval of the visual direction. After approval, autonomously execute Stage B with testing and a reviewable release candidate, but still request explicit authorization before public deployment or modifying another repository. Keep the catalog extensible and document the future release-to-portal update contract.

---

**Design invariant:** **Possibility should be complete whenever someone visits, and free to become something else by the next visit.**

# Codex Implementation Authorization — Possibility Platform v1.0

Repository: `jaychtw/jaychtw.github.io`  
Website: https://jaychtw.github.io/

Your audit and implementation plan are approved, subject to the clarifications and requirements below.

**You are now authorized to implement, modify files, run tests, and prepare a reviewable release candidate. You are NOT yet authorized to deploy the redesigned site publicly, enable automatic production deployment, or modify independent game repositories.**

Do not repeat the architecture audit unless implementation reveals a material conflict.

## 1. Approved architecture

Proceed with your recommended approach:

- Extend the existing Node 24/TypeScript static-site builder.
- Retain one build and deployment system.
- Reuse existing validation, routing, release packaging, asset fingerprinting, and test infrastructure where practical.
- Add Markdown/front-matter processing without migrating to Jekyll.
- Use shared components for navigation, themes, galleries, and article presentation.
- Avoid unnecessary frameworks, databases, runtime services, or administration interfaces.

Preserve the current deployed version as a rollback baseline.

## 2. Authoritative visual references

Use the two attached gallery mockups as the visual authority.

Implement the approved layout as faithfully as practical:

- Possibility wordmark at top left.
- Section navigation at top right.
- Small glossy orb for theme switching.
- Dark charcoal and light appearances.
- Dark theme as the initial default.
- Persist explicitly selected theme preferences.
- Centered pill-shaped tag filters.
- Three-column gallery on desktop, two columns on medium screens, one column on mobile.
- Large 16:9 cover images.
- Titles, descriptions, tags, and launch/open actions.
- Subtle hover interactions, visible keyboard focus, and responsive behavior.

Do not preserve the previous sunlight landing page or staggered portfolio as the active homepage.

If the attachments are missing or inaccessible, stop the visual implementation and request them. Do not substitute an independently invented layout.

## 3. Homepage and navigation

The root URL `/` must open directly to the Games gallery.

There is no separate introductory landing page.

Preserve `/games/` through a suitable static redirect or compatibility page.

Keep the four existing game fact-sheet URLs functional.

Prepare these future collections:

- `/apps/`
- `/blog/`
- `/what-now/`

Do not expose empty or unpublished sections in the navigation.

Use one shared platform header and theme system.

The homepage collection should be configurable, initially set to Games.

## 4. Shared gallery behavior

Games and Apps must use the same reusable gallery system.

Implement single-selection tag filtering:

- `All` selected by default.
- Selecting a tag displays matching complete cards.
- Nonmatching cards disappear.
- Matching cards reflow naturally.
- Preserve relative card ordering.
- Selecting `All` restores the full gallery.
- No names-only results.
- No multi-tag selection in v1.

Tags are optional browsing aids, not mandatory navigation steps.

The default `All` view should be polished and complete.

## 5. Approved game-tag mapping

Use the following as the initial editorial metadata.

| Game | Tags |
|---|---|
| Republic of Chickens | Experimental, Narrative |
| Wonderlands | Sandbox, Experimental |
| Squirrel Control | Puzzle, Kawaii |
| The Last Lantern | Experimental, RPG |
| Formosa Quest | Action, Horizontal Scroller |
| Jeremy's Odyssey | Platformer, Action, Vertical Scroller |
| Tidelight | Puzzle |
| My Queens | Logic, Puzzle |
| Jasmine's Odyssey | Maze, Exploration, Time Attack |
| World Kaiju Tournament | Combat, Strategy, Tournament |
| Nom Nom BOOM! | Time Attack, Kawaii |
| Pedestrian's Living Hell | Arcade, Experimental, Narrative |
| Riot Defender | Strategy, Experimental |
| Kaiju Demolition | Action, Horizontal Scroller |
| Launch Sequence | Puzzle, Kawaii |
| The Other 90% | Experimental, Narrative |
| The Impossible Room | Experimental, Narrative |
| Typhoon Defender | Strategy, Experimental |
| Junctioneer | Puzzle, Strategy |
| Shape Match | Matching, Puzzle |
| Cute Animal Match | Matching, Puzzle |
| Snacks Match – Raohe | Matching, Puzzle |

### Tag rules

- Do not use `Commercial`.
- `Kawaii` is the provisional replacement for `Children` in the three entries above.
- Review whether `Kawaii` accurately reflects each game's presentation. Flag questionable assignments for editorial review rather than silently replacing them.
- Use `Cozy` only when the experience is genuinely relaxed and low-pressure.
- Preserve the supplied tag mapping unless a specific factual inconsistency is found.
- Do not invent an extensive new taxonomy.

Note that the tag assignments describe the intended editorial classification. They do not independently establish gameplay features or release readiness.

## 6. Game inventory and publication readiness

Your audit established that all 22 current game destinations and their directly linked HTML resources respond successfully.

That is sufficient to begin migration, but not proof that every game has passed creative acceptance.

For each candidate:

1. Use the verified current destination, not an obsolete historical URL.
2. Confirm the game identity and description.
3. Identify an authentic screenshot or suitable fallback.
4. Preserve any documented release limitations.
5. Distinguish public reachability from final acceptance.
6. Include only projects with accurate, defensible publication metadata.

Do not impose a new formal certification process on every existing game merely to include it in a personal portfolio.

A working but evolving project may be showcased if its presentation is accurate and its destination is functional.

Preserve the four existing curated entries and their established evidence.

### Initial card ordering

Use your proposed opening order provisionally:

1. Republic of Chickens
2. Wonderlands
3. Squirrel Control
4. The Last Lantern
5. Snacks Match – Raohe
6. Shape Match

Order the remaining entries deliberately and consistently.

Make ordering editable through metadata. The final editorial sequence will be reviewed after the gallery is rendered.

## 7. Cover artwork and asset overrides

Implement the approved three-level priority:

1. Custom cover artwork.
2. Verified gameplay screenshot.
3. Neutral fallback placeholder.

Use predictable source paths:

`public/assets/covers/<collection>/<project-id>.webp`

A manually uploaded custom cover must override the screenshot automatically, without requiring changes to project metadata or application code.

Retain the existing asset-fingerprinting capability so changed image bytes produce new published URLs.

Automate derived checksums and release evidence where appropriate. Do not require manual checksum maintenance for routine cover replacement.

Support 16:9 presentation and responsive image delivery.

Do not generate final cover artwork yourself. We will create, review, and approve the artwork separately.

Do not modify individual game repositories to manage Possibility's cover assets.

## 8. Markdown publishing

Implement one Markdown publishing system shared by Blog and What Now?.

Expected authoring locations:

`content/articles/blog/<slug>.md`

`content/articles/what-now/<slug>.md`

Each Markdown file should support simple front matter, including:

- Title
- Publication date
- Status
- Excerpt
- Tags
- Optional cover

The build must automatically generate:

- Individual article pages.
- Collection index pages.
- Article cards or listings.
- Stable article URLs.
- Shared navigation and theme styling.
- Collection-specific editorial identity where appropriate.

Draft articles must not appear in public indexes or generate public article pages.

The first published article in a collection should automatically activate that collection's index and navigation entry.

Do not publish fabricated demonstration articles.

Use temporary test fixtures during development, excluded from production output.

Treat Blog and What Now? as separate editorial collections sharing the same engine.

## 9. Maintenance workflows

The following must be achievable through ordinary GitHub commits after automatic publication is authorized:

**Replace artwork:** Replace an image at its established source path.

**Publish an article:** Add a Markdown file with front matter.

**Revise an article:** Edit its Markdown content.

**Add a game:** Add project metadata and appropriate imagery.

**Reorder projects:** Edit their order values.

Document these workflows for someone comfortable with basic HTML, Markdown, and GitHub's file interface.

No custom administration dashboard is required.

## 10. Validation and testing

Extend the existing automated test suite.

At minimum, verify:

- Root homepage renders Games directly.
- `/games/` compatibility works.
- Existing game fact-sheet URLs remain functional.
- Navigation excludes empty collections.
- Theme switching and persistence work.
- Tag filtering hides complete cards and preserves relative ordering.
- Three/two/one-column responsive layout.
- Cover priority and image fallback behavior.
- Same-path image replacement changes the fingerprinted output URL.
- Markdown publication creates pages and index entries.
- Draft Markdown content remains unpublished.
- Article URLs remain stable.
- Unsafe Markdown and metadata are handled securely.
- Keyboard accessibility, visible focus, reduced motion, and readable contrast.
- Existing game destinations are not inadvertently changed.

Produce a reviewable local or CI-generated preview of both themes and representative desktop/mobile layouts.

Compare the rendered result against the supplied mockups.

## 11. Deployment restrictions

This authorization covers **development and release-candidate preparation only**.

You may:

- Modify the Possibility repository.
- Add or revise source files.
- Add tests and documentation.
- Run builds and local validation.
- Prepare a reviewable implementation.
- Create commits in a nonproduction working branch if appropriate.

You may not:

- Push changes that automatically alter the live production site.
- Deploy the redesigned site publicly.
- Enable commit-driven production deployment.
- Modify unrelated repositories.
- Delete historical evidence without approval.
- Introduce external paid services or new infrastructure without approval.

Preserve the existing manual production release gate until explicitly instructed otherwise.

## 12. Expected completion report

When implementation is complete, provide:

1. Summary of implemented functionality.
2. Changed files and major architectural decisions.
3. Screenshots or preview artifacts showing the new design in both themes.
4. Results of automated and manual tests.
5. Migrated game inventory and any outstanding editorial issues.
6. Demonstration of cover override behavior.
7. Demonstration of Markdown article generation using nonpublished fixtures.
8. Exact instructions for routine content maintenance.
9. Remaining risks or deviations from the approved specification.
10. The steps required for a separately authorized production release.

Do not claim successful deployment or publication unless it actually occurred.

**Stop at the release-candidate review gate. Await my explicit authorization before deploying or changing the production publication policy.**

## Final direction

The technical foundation comes first.

We will create and refine artwork separately, and artwork updates must remain independent of application development.

Possibility should be easy to operate, visually consistent, and flexible enough to support future creative collections without repeatedly rebuilding the platform.

Proceed with implementation under these boundaries.
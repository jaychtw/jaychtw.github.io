# Possibility — Platform Design Guide v1.0

**Status:** Approved design direction; implementation pending  
**Platform:** GitHub Pages  
**Primary site:** https://jaychtw.github.io/  
**Implementation:** Codex, following this guide  
**Creative direction and acceptance:** Site owner, in collaboration with ChatGPT

---

## 1. Product purpose

Possibility is a personal publishing platform for original creations, including games, applications, experiments, articles, and future projects.

Its purpose is to make those creations immediately accessible through a coherent, visually engaging interface.

**Core principle: One platform, multiple creative collections.**

The platform must remain straightforward to maintain. Routine publishing, image replacement, and article creation should not require Codex or manual programming.

## 2. Information architecture

### Homepage

`/` displays the **Games gallery** directly.

There is no separate introductory landing page, hero manifesto, or intermediate navigation screen.

Retain compatibility with the existing `/games/` URL through a redirect or equivalent arrangement.

### Sections

| Section | Proposed URL | Function |
|---|---|---|
| Games | `/` | Default gallery of playable games |
| Apps | `/apps/` | Applications and interactive experiments |
| Blog | `/blog/` | Personal articles, observations, reflections |
| What Now? | `/what-now/` | Cross-domain discovery and editorial articles |

Only published, functional destinations should appear in navigation. These paths are proposed conventions, not evidence that the sections already exist.

The platform should allow a different section to become the homepage in the future without restructuring the content.

## 3. Visual design

The previously approved user-provided mockups are the authoritative visual references.

### Shared layout

- Possibility wordmark at the upper left.
- Section navigation at the upper right.
- Small glossy theme-toggle orb at the far right.
- Centered pill-shaped filter controls for gallery collections.
- Three-column card grid on desktop, two columns on medium screens, and one column on narrow screens.
- Large visual cover at the top of each card.
- Project title, concise description, relevant tags, and a clear launch/open action.
- Generous whitespace, restrained decoration, and subtle hover interactions.

Do not reinterpret the mockups into a substantially different visual design.

### Themes

Support light and dark appearances.

- Dark theme: charcoal background, glossy white toggle orb.
- Light theme: pale background, glossy black toggle orb.
- Dark theme is the proposed initial default.
- Remember the visitor's selected theme.
- Ensure sufficient contrast and keyboard accessibility.

### Responsive and accessible behavior

Cards must remain readable and functional on desktop, tablet, and mobile. Hover effects must not be required to reveal essential information.

Provide visible keyboard focus, descriptive image alternatives, and reduced-motion support.

## 4. Shared gallery system

Games and Apps use the same gallery components and content model.

Each project has independently maintained metadata, including:

- Unique identifier
- Title
- Description
- Destination URL
- Collection
- Tags
- Cover image
- Screenshot fallback
- Publication status
- Display order

### Tags

Tags are descriptive metadata, not mandatory genre classifications.

The gallery uses **single-selection filtering**.

- `All` is selected initially.
- Selecting a tag shows matching full cards and hides nonmatching cards.
- Remaining cards automatically reflow.
- Original relative ordering is preserved.
- Selecting `All` restores every published card.
- Filtering occurs on the current page, without navigation or a separate results list.

The default `All` experience is the primary browsing experience; visitors should never need to use filters.

Tags must not impose creative constraints on future projects.

### Content visibility

A repository's existence does not establish that a project is publicly playable.

Before publication, verify the project's URL and actual availability. Draft, broken, or unpublished projects must not be presented as playable.

## 5. Cover artwork system

Cover art is a standard publishing asset, distinct from a gameplay screenshot.

The gallery must support:

1. **Custom cover:** Preferred, manually approved artwork.
2. **Screenshot:** Fallback image reflecting actual gameplay.
3. **Placeholder:** Temporary fallback when no valid image is available.

### Art direction

- Target 16:9 aspect ratio.
- Prefer 1600 × 900 source artwork or higher.
- Optimize published assets for web delivery.
- Maintain a recognizable focal point at small display sizes.
- Avoid unnecessary text embedded in artwork.
- Preserve each project's individual identity.
- Do not depict nonexistent gameplay features as actual features.

Consistency means consistent presentation and quality, not identical artistic styles.

### Manual replacement

Use a dedicated, predictable asset location, such as:

`/assets/covers/games/my-queens.webp`

A replacement image with the same path should be sufficient to update the cover after automatic publication.

The platform must not require modifications to the game repository or application code for routine artwork replacement.

Use a sensible caching strategy. Since browsers and CDNs may temporarily retain older images, document a reliable refresh or cache-busting procedure without requiring routine code changes.

Keep approved high-resolution originals separately from optimized web assets.

### Artwork production responsibility

ChatGPT and the site owner develop and review artwork collaboratively.

Codex integrates the artwork and maintains the technical delivery mechanism; it does not independently establish the artistic direction.

## 6. Markdown publishing

Blog and What Now? use a **shared Markdown-based publishing engine**.

They are separate editorial collections, not separate technical systems.

### Authoring workflow

The site owner creates a new `.md` file, supplies basic metadata, and commits it to GitHub.

The publishing pipeline automatically:

- Converts Markdown into an article page.
- Adds the article to the appropriate section index.
- Applies the shared navigation and theme.
- Displays its title, date, excerpt, cover, and tags where provided.
- Generates a stable, readable article URL.

Example:

```markdown
---
title: "From Kitchen to Foundry"
date: 2026-10-28
tags: [Technology, Cross-Domain]
cover: /assets/covers/what-now/from-kitchen-to-foundry.webp
---

# From Kitchen to Foundry

Article content begins here.
```

The example date and content are illustrative, not publication metadata.

### Editorial distinction

**Blog** supports personal observations, essays, and flexible publishing.

**What Now?** supports researched cross-domain discoveries, technology transfer, transferable talents, and related editorial series.

What Now? may have its own masthead and editorial presentation while inheriting the platform's underlying design and publishing functionality.

### Build technology

Evaluate Jekyll, which has established GitHub Pages support, against the existing repository's tooling.

Prefer the simplest maintainable approach that supports:

- Markdown authoring
- Reusable templates
- Collections
- Tags
- Automatic indexes
- GitHub Pages deployment

Do not introduce multiple build systems or a heavy frontend framework without a demonstrated need.

## 7. Deployment and maintenance

The platform is hosted on GitHub Pages.

Routine changes should require only a GitHub commit:

| Activity | Site owner's action |
|---|---|
| Replace cover | Replace image file |
| Publish article | Add Markdown file |
| Revise article | Edit Markdown |
| Update project details | Edit project metadata |
| Add project | Add verified metadata and assets |
| Change application behavior | Use Codex when appropriate |

GitHub handles the configured build and deployment automatically.

No browser-based administration dashboard is required for v1.0.

Keep dependencies minimal, avoid embedding secrets, and grant deployment workflows only necessary permissions.

## 8. Initial content migration

Audit the existing repositories and current website before changing the implementation.

The previously identified game inventory contains 22 candidates. Verify each project's publication status, destination, title, description, and available imagery.

Preserve the established tag assignments, with these refinements:

- Remove `Commercial` from public-facing tags.
- Consider `Kawaii` as the replacement for `Children` where the actual presentation supports it.
- Use `Cozy` only for genuinely relaxed, low-pressure experiences.
- Do not invent tags solely to populate filters.

Determine the default card order deliberately. It should showcase the collection effectively rather than merely following alphabetical or repository creation order.

Do not delete existing content or alter individual game repositories as part of the portal redesign.

## 9. Implementation phases

### Phase 1 — Technical foundation

1. Audit the existing site and repository.
2. Implement the shared layout and themes.
3. Establish navigation and homepage routing.
4. Implement the reusable gallery and tag filters.
5. Establish project metadata and cover overrides.
6. Implement Markdown publishing for Blog and What Now?.
7. Configure automatic builds and deployment.
8. Validate the result across screen sizes and input methods.

Use existing verified screenshots or placeholders during this phase.

### Phase 2 — Artwork production

Create and approve covers collaboratively, replacing the temporary images as each becomes ready.

Artwork replacement must remain independent of platform development.

### Phase 3 — Future enhancements

Consider additional collection types, editorial features, and richer project-detail pages only when actual content or user needs justify them.

Do not build speculative functionality into Phase 1.

## 10. Acceptance criteria

Phase 1 is complete when:

- Visiting `/` opens the Games gallery immediately.
- The visual design closely follows the approved mockups.
- Light/dark switching works and persists.
- Gallery filtering shows and hides complete cards correctly.
- Published cards link to verified destinations.
- Custom covers override screenshots.
- Replacing an image in GitHub automatically publishes the change without manual build commands.
- Adding a Markdown article automatically produces its article page and index entry.
- Blog and What Now? share templates without losing their editorial distinction.
- The site works on mobile and supports keyboard navigation.
- Existing public links remain functional or redirect appropriately.
- Routine content maintenance requires no Codex involvement.

## 11. Implementation boundaries

Codex may inspect the existing codebase, recommend implementation details, and identify conflicts with this specification.

It must not silently substitute a different visual direction, publish unverified games, generate final artwork independently, or expand the scope with unnecessary features.

**Before modifying the live site, present the implementation plan and any material technical tradeoffs for approval.**

---

**Guiding principle:** Possibility should make creation and publication easier, not become another system that requires constant maintenance.

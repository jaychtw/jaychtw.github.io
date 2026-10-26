# Release-to-portal update contract — proposed v1

Status: Stage A proposal. Plain documentation for future humans/tools; no remote integration is installed. Adoption in a shared standards/game repository requires separate authorization. Possibility remains a curated independently useful site.

## Authority and boundaries

A source push or repository discovery is not publication. Game release approval, game deployment permission, catalog-change permission and portal publication permission are distinct. Never change a game to satisfy a portal update. Never assume authority to edit another repository or auto-merge a PR.

The game owns its code, approval record, runtime assets, release identity, hosting and rollback. Possibility owns its catalog, local preview images, editorial selection and independent deployment. The sites exchange release metadata through a reviewable change, not a runtime API or shared asset host.

## Release handoff

Supply these facts with evidence, not inferred defaults:

- Stable canonical project ID and title; optional original-language subtitle.
- Concise human-reviewed description, medium/collection and proposed action label (Play for a verified game, Visit/Read or another typed action for other media).
- Exact public canonical HTTPS destination, preserving real spelling and base path; public source URL where appropriate.
- Approved release version/source or artifact identity, acceptance reference, deployment record and actual publication date/time with timezone.
- Verified language support, actual controls/platform guidance and material known limitations. Automated mobile emulation is not physical-device testing.
- Authentic gameplay screenshot or appropriate finished-work preview, its source/build identity, alt text, crop intent and rights/attribution/provenance record.
- Verification timestamp, redirects/canonical result, asset/routing checks and a representative interaction result.

For legacy work whose exact publication date cannot be recovered, mark it explicitly unknown, preserve the evidence, and omit chronological claims/Recently Added placement. Never invent a publication date from commit time. Newly published work should supply the actual date in its release handoff.

## Sequence

1. Finish and test the work within its own release workflow.
2. Obtain its creator's release approval and explicit permission to publish it.
3. Its authorized operator publishes independently. Verify the actual public URL, correct release/build, assets, direct routes and representative basic interactions. A failed/blocked check is not a pass.
4. Prepare an idempotent Possibility catalog update keyed by the stable ID. Copy only approved, optimized preview art into Possibility-local assets. Retain attribution and a source checksum; do not hotlink to the game's asset host.
5. Validate schema, URL safety, unique IDs, statuses, local assets, descriptions/languages/dates and approved/published/Play eligibility. Do not automatically feature every new release.
6. Run portal typecheck/build and focused data tests, route/asset/link checks, responsive/keyboard/accessibility smoke tests. Render portal and Games without external subsite/API availability.
7. Submit a PR or equivalent reviewable local diff under repository permissions. Include before/after catalog entry, exact release/destination, screenshot provenance, test evidence and known gaps. Respect branch protection.
8. Merge and deploy the portal only under its separately agreed release authorization and policy. Verify resulting public routes, metadata, assets and destination links. Record portal commit/deployment identity.

## Failure, updates and rollback

- An inaccessible, unapproved or unverified work must not be newly represented as playable. Keep it out of public published output until eligible; do not add an empty future card.
- If an existing destination becomes unavailable, preserve useful local context, remove/disable the Play action with an honest status when confirmed, and open a reviewable repair. A local proxy denial alone does not establish a global outage.
- A failed portal update must not roll back or block an independently successful game release. Retry using the same stable ID; do not duplicate entries or fabricate a newer release date.
- A destination move requires verified redirect/base-path handling. Games-gallery extraction requires a stable redirect for the old public gallery URLs. No game repository is renamed or moved as a side effect.
- Portal rollback uses its own known-good build/commit/deployment history. Game rollback remains that game's independent decision/workflow.

## Portable evidence record

Record the ID, source release/version, public destination, approval/deployment references, actual publication date or explicit unknown, `verifiedAt`, actual checks/results, screenshot source/SHA-256/attribution and portal-change identity in version-controlled documentation/data. Store no credentials. This contract does not depend on a particular assistant, hidden prompts, or proprietary metadata.

# Catalog and release-to-portal contract

The single curated registry is **`content/projects.json`**. Editing it changes generated cards/routes without editing layout. It is not a live repository feed. Only `published` entries appear; drafts, approved candidates and archived entries are excluded from public output. Every published destination requires a matching successful entry in `content/link-verification.json` and a documented creator-approval reference.

## Fields and rules

| Field | Meaning |
| --- | --- |
| `id` | Stable unique lower-case hyphenated ID. Updates are idempotent by this ID. |
| `title`, `summary` | Accurate name and concise factual premise. Summary is used in fact sheets/metadata, not the visual gallery. |
| `category` | Extensible medium/collection slug. `games` gets `/games/`; a future real medium need not use Play. Check route conflicts before adding new route namespaces. |
| `status` | Exactly `draft`, `approved`, `published`, or `archived`. Source publication alone does not imply released work. |
| `featured`, `order` | Explicit editorial selection and deterministic order. Featured published work appears on the root; all published games appear on `/games/`. No star/commit-time inference. |
| `publishedAt` | Verified `YYYY-MM-DD`, or explicit `null` for legacy work with unknown publication date. No date is inferred from a source commit; no fake recent ordering. New-release handoffs should provide the actual date/time and timezone. |
| `destination` | `{ "action": "play", "url": "verified HTTPS URL" }` for games; an actual future medium can use `read`, `visit`, `use`, or another short action. Labels remain titles only; the action is exposed accessibly. |
| `repositoryUrl` | Optional public HTTPS source URL, or `null`. Never infer another-repository edit permission from this field. |
| `languages` | Verified language tags. Non-linguistic future work may use an empty array; games must record actual supported languages. |
| `controls`, `limitations` | Concise practical information, or `null` where inapplicable to non-game work. Game facts are required; do not certify untested device support. |
| `approval` | Public release/acceptance record URL and concise provenance note. This records a creator decision; automated tests do not grant approval. |
| `release` | Known version and full source/release SHA, or explicit `null` for inapplicable/unknown facts. Do not invent a version or substitute a moving branch for an immutable commit. |
| `thumbnail` | Local `{ "path": "/assets/possibility/images/…webp", "alt": "meaningful scene alternative" }`, or explicit `null`. A supplied path must exist and match provenance. Missing optional art gets an honest monogram, not a concept image. |

The build rejects duplicate IDs, unexpected/malformed fields, unsafe protocols/credentials/control characters, bad dates, invalid statuses, thumbnail traversal, missing required assets, checksum mismatches and published destinations without matching evidence. Strings are HTML-escaped; no catalog content is executed. The build can run offline using versioned evidence, while release packaging requires fresh successful public checks from the last 24 hours.

## Add or update a released game

1. Finish/test it in its own repository. Obtain the creator's acceptance and explicit permission for its independent deployment. Do not modify or publish another repository as part of a portal change.
2. Have its authorized release operator verify the canonical public URL, correct build, routing/assets and representative interaction. Preserve the actual spelling/base path. Collect title, stable ID, summary, public/source URLs, approval/version evidence, languages, actual publication date and controls/limitations.
3. Obtain an authentic finished-work screenshot and record its source commit, checksum, crop, attribution/rights and an optimized local derivative in `content/asset-provenance.json`. Put that derivative under `public/assets/possibility/images/`. Existing screenshots are 640px square WebP; no runtime hotlinking is allowed.
4. Prepare the entry in a local reviewed change. Only after approval/public release evidence exists, set it to `published` and run `python3 scripts/verify-links.py --record`. This verifies public URLs/resources using normal TLS and updates evidence in this repository; it does not deploy anything. A failed request must not be converted into a playable claim or bypassed by disabling verification.
5. Run `npm run check` and `npm run verify:links`. Inspect actual crops, keyboard focus and responsive layouts; update asset hashes deliberately only when replacing the real approved preview. Ensure no unapproved entry or empty future section is exposed.
6. Submit a PR or equivalent reviewable commit under the repository policy. Include exact released destination/build, approval record, screenshot provenance, test results and known limitations. Source pushes validate but never automatically deploy.
7. Merge/publish the portal only under its separately agreed release authorization. Verify the resulting routes, metadata, file integrity, natural scrolling and destination links, following `DEPLOYMENT.md`.

## Failure, retries and rollback

A portal-update failure does not roll back or break an independently released game. Retry by stable ID rather than duplicating entries or changing publication dates. If a previously working destination is confirmed unavailable, prepare a reviewed status/action change; a local proxy denial alone does not establish a global outage. An unavailable new destination must remain out of published/Play output.

Portal rollback uses a known-good portal commit/artifact; a game rollback remains independent. Destination/gallery migrations need verified redirects and explicit route-conflict checks, not unrequested repository renames or hosting moves.

## Portable handoff

This contract consists of ordinary version-controlled JSON, provenance and commands. It relies on no hidden prompts, proprietary assistant metadata, CMS or API integration. Other humans/tools can follow it. Adoption in a shared game-development/standards repository is **not performed here** and requires separate permission. The earlier Stage A contract is archived as background; this document describes the implemented schema/workflow.

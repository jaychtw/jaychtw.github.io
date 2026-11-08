# Jack of All Trades — authorized Games publication

Owner authority: [FINAL Design Freeze, 2026-11-08 Asia/Taipei](https://github.com/jaychtw/jack-of-all-trades/blob/337a7af7ffb4a52a22583547f62aea1a35ed7c7d/docs/GDD-FINAL.md), §§8–9. The owner expressly authorizes this ONE catalog edit and exact-SHA manual publication with `PUBLISH POSSIBILITY`; no ongoing automatic publication is enabled. No shared components, theme, other entries, pins or deployment policies are changed. $0 spend.

## Independent game release — PASS

- Source: `337a7af7ffb4a52a22583547f62aea1a35ed7c7d`, [game PR #1](https://github.com/jaychtw/jack-of-all-trades/pull/1).
- [Pages run 42449112649](https://github.com/jaychtw/jack-of-all-trades/actions/runs/42449112649), successful retry after owner enabled Pages. The initial attempt's missing-site 404 is resolved.
- Public URL: https://jaychtw.github.io/jack-of-all-trades/ . Observed 2026-11-08, not inferred from repository dates. `game-build-info.json` matches exact source and clean build.
- `live-smoke.json`: actual public Chromium START/sword/delayed beam/pause/resume/natural death/restart/Chinese/mute checks passed, with no page errors, broken assets or third-party runtime requests. `live-beam.png` and `live-defeat.png` are actual public gameplay, without development mutation hooks. Browser ran outside the filesystem sandbox to use the environment's trusted CA database; TLS verification stayed enabled.
- Prior implementation evidence: 21 deterministic rules tests, six Chromium scenarios including natural complete-wave play, bilingual axe inspection, held-touch cancellation, portrait guidance and reduced motion. The main validation job and production-artifact check passed.
- Physical hardware, independent first-player, human aesthetic and human assistive-technology review are NOT VERIFIED. Canvas is not a full nonvisual combat experience. No new owner aesthetic approval is implied.

## Approved cover custody — PASS

Original master: [possibility-card-master.png](https://github.com/jaychtw/jack-of-all-trades/blob/337a7af7ffb4a52a22583547f62aea1a35ed7c7d/docs/artwork/approved/possibility-card-master.png), archived in the game repository, 1672×941, SHA-256 `b7904df8f703f9a65e48d1ef6782d109ba2f6c4b9027174164b7fd9479c58b63`.

Portfolio source: `public/assets/covers/games/jack-of-all-trades.webp`, 1672×941, SHA-256 `7549e770d46983b18acdcc19c1b922d7600bcc404fa1f161e691b5e75a33e59a`. It is a lossless, uncropped, unresized derivative. Decoded pixels were compared byte-for-byte to the original PNG and match. Conversion source: game repository `scripts/cover.mjs`, using the portal's pinned sharp. The portal builder generates responsive fingerprinted delivery renditions. This is promotional art, not a claim that the illustrated lesser orc warriors are gameplay enemies. Rights: owner-authorized project/portfolio use, no blanket artwork license assigned.

## Portal release procedure and rollback

The pre-change actual public build is `ce469f863305e428dd45bfc587285a28eeeecd54` (verified from public build-info). Retain it as the rollback through the existing manual workflow. Current main before this change was `6b80fecbba417e54df34fe37f96318c3cc9b7fc4`; differences from public are only previous release docs/evidence.

Validate this review branch, merge normally, validate the resulting exact main SHA, then dispatch the existing `Publish approved Possibility release` with that SHA and `PUBLISH POSSIBILITY`. The advance Design Freeze supplies the authority. Verify the actual public build identity, new Games card/cover/fact sheet and Play destination independently after dispatch. Candidate checks or a merge alone are not a publication receipt. Final dispatch and public verification are recorded separately after they occur.

## Candidate verification

PASS: typecheck, lint/format, 14 catalog/publishing tests, existing gallery browser suite (10 layouts, 76 filters, 13 axe scans, 13 behaviors, five publishing fixtures), Apps (10 views, zero axe violations), Shadow entry (10 views), and fresh normal-TLS checks of all 26 published projects/resources. Candidate JSON receipts and targeted Jack cover/fact-sheet screenshots are retained in `candidate/`. The targeted portal verifier uses the repository's existing same-origin test-script route method for axe injection; production CSP is preserved. Full clean-source release packaging is also enforced by CI before any dispatch.

## Final public delivery — COMPLETE

Observed 2026-11-08 Asia/Taipei. [Manual publication run 42450588700](https://github.com/jaychtw/jaychtw.github.io/actions/runs/42450588700) completed successfully for exact source `6833dfc191569e465fee37200740cbe94cd7261d`, after [PR #9](https://github.com/jaychtw/jaychtw.github.io/pull/9) and successful exact-main validation `42450443228`. Both prepare and publish jobs passed, including the workflow's public file/browser/link checks. The first attempt's post-deployment check failed; after independent confirmation that all 148 public files matched, retry of the same reviewed SHA passed. The first failure's root cause is not asserted. The run history retains both attempts. No safeguards were weakened.

- PASS: independent normal-TLS comparison of **148 public files** to the clean reviewed production artifact (`public/integrity.json`).
- PASS: new Games card is first by its observed publication date, approved cover is loaded, actual EN/zh-TW fact sheet and Play link work on 390/1440 widths in dark/light themes, with zero scoped axe violations or page errors (`public/verification.json`). The verifier explicitly asserts the persisted theme and waits for the decoded cover; candidate light-theme fact-sheet captures were refreshed accordingly.
- PASS: actual public fact-sheet Play action followed into the live game and invoked START and Blessing (`public/play-game.png`).
- PASS: the unchanged portal smoke script passed independently. A runtime-only proxy adapter was needed for Playwright's Node APIRequestContext in this Cloud environment; the script and product were not changed, and TLS stayed enabled. Adapter retained in `public/cloud-smoke-proxy.cjs` for that environment only.
- PASS: exact public game HTML/JS/CSS/title bytes match the reviewed artifact (`public-game-integrity.json`), in addition to real public combat/death/restart smoke.

Public game: https://jaychtw.github.io/jack-of-all-trades/ . Public fact sheet: https://jaychtw.github.io/games/jack-of-all-trades/ . Gallery: https://jaychtw.github.io/ (Games alias https://jaychtw.github.io/games/).

Original promotional masters, derivative identity, source notices, $0 spend and test limitations remain as recorded above. Physical-device/human aesthetic/assistive-technology checks remain Not Verified. No owner action is required. Automatic production publication remains disabled. Immediate portal rollback remains `ce469f863305e428dd45bfc587285a28eeeecd54`; use the same existing manual workflow only under appropriate authority. This final receipt is documentation only and does not republish or change the deployed source identity.

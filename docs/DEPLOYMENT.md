# Public deployment and rollback

**Stage B prepares a review candidate only. Public deployment still requires the creator's explicit authorization for a specific commit.** Do not dispatch publication merely because CI is green or because a game was released. No other repository is changed by these instructions.

## What is prepared

- `Validate release candidate` (`.github/workflows/ci.yml`) runs on main pushes/PRs/manual requests. It has read-only repository permissions and **no deployment job**. It uploads the clean-commit release ZIP, file manifest/SHA-256, screenshots and test/link evidence as `possibility-review-<full SHA>`.
- `Publish approved Possibility release` (`deploy.yml`) has **only `workflow_dispatch`**. It requires an exact approved 40-character SHA on main and the deliberate phrase `PUBLISH POSSIBILITY`; the phrase is not a secret or a replacement for creator authorization.
- Its prepare job revalidates/packages the exact approved commit and uploads **only `dist/`**. Only the publish job can request Pages write/OIDC permissions and enters the existing `github-pages` environment. No push automatically deploys.
- Current inspected Pages settings: GitHub Actions (`build_type: workflow`), no custom domain, HTTPS enforced. The existing environment has a branch policy; no required-reviewer setting is claimed or changed. Repository owners may add required reviewers as an additional UI-enforced approval when release configuration is authorized.

## Exact steps — only after explicit deployment authorization

1. Obtain the full **approved candidate SHA** from its CI run or release manifest. Do not substitute a moving `main` tip. Confirm **Validate release candidate** is successful for that exact SHA and review its `possibility-review-<SHA>` artifact. Keep a downloaded copy before retention expires (30 days).
2. Verify the ZIP against `release/SHA256SUMS.txt`, inspect `release/manifest.json`, and confirm `sourceCommit` is the approved SHA and `build-info.json` has `sourceDirty: false`. A source push and a built ZIP are not publication.
3. In this repository's **Settings → Pages**, confirm the source remains **GitHub Actions** and the intended host is `https://jaychtw.github.io/`. Check the existing root and any required custom-domain/HTTPS settings before replacement; do not overwrite a newly discovered independent site. Confirm the `github-pages` environment permits main; configure any creator-required reviewer in that UI before dispatch. No settings change has been made during Stage B.
4. Open **Actions → Publish approved Possibility release → Run workflow**. Choose branch **main**. Enter the full approved SHA as `release_commit`; enter `PUBLISH POSSIBILITY` as `authorization`. Run it **once** under the creator's authorization. If using an already-authenticated GitHub CLI, the equivalent is:

   ```sh
   gh workflow run deploy.yml --ref main \
     -f release_commit=FULL_EXPLICITLY_APPROVED_40_CHARACTER_SHA \
     -f authorization='PUBLISH POSSIBILITY'
   ```

5. Approve the environment deployment if a required-reviewer gate is configured. Wait for prepare, publish and public verification to finish. Preparing/uploading an artifact alone is not success.
6. The workflow checks the public build identity, every public file's SHA-256 against the reviewed build, desktop/mobile browser startup, natural scroll and direct `/games/` refresh, plus fresh external destination checks. The build-identity check tolerates bounded CDN propagation while never accepting a stale build. Inspect `possibility-public-verification-<SHA>` if anything fails; do not silently disable verification or redeploy an unreviewed tip.
7. Independently open `https://jaychtw.github.io/` and `/games/`, use the email link, scroll/keyboard/focus/reduced-motion behavior, and follow each game link. Check at least a real phone and any other browsers needed for the intended release; report what was actually tested. Confirm existing game sites remain independently usable. Do not claim those manual/device checks before performing them.
8. Record final URL, approved SHA, workflow/deployment identity, integrity and browser/link results, limitations and any rollback decision. Creating a tag or GitHub release is optional and separately reviewed; no tag/public release is created by Stage B.

## Local release preparation

From a clean committed checkout:

```sh
npm ci
npm run release:check
```

This executes typecheck/lint, catalog tests, production browser checks, fresh public URL/resource requests, then creates `.artifacts/release/possibility-<version>-<short SHA>.zip`, `manifest.json` and `SHA256SUMS.txt`. It refuses dirty or mismatched builds and stale/missing link checks. ZIP timestamps are deterministic; repeated packaging of the same clean build is byte-identical. The archive contains only generated site files, not source, prototype experiments, dependency caches or review media.

`npm run dev` provides local production preview on port 4173. Local smoke equivalents of the publication verifiers, while that server runs:

```sh
python3 scripts/verify-published.py --url http://127.0.0.1:4173/ --local
node scripts/smoke-site.cjs http://127.0.0.1:4173 --local
```

Local flags permit loopback HTTP only. Public mode requires the configured HTTPS origin and normal TLS verification. Passing locally does not claim public deployment.

## Rollback and recovery

- Preserve the previous known-good deployment/artifact before a release. After the first portal release, a rollback is another **explicitly authorized manual dispatch** using the full known-good portal SHA on main. The same validation/public integrity checks apply; games are not rolled back.
- A failed prepare job never reaches publication. If publication succeeds but verification fails, treat that as a published-but-unverified state; investigate actual status/asset/build identity before choosing a rollback. Do not describe it as a clean release.
- No force-push, reset, game-repository edit, asset hotlink or root service worker is needed. Normal source improvements remain reviewable commits.
- The pre-portal **JC placeholder** is a historical GitHub-generated Pages deployment (`40386459406`, source `e7f1961…`), not a buildable portal commit. The new workflow cannot rebuild that old source using scripts it did not contain. Returning to it requires retaining/restoring its previous Pages artifact/hosting procedure; do not falsely promise that passing its SHA to the portal workflow will work. Confirm that recovery path at the authorized first-publication preflight if restoration of the placeholder is required.

The gallery/canonical URLs are physical static routes. Future Games extraction or a custom-domain move needs an explicit redirect/base-path plan and fresh destination verification rather than silently renaming repositories.

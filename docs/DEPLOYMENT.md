# Deployment, review gate and rollback

## Current verified publication state — October 30, 2026

Apps and Storm Chaser have subsequently been published at **`f8ca326efa4eee919c336cdceac18334a480746a`**, successful [manual run 40919100948](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40919100948). Independent verification matched 135 public files and passed public Apps navigation/card interaction plus ten accessibility scans across both themes and five widths. [Delivery record](apps-storm-chaser/DELIVERY.md). Immediate pre-Apps rollback remains `570e17e6ef3a3f1e144a5bea41c27ef3738469a5`; no publication policy or permission changed. The evidence-only handoff commit after this release does not change its public build identity.

The live `build-info.json` now identifies **`570e17e6ef3a3f1e144a5bea41c27ef3738469a5`**, clean Platform v1.0 Games gallery. [Manual publication run 40691518469](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40691518469) succeeded on October 28. Current main `cea7ad271c5d3084129dcd389fd4bfaebce78f31` adds only six lines of catalog handoff documentation to that deployed source. Thus the historical undeployed-design statements below no longer describe the observed public site; they are retained as the earlier development gate, not silently rewritten as evidence of approval. Automatic publication remains disabled and the exact-SHA manual workflow remains unchanged.

The owner's subsequent **Activate Apps and Publish Storm Chaser** assignment authorizes the narrow Apps addition and manual publication if comparison reveals no unrelated unapproved platform changes. That comparison passed: no platform runtime/design code differs from the deployed gallery. [Apps change and evidence](apps-storm-chaser/README.md). Preserve `570e17e6ef3a3f1e144a5bea41c27ef3738469a5` as the immediate pre-Apps rollback reference; the older references below remain historical.

## Historical Platform v1.0 candidate gate

**The redesigned Platform v1.0 is not authorized for public deployment. Automatic production publication remains disabled.** Pushes to main/review branches run validation only. `.github/workflows/deploy.yml` retains the existing manual gate unchanged.

The current public rollback baseline is full SHA **`56f5a997ef12b66cce4948b770c92bc3e8c5db81`**, successfully published in [run 40493531104](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40493531104). Preserve this commit and its release evidence. Root `build-info.json` identified it during preparation. The earlier [deployment guide](platform-v1/previous-deployment.md) remains historical context.

## Review candidate

1. Review `platform/v1-rc`, screenshots, catalog and the successful exact-SHA **Validate release candidate** run. The workflow has read-only contents permissions and no deployment job.
2. Download `possibility-review-<full-SHA>` from that run. `.artifacts/release/` holds the exact-source ZIP, `manifest.json`, and `SHA256SUMS.txt`; browser/publishing/link/asset receipts are included alongside it. Verify `sha256sum -c SHA256SUMS.txt` from the release folder.
3. Local reproduction: `npm ci && npm run release:check` from a clean checkout. Node 24, Python 3 and installed Chromium/Chrome are required. Packaging refuses a dirty/mismatched build or missing/stale successful public-link evidence.
4. Obtain explicit authorization for the reviewed commit's public publication. Plan/implementation approval alone is insufficient. Separately obtain authorization before enabling ongoing automatic deployment.

## Publish only after authorization

1. Merge the approved review branch into main without changing its reviewed content. If merge strategy creates a new source SHA, wait for that exact SHA's successful validation and use its artifact/identity. Do not publish an unverified merge commit.
2. Confirm Pages still uses GitHub Actions, HTTPS and the intended `github-pages` environment/main branch policy. No custom domain or other repository setting change is needed. Preserve the known-good rollback SHA/artifact.
3. GitHub → Actions → **Publish approved Possibility release** → **Run workflow**, branch **main**.
4. Enter the exact approved full SHA as `release_commit`, and `PUBLISH POSSIBILITY` as `authorization`. Dispatch only under actual creator authorization; the phrase is a guard, not authority by itself.
5. Wait for prepare and publish jobs, including exact public-file verification, browser smoke and fresh game-link checks. Verify `/`, `/games/`, the four original fact sheets and actual Play links. Record the deployment run, source SHA and public evidence. Do not call a queued/partially failed run successful.

No public redesigned deployment or postdeployment check has been performed during candidate development. Local equivalents do not establish public CDN propagation.

## Prepared automatic policy — inactive

`docs/platform-v1/automatic-publication.workflow.yml` is a reviewable proposal, **outside the active workflows directory**. It cannot deploy on commits today. After explicit authorization, install it under `.github/workflows/`, review least-privilege settings, and verify a real approved image replacement and article publication end to end. Validation precedes deployment; failed builds leave the previous Pages artifact in place. Routine owners then need only commit content/assets to main.

Activation changes publication policy and must not be bundled silently into the candidate merge. The manual exact-SHA workflow can remain for deliberate releases/rollback.

## Rollback

For a redesigned release, manually publish the known-good baseline SHA above through the same workflow. It is already on main and contains its own working build/tests; the workflow checks out that exact source. Verify its build identity and public files again. Later, retain each known-good platform SHA/artifact for the same procedure. Rolling back only the portal never changes game repositories, game saves or independent deployments. If automatic publication is enabled in the future, coordinate disabling/reverting that policy so a subsequent push cannot immediately overwrite the rollback.

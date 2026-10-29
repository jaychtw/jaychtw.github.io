# Completed Apps publication — October 30, 2026

**Possibility entry: deployed and independently publicly verified.** Visitors can navigate Games → Apps → Storm Chaser. Live [Apps gallery](https://jaychtw.github.io/apps/), [fact sheet](https://jaychtw.github.io/apps/storm-chaser/), and independent [application](https://jaychtw.github.io/storm-chaser/).

## Source and release identities

- Dedicated development branch: `platform/apps-storm-chaser`.
- Development commit: `ebc39df8a2a4d1b75189b5d0a1082f8b7ae345d8`.
- Reviewed/merged [pull request #3](https://github.com/jaychtw/jaychtw.github.io/pull/3).
- Deployed main merge commit: `f8ca326efa4eee919c336cdceac18334a480746a`. Its tree is identical to the development commit.
- Successful development validation: [40918497317](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40918497317); PR validation also passed in [40918505416](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40918505416).
- Successful exact-main validation: [40918831465](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40918831465).
- Successful manual publication, including prepare/publish/public verification: [40919100948](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40919100948). Dispatched with the exact reviewed SHA through the unchanged workflow under the owner's explicit conditional authorization. Comparison showed no unrelated platform redesign.
- The final evidence-only documentation commit is intentionally separate from the deployed source. Automatic publication remains disabled; no further deployment is needed for that handoff.

## Exact implementation files

1. `content/projects/apps/storm-chaser.json` — published Apps entry, `open` action, canonical destination, languages, controls, source/version, factual maturity/date and limitations.
2. `content/asset-provenance.json` — authentic screenshot origin, original/import checksums and rights/treatment.
3. `content/link-verification.json` — real TLS-verified application destination observation.
4. `public/assets/screenshots/apps/storm-chaser.webp` — lossless encoding of the actual public 1600×900 interface, retaining its observed stale-data warning.
5. `package.json` — include Apps browser coverage in the existing browser gate.
6. `scripts/verify-links.py` — validate Apps runtime resources alongside Games resources.
7. `tests/catalog.test.ts` — preserve exclusions/escaping/action validation with multiple galleries instead of Games-only positional assumptions.
8. `tests/apps-browser.cjs` — local/public responsive navigation, gallery, filters, themes, metadata, detail links and accessibility checks.
9. `docs/DEPLOYMENT.md` — reconcile stale deployment status with verified current identity while retaining prior authority/history and rollback.
10. `docs/apps-storm-chaser/README.md` — source/authority reconciliation, metadata, screenshot provenance and independent publication statuses.
11. `docs/apps-storm-chaser/application-browser.json` — real public Storm Chaser bilingual browser receipt.
12. `docs/apps-storm-chaser/capture.json` — actual screenshot time, viewport and observed collection metadata.
13. `docs/apps-storm-chaser/local-validation.json` — local check summary.
14. `docs/apps-storm-chaser/public-capture.png` — retained unmodified original screenshot.

The evidence-only follow-up updates this delivery/README/deployment status and adds `public-browser.json`, `public-integrity.json`, and `previous-public-build.json`. No production runtime/design source, Games record/destination, collection setting or workflow changed. The six-line `docs/CATALOG.md` difference from the previous public source predates this task.

## Implementation and verification

Existing published-content logic activates `/apps/`, its header navigation and `/apps/storm-chaser/`; no redundant landing page or UI framework was created. Games remains `/`, `/games/` redirects compatibly, all 22 Games destinations and fact sheets remain intact, and Blog/What Now? remain hidden. Canonical/Open Graph URLs and active navigation were checked. The existing portal copy contract is English; Storm Chaser's own EN/zh-TW capabilities were independently checked and accurately listed. No global localization system was added.

Metadata: Storm Chaser; Weather/Visualization/Interactive; public maturity; package `1.0.0-rc.1`; public application source `64615b55c5b7d75720fa0b7b7e5b3b722030d98a`. First public deployment is documented at `2026-10-29T16:35:15Z`, October 30 in Asia/Taipei. The screenshot source and WebP have recorded SHA-256 provenance and use the standard fingerprinted 16:9 delivery pipeline. No generated artwork was used.

Local clean exact-source `npm run release:check` passed, including TypeScript, ESLint/formatting, 12 catalog/publishing tests, production build, both browser suites, fresh destination/runtime-asset verification of all 23 projects and release packaging. The original browser suite passed ten layout cases, 76 filter cases, 13 behavior checks, five isolated fixture routes and 13 axe scans; Apps added ten both-theme/five-width scans. Zero reported violations. Release ZIP checksum verification passed. Exact-main CI and the manual prepare job reproduced release validation before publication.

Independent public checks at approximately 01:16–01:18 Asia/Taipei on October 30 matched all **135 public files** byte-for-byte against the reviewed clean build. `public-integrity.json` preserves each observed SHA-256 and exact source identity. `public-browser.json` records successful Apps views at 320/390/768/1024/1440px in dark/light themes, ten axe scans with zero violations, no page exceptions or HTTP errors, navigation/filter/theme/image/detail behavior and real card navigation into the independent map/Explorer application. Existing workflow postdeployment checks also passed exact-file verification, Games browser smoke and fresh destination/resource checks. Public screenshots and complete machine receipts remain under `.artifacts/` and the workflow's retained evidence.

Storm Chaser's independent deployment remains source `64615b55c5b7d75720fa0b7b7e5b3b722030d98a`, [run 40912955062](https://github.com/jaychtw/storm-chaser/actions/runs/40912955062), separate from this portal release. Real EN/zh-TW desktop/mobile map and forecast-time interactions passed four further axe scans. Its collection was about 29 minutes old and visibly stale at capture: reachability and representative functioning do not establish fresh/current/complete weather coverage. Periodic Pages delivery may be delayed or fail; the local Node/SQLite archive is a separate edition. This is an independent information viewer, not an official warning service or independent forecast.

## Rollback and remaining limits

Immediate pre-Apps rollback: full SHA `570e17e6ef3a3f1e144a5bea41c27ef3738469a5`, [successful prior manual run 40691518469](https://github.com/jaychtw/jaychtw.github.io/actions/runs/40691518469), original [public build receipt](previous-public-build.json). Use the existing manual workflow and verify the exact public identity again if rollback is authorized. No force push, automatic-publication activation or replacement of the historical baseline occurred.

No remaining publication approval gate applies to this completed authorized release. Physical-device, screen-reader, independent human comprehension and long-running scheduling/uptime testing are not established. Existing GitHub action Node-runtime and ubuntu-latest migration annotations remain; no workflow modernization was bundled into this catalog task.

**$0 new expenditure:** no paid service, payment method, purchase, account enrollment, larger runner, tag or package publication was introduced. Only the Possibility repository changed. Storm Chaser, shared standards and other project repositories/pipelines were not modified. Temporary local test servers and browser processes were closed; no new unattended service was activated.

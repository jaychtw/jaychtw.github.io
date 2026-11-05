# Armorheart final cover — published and verified

**November 5, 2026 (Asia/Taipei).** The owner's approved cover is live at **https://jaychtw.github.io/**, with the same cover on **https://jaychtw.github.io/games/armorheart/**. Existing Games sorting still places Armorheart first. Play remains https://jaychtw.github.io/armorheart/ . No game-repository or gameplay change.

## Exact publication identity

- Deployed source: **`ce469f863305e428dd45bfc587285a28eeeecd54`**, normal [PR7](https://github.com/jaychtw/jaychtw.github.io/pull/7).
- Manual publication: **[run41967440753](https://github.com/jaychtw/jaychtw.github.io/actions/runs/41967440753)**, successful prepare/publish jobs; deployment **7565152232**. [API run receipt](validation/deployment-run.json), [deployment status](validation/deployment-statuses.json).
- Exact merged-source [validation41967242775](https://github.com/jaychtw/jaychtw.github.io/actions/runs/41967242775) passed. Candidate push/PR validations41966885570/41966996489 also passed. [Merged validation receipt](validation/merged-validation-run.json).
- Previous independently verified public source / rollback: **`691eea8286c18a05a04c4db9fd2f775760e12ca0`**. Pre-change repository main wasaa05a62ece2021f5fb9573f4a91f3bc8423d84b5; do not confuse a documentation-only main commit with a deployed build.

Later receipt-only commits do not publish: public build identity remainsce469f8 until another explicitly authorized manual dispatch. No automatic publication policy, workflow, environment, domain, secret/service or dependency change. No paid services or expenditure.

## Master and creative-content integrity

[Original owner-approved PNG](masters/Armorheart_approved_cover_master.png),1672×941 RGB,2,719,981bytes, SHA-256 **`9f8e834beb95cdf383132e881cf37255332bad7b826fdec69b90b28a10f34a4c`**. Matches both the supplied manifest and SHA256SUMS. ZIP CRC, original byte count/dimensions/color and archive hash were verified. The PNG, [supplied provenance](masters/PROVENANCE.json) and [checksum](masters/SHA256SUMS.txt) are archived byte-for-byte. This is owner-approved AI-generated/edited promotional artwork, not an actual gameplay capture or a blanket rights guarantee over other game assets.

Publishing source `public/assets/covers/games/armorheart.webp` preserves the original dimensions/aspect ratio and has **identical decoded RGBA pixels**. No regeneration, retouching, crop, stretch, text change or overlay. Lossless source is1,975,710bytes, SHA-256 **`fe75df86f1a0b00fd0856c6021aaf2f321e3baa7d140a311795653dff9c81c79`**. [Conversion/provenance proof](provenance.json).

The unchanged existing pipeline delivers optimized480×270 /960×540 /1600×900 WebPs of37,906 /112,826 /226,244bytes with matching content fingerprints. Its standard16:9 rounding removes at most0.5 original pixel vertically in delivery variants; original/native publishing pixels are all preserved, with no meaningful title/subject crop. [Variant hashes/dimensions/sizes](validation/candidate/delivery-variants.json). The original PNG/source WebP are not copied directly into the public build.

## Executed validation

The full clean-source `npm run release:check` passed: typecheck/lint/build,14 unit cases,10 layouts/76 filter cases/13 gallery axe scans/13 behaviors/5 publishing fixtures,10 Apps views,10 Shadow views and fresh HTTPS/resource checks for all25 published projects. [Release log](validation/candidate/release-check.txt), [catalog/browser](validation/candidate/catalog-browser.json), [Apps](validation/candidate/apps-browser.json), [Shadow](validation/candidate/shadow-browser.json), [links](validation/candidate/live-links.json).

Additional local and **independent public** checks passed ten viewport/theme states:320×740,390×844,768×1024,1440×1000 and844×390, each light/dark. Actual rendered cards use the new cover, correct fingerprinted variants, generic existing “Armorheart cover artwork” alt and preserved screenshot fallback. No horizontal overflow; English card/Traditional Chinese fact-sheet copy, first-place sorting and both Play destinations remain correct. Four additional axe audits report zero violations, with incomplete items retained in the report. [Public cover/browser/audit/Play proof](validation/public-cover-browser.json), [local candidate](validation/candidate/cover-browser.json).

The assistant inspected actual CSS-size card captures:280px at320 viewport,350px at390 and379px desktop. **ARMORHEART remains readable; tank, Kong, battleship and distant fortress remain represented**, with full approved composition and unchanged lettering in both themes. [320px light card](validation/card-320-light.png), [phone dark card](validation/card-390-dark.png), [desktop light card](validation/card-1440-light.png), [desktop dark card](validation/card-1440-dark.png), [desktop gallery](validation/gallery-1440-light.png), [phone gallery](validation/gallery-390-dark.png), [phone fact sheet](validation/factsheet-390-light.png). These are real browser captures, not generated previews or enlarged substitutes.

Independent normal-TLS requests matched **all144 public files** to the exact-source build, including public identity, root/fact-sheet HTML and cover hashes. [Full public integrity](validation/public-integrity.json). Actual Games-card touch navigation and fact-sheet keyboard/Enter navigation both loaded the live game and exercised real movement/fire, including simultaneous two-finger direction/fire. No claim of a new full mission/campaign or physical-device test is made by this cover-only verification.

A byte fence confirms the sole production-input change is the added cover: **all existing Armorheart/other-project metadata, order/date, Play URL, screenshot, existing artwork, platform code, dependencies and workflows remain byte-identical**. [Preservation proof](validation/candidate/preservation.json). An initial test-only axe injection was blocked by the existing CSP; the audit harness switched to DevTools evaluation and passed without modifying/bypassing the site's production policy. No production defect was hidden or policy loosened.

## Reproduction, rollback and completion

Reproduce in a clean checkout of deployed sourcece469f863305e428dd45bfc587285a28eeeecd54 using existing Node24/locked dependencies, Python3 and Chromium:

```sh
npm ci --no-audit --no-fund
CHROMIUM_PATH=/usr/bin/chromium npm run release:check
CHROMIUM_PATH=/usr/bin/chromium node scripts/verify-armorheart-cover.cjs
python3 scripts/verify-published.py
CHROMIUM_PATH=/usr/bin/chromium node scripts/verify-armorheart-cover.cjs --public
```

For a future **authorized rollback**, manually run **Publish approved Possibility release** frommain with `release_commit=691eea8286c18a05a04c4db9fd2f775760e12ca0` and guard `PUBLISH POSSIBILITY`, then independently verify public identity/files/Play again. That restores the previous screenshot-based entry. Current known-good cover release isce469f863305e428dd45bfc587285a28eeeecd54. A source revert/commit alone does not publish, and a portal rollback never changes Armorheart's game repository.

**Complete:** owner-authorized final cover integration and publication are deployed and independently verified. No owner manual action remains. Managed Chromium/emulated touch only; physical-phone, other-engine, independent-player and human assistive-technology tests were not performed. Automated audits and assistant readability inspection do not claim those tests. The owner already approved the artwork; no unnecessary creative reapproval or standards repinning. Existing cover/archive/release conventions handled this task without a platform redesign or new shared rule.

# Catalog card copy correction — 2026-11-01

Owner requested removal of the Chinese description immediately beneath the Shadow Becomes Me Games card. Published source **72dc332181b3530a0dc0a1c7178fed220d606af9**, successful [manual run41286666846](https://github.com/jaychtw/jaychtw.github.io/actions/runs/41286666846); main validation41286485306 passed.

Only the Chinese catalog paragraph was removed. English description, approved cover, sorting/filtering and links remain. Traditional Chinese stays on the fact sheet and in the game. Render comparison confirmed an exact one-paragraph catalog diff and byte-identical fact sheet. Existing optional translation metadata now applies to fact sheets, not catalog cards; contract and existing tests updated.

Type/lint/format,14 unit/publishing cases,10 targeted local width/theme views and required full CI/release checks passed. Independent public verification matched139 files and10 width/theme views, including no Chinese text in the card and preserved fact-sheet translation. Initial bulk fetch encountered HTTP503; unchanged-source retry passed. [Live receipt](evidence/card-copy-update.json) · [phone view](evidence/card-copy-390-light.png).

Rollback just this correction with existing manual deploy.yml, release_commit=49d043fbc59d44d6d7675b963713dc90773239a8 and authorization=PUBLISH POSSIBILITY, then verify the live identity/card. That is the immediately preceding public release. No gameplay/assets, automatic-publication policy, billing or standards change. Later evidence-only commits do not alter the deployed source identity.

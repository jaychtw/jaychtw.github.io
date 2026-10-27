# Possibility — isolated Stage A.2 prototype

This is an interactive art-direction proof of concept, not Stage B or a deployed site. It follows the [v1.1 handoff](../../docs/stage-a2/handoff/README.md). No root site, game repository or Pages setting is changed.

## Run locally

From the repository root, with Python 3:

```sh
python3 prototypes/stage-a2/serve.py
```

The server binds only to your computer, on port **8766**, and serves this prototype as `/` and `/games/`. Open that port in your local browser. No Node.js, npm install or build is needed to experience the POC. Stop with Ctrl+C; use `--port 8767` if necessary. Serve over HTTP rather than opening HTML as a file: the gallery reads a local JSON catalog.

For an independent copy, download and extract [Possibility-Stage-A2.zip](../../docs/stage-a2/Possibility-Stage-A2.zip), then run `python3 serve.py` inside its folder. Windows can use `py serve.py`.

## Compare the variants

Enter these paths/query strings on the running local server:

| Study | Path |
| --- | --- |
| Diffuse light + Drift | `/?light=diffuse&pattern=drift` |
| Window light + Drift — recommended for review | `/?light=window&pattern=drift` |
| Window light + Cadence | `/?light=window&pattern=cadence` |
| Drift gallery directly | `/games/?light=window&pattern=drift` |
| Cadence gallery directly | `/games/?light=window&pattern=cadence` |

Typography, content and the landing layout stay constant. The query parameters are review switches, not extra controls in the minimal composition. Explore and the gallery wordmark preserve the chosen variants.

Observe the window crossbar and the lower-right illumination for at least 30–60 seconds. The three gentle, alternating motion periods are 80, 120 and 160 seconds; the composition remains usable while completely still. To inspect the still scene, enable Reduce Motion in your OS/browser, then reload. The [16-second review video](../../docs/stage-a2/evidence/daylight-motion-20x.mp4) accelerates actual CSS frames **20×** and labels each variant. It is not real-time motion speed or an FPS benchmark.

## Contents and limits

- Native HTML, CSS gradients and small local scripts; no framework/runtime package, video background, external font or rendering service.
- Four curated works in `catalog.json`; square crops from authentic gameplay, local optimized WebP assets and safe HTTPS destinations. See [provenance](../../docs/stage-a2/asset-provenance.json).
- DOM/tab order follows catalog order. Only thumbnail and title appear in each gallery link. The more numerous neutral layout fixtures are injected only by tests; no fixture mode or invented work is shipped in the gallery.
- Production static catalog generation, full release schema, deployment workflow, metadata/SEO and final visual acceptance remain Stage B work after approval. The earlier [release-to-portal contract](../../docs/stage-a/RELEASE-TO-PORTAL.md) remains the proposed integration boundary.

## Repeat validation

Use Node.js 24 (tested), npm, Python 3, system Chromium and FFmpeg:

```sh
npm ci --prefix prototypes/stage-a2 --cache /tmp/possibility-npm-cache
npm test --prefix prototypes/stage-a2
npm run verify:live --prefix prototypes/stage-a2
python3 prototypes/stage-a2/package.py
npm run test:bundle --prefix prototypes/stage-a2
```

Tests own port 8766: stop your manual preview first. `CHROMIUM_PATH` can select another installed Chromium. The browser runner saves machine-readable evidence, screenshots and the accelerated motion video under `docs/stage-a2/evidence/`. The live verifier uses normal system TLS verification; it reads URLs/resources and the portal's Pages settings, and never starts a remote workflow or changes settings.

Browser, contrast, fixture and accessibility evidence applies to the **POC**, not to the games' accessibility or a production portal. Physical devices, actual Safari/Firefox and screen readers have not been tested. Fresh direct live-game Chromium interactions were blocked by the cloud certificate trust limitation; see the [implementation report](../../docs/stage-a2/IMPLEMENTATION-NOTES.md).

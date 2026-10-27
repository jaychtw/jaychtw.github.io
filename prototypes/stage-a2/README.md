# Possibility — Stage A.2 revision 2

Locally runnable interactive art-direction prototype: living window light, then the white portfolio on the **same naturally scrollable page**. `/games/` remains directly usable. Stage B and deployment remain unapproved.

## Start

From the repository root, with Python 3:

```sh
python3 prototypes/stage-a2/serve.py
```

Exact local URLs, after starting the server on your computer:

- **Continuous landing + portfolio:** http://localhost:8766/
- **Direct portfolio:** http://localhost:8766/games/
- Optional same-page shortcut: http://localhost:8766/#portfolio
- Optional softer light comparison: http://localhost:8766/?light=diffuse&pattern=drift
- Optional Cadence gallery comparison: http://localhost:8766/?light=window&pattern=cadence

Default is Window + Drift. These are local addresses, not published preview links. No Node installation or build is needed to run the POC. Stop with Ctrl+C. Use `--port 8767` and substitute that port if 8766 is occupied. Windows can use `py` instead of `python3`.

Alternatively, download/extract [the revision-2 ZIP](../../docs/stage-a2/revision-2/Possibility-Stage-A2-Revision-2.zip) and run `python3 serve.py` inside `Possibility-Stage-A2-Revision-2`. The same exact URLs apply. Serve over HTTP; the gallery reads its local catalog.

## Review the movement and flow

Observe the normal scene for 20–30 seconds. Broad window edges change gently over 18/26 seconds, the window shadow drifts over 44 seconds, and slow illumination changes use 31/38-second periods. There is no noise field, watery ripple, flashing, video background, cursor-following effect or moving title. CSS shapes/SVG are local. The title remains stationary within the scene and scrolls normally with its section.

Scroll down using a wheel, trackpad, touch swipe, Space or PageDown. The first scene occupies one viewport; white portfolio content begins directly below it. The arrow is a small optional anchor shortcut, not a required Explore action. There is no scroll snapping, nested scroller, intercepted wheel/touch event or forced smooth scrolling. Direct `/games/` uses the same catalog and assets, with a minimal wordmark link back.

Enable OS/browser Reduce Motion and reload: all light animations stop, while natural scrolling still works. Without CSS path-morph support, SVG path attributes provide a stable window-edge shape; ordinary CSS drift/light remain available. Actual browser coverage is Chromium, not claimed Safari/Firefox compatibility.

[Normal-speed 1× proof](../../docs/stage-a2/revision-2/evidence/sunlight-normal-1x.mp4) · [Accelerated 10× proof](../../docs/stage-a2/revision-2/evidence/sunlight-accelerated-10x.mp4) · [Screenshots and report](../../docs/stage-a2/revision-2/README.md)

## Repeat checks and packaging

Requires Node 24, Python 3, system Chromium and FFmpeg for the development evidence commands only:

```sh
npm ci --prefix prototypes/stage-a2 --cache /tmp/possibility-npm-cache
npm test --prefix prototypes/stage-a2
npm run proof --prefix prototypes/stage-a2
npm run verify:live --prefix prototypes/stage-a2
python3 prototypes/stage-a2/package.py
npm run test:bundle --prefix prototypes/stage-a2
```

`CHROMIUM_PATH` selects another installed Chromium. Automated checks own port 8768; motion capture owns 8769; extracted-ZIP smoke uses 8767. They stop only their own servers. Stop any conflicting preview first. Evidence is written under `docs/stage-a2/revision-2/evidence/`; caches/media intermediates stay ignored. The motion recorder uses the native Chromium screencast protocol and the installed FFmpeg; no Playwright media download is required.

Four curated works remain in `catalog.json`; only authentic local 1:1 gameplay crops and linked titles appear in the gallery. The shared renderer resolves catalog/assets relative to its script, so it works on both routes and from the extracted ZIP. Neutral 3/4/5/8/12-item layout fixtures exist only in tests. No game repository or public site is changed. [Provenance](../../docs/stage-a2/asset-provenance.json) and the [future release-to-portal contract](../../docs/stage-a/RELEASE-TO-PORTAL.md) remain in force.

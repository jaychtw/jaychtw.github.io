# Stage A.2 implementation, checks and limits

Date: **2026-10-27, Asia/Taipei**. Scope: interactive art-direction POC only. The creator authorized following the v1.1 guidelines after a review-only pass. This does not approve full Stage B or public deployment.

## Architecture and content

The prototype is isolated under `prototypes/stage-a2/`. Python's standard HTTP server serves that directory as its own local `/` and `/games/`; it never serves or replaces the repository root. The standalone ZIP has the same structure and needs no package installation or build to experience it.

The landing is native HTML and CSS. Three independently timed gradient/shadow layers use 80/120/160-second alternating periods. One shadow layer has a blur; there is no video background, image wallpaper, heavy blur stack, canvas renderer, cursor tracking, sound, animation library or remote rendering dependency. Reduced motion disables all three animations. Window and Diffuse share composition, color/text treatment and navigation; only the shadow diffusion/light treatment changes.

The h1 is centered on the viewport independently of the email below it. The exact email is an ordinary `mailto:` link; no message is sent by the prototype/tests. Explore is a visible ordinary link, reached through native Tab/Enter, click and emulated touch. The title is not a hidden navigation gesture. Variant query parameters are review switches; there are no extra selection controls inside the product composition.

The gallery has a white background and four catalog-driven square thumbnails/titles. Native links go directly to the existing game destinations; the prototype embeds no games. Catalog text is inserted using text nodes; HTTPS destinations and thumbnail paths are constrained. DOM/tab order remains the catalog order. The two deterministic grid/offset systems use responsive spacing rather than random or absolute per-tile positioning. The 5/8/12-item neutral fixtures are test-process-only DOM replacements, not catalog entries or shipped fixture routes.

`catalog.json` is deliberately a small POC data set. A production build-time catalog schema/status gate, generic medium/action model, static initial gallery rendering, SEO, final metadata and manual deployment workflow remain Stage B work. The [portable release contract](../stage-a/RELEASE-TO-PORTAL.md) remains proposed; nothing was installed in a standards or game repository.

## Actual imagery

The four optimized 640×640 WebP images total **432,416 bytes**. Their source screenshots are retained in the earlier Stage A review. [Provenance](asset-provenance.json) records full pinned source URLs, original screenshot checksums, crop boxes and output checksums. There is no repainting or generated replacement gameplay. Crops retain the republic square, Wonderlands' actual painted world, Miss Bunny/cottage and Hearthmere's characters/village.

The handoff reference is retained separately under `handoff/references/` as **mood only**. None of its hypothetical projects, project art, photo background or portrait-shaped tiles is used in the prototype. No new license or commercial rights clearance is asserted for original project artwork.

## Current public evidence

Earlier network restrictions are no longer blocking ordinary HTTPS/API reads. `npm run verify:live` uses the system's normal CA/TLS verification to check the four canonical game pages and the eight JS/CSS resources linked by their HTML. All returned HTTP 200 with nonempty expected content types. Those are entry-resource checks, **not a claim that every transitive asset or game interaction was rechecked**. Squirrel Control's release manifest additionally matches its live JavaScript hash and identifies the approved source/release commits. Historical hosted gameplay checks and creator approvals remain linked in the Stage A report.

The existing user-site root returns the **JC / Portal of jaychtw** placeholder. Pages reports `build_type: workflow`, source metadata `main` / `/`, no custom domain, and HTTPS enforced. This POC adds no repository-root index, no `.github/workflows`, no root service worker and no Pages settings change. A normal source push for review does not introduce or dispatch deployment. The live root is checked again after the review push.

Chromium rejects the environment proxy's certificate with `ERR_CERT_AUTHORITY_INVALID`, although normal HTTPS using the existing system trust succeeds. An attempt to import the already-installed proxy CA into the user-wide Chromium NSS store was rejected by automatic approval review because it would broaden browser trust. The rejection was respected; no import, ignore-certificate flag or verification bypass was used. Fresh live-game browser interactions remain unrun. All interactive browser evidence here is from the local POC, and this limitation does not prevent the Stage A.2 visual review.

## Executed checks

Runner: **Chromium 154.0.8037.57**, Playwright **1.64.1**, axe-core **4.14.0**, Linux cloud environment. Node 24, npm frozen lockfile, Python 3. No physical-device certification is implied.

| Check | Actual outcome |
| --- | --- |
| Landing and gallery variants | 20 cases: both variants/patterns at 320, 390, 768, 1024 and 1440px. Centering, email, square images, direct route/reload, title-only cards, local resources, no overlap/overflow or page errors passed. |
| Reduced motion | Two 390px cases, zero animations; before/after captures pixel-identical. |
| Navigation | Three cases: real keyboard, pointer click and emulated touch. Email precedes Explore; wordmark precedes four game links in catalog order. Variant preservation and visible keyboard outline checked. |
| Missing thumbnail | One case: title and destination remain usable when an image request fails. This does not substitute for Stage B's designed typographic fallback. |
| Layout growth | 50 cases: 2 patterns × 5 counts (3/4/5/8/12) × 5 widths, with a deliberately wrapping title. Square images and no tile overlap/horizontal overflow passed. |
| Accessibility | Eight scans, no axe violations. Four landing scans returned `color-contrast` as incomplete because of the complex background; these were not suppressed or silently called passes. |
| Contrast follow-up | Ten light/width cases. Actual rendered background pixels were sampled under all three text/link rectangles every 4px, at 25 phases over the shared 960-second alternate cycle. Minimum sampled text contrast **9.0559:1**, above 4.5:1. This is sampled evidence, not a proof of every continuous pixel/frame. Foreground text remains a fixed dark color. |
| Motion proof | Actual CSS frames sampled every two animation seconds; 160 frames encoded at 10fps into a valid 16-second H.264 MP4. Playback is explicitly labeled **20×**, not actual site speed or a frame-rate measurement. |
| Public reads | Four destinations, eight HTML-linked JS/CSS resources, Squirrel release manifest/hash, existing root and Pages metadata verified over normal TLS. No game writes, dispatches or deployment. |

Machine-readable results are in `evidence/browser-checks.json` and `evidence/live-https-checks.json`. Current-run screenshots include both 1440px/390px landing and gallery variants, reduced-motion stills, focused links and clearly identified count fixtures.

## Performance and reproducibility

The live POC loads only same-origin static resources. Tests observed a maximum **442,326 decoded resource bytes** on the gallery, excluding its HTML document, including all four images. Test tooling is not part of page runtime. There is no external font/API/service request needed to display either page, and no coupling to another site's assets. Links naturally require their external destinations only when followed.

Local navigation timings are recorded for transparency, but are loopback/cloud measurements and not a public-network performance claim. No physical-phone GPU, sustained battery/thermal, frame-rate or field-vitals measurement is claimed. Typography uses a system serif stack, so glyph metrics may vary on other operating systems. FFmpeg emitted nonfatal font-cache notices in this sandbox; the resulting MP4 was checked with ffprobe and its labeled frames were inspected.

Run/variant/test/package commands are in the [POC README](../../prototypes/stage-a2/README.md). The test runner owns and stops its local server. The extracted archive passed three independent browser smoke cases (both light variants, both gallery patterns, navigation, decoded images and refresh); see `evidence/bundle-smoke.json`. The archive is validated and listed in `evidence/bundle-manifest.json`; npm dependencies, caches, browser trust files and test-only fixtures are excluded. The POC can be reviewed without Node or FFmpeg through its included static assets/Python server; those tools are only needed to repeat automated checks/video generation.

## Still awaiting the creator

Approve the light treatment and gallery pattern, or request a focused adjustment. Window + Drift is a recommendation, not recorded approval. Stage B production and its full quality/release gates remain pending. Website deployment and other-repository modifications remain separately authorized actions.

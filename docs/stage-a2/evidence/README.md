# Stage A.2 evidence index

These files document local prototype checks, not production certification.

- [Browser checks](browser-checks.json): 26 product cases, 50 fixture cases, eight axe scans and ten sampled contrast cases; includes exact browser/tool versions and performance scope.
- [Current TLS-verified public reads](live-https-checks.json): four games, entry JS/CSS resources, Squirrel release identity, existing user-site root and Pages metadata. Live-game Chromium interaction was not rerun.
- [Standalone bundle manifest](bundle-manifest.json) and [extracted-archive browser smoke](bundle-smoke.json).
- [20× motion proof](daylight-motion-20x.mp4): actual browser CSS frames, 16 seconds total. Review labels are not product text.
- [Window desktop](landing-window-1440.png) / [mobile](landing-window-390.png); [Diffuse desktop](landing-diffuse-1440.png) / [mobile](landing-diffuse-390.png).
- [Drift desktop](gallery-drift-1440.png) / [mobile](gallery-drift-390.png); [Cadence desktop](gallery-cadence-1440.png) / [mobile](gallery-cadence-390.png).
- Reduced-motion stills: [Window](reduced-window-390.png), [Diffuse](reduced-diffuse-390.png).
- Focus evidence: [Explore](landing-keyboard-focus-390.png), [gallery link](gallery-keyboard-focus-390.png).

## Neutral layout fixtures — not real projects

The test runner injects simple gray squares and numbered fixture labels into an isolated browser context. There is no fixture route, count switch, duplicate catalog entry or fictitious game in the prototype. The 4-item real catalog is shown in the primary gallery screenshots above. All 3/4/5/8/12 counts were tested at five widths; the files below are selected stress-test captures.

| Count | Drift desktop / mobile | Cadence desktop / mobile |
| --- | --- | --- |
| 3 | [1440](fixture-drift-3-1440.png) / [390](fixture-drift-3-390.png) | [1440](fixture-cadence-3-1440.png) / [390](fixture-cadence-3-390.png) |
| 5 | [1440](fixture-drift-5-1440.png) / [390](fixture-drift-5-390.png) | [1440](fixture-cadence-5-1440.png) / [390](fixture-cadence-5-390.png) |
| 8 | [1440](fixture-drift-8-1440.png) / [390](fixture-drift-8-390.png) | [1440](fixture-cadence-8-1440.png) / [390](fixture-cadence-8-390.png) |
| 12 | [1440](fixture-drift-12-1440.png) / [390](fixture-drift-12-390.png) | [1440](fixture-cadence-12-1440.png) / [390](fixture-cadence-12-390.png) |

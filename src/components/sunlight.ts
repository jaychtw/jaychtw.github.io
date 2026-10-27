import type { Site } from "../model.ts";
import { escape } from "./html.ts";
export function sunlight(site: Site, hasPortfolio: boolean): string {
  return `<section class="landing-scene" aria-labelledby="possibility-title">
<div class="daylight" aria-hidden="true"><div class="illumination"></div>
<svg class="window-shadow" viewBox="0 0 1440 1000" preserveAspectRatio="none"><path class="glass-edge vertical-edge" d="M580 -180 C575 170 594 350 584 480 C575 670 600 890 580 1180 L646 1180 C662 890 640 670 650 480 C660 350 641 170 648 -180 Z"/><path class="glass-edge horizontal-edge" d="M-200 431 C230 420 420 444 710 431 C990 418 1220 441 1640 430 L1640 484 C1220 495 990 472 710 485 C420 498 230 474 -200 485 Z"/></svg><div class="glass-light"></div></div>
<div class="scene-content"><h1 id="possibility-title">${escape(site.name)}</h1><a class="contact" href="mailto:${escape(site.email)}">${escape(site.email)}</a>
${hasPortfolio ? '<a class="scroll-cue" href="#portfolio" aria-label="Scroll to portfolio"><svg aria-hidden="true" width="18" height="28" viewBox="0 0 18 28" fill="none"><path d="M9 3v20M3.5 17.5 9 23l5.5-5.5" stroke="currentColor" stroke-width="1"/></svg></a>' : ""}</div></section>`;
}

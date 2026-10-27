const { chromium } = require("playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { spawn, execFileSync } = require("node:child_process");
const { PNG } = require("pngjs");
const root = path.resolve(__dirname, ".."),
  out = path.join(root, ".artifacts/browser"),
  cache = path.join(root, ".cache");
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(cache, { recursive: true });
const widths = [320, 390, 768, 1024, 1440];
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "content/projects.json")),
)
  .filter((p) => p.status === "published")
  .sort((a, b) => a.order - b.order);
const result = {
  scope:
    "Production build in local Chromium; not a deployed site, device certification, or fresh live-game browser testing.",
  routes: [],
  accessibility: [],
  contrast: [],
  fixtures: [],
  behavior: [],
  baseline: [],
};
let browser, server, baseline;
async function start(port, script) {
  try {
    await fetch(`http://127.0.0.1:${port}`);
    throw new Error(`Port ${port} is occupied`);
  } catch (e) {
    if (e.message.includes("occupied")) throw e;
  }
  const child = spawn(
    "python3",
    Array.isArray(script) ? script : [script, "--port", String(port)],
    { cwd: root, stdio: "ignore" },
  );
  for (let i = 0; i < 40; i++) {
    if (child.exitCode !== null) throw new Error("Preview server failed");
    try {
      if ((await fetch(`http://127.0.0.1:${port}`)).ok) return child;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  child.kill();
  throw new Error("Preview did not become ready");
}
async function ready(page) {
  await page.waitForSelector(".gallery");
  await page.locator(".work").last().scrollIntoViewIfNeeded();
  await page
    .locator(".work img")
    .evaluateAll((xs) => Promise.all(xs.map((i) => i.decode())));
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(50);
}
async function time(page, t) {
  await page.evaluate((t) => {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t;
    }
  }, t);
}
async function geometry(page, count) {
  const d = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll(".work-link")].map((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
    });
    return {
      count: tiles.length,
      square: [...document.querySelectorAll(".work-media")].every(
        (e) =>
          Math.abs(
            e.getBoundingClientRect().width - e.getBoundingClientRect().height,
          ) < 0.1,
      ),
      overlap: tiles.some((r, i) =>
        tiles
          .slice(i + 1)
          .some(
            (s) =>
              r.x < s.right &&
              r.right > s.x &&
              r.y < s.bottom &&
              r.bottom > s.y,
          ),
      ),
      overflow: document.documentElement.scrollWidth > innerWidth,
      offset: tiles.length < 2 || Math.abs(tiles[0].y - tiles[1].y) > 10,
      snap: [
        getComputedStyle(document.documentElement).scrollSnapType,
        getComputedStyle(document.body).scrollSnapType,
      ],
    };
  });
  assert.equal(d.count, count);
  assert(d.square && d.offset && !d.overlap && !d.overflow);
  assert.deepEqual(d.snap, ["none", "none"]);
  return d;
}
async function axe(page, label) {
  const scan = await page.evaluate(() =>
    axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    }),
  );
  const violations = scan.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.map((n) => n.target),
  }));
  result.accessibility.push({
    label,
    violations,
    incomplete: scan.incomplete.map((v) => ({ id: v.id, impact: v.impact })),
  });
  assert.deepEqual(violations, [], label);
}
const lum = (a) =>
  a
    .map((v) => v / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) =>
  (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
function sampled(buffer, rects) {
  const p = PNG.sync.read(buffer);
  let min = 100;
  for (const r of rects)
    for (
      let y = Math.max(0, Math.floor(r.y));
      y < Math.min(p.height, Math.ceil(r.y + r.height));
      y += 5
    )
      for (
        let x = Math.max(0, Math.floor(r.x));
        x < Math.min(p.width, Math.ceil(r.x + r.width));
        x += 5
      ) {
        const i = (y * p.width + x) * 4;
        min = Math.min(
          min,
          ratio([p.data[i], p.data[i + 1], p.data[i + 2]], [50, 46, 41]),
        );
      }
  return min;
}
(async () => {
  server = await start(4173, "scripts/serve.py");
  baseline = await start(8766, [
    "-m",
    "http.server",
    "8766",
    "--bind",
    "127.0.0.1",
    "--directory",
    path.join(root, "tests/visual-reference"),
  ]);
  let executable = process.env.CHROMIUM_PATH;
  for (const name of ["chromium", "google-chrome", "chromium-browser"])
    if (!executable) {
      try {
        executable = execFileSync("which", [name], { encoding: "utf8" }).trim();
      } catch {}
    }
  browser = await chromium.launch({
    executablePath: executable,
    args: ["--no-sandbox"],
    env: {
      ...process.env,
      XDG_CONFIG_HOME: path.join(cache, "config"),
      XDG_CACHE_HOME: path.join(cache, "cache"),
    },
  });
  result.browser = browser.version();
  result.playwright = require("playwright/package.json").version;
  result.axe = require("axe-core/package.json").version;
  const context = await browser.newContext();
  await context.addInitScript({ path: require.resolve("axe-core/axe.min.js") });
  for (const route of ["/", "/games/"])
    for (const width of widths) {
      const page = await context.newPage();
      await page.setViewportSize({ width, height: width < 600 ? 844 : 960 });
      const errors = [],
        failed = [],
        requests = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(r.status() + " " + r.url());
      });
      page.on("request", (r) => requests.push(r.url()));
      const response = await page.goto("http://127.0.0.1:4173" + route);
      assert.equal(response.status(), 200);
      await ready(page);
      const g = await geometry(page, catalog.length);
      assert.deepEqual(
        await page.locator(".work-title").allTextContents(),
        catalog.map((p) => p.title),
      );
      assert.deepEqual(
        await page
          .locator(".work-link")
          .evaluateAll((xs) => xs.map((x) => x.href)),
        catalog.map((p) => p.destination.url),
      );
      assert.equal(
        await page.locator(".work p,.work button,.work time").count(),
        0,
      );
      assert(requests.every((u) => u.startsWith("http://127.0.0.1:4173/")));
      assert(
        !requests.some(
          (u) => u.includes("catalog.json") || u.includes("github"),
        ),
      );
      await page.reload();
      await ready(page);
      await geometry(page, catalog.length);
      if (route === "/") {
        const h0 = await page.locator("h1").boundingBox();
        await time(page, 9000);
        assert.deepEqual(await page.locator("h1").boundingBox(), h0);
        const positions = await page.evaluate(() => ({
          height: document
            .querySelector(".landing-scene")
            .getBoundingClientRect().height,
          below: document.querySelector("#portfolio").getBoundingClientRect().y,
          viewport: innerHeight,
        }));
        assert.equal(positions.height, positions.viewport);
        assert.equal(positions.below, positions.viewport);
        assert.equal(
          await page.locator(".scene-content").innerText(),
          "Possibility\njay.yc.chen@gmail.com",
        );
        assert.equal(
          await page.locator(".contact").getAttribute("href"),
          "mailto:jay.yc.chen@gmail.com",
        );
        const rects = await page
          .locator("h1,.contact,.scroll-cue")
          .evaluateAll((es) =>
            es.map((e) => {
              const r = e.getBoundingClientRect();
              return { x: r.x, y: r.y, width: r.width, height: r.height };
            }),
          );
        await page
          .locator(".scene-content")
          .evaluate((e) => (e.style.visibility = "hidden"));
        let min = 100;
        for (let t = 0; t <= 120000; t += 10000) {
          await time(page, t);
          min = Math.min(min, sampled(await page.screenshot(), rects));
        }
        assert(min >= 4.5);
        await page
          .locator(".scene-content")
          .evaluate((e) => (e.style.visibility = ""));
        const colors = await page.evaluate(() => ({
          base: [
            ...getComputedStyle(
              document.querySelector(".daylight"),
            ).backgroundImage.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g),
          ].map((m) => m.slice(1).map(Number)),
          shadows: [...document.querySelectorAll(".glass-edge")].map((e) => ({
            rgb: getComputedStyle(e).fill.match(/\d+/g).map(Number),
            alpha: Number(getComputedStyle(e).opacity),
          })),
        }));
        let bound = [0, 1, 2].map((i) =>
          Math.min(...colors.base.map((c) => c[i])),
        );
        for (const s of colors.shadows)
          bound = bound.map((c, i) => c * (1 - s.alpha) + s.rgb[i] * s.alpha);
        const lower = ratio(bound.map(Math.floor), [50, 46, 41]);
        assert(lower >= 4.5);
        result.contrast.push({
          width,
          minimumSampledRatio: min,
          phases: 13,
          seconds: 120,
          conservativeAllPhaseRatio: lower,
          boundRGB: bound.map(Math.floor),
        });
        await time(page, 9000);
      }
      if ([390, 1440].includes(width)) {
        await page.screenshot({
          path: path.join(
            out,
            `${route === "/" ? "home" : "games"}-${width}.png`,
          ),
          fullPage: true,
        });
        await axe(page, route + width);
      }
      if (route === "/" && [390, 1440].includes(width)) {
        const approved = await browser.newPage({
          viewport: { width, height: width === 390 ? 844 : 960 },
        });
        await approved.goto("http://127.0.0.1:8766/");
        await approved.locator(".landing-scene").waitFor();
        await time(approved, 9000);
        const a = PNG.sync.read(
            await page.locator(".landing-scene").screenshot(),
          ),
          b = PNG.sync.read(
            await approved.locator(".landing-scene").screenshot(),
          );
        assert.equal(a.data.length, b.data.length);
        let changed = 0,
          max = 0;
        for (let i = 0; i < a.data.length; i += 4) {
          const d = Math.max(
            ...[0, 1, 2].map((c) => Math.abs(a.data[i + c] - b.data[i + c])),
          );
          if (d > 3) changed++;
          max = Math.max(max, d);
        }
        const fraction = changed / (a.width * a.height);
        result.baseline.push({
          width,
          pixelsOverTolerance: fraction,
          maxChannelDifference: max,
          approvedBaseline: JSON.parse(
            fs.readFileSync(
              path.join(root, "tests/visual-reference/baseline.json"),
            ),
          ).approvedCommit,
        });
        assert(fraction < 0.003, "Approved landing differs materially");
        await approved.close();
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(failed, []);
      result.routes.push({
        route,
        width,
        ...g,
        noExternalRuntimeRequests: true,
        reload: true,
      });
      await page.close();
    }
  for (const project of catalog) {
    const page = await context.newPage();
    const route = "/" + project.category + "/" + project.id + "/";
    assert.equal(
      (await page.goto("http://127.0.0.1:4173" + route)).status(),
      200,
    );
    await page.reload();
    assert.equal(await page.locator("h1").innerText(), project.title);
    assert.equal(
      await page.locator(".primary-action").getAttribute("href"),
      project.destination.url,
    );
    assert((await page.locator("body").innerText()).includes(project.controls));
    await axe(page, route);
    result.behavior.push({ type: "project-detail", route, reload: true });
    await page.close();
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  for (const route of ["/", "/games/"]) {
    const page = await nojs.newPage();
    await page.goto("http://127.0.0.1:4173" + route);
    assert.equal(await page.locator(".work-link").count(), catalog.length);
    assert.equal(
      await page.locator(".work-link").first().getAttribute("href"),
      catalog[0].destination.url,
    );
    result.behavior.push({ type: "no-javascript", route, staticContent: true });
    await page.close();
  }
  await nojs.close();
  for (const width of [390, 1440]) {
    const page = await context.newPage({
      viewport: { width, height: width === 390 ? 844 : 960 },
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://127.0.0.1:4173/");
    await ready(page);
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
    const a = await page.screenshot();
    await page.waitForTimeout(200);
    assert(a.equals(await page.screenshot()));
    await page.screenshot({ path: path.join(out, `reduced-${width}.png`) });
    await page.mouse.wheel(0, 450);
    await page.waitForFunction(() => scrollY > 200);
    result.behavior.push({
      type: "reduced-motion",
      width,
      stillAndScroll: true,
    });
    await page.close();
  }
  const keyboard = await context.newPage();
  await keyboard.setViewportSize({ width: 390, height: 844 });
  await keyboard.goto("http://127.0.0.1:4173/");
  await ready(keyboard);
  await keyboard.keyboard.press("PageDown");
  await keyboard.waitForFunction(() => scrollY > 300);
  await keyboard.evaluate(() => scrollTo(0, 0));
  await keyboard.keyboard.press("Tab");
  assert.equal(
    await keyboard.locator(":focus").getAttribute("href"),
    "mailto:jay.yc.chen@gmail.com",
  );
  await keyboard.keyboard.press("Tab");
  assert.equal(
    await keyboard.locator(":focus").getAttribute("href"),
    "#portfolio",
  );
  await keyboard.keyboard.press("Enter");
  await keyboard.waitForURL((u) => u.hash === "#portfolio");
  for (const p of catalog) {
    await keyboard.keyboard.press("Tab");
    assert.equal(
      await keyboard.locator(":focus").getAttribute("href"),
      p.destination.url,
    );
    assert.equal(
      await keyboard
        .locator(":focus")
        .evaluate((e) => getComputedStyle(e).outlineStyle),
      "solid",
    );
  }
  await keyboard.screenshot({ path: path.join(out, "keyboard-focus.png") });
  result.behavior.push({ type: "keyboard", pageDownAndCueAndOrder: true });
  await keyboard.close();
  const tc = await browser.newContext({
      hasTouch: true,
      viewport: { width: 390, height: 844 },
    }),
    touch = await tc.newPage();
  await touch.goto("http://127.0.0.1:4173/");
  await ready(touch);
  const cdp = await tc.newCDPSession(touch);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 195, y: 700 }],
  });
  for (let y = 670; y >= 190; y -= 30)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 195, y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await touch.waitForFunction(() => scrollY > 200);
  assert.equal(new URL(touch.url()).hash, "");
  result.behavior.push({ type: "touch", naturalSwipe: true });
  await tc.close();
  const missing = await context.newPage();
  await missing.route("**/images/*.webp", (r) => r.abort());
  await missing.goto("http://127.0.0.1:4173/games/");
  await missing.waitForSelector(".work-media.is-fallback");
  assert.equal(await missing.locator(".work-title").count(), catalog.length);
  assert.equal(
    await missing.locator(".work-media.is-fallback").count(),
    catalog.length,
  );
  assert.equal(
    await missing.locator(".thumb-fallback").first().innerText(),
    "RC",
  );
  result.behavior.push({ type: "missing-art", designedFallbackAndLinks: true });
  await missing.close();
  const pause = await context.newPage();
  await pause.goto("http://127.0.0.1:4173/");
  await ready(pause);
  await pause.locator("#portfolio").scrollIntoViewIfNeeded();
  await pause.waitForFunction(
    () => document.querySelector(".daylight").dataset.paused === "true",
  );
  assert(
    await pause.evaluate(() =>
      document.getAnimations().every((a) => a.playState === "paused"),
    ),
  );
  await pause.evaluate(() => scrollTo(0, 0));
  await pause.waitForFunction(
    () => document.querySelector(".daylight").dataset.paused === "false",
  );
  result.behavior.push({ type: "offscreen-motion", pausesAndResumes: true });
  await pause.close();
  for (const count of [3, 4, 5, 8, 12])
    for (const width of widths) {
      const page = await context.newPage();
      await page.setViewportSize({ width, height: 844 });
      await page.goto("http://127.0.0.1:4173/games/");
      await ready(page);
      await page.evaluate((count) => {
        const g = document.querySelector(".gallery");
        g.replaceChildren();
        g.classList.toggle("many", count > 4);
        for (let i = 0; i < count; i++) {
          const li = document.createElement("li");
          li.className = "work";
          const a = document.createElement("a");
          a.className = "work-link";
          a.href = "#fixture-" + i;
          const media = document.createElement("span");
          media.className = "work-media";
          const h = document.createElement("h2");
          h.className = "work-title";
          h.textContent =
            "Layout fixture " +
            i +
            (i === 2 ? " with a long wrapping title" : "");
          a.append(media, h);
          li.append(a);
          g.append(li);
        }
      }, count);
      result.fixtures.push({ count, width, ...(await geometry(page, count)) });
      await page.close();
    }
  const extra = await context.newPage();
  await extra.setViewportSize({ width: 844, height: 390 });
  await extra.goto("http://127.0.0.1:4173/");
  await ready(extra);
  await geometry(extra, 4);
  assert(await extra.locator(".contact").isVisible());
  result.behavior.push({
    type: "short-landscape",
    width: 844,
    height: 390,
    noOverflow: true,
  });
  await extra.goto("http://127.0.0.1:4173/missing-route/");
  assert.equal(await extra.locator("h1").innerText(), "Page not found");
  await extra.close();
  for (const route of ["/", "/games/"])
    for (const width of [320, 390]) {
      const page = await context.newPage();
      await page.setViewportSize({ width, height: 844 });
      await page.goto("http://127.0.0.1:4173" + route);
      await ready(page);
      await page.evaluate(
        () => (document.documentElement.style.fontSize = "200%"),
      );
      await geometry(page, catalog.length);
      if (route === "/") {
        const h = await page.locator("h1").boundingBox(),
          mail = await page.locator(".contact").boundingBox();
        assert(
          h.x >= 15 && h.x + h.width <= width - 15 && h.y + h.height < mail.y,
        );
      }
      result.behavior.push({
        type: "text-resize-200-percent",
        route,
        width,
        reflow: true,
      });
      await page.close();
    }
  const high = await context.newPage();
  await high.emulateMedia({ forcedColors: "active" });
  await high.goto("http://127.0.0.1:4173/");
  await ready(high);
  assert.equal(
    await high
      .locator(".window-shadow")
      .evaluate((e) => getComputedStyle(e).display),
    "none",
  );
  assert.equal(await high.locator("h1").innerText(), "Possibility");
  result.behavior.push({
    type: "forced-colors",
    decorativeLightSuppressed: true,
  });
  await high.close();
  result.summary = {
    routes: result.routes.length,
    behavior: result.behavior.length,
    fixtures: result.fixtures.length,
    axeScans: result.accessibility.length,
    contrastCases: result.contrast.length,
    visualComparisons: result.baseline.length,
    failures: 0,
  };
})()
  .catch((e) => {
    result.failure = e.stack;
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) server.kill("SIGTERM");
    if (baseline) baseline.kill("SIGTERM");
    fs.writeFileSync(
      path.join(out, "results.json"),
      JSON.stringify(result, null, 2) + "\n",
    );
    console.log(
      JSON.stringify(
        { summary: result.summary, failure: result.failure },
        null,
        2,
      ),
    );
  });

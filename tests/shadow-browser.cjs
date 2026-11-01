const { chromium } = require("playwright"),
  fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { spawn } = require("node:child_process");
const {
  published,
  readProjects,
  editorialOrder,
} = require("../src/catalog.ts");
const root = path.resolve(__dirname, ".."),
  isPublic = process.argv.includes("--public"),
  base = isPublic ? "https://jaychtw.github.io" : "http://127.0.0.1:4178",
  out = path.join(
    root,
    ".artifacts",
    isPublic ? "shadow-public" : "shadow-browser",
  );
fs.mkdirSync(out, { recursive: true });
const projects = readProjects(root),
  games = published(projects).filter((p) => p.category === "games"),
  entry = games.find((p) => p.id === "shadow-becomes-me"),
  filters = [
    "All",
    ...new Set([...games].sort(editorialOrder).flatMap((p) => p.tags)),
  ],
  views = [];
let server, browser;
(async () => {
  if (!isPublic) {
    server = spawn(
      "python3",
      [
        "-m",
        "http.server",
        "4178",
        "--bind",
        "127.0.0.1",
        "--directory",
        path.join(root, "dist"),
      ],
      { stdio: "ignore" },
    );
    for (let i = 0; i < 30; i++) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
    ...(isPublic && process.env.HTTPS_PROXY
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  for (const width of [320, 390, 768, 1024, 1440])
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        isMobile: width < 640,
        hasTouch: width < 640,
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base);
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        await page.locator(".theme-toggle").click();
      assert.equal(
        await page
          .locator("[data-project]")
          .first()
          .getAttribute("data-project"),
        games[0].id,
      );
      assert.deepEqual(
        await page
          .locator("[data-filter]")
          .evaluateAll((es) => es.map((e) => e.dataset.filter)),
        filters,
      );
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        theme,
      );
      const card = page.locator('[data-project="shadow-becomes-me"]');
      assert.equal(await card.getAttribute("href"), entry.destination.url);
      assert.equal(
        await card.locator('[lang="en"]').innerText(),
        entry.summary,
      );
      assert.equal(await card.locator('[lang="zh-TW"]').count(), 0);
      assert.equal(
        await card.locator("img").getAttribute("alt"),
        entry.coverAlt,
      );
      await card.locator("img").evaluate((e) => e.decode());
      const art = await card.locator("img").evaluate((e) => ({
        src: e.currentSrc,
        loaded: e.naturalWidth > 0,
        fit: getComputedStyle(e).objectFit,
      }));
      assert(art.loaded && art.src.includes("shadow-becomes-me."));
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.screenshot({
        path: path.join(out, `games-${width}-${theme}.png`),
      });
      await page.goto(base + "/games/shadow-becomes-me/");
      assert.equal(
        await page.locator('p[lang="zh-TW"]').innerText(),
        entry.summaryZhTW,
      );
      assert.equal(
        await page.locator(".primary-action").getAttribute("href"),
        entry.destination.url,
      );
      assert.deepEqual(errors, []);
      views.push({
        width,
        theme,
        first: games[0].id,
        bilingualCopy: true,
        art,
        overflow: false,
      });
      await page.close();
    }
  if (isPublic) {
    for (const [width, locale] of [
      [1440, "en"],
      [390, "zh-TW"],
    ]) {
      const p = await browser.newPage({
        viewport: { width, height: 1050 },
        isMobile: width === 390,
        hasTouch: width === 390,
      });
      await p.goto(base);
      await p
        .locator('[data-project="shadow-becomes-me"]')
        [width === 390 ? "tap" : "click"]();
      await p.waitForURL(entry.destination.url);
      await p.waitForFunction(() => window.__shadow);
      if (locale === "zh-TW") await p.locator("#language").tap();
      await p.locator("#begin").click();
      for (const expected of ["box", "chair", "idle"]) {
        await p.locator("#transform")[width === 390 ? "tap" : "click"]();
        assert.equal(
          await p.evaluate(() => window.__shadow.snapshot().player.form),
          expected,
        );
      }
      assert(
        (await p.locator("#build-id").innerText()).includes("r3-5c7c6e926759"),
      );
      await p.screenshot({
        path: path.join(out, `portal-to-game-${width}.png`),
      });
      await p.close();
    }
  }
  fs.writeFileSync(
    path.join(out, "results.json"),
    JSON.stringify(
      {
        public: isPublic,
        views,
        portalToActualGameLocales: isPublic ? ["en", "zh-TW"] : [],
        note: "Portal chrome remains English; catalog summaries are English; Traditional Chinese remains on the fact sheet. Actual game has two live-switchable language modes.",
      },
      null,
      2,
    ),
  );
  console.log(
    `${views.length} Shadow entry views passed${isPublic ? "; actual EN/zh-TW game clicks passed" : ""}`,
  );
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    server?.kill();
  });

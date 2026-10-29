const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const publicRun = process.argv.includes("--public");
const base = publicRun ? "https://jaychtw.github.io" : "http://127.0.0.1:4177";
const out = path.join(
  root,
  ".artifacts",
  publicRun ? "apps-public" : "apps-browser",
);
fs.mkdirSync(out, { recursive: true });
const entry = JSON.parse(
  fs.readFileSync(path.join(root, "content/projects/apps/storm-chaser.json")),
);
const identity = JSON.parse(
  fs.readFileSync(path.join(root, "dist/build-info.json")),
);
const report = {
  public: publicRun,
  sourceCommit: identity.sourceCommit,
  checkedAt: new Date().toISOString(),
  views: [],
  errors: [],
  failed: [],
};
let server, browser;
(async () => {
  if (!publicRun) {
    server = spawn(
      "python3",
      [
        "-m",
        "http.server",
        "4177",
        "--bind",
        "127.0.0.1",
        "--directory",
        path.join(root, "dist"),
      ],
      { stdio: "ignore" },
    );
    for (let i = 0; i < 50; i++) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
    ...(publicRun && process.env.HTTPS_PROXY
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      isMobile: width < 640,
      hasTouch: width < 640,
    });
    page.on("pageerror", (e) => report.errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400)
        report.failed.push({ url: r.url(), status: r.status() });
    });
    await page.goto(base + "/");
    const build = await (
      await page.request.get(base + "/build-info.json")
    ).json();
    assert.equal(build.sourceCommit, identity.sourceCommit);
    if (publicRun) assert.equal(build.sourceDirty, false);
    assert.equal(await page.title(), "Possibility");
    const games = await page
      .locator("[data-project]")
      .evaluateAll((cards) =>
        cards.map((c) => ({ id: c.dataset.project, url: c.href })),
      );
    const appsLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Apps", exact: true });
    if (width < 640) await appsLink.tap();
    else await appsLink.click();
    await page.waitForURL(base + "/apps/");
    assert.deepEqual(await page.locator("nav a").allTextContents(), [
      "Games",
      "Apps",
    ]);
    assert.equal(
      await page.locator('nav [aria-current="page"]').innerText(),
      "Apps",
    );
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      "https://jaychtw.github.io/apps/",
    );
    assert.equal(
      await page.locator('meta[property="og:url"]').getAttribute("content"),
      "https://jaychtw.github.io/apps/",
    );
    const card = page.getByRole("link", {
      name: "Open Storm Chaser",
      exact: true,
    });
    assert.equal(await page.locator("[data-project]").count(), 1);
    assert.equal(await card.getAttribute("href"), entry.destination.url);
    const image = card.locator("img");
    await image.evaluate((i) => i.decode());
    const bounds = await image.boundingBox();
    assert(Math.abs(bounds.width / bounds.height - 16 / 9) < 0.02);
    for (const theme of ["dark", "light"]) {
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        await page
          .getByRole("button", { name: `Switch to ${theme} theme` })
          .click();
      for (const tag of entry.tags) {
        await page.getByRole("button", { name: tag, exact: true }).click();
        assert.equal(await page.locator("[data-project]:visible").count(), 1);
        assert.equal(
          await page
            .getByRole("button", { name: tag, exact: true })
            .getAttribute("aria-pressed"),
          "true",
        );
      }
      await page.getByRole("button", { name: "All", exact: true }).click();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.route("**/__test__/apps-axe.js", (route) =>
        route.fulfill({
          contentType: "application/javascript",
          body: fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8"),
        }),
      );
      await page.addScriptTag({ url: base + "/__test__/apps-axe.js" });
      const audit = await page.evaluate(async () =>
        window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
          },
        }),
      );
      assert.deepEqual(audit.violations, []);
      await page.screenshot({
        path: path.join(out, `apps-${width}-${theme}.png`),
        fullPage: true,
      });
      report.views.push({ width, theme, violations: audit.violations });
    }
    await page.reload();
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page.goto(base + "/apps/storm-chaser/");
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      "https://jaychtw.github.io/apps/storm-chaser/",
    );
    assert.equal(
      await page.locator('meta[property="og:url"]').getAttribute("content"),
      "https://jaychtw.github.io/apps/storm-chaser/",
    );
    assert(
      (await page.locator("main").innerText()).includes("Traditional Chinese"),
    );
    assert(
      (await page.locator("main").innerText()).includes(
        "not an official warning service",
      ),
    );
    await page.getByRole("link", { name: "Back to Apps" }).click();
    if (publicRun) {
      await card.click();
      await page.waitForURL(entry.destination.url);
      await page.locator("#map[data-ready='true']").waitFor({ timeout: 60000 });
      assert(await page.locator("#explorer").count());
    }
    await page.goto(base + "/games/");
    await page.waitForURL(base + "/");
    assert.deepEqual(
      await page
        .locator("[data-project]")
        .evaluateAll((cards) =>
          cards.map((c) => ({ id: c.dataset.project, url: c.href })),
        ),
      games,
    );
    assert.equal(
      await page.locator('nav [aria-current="page"]').innerText(),
      "Games",
    );
    await page.close();
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failed, []);
  report.passed = true;
  console.log(
    JSON.stringify({
      public: publicRun,
      appsViews: report.views.length,
      axeViolations: 0,
      passed: true,
    }),
  );
})()
  .catch((error) => {
    report.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) server.kill();
    fs.writeFileSync(
      path.join(out, "results.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
  });

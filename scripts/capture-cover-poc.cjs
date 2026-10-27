// Reproducible local-only visual evidence; never publishes or generates artwork.
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { spawn, execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const { createHash } = require("node:crypto");
const root = path.resolve(__dirname, "..");
const filtersOnly = process.argv.includes("--filters-only");
const cover = path.join(
  root,
  "public/assets/covers/games/republic-of-chickens.webp",
);
if (!filtersOnly && !fs.existsSync(cover))
  throw new Error(
    "Supply the original cover file before recording cover integration. --filters-only records the separate filter assessment without claiming artwork integration.",
  );
const baseline = "f0d0a70f9e219d7abc47ac1040a6bdc038695aac";
const baselineCSS = execFileSync(
  "git",
  ["show", `${baseline}:src/styles/platform.css`],
  { cwd: root, encoding: "utf8" },
);
const out = path.join(
  root,
  ".artifacts/cover-poc",
  filtersOnly ? "filters-only" : "cover-integration",
);
fs.mkdirSync(out, { recursive: true });
const receipt = {
  scope: filtersOnly
    ? "Filter presentation comparison using current gallery assets; this mode alone does not certify supplied-cover integration."
    : "Supplied cover POC in actual local gallery, not creative approval or public deployment.",
  baseline,
  coverSourceSha256: fs.existsSync(cover)
    ? createHash("sha256").update(fs.readFileSync(cover)).digest("hex")
    : null,
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim(),
  sourceDirty:
    execFileSync("git", ["status", "--porcelain"], {
      cwd: root,
      encoding: "utf8",
    }).trim().length > 0,
  deviceScaleFactor: 1,
  cases: [],
};
let browser, server;
(async () => {
  try {
    await fetch("http://127.0.0.1:4180/");
    throw new Error("Port 4180 is occupied");
  } catch (error) {
    if (error.message.includes("occupied")) throw error;
  }
  server = spawn("python3", ["scripts/serve.py", "--port", "4180"], {
    cwd: root,
    stdio: "ignore",
  });
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch("http://127.0.0.1:4180/")).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  assert(ready, "Local preview did not start");
  let executablePath = process.env.CHROMIUM_PATH;
  for (const name of ["chromium", "google-chrome"])
    if (!executablePath) {
      try {
        executablePath = execFileSync("which", [name], {
          encoding: "utf8",
        }).trim();
      } catch {}
    }
  browser = await chromium.launch({
    executablePath,
    args: ["--no-sandbox"],
    env: {
      ...process.env,
      XDG_CONFIG_HOME: path.join(root, ".cache/config"),
      XDG_CACHE_HOME: path.join(root, ".cache/cache"),
    },
  });
  receipt.browser = browser.version();
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
    ["narrow", 320, 900],
  ])
    for (const theme of ["dark", "light"])
      for (const mode of ["before", "after"]) {
        const page = await browser.newPage({
          viewport: { width, height },
          deviceScaleFactor: 1,
        });
        if (mode === "before")
          await page.route("**/assets/possibility/site.*.css", (r) =>
            r.fulfill({ contentType: "text/css", body: baselineCSS }),
          );
        await page.goto("http://127.0.0.1:4180/");
        if (theme === "light")
          await page
            .getByRole("button", { name: "Switch to light theme" })
            .click();
        const card = page.locator('[data-project="republic-of-chickens"]');
        const image = card.locator("img");
        await image.evaluate((i) => i.decode());
        for (const visibleImage of await page.locator(".work img").all()) {
          if (
            await visibleImage.evaluate((i) => {
              const r = i.getBoundingClientRect();
              return r.top < innerHeight && r.bottom > 0;
            })
          )
            await visibleImage.evaluate((i) => i.decode());
        }
        if (!filtersOnly)
          assert(
            (await image.getAttribute("src")).includes("/assets/covers/games/"),
            "Custom cover must take priority",
          );
        const metrics = await page.evaluate(() => {
          const pills = [...document.querySelectorAll(".filter")],
            filters = document
              .querySelector(".filters")
              .getBoundingClientRect(),
            card = document
              .querySelector('[data-project="republic-of-chickens"]')
              .getBoundingClientRect(),
            media = document
              .querySelector(
                '[data-project="republic-of-chickens"] .work-media',
              )
              .getBoundingClientRect();
          return {
            filterCount: pills.length,
            filterRows: new Set(
              pills.map((p) => Math.round(p.getBoundingClientRect().top)),
            ).size,
            filterHeight: filters.height,
            minTargetHeight: Math.min(
              ...pills.map((p) => p.getBoundingClientRect().height),
            ),
            firstCoverTop: media.top,
            card: { width: card.width, height: card.height },
            media: { width: media.width, height: media.height },
            columns: getComputedStyle(
              document.querySelector("#project-grid"),
            ).gridTemplateColumns.split(" ").length,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        assert.equal(metrics.overflow, false);
        assert.equal(metrics.columns, width >= 1024 ? 3 : width >= 640 ? 2 : 1);
        assert(
          Math.abs(metrics.media.width / metrics.media.height - 16 / 9) < 0.015,
        );
        const name = `${device}-${theme}-${mode}`;
        await page.screenshot({ path: path.join(out, name + ".png") });
        if (mode === "after") {
          await card.screenshot({
            path: path.join(out, `${device}-${theme}-card-1x.png`),
          });
          await card.locator(".work-media").screenshot({
            path: path.join(out, `${device}-${theme}-artwork-1x.png`),
          });
        }
        receipt.cases.push({
          device,
          width,
          height,
          theme,
          mode,
          ...metrics,
          image: await image.getAttribute("src"),
          renderedImage: await image.evaluate((i) => ({
            currentSrc: i.currentSrc,
            naturalWidth: i.naturalWidth,
            naturalHeight: i.naturalHeight,
            objectFit: getComputedStyle(i).objectFit,
            complete: i.complete,
          })),
        });
        await page.close();
      }
  if (!filtersOnly) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    await page.goto("http://127.0.0.1:4180/");
    const image = page.locator('[data-project="republic-of-chickens"] img');
    await image.evaluate((i) => i.decode());
    receipt.highDensity = await image.evaluate((i) => ({
      deviceScaleFactor: window.devicePixelRatio,
      currentSrc: i.currentSrc,
      cssWidth: i.getBoundingClientRect().width,
      cssHeight: i.getBoundingClientRect().height,
    }));
    assert(
      receipt.highDensity.currentSrc.includes(".960."),
      "2x display should select the 960px cover rendition",
    );
    await page.close();
    receipt.fallbacks = [];
    for (const failScreenshot of [false, true]) {
      const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
      });
      await page.route("**/assets/covers/games/republic-of-chickens.*", (r) =>
        r.abort(),
      );
      if (failScreenshot)
        await page.route(
          "**/assets/screenshots/games/republic-of-chickens.*",
          (r) => r.abort(),
        );
      await page.goto("http://127.0.0.1:4180/");
      if (failScreenshot)
        await page.waitForFunction(() =>
          document
            .querySelector('[data-project="republic-of-chickens"] .work-media')
            .classList.contains("is-fallback"),
        );
      else
        await page.waitForFunction(() => {
          const i = document.querySelector(
            '[data-project="republic-of-chickens"] img',
          );
          return (
            i.currentSrc.includes("/assets/screenshots/") &&
            i.complete &&
            i.naturalWidth > 0
          );
        });
      const card = page.locator('[data-project="republic-of-chickens"]');
      assert.equal(
        await card.locator(".launch").getAttribute("href"),
        "https://jaychtw.github.io/reppublic-of-chickens/",
      );
      const name = failScreenshot
        ? "fallback-placeholder-mobile"
        : "fallback-screenshot-mobile";
      await page.screenshot({ path: path.join(out, name + ".png") });
      receipt.fallbacks.push({
        case: failScreenshot
          ? "Cover and screenshot requests blocked"
          : "Cover request blocked",
        selected: failScreenshot ? "placeholder" : "screenshot",
        launchURL: await card.locator(".launch").getAttribute("href"),
        passed: true,
      });
      await page.close();
    }
  }
  receipt.passed = true;
  console.log(
    JSON.stringify(
      receipt.cases
        .filter((c) => c.theme === "dark")
        .map((c) => ({
          device: c.device,
          mode: c.mode,
          rows: c.filterRows,
          filterHeight: c.filterHeight,
          firstCoverTop: c.firstCoverTop,
          card: c.card,
        })),
    ),
  );
})()
  .catch((error) => {
    receipt.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) server.kill();
    fs.writeFileSync(
      path.join(out, "receipt.json"),
      JSON.stringify(receipt, null, 2) + "\n",
    );
  });

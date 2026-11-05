const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { spawn, execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
const isPublic = process.argv.includes("--public");
const base = isPublic ? "https://jaychtw.github.io" : "http://127.0.0.1:4186";
const out = path.join(
  root,
  ".artifacts",
  isPublic ? "armorheart-cover-public" : "armorheart-cover-local",
);
fs.mkdirSync(out, { recursive: true });
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f)));
const entry = read("content/projects/games/armorheart.json");
const build = read("dist/build-info.json");
const assets = read(".artifacts/asset-evidence.json");
const cover = assets.find(
  (a) => a.sourcePath === "/assets/covers/games/armorheart.webp",
);
assert.equal(assets.find((a) => a.project === "armorheart").selected, "cover");
assert.deepEqual(
  cover.variants.map((v) => v.width),
  [480, 960, 1600],
);
assert(
  fs
    .readFileSync(path.join(root, "content/projects/games/armorheart.json"))
    .equals(
      execFileSync(
        "git",
        [
          "show",
          "aa05a62ece2021f5fb9573f4a91f3bc8423d84b5:content/projects/games/armorheart.json",
        ],
        { cwd: root },
      ),
    ),
);
for (const v of cover.variants) {
  const bytes = fs.readFileSync(path.join(root, "dist", v.src));
  assert.equal(
    crypto.createHash("sha256").update(bytes).digest("hex"),
    v.sha256,
  );
  assert.equal(v.height, Math.round((v.width * 9) / 16));
  assert(v.width <= 1672);
}
let server, browser;
const views = [],
  audits = [],
  plays = [],
  errors = [];
(async () => {
  if (!isPublic) {
    server = spawn(
      "python3",
      [
        "-m",
        "http.server",
        "4186",
        "--bind",
        "127.0.0.1",
        "--directory",
        path.join(root, "dist"),
      ],
      { stdio: "ignore" },
    );
    for (let i = 0; i < 40; i++) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
    ...(process.env.HTTPS_PROXY
      ? {
          proxy: {
            server: process.env.HTTPS_PROXY,
            bypass: "127.0.0.1,localhost",
          },
        }
      : {}),
  });
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1440, 1000],
    [844, 390],
  ]) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: width < 640 ? 2 : 1,
        isMobile: width < 640,
        hasTouch: true,
      });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base);
      const identity = await (
        await page.request.get(base + "/build-info.json")
      ).json();
      assert.equal(identity.sourceCommit, build.sourceCommit);
      if (isPublic) assert.equal(identity.sourceDirty, false);
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        await page.locator(".theme-toggle").click();
      const card = page.locator('[data-project="armorheart"]');
      assert.equal(
        await page
          .locator("[data-project]")
          .first()
          .getAttribute("data-project"),
        "armorheart",
      );
      assert.equal(await card.count(), 1);
      assert.equal(await card.getAttribute("href"), entry.destination.url);
      assert.equal(
        await card.locator('[lang="en"]').innerText(),
        entry.summary,
      );
      assert.equal(await card.locator('[lang="zh-TW"]').count(), 0);
      const image = card.locator("img");
      await image.evaluate((e) => e.decode());
      const measured = await image.evaluate((e) => {
        const r = e.getBoundingClientRect();
        return {
          src: e.currentSrc,
          naturalWidth: e.naturalWidth,
          naturalHeight: e.naturalHeight,
          width: r.width,
          height: r.height,
          fit: getComputedStyle(e).objectFit,
          alt: e.alt,
          fallback: e.dataset.fallback,
        };
      });
      assert(
        cover.variants.some((v) => new URL(measured.src).pathname === v.src),
      );
      assert.equal(measured.alt, "Armorheart cover artwork");
      assert(
        measured.fallback.includes("/assets/screenshots/games/armorheart."),
      );
      assert.equal(measured.fit, "cover");
      assert(Math.abs(measured.width / measured.height - 16 / 9) < 0.001);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      const imageResponse = await page.request.get(measured.src);
      assert(imageResponse.ok());
      assert.equal(
        crypto
          .createHash("sha256")
          .update(await imageResponse.body())
          .digest("hex"),
        cover.variants.find((v) => new URL(measured.src).pathname === v.src)
          .sha256,
      );
      await image.screenshot({
        scale: "css",
        path: path.join(out, `card-${width}-${theme}.png`),
      });
      if ([390, 1440].includes(width)) {
        await page
          .locator("[data-project] img")
          .evaluateAll((es) =>
            Promise.all(
              es
                .filter((e) => e.getBoundingClientRect().top < innerHeight)
                .map((e) => e.decode()),
            ),
          );
        await page.screenshot({
          scale: "css",
          path: path.join(out, `gallery-${width}-${theme}.png`),
        });
        // Audit through DevTools evaluation; keep the site's production CSP intact.
        await page.evaluate(
          fs.readFileSync(
            path.join(root, "node_modules/axe-core/axe.min.js"),
            "utf8",
          ),
        );
        const audit = await page.evaluate(async () => {
          const r = await axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          });
          return {
            violations: r.violations,
            incomplete: r.incomplete.map((x) => ({
              id: x.id,
              impact: x.impact,
            })),
            passes: r.passes.length,
          };
        });
        assert.deepEqual(audit.violations, []);
        audits.push({ width, theme, ...audit });
      }
      await page.goto(base + "/games/armorheart/");
      assert.equal(await page.locator("h1").innerText(), entry.title);
      assert.equal(
        await page.locator('p[lang="zh-TW"]').innerText(),
        entry.summaryZhTW,
      );
      assert.equal(
        await page.locator(".primary-action").getAttribute("href"),
        entry.destination.url,
      );
      await page.locator(".work-media img").evaluate((e) => e.decode());
      assert(
        (await page.locator(".work-media img").getAttribute("src")).includes(
          "/assets/covers/games/armorheart.",
        ),
      );
      if ([390, 1440].includes(width))
        await page.screenshot({
          scale: "css",
          path: path.join(out, `factsheet-${width}-${theme}.png`),
          fullPage: true,
        });
      views.push({
        width,
        height,
        theme,
        image: measured,
        first: "armorheart",
        metadataUnchanged: true,
        bilingualFactsheet: true,
        noOverflow: true,
      });
      await page.close();
    }
  }
  for (const mobile of [true, false]) {
    const page = await browser.newPage({
      viewport: { width: mobile ? 390 : 1440, height: 1000 },
      isMobile: mobile,
      hasTouch: true,
    });
    await page.goto(base + (mobile ? "/" : "/games/armorheart/"));
    const link = page.locator(
      mobile ? '[data-project="armorheart"]' : ".primary-action",
    );
    if (mobile) await link.tap();
    else {
      await link.focus();
      await page.keyboard.press("Enter");
    }
    await page.waitForURL(entry.destination.url);
    await page.waitForFunction(() => window.guardianPOC);
    await page.locator("#start").click();
    const before = await page.evaluate(
      () => window.guardianPOC.snapshot().state,
    );
    if (mobile) {
      const session = await page.context().newCDPSession(page);
      const targets = await Promise.all([
        page.locator('[data-dir="right"]').boundingBox(),
        page.locator("#fire").boundingBox(),
      ]);
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: targets.map((r, i) => ({
          id: i + 1,
          x: r.x + r.width / 2,
          y: r.y + r.height / 2,
        })),
      });
      await page.waitForTimeout(150);
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    } else {
      await page.locator("#arena").focus();
      await page.keyboard.down("ArrowRight");
      await page.keyboard.down("Space");
      await page.waitForTimeout(150);
      await page.keyboard.up("Space");
      await page.keyboard.up("ArrowRight");
    }
    const after = await page.evaluate(
      () => window.guardianPOC.snapshot().state,
    );
    assert(after.tank.x > before.tank.x && after.shots > before.shots);
    plays.push({
      from: mobile ? "Games card/touch" : "fact-sheet Play/keyboard",
      url: page.url(),
      movedAndFired: true,
    });
    await page.close();
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    path.join(out, "results.json"),
    JSON.stringify(
      {
        passed: true,
        public: isPublic,
        sourceCommit: build.sourceCommit,
        checkedAt: new Date().toISOString(),
        cover,
        views,
        audits,
        plays,
        errors,
        limitations:
          "Managed Chromium/viewport emulation, not physical phones, independent player or assistive-technology certification. Title/subject readability is assistant visual inspection of actual card captures; no creative edits.",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify({
      passed: true,
      public: isPublic,
      views: views.length,
      axeScans: audits.length,
      plays,
    }),
  );
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) server.kill();
  });

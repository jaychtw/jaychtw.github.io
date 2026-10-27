const { chromium } = require("playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { spawn, execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."),
  out = path.join(root, ".artifacts/browser");
fs.mkdirSync(out, { recursive: true });
const catalog = fs
  .readdirSync(path.join(root, "content/projects/games"))
  .filter((f) => f.endsWith(".json"))
  .map((f) =>
    JSON.parse(fs.readFileSync(path.join(root, "content/projects/games", f))),
  )
  .filter((p) => p.status === "published")
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
const site = JSON.parse(fs.readFileSync(path.join(root, "content/site.json")));
const collections = JSON.parse(
  fs.readFileSync(path.join(root, "content/collections.json")),
);
const homepage = collections.find((c) => c.id === site.homepageCollection);
const origin = "http://127.0.0.1:4175";
const galleryURL =
  origin + (site.homepageCollection === "games" ? "/" : "/games/");
const active = new Set(
  fs
    .readdirSync(path.join(root, "content/projects"), { recursive: true })
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      JSON.parse(fs.readFileSync(path.join(root, "content/projects", f))),
    )
    .filter((p) => p.status === "published")
    .map((p) => p.category),
);
for (const c of collections.filter((c) => c.type === "editorial")) {
  const dir = path.join(root, "content/articles", c.id);
  if (
    fs.existsSync(dir) &&
    fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .some((f) => {
        const match = fs
          .readFileSync(path.join(dir, f), "utf8")
          .match(/^---\r?\n([\s\S]*?)\r?\n---/u);
        return match && require("yaml").parse(match[1]).status === "published";
      })
  )
    active.add(c.id);
}
const keyboardTag = catalog.some((p) => p.tags.includes("Puzzle"))
  ? "Puzzle"
  : catalog.flatMap((p) => p.tags)[0] || "All";
const touchTag = catalog.some((p) => p.tags.includes("Kawaii"))
  ? "Kawaii"
  : keyboardTag;
const result = {
  scope:
    "Local Chromium, emulated viewport/touch; production and explicitly isolated publishing fixtures. No public deployment or physical-device certification.",
  layouts: [],
  filters: [],
  accessibility: [],
  behavior: [],
  fixtures: [],
};
let browser;
const servers = [];
async function server(port, dir) {
  try {
    await fetch(`http://127.0.0.1:${port}`);
    throw new Error(`Port ${port} occupied`);
  } catch (e) {
    if (e.message.includes("occupied")) throw e;
  }
  const child = spawn(
    "python3",
    [
      "-m",
      "http.server",
      String(port),
      "--bind",
      "127.0.0.1",
      "--directory",
      dir,
    ],
    { cwd: root, stdio: "ignore" },
  );
  servers.push(child);
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Local preview failed");
}
async function theme(page, value) {
  if ((await page.locator("html").getAttribute("data-theme")) !== value)
    await page
      .getByRole("button", { name: `Switch to ${value} theme` })
      .click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), value);
}
async function axe(page, label) {
  // Same-origin test instrumentation retains the production CSP unchanged.
  await page.route("**/__test__/axe.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8"),
    }),
  );
  await page.addScriptTag({
    url: new URL("/__test__/axe.js", page.url()).href,
  });
  const a = await page.evaluate(async () =>
    window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    }),
  );
  result.accessibility.push({
    label,
    violations: a.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    incomplete: a.incomplete.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  });
  assert.deepEqual(
    a.violations.map((v) => v.id),
    [],
    label,
  );
}
async function capture(page, name) {
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((i) => i.decode());
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: path.join(out, name + ".png"),
    fullPage: true,
  });
}
(async () => {
  execFileSync(process.execPath, ["tests/fixtures.ts", "--cover"], {
    cwd: root,
    stdio: "pipe",
  });
  await server(4175, path.join(root, "dist"));
  await server(4176, path.join(root, ".artifacts/fixtures/publishing/dist"));
  let executable = process.env.CHROMIUM_PATH;
  for (const name of ["chromium", "google-chrome"])
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
      XDG_CONFIG_HOME: path.join(root, ".cache/config"),
      XDG_CACHE_HOME: path.join(root, ".cache/cache"),
    },
  });
  result.browser = browser.version();
  const errors = [];
  for (const width of [320, 390, 768, 1024, 1440])
    for (const appearance of ["dark", "light"]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on("pageerror", (e) => errors.push(e.message));
      const foreign = [];
      page.on("request", (r) => {
        if (!r.url().startsWith("http://127.0.0.1:4175/"))
          foreign.push(r.url());
      });
      await page.goto(origin + "/");
      assert.equal(await page.locator("h1").innerText(), homepage.title);
      if (galleryURL !== origin + "/") await page.goto(galleryURL);
      await theme(page, appearance);
      assert.equal(await page.locator("h1").innerText(), "Games");
      assert.equal(
        await page.locator("[data-project]").count(),
        catalog.length,
      );
      const geometry = await page.evaluate(() => ({
        columns: getComputedStyle(
          document.querySelector(".gallery"),
        ).gridTemplateColumns.split(" ").length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        firstY: document.querySelector(".gallery").getBoundingClientRect().top,
        ratios: [...document.querySelectorAll(".work-media")].map(
          (e) =>
            e.getBoundingClientRect().width / e.getBoundingClientRect().height,
        ),
      }));
      assert.equal(geometry.columns, width >= 1024 ? 3 : width >= 640 ? 2 : 1);
      assert.equal(geometry.overflow, false);
      for (const ratio of geometry.ratios)
        assert(Math.abs(ratio - 16 / 9) < 0.015);
      assert(geometry.firstY < 650, "No landing screen before gallery");
      assert.equal(
        await page.locator('nav[aria-label="Collections"] a').count(),
        active.size,
      );
      assert.deepEqual(foreign, []);
      result.layouts.push({ width, appearance, ...geometry });
      // Each tag must hide complete articles, close holes and preserve relative order.
      if (width === 390 || width === 1440) {
        for (const tag of [...new Set(catalog.flatMap((p) => p.tags))]) {
          await page.getByRole("button", { name: tag, exact: true }).click();
          const expected = catalog
            .filter((p) => p.tags.includes(tag))
            .map((p) => p.id);
          assert.deepEqual(
            await page
              .locator("[data-project]:visible")
              .evaluateAll((xs) => xs.map((x) => x.dataset.project)),
            expected,
          );
          assert.equal(
            await page.locator('.filter[aria-pressed="true"]').count(),
            1,
          );
          const first = await page
            .locator("[data-project]:visible")
            .first()
            .boundingBox();
          const grid = await page.locator(".gallery").boundingBox();
          assert(Math.abs(first.y - grid.y) < 1);
          assert(Math.abs(first.x - grid.x) < 1);
          result.filters.push({
            width,
            appearance,
            tag,
            count: expected.length,
          });
        }
        await page.getByRole("button", { name: "All", exact: true }).click();
        assert.equal(
          await page.locator("[data-project]:visible").count(),
          catalog.length,
        );
        await axe(page, `gallery-${width}-${appearance}`);
        await capture(page, `gallery-${width}-${appearance}`);
      }
      await page.reload();
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        appearance,
      );
      await page.goto("http://127.0.0.1:4175/games/");
      await page.waitForURL(galleryURL);
      assert.equal(
        await page.locator("[data-project]").count(),
        catalog.length,
      );
      await page.close();
    }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(galleryURL);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Skip to content",
  );
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.id), "main");
  await page.getByRole("button", { name: keyboardTag, exact: true }).focus();
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.activeElement).outlineStyle,
    ),
    "solid",
  );
  await page.keyboard.press("Space");
  assert.equal(
    await page
      .getByRole("button", { name: keyboardTag, exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.screenshot({ path: path.join(out, "keyboard-focus.png") });
  result.behavior.push("Keyboard skip, visible focus and Space filtering");
  for (const id of [
    "republic-of-chickens",
    "wonderlands",
    "squirrel-control",
    "the-last-lantern",
  ]) {
    await page.goto(`http://127.0.0.1:4175/games/${id}/`);
    assert.equal(
      await page.locator("h1").innerText(),
      catalog.find((p) => p.id === id).title,
    );
    await axe(page, `fact-sheet-${id}`);
  }
  result.behavior.push("Four historical fact-sheet URLs preserved");
  await page.goto(galleryURL);
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".work-media img")
      .first()
      .evaluate((e) => getComputedStyle(e).transitionDuration),
    "0s",
  );
  result.behavior.push("Reduced-motion transitions suppressed");
  for (const appearance of ["dark", "light"]) {
    await theme(page, appearance);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.evaluate(() => (document.documentElement.style.fontSize = ""));
  }
  result.behavior.push("200% text reflow in both themes");
  await page.emulateMedia({ forcedColors: "active" });
  assert(
    await page.getByRole("button", { name: "All", exact: true }).isVisible(),
  );
  result.behavior.push("Forced-colors controls remain available");
  await page.close();
  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await touch.goto(galleryURL);
  await touch.getByRole("button", { name: touchTag, exact: true }).tap();
  assert.equal(
    await touch.locator("[data-project]:visible").count(),
    touchTag === "All"
      ? catalog.length
      : catalog.filter((p) => p.tags.includes(touchTag)).length,
  );
  await touch.getByRole("button", { name: "Switch to light theme" }).tap();
  result.behavior.push("Emulated touch filtering and theme switch");
  await touch.close();
  const nojs = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await nojs.goto(galleryURL);
  assert.equal(await nojs.locator("[data-project]").count(), catalog.length);
  assert.equal(await nojs.locator(".filters").isVisible(), false);
  assert.equal(await nojs.locator(".theme-toggle").isVisible(), false);
  result.behavior.push("No-JavaScript full catalog and functional links");
  await nojs.close();
  const blocked = await browser.newPage();
  await blocked.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage disabled");
      },
    }),
  );
  await blocked.goto(galleryURL);
  await blocked.getByRole("button", { name: "Switch to light theme" }).click();
  assert.equal(
    await blocked.locator("html").getAttribute("data-theme"),
    "light",
  );
  result.behavior.push("Blocked storage leaves theme switch usable");
  await blocked.close();
  const failed = await browser.newPage();
  await failed.route(
    "**/assets/screenshots/games/republic-of-chickens.*",
    (route) => route.abort(),
  );
  await failed.goto(galleryURL);
  await failed.waitForFunction(() =>
    document
      .querySelector('[data-project="republic-of-chickens"] .work-media')
      .classList.contains("is-fallback"),
  );
  assert(
    await failed
      .locator('[data-project="republic-of-chickens"] .launch')
      .isVisible(),
  );
  result.behavior.push("Failed screenshot retains placeholder and Play link");
  await failed.close();
  const coverFailure = await browser.newPage();
  await coverFailure.route("**/assets/covers/games/**", (route) =>
    route.abort(),
  );
  await coverFailure.goto("http://127.0.0.1:4176/");
  await coverFailure.waitForFunction(() => {
    const image = document.querySelector(
      '[data-project="republic-of-chickens"] img',
    );
    return (
      image.src.includes("/screenshots/") &&
      image.complete &&
      image.naturalWidth > 0
    );
  });
  assert.equal(
    await coverFailure
      .locator('[data-project="republic-of-chickens"] img')
      .getAttribute("alt"),
    catalog.find((p) => p.id === "republic-of-chickens").thumbnail.alt,
  );
  result.behavior.push(
    "Runtime custom-cover failure restores authentic screenshot and its alt text",
  );
  await coverFailure.close();
  const allFailure = await browser.newPage();
  await allFailure.route("**/assets/covers/games/**", (route) => route.abort());
  await allFailure.route("**/assets/screenshots/games/**", (route) =>
    route.abort(),
  );
  await allFailure.goto("http://127.0.0.1:4176/");
  await allFailure.waitForFunction(() =>
    document
      .querySelector('[data-project="republic-of-chickens"] .work-media')
      .classList.contains("is-fallback"),
  );
  assert(
    await allFailure
      .locator('[data-project="republic-of-chickens"] .launch')
      .isVisible(),
  );
  result.behavior.push(
    "Runtime cover and screenshot failure retains a neutral placeholder and launch action",
  );
  await allFailure.close();
  const fixture = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  for (const route of [
    "/apps/",
    "/blog/",
    "/what-now/",
    "/blog/publishing-fixture/",
    "/what-now/publishing-fixture/",
  ]) {
    await fixture.goto("http://127.0.0.1:4176" + route);
    assert.equal(
      await fixture.locator('nav[aria-label="Collections"] a').count(),
      4,
    );
    assert.equal(
      await fixture.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await axe(fixture, `fixture-${route}`);
    result.fixtures.push(route);
  }
  await capture(fixture, "what-now-fixture-dark");
  await theme(fixture, "light");
  await capture(fixture, "what-now-fixture-light");
  const routeText = await fixture.locator(".prose").innerText();
  assert(routeText.includes("<script>"));
  assert.equal(await fixture.locator(".prose script").count(), 0);
  await fixture.close();
  assert.deepEqual(errors, []);
  result.passed = true;
  console.log(
    JSON.stringify({
      layouts: result.layouts.length,
      filterCases: result.filters.length,
      axeScans: result.accessibility.length,
      behavior: result.behavior.length,
      fixtures: result.fixtures.length,
      passed: true,
    }),
  );
})()
  .catch((e) => {
    result.failure = e.stack;
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    for (const s of servers) s.kill();
    fs.writeFileSync(
      path.join(out, "results.json"),
      JSON.stringify(result, null, 2) + "\n",
    );
  });

const { chromium } = require("playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."),
  site = JSON.parse(fs.readFileSync(path.join(root, "content/site.json")));
const homepage = JSON.parse(
  fs.readFileSync(path.join(root, "content/collections.json")),
).find((c) => c.id === site.homepageCollection);
const galleryPath = site.homepageCollection === "games" ? "/" : "/games/";
const target = process.argv[2] || site.canonicalOrigin;
const url = new URL(target);
const local = process.argv.includes("--local");
if (local)
  assert(
    url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname),
  );
else assert.equal(url.origin, site.canonicalOrigin);
const projects = fs
  .readdirSync(path.join(root, "content/projects", "games"))
  .filter((f) => f.endsWith(".json"))
  .map((f) =>
    JSON.parse(
      fs.readFileSync(path.join(root, "content/projects", "games", f)),
    ),
  )
  .filter((p) => p.status === "published");
const buildInfo = JSON.parse(
  fs.readFileSync(path.join(root, "dist/build-info.json")),
);
const assetEvidence = JSON.parse(
  fs.readFileSync(path.join(root, ".artifacts/asset-evidence.json")),
);
const selectedAssets = new Map(
  assetEvidence
    .filter((entry) => entry.project)
    .map((entry) => [entry.project, entry]),
);
const imageAssets = new Map(
  assetEvidence
    .filter((entry) => entry.sourcePath && entry.variants)
    .map((entry) => [entry.sourcePath, entry]),
);
const screenshotDirectory = path.join(
  root,
  ".artifacts",
  local ? "local-gallery" : "public-gallery",
);
fs.mkdirSync(screenshotDirectory, { recursive: true });
(async () => {
  let executable = process.env.CHROMIUM_PATH;
  for (const name of ["chromium", "google-chrome"])
    if (!executable) {
      try {
        executable = execFileSync("which", [name], { encoding: "utf8" }).trim();
      } catch {}
    }
  const browser = await chromium.launch({
    executablePath: executable,
    args: ["--no-sandbox"],
    env: {
      ...process.env,
      XDG_CONFIG_HOME: path.join(root, ".cache/config"),
      XDG_CACHE_HOME: path.join(root, ".cache/cache"),
    },
  });
  const errors = [],
    failed = [],
    views = [];
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(r.status() + " " + r.url());
      });
      await page.goto(url.origin + "/");
      const identityResponse = await page.request.get(
        url.origin + "/build-info.json",
      );
      assert(identityResponse.ok());
      const identity = await identityResponse.json();
      assert.equal(identity.sourceCommit, buildInfo.sourceCommit);
      if (!local) assert.equal(identity.sourceDirty, false);
      assert.equal(await page.locator("h1").innerText(), homepage.title);
      if (galleryPath !== "/") await page.goto(url.origin + galleryPath);
      assert.equal(
        await page.locator("[data-project]").count(),
        projects.length,
      );
      assert.equal(await page.locator("[data-project] a, .launch").count(), 0);
      for (const project of projects) {
        const card = page.locator(`[data-project="${project.id}"]`);
        assert.equal(await card.evaluate((element) => element.tagName), "A");
        assert.equal(await card.getAttribute("href"), project.destination.url);
        assert.equal(
          await card.getAttribute("aria-label"),
          `${project.destination.action === "play" ? "Play" : "Open"} ${project.title}`,
        );
      }
      const tag = page.locator(".filter").nth(1);
      if (await tag.count()) await tag.click();
      await page.getByRole("button", { name: "All", exact: true }).click();
      const icon = await page.locator('link[rel="icon"]').getAttribute("href");
      assert.match(
        icon,
        /^\/assets\/possibility\/favicon\.[0-9a-f]{12}\.svg$/u,
      );
      const iconResponse = await page.request.get(
        new URL(icon, url.origin).href,
      );
      assert(iconResponse.ok());
      assert.deepEqual(
        await iconResponse.body(),
        fs.readFileSync(path.join(root, "public/favicon.svg")),
      );
      for (const appearance of ["dark", "light"]) {
        if (
          (await page.locator("html").getAttribute("data-theme")) !== appearance
        )
          await page
            .getByRole("button", { name: `Switch to ${appearance} theme` })
            .click();
        const cards = [];
        for (const project of projects) {
          const card = page.locator(`[data-project="${project.id}"]`);
          const expected = selectedAssets.get(project.id);
          assert(expected, `Missing image evidence for ${project.id}`);
          const image = card.locator("img");
          let currentSrc = null;
          if (expected.selected === "placeholder") {
            assert.equal(await image.count(), 0);
          } else {
            await image.scrollIntoViewIfNeeded();
            await image.evaluate((element) => element.decode());
            currentSrc = await image.evaluate((element) => element.currentSrc);
            const variants = imageAssets.get(expected.source)?.variants;
            assert(
              variants?.some(
                (variant) => variant.src === new URL(currentSrc).pathname,
              ),
              `Wrong image for ${project.id}`,
            );
          }
          cards.push({
            id: project.id,
            selected: expected.selected,
            currentSrc,
          });
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        const screenshot = `gallery-${width}-${appearance}.png`;
        await page.screenshot({
          path: path.join(screenshotDirectory, screenshot),
          fullPage: true,
        });
        views.push({ width, appearance, icon, cards, screenshot });
      }
      await page.goto(url.origin + "/games/");
      await page.waitForURL(url.origin + galleryPath);
      await page.reload();
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        "light",
      );
      assert.equal(await page.locator(".wordmark").innerText(), "Possibility");
      await page.locator(".work").last().scrollIntoViewIfNeeded();
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((i) => i.decode());
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(failed, []);
    fs.mkdirSync(path.join(root, ".artifacts"), { recursive: true });
    fs.writeFileSync(
      path.join(root, ".artifacts/site-smoke.json"),
      JSON.stringify(
        {
          url: target,
          local,
          sourceCommit: buildInfo.sourceCommit,
          browser: browser.version(),
          widths: [390, 1440],
          views,
          errors,
          failed,
          passed: true,
        },
        null,
        2,
      ) + "\n",
    );
    console.log(local ? "Local" : "Public", "browser smoke passed.");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

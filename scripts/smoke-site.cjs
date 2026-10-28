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
    failed = [];
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(r.status() + " " + r.url());
      });
      await page.goto(url.origin + "/");
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
      await page.getByRole("button", { name: "Switch to light theme" }).click();
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
          browser: browser.version(),
          widths: [390, 1440],
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

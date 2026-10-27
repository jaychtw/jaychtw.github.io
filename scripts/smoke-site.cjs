const { chromium } = require("playwright");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."),
  site = JSON.parse(fs.readFileSync(path.join(root, "content/site.json")));
const target = process.argv[2] || site.canonicalOrigin;
const url = new URL(target);
const local = process.argv.includes("--local");
if (local)
  assert(
    url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname),
  );
else assert.equal(url.origin, site.canonicalOrigin);
const expected = JSON.parse(
  fs.readFileSync(path.join(root, "content/projects.json")),
).filter((p) => p.status === "published" && p.featured).length;
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
      assert.equal(await page.locator("h1").innerText(), "Possibility");
      assert.equal(await page.locator(".work-link").count(), expected);
      await page.mouse.wheel(0, 600);
      await page.waitForFunction(() => scrollY > 300);
      await page.goto(url.origin + "/games/");
      await page.reload();
      assert.equal(await page.locator(".wordmark").innerText(), "Possibility");
      await page.locator(".work").last().scrollIntoViewIfNeeded();
      await page
        .locator("img")
        .evaluateAll((xs) => Promise.all(xs.map((i) => i.decode())));
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

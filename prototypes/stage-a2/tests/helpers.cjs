const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, '../../docs/stage-a2/revision-2/evidence');
const cache = path.join(root, '.cache');
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(cache, { recursive: true });
const browserEnv = { ...process.env, XDG_CONFIG_HOME: path.join(cache, 'config'), XDG_CACHE_HOME: path.join(cache, 'cache') };
async function launch() {
  return chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'], env: browserEnv });
}
async function startServer(port, directory = root) {
  const base = `http://127.0.0.1:${port}`;
  let occupied = false;
  try { await fetch(base); occupied = true; } catch {}
  if (occupied) throw new Error(`Port ${port} is already in use; stop that preview or use another port.`);
  const child = spawn('python3', ['serve.py', '--port', String(port)], { cwd: directory, stdio: 'ignore' });
  for (let i = 0; i < 40; i++) {
    if (child.exitCode !== null) throw new Error(`Preview server exited: ${child.exitCode}`);
    try { const r = await fetch(base); if (r.ok) return { child, base }; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  child.kill('SIGTERM');
  throw new Error('Preview did not become ready.');
}
async function ready(page) {
  await page.waitForSelector('.gallery[data-ready="true"]');
  await page.locator('.work').last().scrollIntoViewIfNeeded();
  await page.locator('.work img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
  await page.evaluate(() => scrollTo(0, 0));
}
async function setTime(page, ms) {
  await page.evaluate(ms => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; } }, ms);
}
module.exports = { root, output, cache, browserEnv, launch, startServer, ready, setTime };

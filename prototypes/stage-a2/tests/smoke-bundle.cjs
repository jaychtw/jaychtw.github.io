const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const os=require('node:os');
const {spawn,execFileSync}=require('node:child_process');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'), docs=path.resolve(root,'../../docs/stage-a2');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'possibility-a2-bundle-'));
let server,browser;
(async()=>{
 execFileSync('python3',['-c',"from zipfile import ZipFile; from pathlib import Path; import sys; root=Path(sys.argv[2]).resolve(); z=ZipFile(sys.argv[1]); assert z.testzip() is None; assert all((root/m.filename).resolve().is_relative_to(root) for m in z.infolist()); z.extractall(root)",path.join(docs,'Possibility-Stage-A2.zip'),temporary]);
 const extracted=path.join(temporary,'Possibility-Stage-A2');
 server=spawn('python3',['serve.py','--port','8767'],{cwd:extracted,stdio:'ignore'});
 for(let i=0;i<40;i++){try{await fetch('http://127.0.0.1:8767/');break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox'],env:{...process.env,XDG_CONFIG_HOME:path.join(root,'.cache/config'),XDG_CACHE_HOME:path.join(root,'.cache/cache')}});
 const cases=[];
 for(const [light,pattern] of [['window','drift'],['diffuse','drift'],['window','cadence']]){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:8767/?light=${light}&pattern=${pattern}`);
  assert.equal(await page.locator('h1').innerText(),'Possibility');
  assert.equal(await page.locator('.contact').getAttribute('href'),'mailto:jay.yc.chen@gmail.com');
  await page.locator('.explore').click();await page.waitForSelector('.gallery[data-ready]');
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  assert.equal(await page.locator('.work-link').count(),4);
  assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth===640&&i.naturalHeight===640)));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.reload();await page.waitForSelector('.gallery[data-ready]');
  await page.locator('.wordmark').click();await page.waitForURL(u=>u.pathname==='/');assert.deepEqual(errors,[]);
  cases.push({light,pattern,passed:true,scope:'Extracted archive: landing/email, Explore, four decoded local images, gallery refresh, return navigation.'});
  await page.close();
 }
 fs.writeFileSync(path.join(docs,'evidence/bundle-smoke.json'),JSON.stringify({browser:browser.version(),cases,failures:0},null,2)+'\n');
 console.log('Standalone archive browser smoke: 3/3 variant/navigation cases passed.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(server)server.kill('SIGTERM');fs.rmSync(temporary,{recursive:true,force:true});});

/* Browser evidence for the isolated POC; never starts or dispatches deployment. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawn, execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, '../../docs/stage-a2/evidence');
const cache = path.resolve(root, '.cache');
fs.mkdirSync(output, { recursive: true }); fs.mkdirSync(cache, { recursive: true });
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json')));
const widths = [320, 390, 768, 1024, 1440];
const results = { scope: 'Local Chromium POC; no physical-device, Safari/Firefox, or live-browser game claims.', cases: [], contrast: [], accessibility: [], performance: [], fixtureCases: [] };
const failures = [];
const server = spawn('python3', ['serve.py', '--port', '8766'], { cwd: root, stdio: ['ignore', 'ignore', 'pipe'] });
let serverError = ''; server.stderr.on('data', x => { if (x.toString().includes('Address already in use')) serverError += x; });
let browser;
const base = 'http://127.0.0.1:8766';
const pngFiles = [];
async function screenshot(page, name, fullPage = true) { await page.screenshot({ path: path.join(output, name), fullPage }); pngFiles.push(name); }
async function galleryReady(page) {
  await page.waitForSelector('.gallery[data-ready="true"]');
  await page.locator('.work img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
}
async function geometry(page, expectedCount) {
  return page.evaluate(expectedCount => {
    const gallery = document.querySelector('.gallery');
    const tiles = [...gallery.querySelectorAll('.work-link')];
    const images = [...gallery.querySelectorAll('img')];
    const rects = tiles.map(i => { const r=i.getBoundingClientRect(); return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; });
    const overlap = rects.some((r,i) => rects.slice(i+1).some(s => r.x<s.right && r.right>s.x && r.y<s.bottom && r.bottom>s.y));
    return { count:tiles.length, expectedCount, overflow:document.documentElement.scrollWidth>innerWidth, overlap, square:images.every(i => Math.abs(i.getBoundingClientRect().width-i.getBoundingClientRect().height)<.1), loaded:images.every(i=>i.complete&&i.naturalWidth>0), offset:rects.length<2 || Math.abs(rects[0].y-rects[1].y)>10, background:getComputedStyle(document.body).backgroundColor, rects };
  }, expectedCount);
}
function checkGeometry(data) { assert.equal(data.count, data.expectedCount); assert.equal(data.overflow,false); assert.equal(data.overlap,false); assert.equal(data.square,true); assert.equal(data.loaded,true); assert.equal(data.offset,true); assert.equal(data.background,'rgb(255, 255, 255)'); }
async function setTime(page, time) { await page.evaluate(time => { for(const a of document.getAnimations()){a.pause();a.currentTime=time;} }, time); }
async function a11y(page, label) {
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const scan=await page.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
  const violations=scan.violations.map(({id,impact,description,nodes})=>({id,impact,description,targets:nodes.map(n=>n.target)}));
  results.accessibility.push({label, violations, incomplete:scan.incomplete.map(({id,impact})=>({id,impact}))});
  assert.equal(violations.length,0,label+' axe violations');
}
function luminance(r,g,b) { return [r,g,b].map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0); }
function minContrast(buffer, rects) {
  const png=PNG.sync.read(buffer), text=luminance(50,46,41);let min=100;
  for(const r of rects) for(let y=Math.max(0,Math.floor(r.y));y<Math.min(png.height,Math.ceil(r.y+r.height));y+=4) for(let x=Math.max(0,Math.floor(r.x));x<Math.min(png.width,Math.ceil(r.x+r.width));x+=4){const i=(y*png.width+x)*4;const l=luminance(png.data[i],png.data[i+1],png.data[i+2]);min=Math.min(min,(Math.max(l,text)+.05)/(Math.min(l,text)+.05));}
  return min;
}
(async()=>{
  for(let i=0;i<40;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
  assert.equal(serverError,'','POC test port must be free');
  browser=await chromium.launch({ executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium', headless:true, args:['--no-sandbox'], env:{...process.env,XDG_CONFIG_HOME:path.join(cache,'config'),XDG_CACHE_HOME:path.join(cache,'cache')} });
  results.browser=browser.version(); results.playwright=require('playwright/package.json').version;results.axe=require('axe-core/package.json').version;
  for(const light of ['diffuse','window']) for(const width of widths){
    const page=await browser.newPage({ viewport:{width,height:width<600?844:960} });
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto(`${base}/?light=${light}&pattern=drift`); assert.equal(response.status(),200);
    assert.equal(await page.locator('h1').innerText(),'Possibility');
    assert.equal(await page.locator('a').count(),2);
    assert.equal(await page.locator('.contact').getAttribute('href'),'mailto:jay.yc.chen@gmail.com');
    const layout=await page.evaluate(()=>{const h=document.querySelector('h1').getBoundingClientRect(),mail=document.querySelector('.contact').getBoundingClientRect(),ex=document.querySelector('.explore').getBoundingClientRect();return {centerX:Math.abs(h.x+h.width/2-innerWidth/2),centerY:Math.abs(h.y+h.height/2-innerHeight/2),overflow:document.documentElement.scrollWidth>innerWidth,noOverlap:h.bottom<mail.top && mail.bottom<ex.top,emailVisible:mail.right<=innerWidth&&mail.left>=0,animations:document.getAnimations().map(a=>({duration:a.effect.getTiming().duration,iterations:a.effect.getTiming().iterations}))};});
    assert(layout.centerX<1&&layout.centerY<1);assert.equal(layout.overflow,false);assert(layout.noOverlap&&layout.emailVisible);assert.equal(layout.animations.length,3);assert(layout.animations.every(a=>a.duration>=80000));
    const rects=await page.locator('h1,.contact,.explore').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
    await page.locator('main').evaluate(e=>e.style.visibility='hidden');
    let worst=100;
    // The three alternate periods (80,120,160s) repeat together after 960s.
    for(let t=0;t<=960000;t+=40000){await setTime(page,t);const b=await page.screenshot();worst=Math.min(worst,minContrast(b,rects));}
    assert(worst>=4.5,`${light}/${width} minimum sampled text contrast ${worst}`);
    results.contrast.push({light,width,minimumSampledRatio:worst,samples:25,cycleSeconds:960,scope:'Actual background pixels sampled every 40s under all three text/link boxes, at 4px intervals; not continuous mathematical certification.'});
    await page.locator('main').evaluate(e=>e.style.visibility='');await setTime(page,80000);
    if([390,1440].includes(width)) {await screenshot(page,`landing-${light}-${width}.png`,false);await a11y(page,`landing-${light}-${width}`);}
    results.cases.push({type:'landing',light,width,...layout,errors});assert.deepEqual(errors,[]);await page.close();
  }
  for(const light of ['diffuse','window']){
    const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await page.goto(`${base}/?light=${light}`);assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
    const a=await page.screenshot();await page.waitForTimeout(180);const b=await page.screenshot();assert(a.equals(b));await screenshot(page,`reduced-${light}-390.png`,false);
    results.cases.push({type:'reduced-motion',light,width:390,animations:0,identicalFrames:true});await page.close();
  }
  for(const pattern of ['drift','cadence']) for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:width<600?844:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/games/?pattern=${pattern}`);await galleryReady(page);
    const data=await geometry(page,4);checkGeometry(data);
    assert.deepEqual(await page.locator('.work h2').allTextContents(),catalog.map(x=>x.title));
    assert.deepEqual(await page.locator('.work a').evaluateAll(xs=>xs.map(x=>x.href)),catalog.map(x=>x.destination));
    assert.equal(await page.locator('.work p,.work button,.work time').count(),0);
    assert.deepEqual((await page.locator('body').innerText()).trim().split('\n').map(x=>x.trim()).filter(Boolean),['Possibility','Games',...catalog.map(x=>x.title)]);
    await page.reload();await galleryReady(page);checkGeometry(await geometry(page,4));
    if([390,1440].includes(width)){await screenshot(page,`gallery-${pattern}-${width}.png`);await a11y(page,`gallery-${pattern}-${width}`);}
    const perf=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation')[0].duration,resources:performance.getEntriesByType('resource').filter(e=>!e.name.includes('favicon')).map(e=>({url:e.name,transfer:e.transferSize,decoded:e.decodedBodySize}))}));
    assert(perf.resources.every(r=>r.url.startsWith(base)));results.performance.push({pattern,width,...perf});
    results.cases.push({type:'gallery',pattern,width,...data,errors});assert.deepEqual(errors,[]);await page.close();
  }
  // Geometry stress fixtures exist only in this test process, not the catalog or app.
  for(const pattern of ['drift','cadence']) for(const count of [3,4,5,8,12]) for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:width<600?844:960}});await page.goto(`${base}/games/?pattern=${pattern}`);await galleryReady(page);
    await page.evaluate(count=>{const g=document.querySelector('.gallery');g.replaceChildren();g.classList.toggle('many',count>4);for(let i=0;i<count;i++){const li=document.createElement('li');li.className='work';const a=document.createElement('a');a.className='work-link';a.href='#fixture-'+i;const img=document.createElement('img');img.src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><path fill="#e8e6e1" d="M0 0h640v640H0z"/></svg>');img.alt='Neutral layout fixture, not a project';const h=document.createElement('h2');h.textContent='Layout fixture '+String(i+1).padStart(2,'0')+(i===2?' with a deliberately longer wrapping title':'');a.append(img,h);li.append(a);g.append(li);}},count);
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
    const data=await geometry(page,count);checkGeometry(data);results.fixtureCases.push({pattern,count,width,...data});
    if([390,1440].includes(width)&&[3,5,8,12].includes(count))await screenshot(page,`fixture-${pattern}-${count}-${width}.png`);
    await page.close();
  }
  for(const touch of [false,true]){
    const context=await browser.newContext({hasTouch:touch,viewport:{width:390,height:844}});const page=await context.newPage();
    await page.goto(`${base}/?light=window&pattern=cadence`);
    if(touch)await page.locator('.explore').tap();else {await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('href'),'mailto:jay.yc.chen@gmail.com');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('aria-label'),'Explore the portfolio');assert.equal(await page.locator(':focus').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');await screenshot(page,'landing-keyboard-focus-390.png',false);await page.keyboard.press('Enter');}
    await galleryReady(page);assert(page.url().includes('light=window')&&page.url().includes('pattern=cadence'));
    await page.reload();await galleryReady(page);
    if(!touch){await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Possibility');for(const entry of catalog){await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('href'),entry.destination);assert.equal(await page.locator(':focus').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');}await screenshot(page,'gallery-keyboard-focus-390.png');}
    await page.locator('.wordmark').click();await page.waitForURL(url=>url.pathname==='/');assert.equal(await page.locator('h1').innerText(),'Possibility');results.cases.push({type:touch?'touch-navigation':'keyboard-navigation',passed:true,variantPreserved:true});await context.close();
  }
  // Pointer discovery is checked separately from keyboard and touch.
  const pointer=await browser.newPage();await pointer.goto(base);await pointer.locator('.explore').click();await galleryReady(pointer);results.cases.push({type:'pointer-navigation',passed:true});await pointer.close();
  // A failed optional thumbnail keeps the title and link usable.
  const missing=await browser.newPage();await missing.route('**/assets/republic-of-chickens.webp',r=>r.abort());await missing.goto(`${base}/games/`);await missing.waitForSelector('.gallery[data-ready]');assert.equal(await missing.locator('.work-link').first().innerText(),'Republic of Chickens');assert.equal(await missing.locator('.work-link').first().getAttribute('href'),catalog[0].destination);results.cases.push({type:'image-failure',titleAndLinkRetained:true});await missing.close();
  // Actual CSS rendering sampled at 2s intervals; encoded later at 20x speed.
  const frames=path.join(cache,'motion');fs.mkdirSync(frames,{recursive:true});
  const motion=await browser.newPage({viewport:{width:960,height:600}});let frame=0;
  for(const light of ['diffuse','window']){await motion.goto(`${base}/?light=${light}`);for(let t=0;t<160000;t+=2000){await setTime(motion,t);await motion.screenshot({path:path.join(frames,`frame-${String(frame++).padStart(3,'0')}.png`)});}}
  await motion.close();
  execFileSync('ffmpeg',['-y','-loglevel','error','-framerate','10','-i',path.join(frames,'frame-%03d.png'),'-vf',"drawtext=text='Diffuse light / 20x review playback':x=24:y=24:fontsize=16:fontcolor=0x322e29:enable='lt(t,8)',drawtext=text='Window shadows / 20x review playback':x=24:y=24:fontsize=16:fontcolor=0x322e29:enable='gte(t,8)'",'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',path.join(output,'daylight-motion-20x.mp4')]);
  results.motion={file:'daylight-motion-20x.mp4',scope:'Actual Chromium CSS frames sampled every 2 animation seconds; 10fps, 20x review playback. 8s per variant. Not a real-time frame-rate benchmark.'};
  results.summary={productCases:results.cases.length,fixtureCases:results.fixtureCases.length,axeScans:results.accessibility.length,contrastCases:results.contrast.length,screenshots:pngFiles.length,failures:0};
})().catch(e=>{failures.push(e.stack);process.exitCode=1;}).finally(async()=>{results.failures=failures;fs.writeFileSync(path.join(output,'browser-checks.json'),JSON.stringify(results,null,2)+'\n');if(browser)await browser.close();server.kill('SIGTERM');console.log(JSON.stringify({summary:results.summary,failures},null,2));});

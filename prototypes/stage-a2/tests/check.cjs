const { root, output, launch, startServer, ready, setTime } = require('./helpers.cjs');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { PNG } = require('pngjs');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json')));
const widths = [320, 390, 768, 1024, 1440];
const report = { scope: 'Revision 2 local Chromium checks, not physical-device or live-game browser coverage.', cases: [], contrast: [], accessibility: [], fixtureCases: [] };
let browser, server;
async function shot(page, name, fullPage = false) { await page.screenshot({ path: path.join(output, name), fullPage }); }
async function geometry(page, count) {
  const g = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('.work-link')];
    const rects = tiles.map(e => { const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}; });
    return { count:tiles.length, overflow:document.documentElement.scrollWidth>innerWidth, square:[...document.querySelectorAll('.work img')].every(i=>Math.abs(i.getBoundingClientRect().width-i.getBoundingClientRect().height)<.1), overlap:rects.some((r,i)=>rects.slice(i+1).some(s=>r.x<s.right&&r.right>s.x&&r.y<s.bottom&&r.bottom>s.y)), offset:Math.abs(rects[0].y-rects[1].y)>10, background:getComputedStyle(document.querySelector('.portfolio')).backgroundColor, snap:[getComputedStyle(document.documentElement).scrollSnapType,getComputedStyle(document.body).scrollSnapType], rects };
  });
  assert.equal(g.count,count); assert(g.square&&g.offset&&!g.overflow&&!g.overlap); assert.equal(g.background,'rgb(255, 255, 255)'); assert.deepEqual(g.snap,['none','none']);
  return g;
}
async function axe(page,label) {
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const scan=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
  const violations=scan.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));
  report.accessibility.push({label,violations,incomplete:scan.incomplete.map(v=>({id:v.id,impact:v.impact}))});
  assert.deepEqual(violations,[]);
}
const lum = rgb => rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
function sampledContrast(buffer,rects){
  const p=PNG.sync.read(buffer); let minimum=100;
  for(const r of rects)for(let y=Math.max(0,Math.floor(r.y));y<Math.min(p.height,Math.ceil(r.y+r.height));y+=5)for(let x=Math.max(0,Math.floor(r.x));x<Math.min(p.width,Math.ceil(r.x+r.width));x+=5){const i=(y*p.width+x)*4;minimum=Math.min(minimum,contrast([p.data[i],p.data[i+1],p.data[i+2]],[50,46,41]));}
  return minimum;
}
(async()=>{
  server=await startServer(8768);browser=await launch(); const base=server.base;
  report.browser=browser.version();report.playwright=require('playwright/package.json').version;report.axe=require('axe-core/package.json').version;
  for(const light of ['window','diffuse'])for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:width<600?844:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/?light=${light}`);await ready(page);
    assert.equal(await page.locator('.scene-content').innerText(),'Possibility\njay.yc.chen@gmail.com');
    assert.equal(await page.locator('.contact').getAttribute('href'),'mailto:jay.yc.chen@gmail.com');
    assert.equal(await page.locator('.scroll-cue').getAttribute('href'),'#portfolio');assert.equal(await page.getByText('Explore',{exact:true}).count(),0);
    const before=await page.locator('h1').boundingBox();await setTime(page,9000);const after=await page.locator('h1').boundingBox();assert.deepEqual(before,after);
    const layout=await page.evaluate(()=>{const s=document.querySelector('.landing-scene').getBoundingClientRect(),p=document.querySelector('#portfolio').getBoundingClientRect(),h=document.querySelector('h1').getBoundingClientRect();return {sceneHeight:s.height,viewport:innerHeight,portfolioTop:p.y,titleCenter:[h.x+h.width/2,h.y+h.height/2],viewportCenter:[innerWidth/2,innerHeight/2],animations:document.getAnimations().map(a=>a.animationName)};});
    assert(Math.abs(layout.sceneHeight-layout.viewport)<1&&Math.abs(layout.portfolioTop-layout.sceneHeight)<1);assert.deepEqual(layout.titleCenter,layout.viewportCenter);assert.equal(layout.animations.length,5);
    const d0=await page.locator('.vertical-edge').evaluate(e=>getComputedStyle(e).d);await setTime(page,17000);const d1=await page.locator('.vertical-edge').evaluate(e=>getComputedStyle(e).d);assert.notEqual(d0,d1,'Glass edges must actually morph');
    await setTime(page,0);const b0=await page.locator('.illumination').evaluate(e=>getComputedStyle(e).opacity);await setTime(page,7000);const b1=await page.locator('.illumination').evaluate(e=>getComputedStyle(e).opacity);assert.notEqual(b0,b1);
    const rects=await page.locator('h1,.contact,.scroll-cue').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
    await page.locator('.scene-content').evaluate(e=>e.style.visibility='hidden');let minimum=100;
    for(let t=0;t<=120000;t+=5000){await setTime(page,t);minimum=Math.min(minimum,sampledContrast(await page.screenshot(),rects));}
    assert(minimum>=4.5);
    // Conservative bound for ALL phases: darkest base stop plus both full-alpha
    // shadow paths. Bright overlays, blur and edge antialiasing only raise this bound.
    const colors=await page.evaluate(()=>({base:[...getComputedStyle(document.querySelector('.daylight')).backgroundImage.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)].map(m=>m.slice(1).map(Number)),shadows:[...document.querySelectorAll('.glass-edge')].map(e=>({rgb:getComputedStyle(e).fill.match(/\d+/g).map(Number),alpha:Number(getComputedStyle(e).opacity)}))}));
    let bound=[0,1,2].map(i=>Math.min(...colors.base.map(c=>c[i])));
    for(const s of colors.shadows)bound=bound.map((c,i)=>c*(1-s.alpha)+s.rgb[i]*s.alpha);
    const boundRatio=contrast(bound.map(Math.floor),[50,46,41]);assert(boundRatio>=4.5);
    report.contrast.push({light,width,minimumSampledRatio:minimum,samples:25,intervalSeconds:5,rangeSeconds:120,conservativeAllPhaseRatio:boundRatio,boundRGB:bound.map(Math.floor),scope:'Actual rendered background sampling, plus conservative source-color/full-shadow compositing bound for this CSS. Not general WCAG certification.'});
    await page.locator('.scene-content').evaluate(e=>e.style.visibility='');await setTime(page,9000);
    if([390,1440].includes(width)){await shot(page,`landing-${light}-${width}.png`);await shot(page,`continuous-${light}-${width}.png`,true);await axe(page,`continuous-${light}-${width}`);}
    await page.mouse.wheel(0,333);await page.waitForFunction(()=>scrollY>100);assert.equal(new URL(page.url()).hash,'');const y=await page.evaluate(()=>scrollY);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>scrollY),y);
    await page.locator('#portfolio').scrollIntoViewIfNeeded();const g=await geometry(page,4);assert.deepEqual(await page.locator('.work-title').allTextContents(),catalog.map(e=>e.title));
    if([390,1440].includes(width)&&light==='window')await shot(page,`scrolled-portfolio-${width}.png`);
    assert.deepEqual(errors,[]);report.cases.push({type:'continuous-page',light,width,...layout,stationaryTitle:true,morphChanged:true,brightnessChanged:true,naturalScroll:true,...g});await page.close();
  }
  for(const route of ['/','/games/'])for(const pattern of ['drift','cadence'])for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:width<600?844:960}});await page.goto(`${base}${route}?pattern=${pattern}`);await ready(page);const g=await geometry(page,4);
    assert.deepEqual(await page.locator('.work a').evaluateAll(xs=>xs.map(x=>x.href)),catalog.map(x=>x.destination));assert.equal(await page.locator('.work p,.work button,.work time').count(),0);
    await page.reload();await ready(page);await geometry(page,4);
    if(route==='/games/'&&[390,1440].includes(width)){await shot(page,`gallery-${pattern}-${width}.png`,true);await axe(page,`direct-${pattern}-${width}`);}
    report.cases.push({type:'gallery-route',route,pattern,width,...g,reloadPassed:true});await page.close();
  }
  for(const width of [390,1440]){
    const page=await browser.newPage({viewport:{width,height:width===390?844:960},reducedMotion:'reduce'});await page.goto(base);await ready(page);assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
    const a=await page.screenshot();await page.waitForTimeout(200);const b=await page.screenshot();assert(a.equals(b));await shot(page,`reduced-${width}.png`);await page.mouse.wheel(0,500);await page.waitForFunction(()=>scrollY>200);report.cases.push({type:'reduced-motion',width,identicalFrames:true,scrollStillWorks:true});await page.close();
  }
  // Actual keyboard: PageDown discovers work, cue Enter focuses section, then tab to tiles.
  const keyboard=await browser.newPage({viewport:{width:390,height:844}});await keyboard.goto(base);await ready(keyboard);await keyboard.keyboard.press('PageDown');await keyboard.waitForFunction(()=>scrollY>300);await keyboard.evaluate(()=>scrollTo(0,0));await keyboard.keyboard.press('Tab');assert.equal(await keyboard.locator(':focus').getAttribute('href'),'mailto:jay.yc.chen@gmail.com');await keyboard.keyboard.press('Tab');assert.equal(await keyboard.locator(':focus').getAttribute('aria-label'),'Scroll to portfolio');assert.equal(await keyboard.locator(':focus').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');await keyboard.keyboard.press('Enter');await keyboard.waitForURL(u=>u.hash==='#portfolio');for(const item of catalog){await keyboard.keyboard.press('Tab');assert.equal(await keyboard.locator(':focus').getAttribute('href'),item.destination);assert.equal(await keyboard.locator(':focus').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');}await shot(keyboard,'keyboard-focus-390.png');report.cases.push({type:'keyboard',pageDownDiscovers:true,cueAndTabOrder:true});await keyboard.close();
  const touchContext=await browser.newContext({hasTouch:true,viewport:{width:390,height:844}});const touch=await touchContext.newPage();await touch.goto(base);await ready(touch);const cdp=await touchContext.newCDPSession(touch);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:700}]});for(let y=670;y>=190;y-=30)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.waitForFunction(()=>scrollY>200);assert.equal(new URL(touch.url()).hash,'');report.cases.push({type:'touch-swipe',scrollsWithoutNavigation:true});await touchContext.close();
  for(const pattern of ['drift','cadence'])for(const count of [3,4,5,8,12])for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:844}});await page.goto(`${base}/games/?pattern=${pattern}`);await ready(page);
    await page.evaluate(count=>{const g=document.querySelector('.gallery');g.replaceChildren();g.classList.toggle('many',count>4);for(let i=0;i<count;i++){const li=document.createElement('li');li.className='work';const a=document.createElement('a');a.className='work-link';a.href='#fixture-'+i;const img=document.createElement('img');img.src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><path fill="#e8e6e1" d="M0 0h640v640H0z"/></svg>');const h=document.createElement('h2');h.className='work-title';h.textContent='Layout fixture '+i+(i===2?' with a longer wrapping label':'');a.append(img,h);li.append(a);g.append(li);}},count);await page.locator('img').evaluateAll(xs=>Promise.all(xs.map(i=>i.decode())));report.fixtureCases.push({pattern,count,width,...await geometry(page,count)});await page.close();
  }
  const missing=await browser.newPage();await missing.route('**/assets/republic-of-chickens.webp',r=>r.abort());await missing.goto(base);await missing.waitForSelector('.gallery[data-ready]');assert.equal(await missing.locator('.work-link').first().innerText(),catalog[0].title);report.cases.push({type:'missing-image',titleAndLinkRemain:true});await missing.close();
  report.summary={productCases:report.cases.length,fixtureCases:report.fixtureCases.length,axeScans:report.accessibility.length,contrastCases:report.contrast.length,failures:0};
})().catch(e=>{report.failure=e.stack;process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.child.kill('SIGTERM');fs.writeFileSync(path.join(output,'browser-checks.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({summary:report.summary,failure:report.failure},null,2));});

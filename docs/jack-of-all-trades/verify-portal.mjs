import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const base=process.argv[2]||'http://127.0.0.1:4177';
const live=base==='https://jaychtw.github.io';
const out='docs/jack-of-all-trades/'+(live?'public':'candidate');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const report={checkedAt:new Date().toISOString(),base,live,cases:[]};
try{
 for(const width of [390,1440])for(const theme of ['dark','light']){
 const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===390});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/');await page.evaluate(t=>{document.documentElement.dataset.theme=t;localStorage.setItem('possibility:theme',t)},theme);
 const card=page.locator('[data-project="jack-of-all-trades"]');assert.equal(await page.locator('[data-project]').first().getAttribute('data-project'),'jack-of-all-trades');assert.equal(await card.getAttribute('href'),'https://jaychtw.github.io/jack-of-all-trades/');assert.equal(await card.locator('h2').textContent(),'Jack of All Trades');
 const image=card.locator('img');await image.waitFor({state:'visible'});await page.waitForFunction(()=>{const i=document.querySelector('[data-project="jack-of-all-trades"] img');return i?.complete&&i.naturalWidth>0});const src=await image.evaluate(i=>i.currentSrc);assert.ok(src.includes('/assets/covers/games/jack-of-all-trades.'));assert.ok(await image.getAttribute('alt'));await card.screenshot({path:`${out}/card-${width}-${theme}.png`});
 await page.route('**/__test__/jack-axe.js',async route=>route.fulfill({contentType:'application/javascript',body:await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8')}));await page.addScriptTag({url:base+'/__test__/jack-axe.js'});const axe=await page.evaluate(async()=>await window.axe.run(document.querySelector('#project-grid'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(axe.violations,[]);
 await page.goto(base+'/games/jack-of-all-trades/');await page.locator('h1').filter({hasText:'Jack of All Trades'}).waitFor();assert.equal(await page.locator('html').getAttribute('data-theme'),theme);assert.ok((await page.locator('[lang="zh-TW"]').textContent()).includes('羅馬騎士'));const play=page.getByRole('link',{name:'Play Jack of All Trades',exact:true});assert.equal(await play.getAttribute('href'),'https://jaychtw.github.io/jack-of-all-trades/');await page.locator('.detail img').scrollIntoViewIfNeeded();await page.locator('.detail img').evaluate(i=>i.decode());await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`${out}/facts-${width}-${theme}.png`});
 if(live&&width===1440&&theme==='dark'){await play.focus();await page.keyboard.press('Enter');await page.waitForURL('https://jaychtw.github.io/jack-of-all-trades/');await page.locator('#start').click();await page.locator('#arena').waitFor({state:'visible'});await page.keyboard.press('5');await page.waitForTimeout(350);await page.screenshot({path:`${out}/play-game.png`});}
 assert.deepEqual(errors,[]);report.cases.push({width,theme,firstCard:true,approvedCover:src,localizedFactSheet:true,correctPlay:true,axeViolations:axe.violations.length,pageErrors:errors});await context.close();
 }
 report.status='Pass';await fs.writeFile(`${out}/verification.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}

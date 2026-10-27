const { launch, startServer, ready, output, root }=require('./helpers.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'possibility-a2-r2-'));let browser,server;
(async()=>{
 const archive=path.resolve(root,'../../docs/stage-a2/revision-2/Possibility-Stage-A2-Revision-2.zip');
 execFileSync('python3',['-c',"from zipfile import ZipFile; from pathlib import Path; import sys; root=Path(sys.argv[2]).resolve(); z=ZipFile(sys.argv[1]); assert z.testzip() is None; assert all((root/m.filename).resolve().is_relative_to(root) for m in z.infolist()); z.extractall(root)",archive,temporary]);
 server=await startServer(8767,path.join(temporary,'Possibility-Stage-A2-Revision-2'));browser=await launch();const base=server.base.replace('127.0.0.1','localhost'),cases=[];
 for(const query of ['','?light=diffuse&pattern=drift','?light=window&pattern=cadence']){
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/'+query);await ready(page);assert.equal(await page.locator('.contact').getAttribute('href'),'mailto:jay.yc.chen@gmail.com');
  await page.mouse.wheel(0,600);await page.waitForFunction(()=>scrollY>300);assert.equal(new URL(page.url()).pathname,'/');assert.equal(new URL(page.url()).hash,'');assert.equal(await page.locator('.work-link').count(),4);
  await page.goto(base+'/games/'+query);await ready(page);await page.reload();await ready(page);assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth===640)));
  await page.locator('.wordmark').click();await page.waitForURL(u=>u.pathname==='/');assert.deepEqual(errors,[]);cases.push({query,passed:true,continuousScroll:true,directGalleryRefresh:true,imagesDecoded:true});await page.close();
 }
 fs.writeFileSync(path.join(output,'bundle-smoke.json'),JSON.stringify({browser:browser.version(),cases,failures:0},null,2)+'\n');console.log('Revision-2 extracted ZIP: 3/3 localhost/scroll/direct-route smoke cases passed.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.child.kill('SIGTERM');fs.rmSync(temporary,{recursive:true,force:true});});

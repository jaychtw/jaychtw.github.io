const { output, cache, browserEnv, launch, startServer, setTime } = require('./helpers.cjs');
const { execFileSync } = require('node:child_process');
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
let browser,server;
function encode(input,outputFile,label,extra=[]){
 execFileSync('ffmpeg',['-y','-loglevel','error',...extra,'-i',input,'-vf',`drawtext=text='${label}':x=24:y=24:fontsize=16:fontcolor=0x322e29`,'-an','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',path.join(output,outputFile)],{env:browserEnv});
}
(async()=>{
 server=await startServer(8769);browser=await launch();
 const recordings=path.join(cache,'normal-r2');fs.rmSync(recordings,{recursive:true,force:true});fs.mkdirSync(recordings,{recursive:true});
 const context=await browser.newContext({viewport:{width:960,height:600}});
 const page=await context.newPage();await page.goto(server.base+'/?light=window');
 const first={title:await page.locator('h1').boundingBox(),edge:await page.locator('.vertical-edge').evaluate(e=>getComputedStyle(e).d)};
 // Native Chromium screencast timestamps preserve real elapsed time, even when
 // software rendering drops frames. No Playwright media download is needed.
 const cdp=await context.newCDPSession(page), captured=[];
 cdp.on('Page.screencastFrame',event=>{
   const file=path.join(recordings,`frame-${String(captured.length).padStart(4,'0')}.jpg`);
   fs.writeFileSync(file,Buffer.from(event.data,'base64'));
   captured.push({file,timestamp:event.metadata.timestamp});
   cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{});
 });
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:92,maxWidth:960,maxHeight:600,everyNthFrame:2});
 await page.waitForTimeout(12000);await page.screenshot({path:path.join(output,'normal-speed-midpoint.png')});await page.waitForTimeout(12000);
 await cdp.send('Page.stopScreencast');
 const last={title:await page.locator('h1').boundingBox(),edge:await page.locator('.vertical-edge').evaluate(e=>getComputedStyle(e).d)};
 assert.deepEqual(first.title,last.title);assert.notEqual(first.edge,last.edge);assert(captured.length>100);
 const recordedSpan=captured.at(-1).timestamp-captured[0].timestamp;assert(recordedSpan>22&&recordedSpan<30);
 const concat=['ffconcat version 1.0'];
 captured.forEach((f,i)=>{concat.push(`file '${f.file}'`);concat.push(`duration ${i<captured.length-1?captured[i+1].timestamp-f.timestamp:.04}`);});
 concat.push(`file '${captured.at(-1).file}'`);const listing=path.join(recordings,'frames.ffconcat');fs.writeFileSync(listing,concat.join('\n')+'\n');
 await context.close();
 encode(listing,'sunlight-normal-1x.mp4','Normal speed / 1x / original browser timestamps',['-f','concat','-safe','0']);
 const frames=path.join(cache,'accelerated-r2');fs.rmSync(frames,{recursive:true,force:true});fs.mkdirSync(frames,{recursive:true});
 const accelerated=await browser.newPage({viewport:{width:960,height:600}});await accelerated.goto(server.base+'/?light=window');
 for(let i=0;i<120;i++){await setTime(accelerated,i*1000);await accelerated.screenshot({path:path.join(frames,`frame-${String(i).padStart(3,'0')}.png`)});}
 await accelerated.close();
 encode(path.join(frames,'frame-%03d.png'),'sunlight-accelerated-10x.mp4','Accelerated review / 10x / not normal speed',['-framerate','10']);
 const probes={};for(const file of ['sunlight-normal-1x.mp4','sunlight-accelerated-10x.mp4'])probes[file]=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size','-of','json',path.join(output,file)]));
 fs.writeFileSync(path.join(output,'motion-proof.json'),JSON.stringify({browser:browser.version(),normal:{method:'Native Chromium screencast frames over 24 wall-clock seconds; original frame timestamps preserved by concat durations. No animation seeking or playback speed change.',capturedFrames:captured.length,recordedSpanSeconds:recordedSpan,...probes['sunlight-normal-1x.mp4']},accelerated:{method:'Actual CSS rendering sampled once per animation second for 120 seconds, encoded at 10fps: 10x.',...probes['sunlight-accelerated-10x.mp4']},stationaryTitle:true,changingEdge:true,first,last},null,2)+'\n');
 console.log('Normal-speed and 10x motion proofs encoded; title remained stationary.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(server)server.child.kill('SIGTERM');});

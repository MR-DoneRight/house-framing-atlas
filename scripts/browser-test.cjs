'use strict';

const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');

const sourceDir = path.resolve(__dirname,'..','src');
const work = path.resolve(__dirname,'..','build','qa');
const input = process.argv[2];
const bootstrap = input === '--bootstrap';
const software = process.argv.includes('--software');
const screenshotOnly = process.argv.includes('--screens');
const outputSuffix = software ? '-software' : '';
const uri = bootstrap ? 'data:text/html,<main>Browser%20test</main>' : input && pathToFileURL(path.resolve(input)).href;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function check(ok, message) { if (!ok) throw new Error(message); }
const errors = [];
const notices = [];
const externalRequests = new Set();

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.nextId = 1;
    this.promises = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, {once:true});
      this.ws.addEventListener('error', reject, {once:true});
    });
    this.ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.promises.has(msg.id)) {
        const [resolve,reject,timer] = this.promises.get(msg.id);
        this.promises.delete(msg.id);
        clearTimeout(timer);
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const details = msg.params.exceptionDetails;
        errors.push(details.exception?.description || details.text);
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error')
        errors.push(msg.params.args.map(a => a.description || a.value).join(' '));
      if (msg.method === 'Network.requestWillBeSent' && /^(?:https?:|wss?:)/i.test(msg.params.request.url))
        externalRequests.add(msg.params.request.url);
      if (msg.method === 'Log.entryAdded') {
        const entry = msg.params.entry;
        if (entry.level === 'error') errors.push(entry.text);
        else if (entry.level === 'warning') notices.push(entry.text);
      }
    });
  }
  command(method, params={}) {
    const id = this.nextId++;
    return new Promise((resolve,reject) => {
      const timer=setTimeout(()=>{this.promises.delete(id);reject(new Error('Timed out: '+method));},45000);
      this.promises.set(id,[resolve,reject,timer]);
      this.ws.send(JSON.stringify({id,method,params}));
    });
  }
  async evaluate(fn, ...args) {
    const expression = typeof fn === 'function' ? '('+fn.toString()+')(...'+JSON.stringify(args)+')' : fn;
    const r = await this.command('Runtime.evaluate', {expression, returnByValue:true, awaitPromise:true});
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  async settle() {
    await this.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  }
  async click(x, y) {
    await this.command('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});
    await this.command('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',buttons:1,clickCount:1});
    await this.command('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',buttons:0,clickCount:1});
    await this.settle();
  }
  async desktop() {
    await this.command('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
    await this.command('Emulation.setTouchEmulationEnabled',{enabled:false});
  }
  async mobile() {
    await this.command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await this.command('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
    await this.settle();
  }
  async screenshot(name) {
    const {data} = await this.command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
    const out=path.join(work,'qa-'+name+outputSuffix+'.png');
    await fs.writeFile(out,Buffer.from(data,'base64'));
    console.log('Screenshot '+out);
  }
}

async function makeBrowser() {
  const binaries=[
    process.env.QA_CHROME,
    path.join(process.env.ProgramFiles || 'C:/Program Files','Google','Chrome','Application','chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)','Microsoft','Edge','Application','msedge.exe')
  ];
  const binary = binaries.find(p=>p && existsSync(p));
  check(binary,'A local Chrome or Edge browser is required');
  const root=path.join(work,'qa-profile');
  await fs.mkdir(root,{recursive:true});
  const profile=await fs.mkdtemp(path.join(root,'run-'));
  const browser=spawn(binary,[
    '--headless=new','--remote-debugging-port=0','--user-data-dir='+profile,'--no-first-run',
    '--no-default-browser-check','--disable-extensions','--disable-component-update',
    '--disable-background-networking','--disable-sync','--noerrdialogs',
    '--enable-unsafe-swiftshader','--window-size=1440,960','about:blank'
  ],{windowsHide:true,stdio:['ignore','ignore','pipe']});
  let stderr='', launchError;
  browser.stderr.on('data',b=>{stderr=(stderr+b.toString()).slice(-5000);});
  browser.on('error',e=>{launchError=e;});
  try {
    let port;
    for(let i=0;i<150;i++){
      if(launchError || browser.exitCode !== null) throw Error((launchError?.message || 'Chrome exited '+browser.exitCode)+' '+stderr);
      try {port=Number((await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0]);} catch {}
      if(port) break;
      await pause(125);
    }
    check(port,'Chrome did not create its local DevTools port. '+stderr);
    const tabs=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
    const page=tabs.find(t=>t.type==='page');
    check(page,'No browser page target');
    const c=new Cdp(page.webSocketDebuggerUrl);
    await c.ready;
    await Promise.all([c.command('Runtime.enable'),c.command('Page.enable'),c.command('Log.enable'),c.command('Network.enable')]);
    await c.command('Network.setBlockedURLs',{urls:['http://*','https://*','ws://*','wss://*']});
    await c.desktop();
    if(software) await c.command('Page.addScriptToEvaluateOnNewDocument',{source:`
      const original=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(mode,...args){if(/^webgl|^experimental-webgl/.test(mode))return null;return original.call(this,mode,...args);}
    `});
    await c.command('Page.navigate',{url:uri});
    for(let i=0;i<100;i++){
      const loaded=await c.evaluate(()=>({state:document.readyState,url:location.href}));
      if(loaded.url===uri && loaded.state==='complete') break;
      await pause(100);
    }
    await c.settle();
    return {browser,c};
  } catch(err) {browser.kill();throw err;}
}

async function checkModel() {
  const sources = [];
  for (const filename of ['model.js','structure.js','envelope.js','roof.js','floortypes.js','roof-lines.js']) sources.push(await fs.readFile(path.join(sourceDir,filename),'utf8'));
  const result=vm.runInNewContext(sources.join('\n')+`
    (()=>{
      const used=new Set(pieces.map(p=>p.id));
      const scenes=[...new Set(pieces.map(p=>p.scene))];
      const missing=[...terms.values()].filter(t=>!used.has(t.id) || ![t.name,t.purpose,t.placement,t.importance].every(Boolean)).map(t=>t.id);
      const bad=pieces.filter(p=>!terms.has(p.id)||p.faces.length<4||p.verts.some(v=>v.some(n=>!Number.isFinite(n)))).map(p=>p.id);
      return {terms:terms.size,pieces:pieces.length,scenes,missing,bad};
    })()`);
  check(!result.missing.length&&!result.bad.length,'Invalid models or definitions: '+JSON.stringify(result));
  console.log(result.terms+' component definitions, '+result.pieces+' pickable 3D pieces, '+result.scenes.join(', '));
}
async function readUi(c) {
  return c.evaluate(()=>({
    title:document.title, headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>e.textContent.trim()),
    canvas:[...document.querySelectorAll('canvas')].map(e=>({id:e.id,w:e.width,h:e.height})),
    selects:[...document.querySelectorAll('select')].map(s=>({id:s.id,labels:[...s.options].map(o=>o.label)})),
    inputs:[...document.querySelectorAll('input')].map(i=>[i.id,i.type,i.placeholder]),
    buttons:[...document.querySelectorAll('button')].slice(0,30).map(b=>[b.id,b.getAttribute('aria-label'),b.innerText.trim().slice(0,40)])
  }));
}
async function pixelInfo(c) {
  return c.evaluate(()=>{
    const canvas=document.querySelector('canvas');
    if(!canvas) throw Error('No live 3D canvas');
    const r=canvas.getBoundingClientRect(), thumb=document.createElement('canvas');
    thumb.width=84;thumb.height=64;
    const ctx=thumb.getContext('2d');ctx.drawImage(canvas,0,0,84,64);
    const {data}=ctx.getImageData(0,0,84,64);
    const colors=new Set();let checksum=2166136261;
    const samples=[];
    for(let i=0;i<data.length;i+=4){
      const color=(data[i]<<16)|(data[i+1]<<8)|data[i+2];
      colors.add(color);
      checksum=Math.imul(checksum^color,16777619)>>>0;
      const px=(i/4)%84,py=Math.floor(i/4/84);
      const dist=Math.abs(data[i]-data[0])+Math.abs(data[i+1]-data[1])+Math.abs(data[i+2]-data[2]);
      if(px%4===0 && py%4===0 && px>10 && px<74 && py>8 && py<58 && dist>95) samples.push({x:r.left+(px+.5)*r.width/84,y:r.top+(py+.5)*r.height/64,dist});
    }
    return {w:r.width,h:r.height,colors:colors.size,checksum,samples};
  });
}
async function checkLayout(c) {
  const result=await c.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,canvas:document.querySelector('canvas')?.getBoundingClientRect().width}));
  check(result.scroll<=result.width+1,'Page overflows horizontally: '+JSON.stringify(result));
  check(result.canvas>200,'3D canvas is unusably small: '+JSON.stringify(result));
}

async function run() {
  check(uri,'Usage: node scripts/browser-test.cjs index.html [--software] [--screens]');
  const {c,browser}=await makeBrowser();
  try {
    if(bootstrap){console.log(await c.evaluate(()=>document.body.innerText));return;}
    await checkModel();
    await checkLayout(c);
    const desktop=await pixelInfo(c);
    check(desktop.colors>35 && desktop.samples.length>3,'Blank desktop 3D scene: '+JSON.stringify(desktop));
    await c.screenshot('desktop');
    if(!screenshotOnly) await interactions(c,desktop);
    await c.mobile();
    await c.command('Page.reload',{ignoreCache:true});
    for(let i=0;i<70;i++){
      try {if(await c.evaluate(()=>!!document.querySelector('canvas') && document.readyState==='complete'))break;} catch{}
      await pause(100);
    }
    await c.settle();await checkLayout(c);
    const mobile=await pixelInfo(c);
    check(mobile.colors>35 && mobile.samples.length>3,'Blank phone 3D scene');
    await c.screenshot('mobile');
    if(!screenshotOnly) await mobileInteractions(c,mobile);
    check(errors.length===0,errors.join('\n'));
    check(!externalRequests.size,'Page attempted to load external resources: '+[...externalRequests].join(', '));
    if(notices.length)console.log('Browser warnings: '+[...new Set(notices)].join(' / '));
    console.log('Passed desktop and mobile rendering and layout checks.');
  } finally {
    try {await c.command('Browser.close');} catch {}
    c.ws.close();
    setTimeout(()=>{if(browser.exitCode===null)browser.kill();},1500).unref();
  }
}
const roleKey=k=>'[data-role="'+k+'"]',action=k=>'[data-action="'+k+'"]';
async function clickControl(c,selector) {
  const center=await c.evaluate(s=>{
    const e=document.querySelector(s);if(!e)throw Error('Missing '+s);
    e.scrollIntoView({block:'nearest',inline:'nearest'});
    const r=e.getBoundingClientRect();
    if(r.width<1||r.height<1)throw Error('Hidden control: '+s);
    return {x:r.left+r.width/2,y:r.top+r.height/2};
  },selector);
  await c.click(center.x,center.y);
}
async function form(c,key,value,type='change'){
  await c.evaluate((sel,v,event)=>{
    const e=document.querySelector(sel);e.value=v;e.dispatchEvent(new Event(event,{bubbles:true}));
  },roleKey(key),value,type);
  await c.settle();
}
async function description(c) {
  const parts=await c.evaluate(()=>Object.fromEntries(['name','purpose','placement','importance','model-title','position'].map(k=>[k,document.querySelector('[data-role="'+k+'"]').textContent.trim()])));
  check(Object.values(parts).every(Boolean),'Incomplete description '+JSON.stringify(parts));
  return parts;
}
async function clickVisiblePiece(c,pixels,touch=false){
  const before=(await description(c)).name;
  const onScreen=pixels.samples.filter(p=>p.x>8&&p.y>8 && (!touch || p.x<382&&p.y<831));
  const order=Array.from({length:Math.min(20,onScreen.length)},(_,i)=>onScreen[Math.floor((i+.5)*onScreen.length/Math.min(20,onScreen.length))]);
  for (const p of order){
    if(touch) {
      await sendTouch(c,'touchStart',[[p.x,p.y]]);
      await sendTouch(c,'touchEnd',[]);await c.settle();
    }else await c.click(p.x,p.y);
    const after=(await description(c)).name;
    if(before!==after){console.log((touch?'Touch':'Mouse')+' picked '+after+' from model surface (was '+before+').');return after;}
  }
  throw Error((touch?'Touch':'Mouse')+' model surface did not change the selection');
}
async function interactions(c,desktop) {
  const start=await description(c);
  await clickVisiblePiece(c,desktop);
  const picked=await description(c);
  const asBuilt=(await pixelInfo(c)).checksum;
  await clickControl(c,action('isolate'));
  check((await description(c))['model-title']==='Isolated part','Isolate failed');
  check((await pixelInfo(c)).checksum!==asBuilt,'Isolation did not change visible geometry');
  await clickControl(c,action('isolate'));
  check((await description(c)).name===picked.name,'Restore assembly lost selection');
  const beforeRotate=(await pixelInfo(c)).checksum;
  await clickControl(c,action('left'));
  check((await pixelInfo(c)).checksum!==beforeRotate,'Rotate left had no visible effect');
  await clickControl(c,action('right'));await clickControl(c,action('plus'));
  const enlarged=(await pixelInfo(c)).checksum;
  await clickControl(c,action('minus'));
  check((await pixelInfo(c)).checksum!==enlarged,'Zoom controls had no visible effect');
  await clickControl(c,action('fit'));await clickControl(c,action('next'));
  check((await description(c)).name!==picked.name,'Next term did not advance');
  await clickControl(c,action('prev'));
  check((await description(c)).name===picked.name,'Previous term did not restore the term');
  await clickControl(c,action('guide'));
  check(await c.evaluate(()=>document.querySelector('[data-role=guide]').open),'Guide did not open');
  await clickControl(c,action('close-guide'));
  await clickControl(c,action('index'));
  const total=await c.evaluate(()=>document.querySelectorAll('button[data-term]').length);
  check(total>=100,'Term index incomplete');
  await form(c,'search','electronic-unmatched-example','input');
  check(await c.evaluate(()=>document.querySelectorAll('button[data-term]').length===0 && document.querySelector('[data-role=results]').innerText.includes('No matches')),'Empty search state failed');
  await form(c,'search','water seal','input');
  check(await c.evaluate(()=>!!document.querySelector('button[data-term="s-trap"]')),'Alias search did not find P-trap');
  await form(c,'index-group','roof');
  check(await c.evaluate(()=>!document.querySelector('button[data-term="s-trap"]')),'Index filter failed');
  await form(c,'index-group','all');await clickControl(c,'[data-term="s-trap"]');
  check((await description(c)).name==='P-trap','Index did not open chosen assembly and part');
  console.log('Index alias search, scope filtering, isolation, navigation, guide, camera zoom and rotation passed.');
  const groups=await c.evaluate(()=>Array.from(document.querySelectorAll('[data-role=systems] [data-group]'),e=>e.dataset.group));
  const actualScenes=new Set();
  for(const g of groups){
    await clickControl(c,'[data-role=systems] [data-group="'+g+'"]');
    const available=await c.evaluate(()=>Array.from(document.querySelector('[data-role=scene]').options,o=>o.value));
    for(const scene of available){
      if(available.length>1) await form(c,'scene',scene);
      const descriptionNow=await description(c);
      const state=await pixelInfo(c);
      check(state.colors>15, 'Scene '+g+'/'+scene+' has no rendered model');
      check(/^Term \d+ of [1-9]\d*$/.test(descriptionNow.position),'Invalid term navigation in '+scene);
      actualScenes.add(scene);
    }
  }
  check(groups.length===9 && actualScenes.size===10,'Missing section or detail '+groups.join('/')+' '+[...actualScenes].join('/'));
  console.log(groups.length+' top-level views and '+actualScenes.size+' distinct detail models navigated. Initial part '+start.name+'.');
}
async function sendTouch(c,type,coords) {
  await c.command('Input.dispatchTouchEvent',{type,touchPoints:coords.map(([x,y],i)=>({id:i+1,x,y,radiusX:3,radiusY:3,force:.8}))});
}
async function mobileInteractions(c,mobile) {
  await clickVisiblePiece(c,mobile,true);
  const bounds=await c.evaluate(()=>{const r=document.querySelector('[data-role=model]').getBoundingClientRect();return {x:r.left+r.width*.5,y:r.top+r.height*.5}});
  const {x,y}=bounds;
  check(y<800,'Model center off mobile screen');
  const beforeDrag=(await pixelInfo(c)).checksum;
  const chosen=(await description(c)).name;
  await sendTouch(c,'touchStart',[[x,y]]);
  await sendTouch(c,'touchMove',[[x+29,y+7]]);
  await sendTouch(c,'touchMove',[[x+54,y+13]]);
  await sendTouch(c,'touchEnd',[]);await c.settle();
  const afterDrag=(await pixelInfo(c)).checksum;
  check(afterDrag!==beforeDrag && (await description(c)).name===chosen,'One-finger orbit failed');
  await sendTouch(c,'touchStart',[[x-24,y],[x+24,y]]);
  await sendTouch(c,'touchMove',[[x-38,y],[x+38,y]]);
  await sendTouch(c,'touchMove',[[x-52,y],[x+52,y]]);
  await sendTouch(c,'touchEnd',[]);await c.settle();
  check((await pixelInfo(c)).checksum!==afterDrag && (await description(c)).name===chosen,'Two-finger pinch failed');
  await form(c,'system-select','interior');
  check((await description(c))['model-title']==='Stair assembly','Mobile section selection failed');
  console.log('Phone tap, one-finger orbit, two-finger pinch and mobile section selector passed.');
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1;});

const root=document.getElementById('framing-atlas');
const role=name=>root.querySelector('[data-role="'+name+'"]');
const embedded=root.classList.contains('inline-atlas');
for(const o of pieces){
  const t=terms.get(o.id);
  if(!t)throw Error('Part lacks a definition: '+o.id);
  t.scenes.add(o.scene);
}
for(const t of terms.values())if(!t.scenes.size)throw Error('Term lacks a part: '+t.id);
Object.assign(sceneNames,{slope:'Rafter seat & roof slope',engineered:'Engineered floor',rooflines:'Roof edges & faces'});
const groupScenes={
  all:['house'],foundation:['house'],floor:['house','engineered'],walls:['house'],
  roof:['house','junction','truss','slope'],roofing:['house','rooflines','flashing','junction'],
  exterior:['enclosure','house'],interior:['stairs','enclosure'],services:['services']
};
for(const g of Object.keys(groupScenes))groupScenes[g]=groupScenes[g].filter(s=>pieces.some(o=>o.scene===s));
const preferred={all:'common-rafter',foundation:'stem-wall',floor:'floor-joist',walls:'header',roof:'common-rafter',roofing:'field-shingle',exterior:'e-frame',interior:'i-stringer',services:'s-trap'};
const detailPreferred={junction:'valley-rafter',rooflines:'roof-valley',truss:'top-chord',slope:'birdsmouth',engineered:'i-joist',flashing:'step-flashing',stairs:'i-stringer',enclosure:'e-frame',services:'s-trap'};
const defaults={house:[.61,.34],enclosure:[.33,.23],stairs:[.38,.28],services:[.33,.22],truss:[.28,.20],slope:[.25,.23],junction:[.55,.49],rooflines:[.56,.48],flashing:[.56,.44],engineered:[.56,.32]};
let group='all',view='house',active=null,isolated=false,localParts=[],visible=[],viewTerms=[];
let yaw=.61,pitch=.34,zoom=1,pan=[0,0],bounds,fitScale=1,focus,cam,selectedPoint=null,drawPending=false,chooseBest=false;
let isTurning=false;
let canvas=role('model'),renderer;
try{renderer=createGlRenderer(canvas);}catch(e){console.warn('Using compatible 3D display mode.',e.message);}
if(!renderer){const replacement=canvas.cloneNode(false);canvas.replaceWith(replacement);canvas=replacement;renderer=createSoftwareRenderer(canvas);}
const stage=role('stage'),overlay=role('overlay'),overlayContext=overlay.getContext('2d');
canvas.addEventListener('webglcontextlost',e=>{
  e.preventDefault();
  const fresh=canvas.cloneNode(false);canvas.replaceWith(fresh);canvas=fresh;
  renderer=createSoftwareRenderer(canvas);renderer.set(visible,bounds);scheduleDraw();
},{once:true});
const groupEntries=Object.entries(groups);
function option(value,label){const o=document.createElement('option');o.value=value;o.textContent=label;return o;}
for(const [id,label] of groupEntries){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.group=id;
  role('systems').append(b);role('system-select').append(option(id,label));
  role('index-group').append(option(id,id==='all'?'All systems':label));
}
role('coverage').textContent=terms.size+' terms  /  '+(groupEntries.length-1)+' building systems';
function getScenePieces(g,s){
  return pieces.filter(o=>o.scene===s&&(g==='all'||s!=='house'||terms.get(o.id).group===g));
}
function centerCandidate(id){
  const candidates=localParts.filter(o=>o.id===id);
  const target=view==='house'?[1.8,3.4,2.7]:bounds?.center||[0,0,0];
  return candidates.sort((a,b)=>candidateScore(a,target)-candidateScore(b,target))[0];
}
function candidateScore(o,target){
  return Math.hypot(...sub(o.center,target))-.09*Math.max(...getBounds([o]).spans);
}
function connectedPart(start){
  const others=localParts.filter(o=>o.id===start.id),boxes=others.map(o=>getBounds([o]));
  const found=new Set([start]),queue=[others.indexOf(start)];
  while(queue.length){
    const i=queue.pop(),a=boxes[i];
    for(let j=0;j<others.length;j++){
      if(found.has(others[j]))continue;
      const b=boxes[j];
      if(a.lo.every((v,k)=>v<=b.hi[k]+.018&&a.hi[k]>=b.lo[k]-.018)){found.add(others[j]);queue.push(j);}
    }
  }
  return [...found];
}
function configureScene(g,s,id,instance=null){
  group=g;view=s;isolated=false;selectedPoint=null;
  localParts=getScenePieces(g,s);bounds=getBounds(localParts);
  const ids=new Set(localParts.map(o=>o.id));
  viewTerms=[...terms.values()].filter(t=>ids.has(t.id));
  const fallback=[id,detailPreferred[s],preferred[g],viewTerms[0].id].find(x=>ids.has(x));
  active=instance||centerCandidate(fallback);chooseBest=true;
  updateVisible();setControls();updateDescription();
}
function updateVisible(){
  visible=isolated?connectedPart(active):localParts;
  bounds=getBounds(visible);renderer.set(visible,bounds);resetCamera();
}
function resetCamera(){
  [yaw,pitch]=defaults[view]||defaults.house;
  if(view==='house'&&['floor','foundation'].includes(group))pitch=.48;
  if(group==='walls'&&view==='house')yaw=.49;
  if(isolated&&Math.max(...bounds.spans)<1)pitch=.37;
  zoom=1;pan=[0,0];measureFit();scheduleDraw();
}
function measureFit(){
  const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
  const perspective=getCamera(yaw,pitch);
  const x=[],y=[];
  for(const o of visible)for(const v of o.verts){x.push(dot(v,perspective.right));y.push(dot(v,perspective.up));}
  const lx=Math.min(...x),hx=Math.max(...x),ly=Math.min(...y),hy=Math.max(...y);
  const base=bounds.center;
  focus=add(add(base,mul(perspective.right,(lx+hx)*.5-dot(base,perspective.right))),mul(perspective.up,(ly+hy)*.5-dot(base,perspective.up)));
  fitScale=Math.min(w*(w<440?.91:.89)/Math.max(hx-lx,.06),h*.83/Math.max(hy-ly,.06));
}
function setControls(){
  for(const b of role('systems').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.group===group));
  role('system-select').value=group;
  const scenes=groupScenes[group];role('scene').replaceChildren(...scenes.map(s=>option(s,sceneNames[s])));
  role('scene').value=view;role('model-options').hidden=scenes.length<2;
  role('model-title').textContent=isolated?'Isolated part':view==='house'&&group!=='all'?groups[group]:sceneNames[view];
  role('scene-count').textContent=viewTerms.length+' terms in this view';
}
function updateDescription(){
  const t=terms.get(active.id);
  for(const k of ['name','purpose','placement','importance'])role(k).textContent=t[k];
  role('part-group').textContent=groups[t.group];role('isolate-text').textContent=isolated?'Show assembly':'Isolate this part';
  root.querySelector('[data-action="isolate"]').setAttribute('aria-pressed',String(isolated));
  role('position').textContent='Term '+(1+viewTerms.findIndex(x=>x.id===t.id))+' of '+viewTerms.length;
  canvas.setAttribute('aria-label',sceneNames[view]+'. Selected piece: '+t.name+'. Select pieces by tapping the model or choosing a term in the index.');
}
function scheduleDraw(){if(!drawPending){drawPending=true;requestAnimationFrame(draw);}}
function draw(){
  drawPending=false;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h||!focus)return;
  cam={...getCamera(yaw,pitch),w,h,scale:fitScale*zoom,center:focus,pan};
  const bg=embedded?themeColor():rgb('#e9efea');
  renderer.draw(cam,active.num,bg);
  if(chooseBest&&!isolated){
    chooseBest=false;
    const candidates=localParts.filter(o=>o.id===active.id);
    const target=active.center;
    candidates.sort((a,b)=>candidateScore(a,target)-candidateScore(b,target));
    outer:for(const ob of candidates.slice(0,32)){
      const samples=[ob.center,...ob.faces.filter(f=>dot(f.n,cam.forward)>.01).map(f=>average(f.pts))];
      for(const point of samples){
        const [x,y]=project(point,cam);
        if(x>=0&&x<w&&y>=0&&y<h&&renderer.pick(x,y)===ob.num){
          const changed=active!==ob;active=ob;selectedPoint=point;
          if(changed)renderer.draw(cam,active.num,bg);break outer;
        }
      }
    }
  }
  annotation();
}
const themeSample=document.createElement('canvas');
themeSample.width=1;themeSample.height=1;
const sampleContext=themeSample.getContext('2d',{willReadFrequently:true});
let cachedCss='',cachedBg=rgb('#e9efea');
function themeColor(){
  const css=getComputedStyle(stage).backgroundColor;
  if(css!==cachedCss){
    cachedCss=css;sampleContext.clearRect(0,0,1,1);sampleContext.fillStyle=css;
    sampleContext.fillRect(0,0,1,1);
    const rgba=sampleContext.getImageData(0,0,1,1).data;
    cachedBg=rgba[3]?Array.from(rgba.slice(0,3),c=>c/255):rgb('#e9efea');
  }
  return cachedBg;
}
function annotation(){
  const {w,h}=cam,dpr=Math.min(devicePixelRatio||1,2);
  if(overlay.width!==Math.round(w*dpr)||overlay.height!==Math.round(h*dpr)){overlay.width=Math.round(w*dpr);overlay.height=Math.round(h*dpr);}
  const ctx=overlayContext;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const point=selectedPoint||active.center;
  const [x,y]=project(point,cam);
  if(x<4||x>w-4||y<4||y>h-4)return;
  const visibleHere=isTurning||renderer.pick(x,y)===active.num;
  // A dashed leader locates a buried part even when another layer covers it.
  const label=terms.get(active.id).name;
  ctx.font='600 '+(w<460?11:12)+'px "Segoe UI",Arial,sans-serif';
  const tw=ctx.measureText(label).width+22,th=25;
  const preferRight=x<w*.47;
  const tx=clamp(x+(preferRight?31:-tw-30),6,w-tw-6);
  const ty=clamp(y-(w<460?34:50)-th,6,h-th-6);
  const anchor=clamp(x,tx+8,tx+tw-8),endY=ty+th;
  ctx.strokeStyle='#9a512d';ctx.lineWidth=1.3;ctx.setLineDash(visibleHere?[]:[3,3]);
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(anchor,endY);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#ff8a45';ctx.strokeStyle='#fff4e4';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,3.7,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#243d36';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(tx,ty,tw,th,5);else ctx.rect(tx,ty,tw,th);ctx.fill();
  ctx.fillStyle='#ffffff';ctx.textBaseline='middle';ctx.fillText(label,tx+11,ty+th/2+.3);
}
function selectLocal(id,instance,point){
  if(isolated){isolated=false;active=instance||centerCandidate(id);updateVisible();setControls();}
  else active=instance||centerCandidate(id);
  selectedPoint=point||null;chooseBest=!instance;updateDescription();scheduleDraw();saveState();
}
function selectFromLibrary(id){
  const term=terms.get(id);
  if(viewTerms.some(t=>t.id===id)){selectLocal(id);return;}
  const ordered=groupScenes[term.group];
  const s=ordered.find(s=>term.scenes.has(s))||[...term.scenes][0];
  configureScene(term.group,s,id);saveState();
}
function changeGroup(g){
  const s=groupScenes[g][0];configureScene(g,s,preferred[g]);saveState();
}
function surfacePoint(instance,x,y){
  let best=-Infinity,result=instance.center;
  for(const f of instance.faces){
    const pts=f.pts.map(p=>project(p,cam));
    for(let i=1;i<pts.length-1;i++){
      const a=pts[0],b=pts[i],c=pts[i+1],abx=b[0]-a[0],aby=b[1]-a[1],acx=c[0]-a[0],acy=c[1]-a[1];
      const det=abx*acy-aby*acx;if(Math.abs(det)<.00001)continue;
      const u=((x-a[0])*acy-(y-a[1])*acx)/det,v=(abx*(y-a[1])-aby*(x-a[0]))/det;
      if(u<-.002||v<-.002||u+v>1.002)continue;
      const depth=a[2]+u*(b[2]-a[2])+v*(c[2]-a[2]);
      if(depth>best){best=depth;result=add(add(mul(f.pts[0],1-u-v),mul(f.pts[i],u)),mul(f.pts[i+1],v));}
    }
  }
  return result;
}
function tap(x,y){
  if(!cam)return;
  let n=renderer.pick(x,y);
  if(!n&&matchMedia('(pointer: coarse)').matches){
    for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2],[4,0],[-4,0],[0,4],[0,-4]]){
      n=renderer.pick(x+dx,y+dy);if(n){x+=dx;y+=dy;break;}
    }
  }
  if(!n)return;
  const ob=pieces[n-1];if(isolated){active=ob;selectedPoint=surfacePoint(ob,x,y);scheduleDraw();return;}
  selectLocal(ob.id,ob,surfacePoint(ob,x,y));
}
const contacts=new Map();let dragged=false,pair=null;
const mid=(a,b)=>[(a.x+b.x)*.5,(a.y+b.y)*.5];
function twoFingers(){const [a,b]=[...contacts.values()];return {dist:Math.max(2,Math.hypot(a.x-b.x,a.y-b.y)),mid:mid(a,b)};}
stage.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0&&e.button!==1)return;
  stage.setPointerCapture(e.pointerId);
  if(!contacts.size)dragged=false;
  contacts.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});
  if(contacts.size===2){pair=twoFingers();dragged=true;}
});
stage.addEventListener('pointermove',e=>{
  const a=contacts.get(e.pointerId);if(!a)return;
  const dx=e.clientX-a.x,dy=e.clientY-a.y;
  if(!dragged&&Math.hypot(e.clientX-a.sx,e.clientY-a.sy)<4)return;
  dragged=true;isTurning=true;a.x=e.clientX;a.y=e.clientY;
  if(contacts.size>=2){
    const next=twoFingers();
    if(pair){zoom=clamp(zoom*next.dist/pair.dist,.42,8);pan=add(pan,sub(next.mid,pair.mid));}
    pair=next;
  }else if(e.shiftKey||e.buttons===4){pan=add(pan,[dx,dy]);}
  else{yaw-=dx*.009;pitch=clamp(pitch+dy*.008,-.12,1.39);}
  scheduleDraw();
});
function endContact(e,canTap){
  if(!contacts.has(e.pointerId))return;
  if(canTap&&!dragged&&contacts.size===1){
    const rect=canvas.getBoundingClientRect();tap(e.clientX-rect.left,e.clientY-rect.top);
  }
  contacts.delete(e.pointerId);if(contacts.size<2)pair=null;
  if(!contacts.size&&dragged){isTurning=false;scheduleDraw();saveState();}
}
stage.addEventListener('pointerup',e=>endContact(e,true));
stage.addEventListener('pointercancel',e=>endContact(e,false));
stage.addEventListener('lostpointercapture',e=>endContact(e,false));
stage.addEventListener('wheel',e=>{
  e.preventDefault();zoom=clamp(zoom*Math.exp(-clamp(e.deltaY,-140,140)*.0025),.42,8);scheduleDraw();saveState();
},{passive:false});
function searchIndex(){
  const fold=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const words=fold(role('search').value).split(' ').filter(Boolean),filter=role('index-group').value;
  const matches=[...terms.values()].filter(t=>(filter==='all'||filter===t.group)&&words.every(w=>fold(t.name+' '+t.aliases+' '+groups[t.group]).includes(w)));
  matches.sort((a,b)=>a.name.localeCompare(b.name));
  role('result-count').textContent=matches.length+' '+(matches.length===1?'term':'terms');
  const container=role('results');container.replaceChildren();
  if(!matches.length){const n=document.createElement('p');n.className='empty';n.textContent='No matches. Try a shorter term or choose All systems.';container.append(n);return;}
  for(const [g,label] of groupEntries){
    const list=matches.filter(t=>t.group===g);if(!list.length)continue;
    const heading=document.createElement('h3');heading.textContent=label;
    const wrap=document.createElement('div');wrap.className='result-group';
    for(const t of list){const b=document.createElement('button');b.type='button';b.className='result btn';b.dataset.term=t.id;b.textContent=t.name;wrap.append(b);}
    container.append(heading,wrap);
  }
}
role('search').addEventListener('input',searchIndex);role('index-group').addEventListener('change',searchIndex);
role('system-select').addEventListener('change',e=>changeGroup(e.target.value));
role('scene').addEventListener('change',e=>{const s=e.target.value;configureScene(group,s,detailPreferred[s]||preferred[group]);saveState();});
function showDialog(dialog){
  if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}
function closeDialog(dialog){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}
for(const d of root.querySelectorAll('dialog'))d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}});
root.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.group){changeGroup(b.dataset.group);return;}
  if(b.dataset.term){closeDialog(role('library'));selectFromLibrary(b.dataset.term);return;}
  switch(b.dataset.action){
    case 'index':role('search').value='';role('index-group').value='all';searchIndex();showDialog(role('library'));if(!matchMedia('(pointer: coarse)').matches)role('search').focus();return;
    case 'guide':showDialog(role('guide'));return;
    case 'close-guide':closeDialog(role('guide'));return;
    case 'close-index':closeDialog(role('library'));return;
    case 'left':yaw-=Math.PI/9;break;
    case 'right':yaw+=Math.PI/9;break;
    case 'plus':zoom=clamp(zoom*1.25,.42,8);break;
    case 'minus':zoom=clamp(zoom/1.25,.42,8);break;
    case 'fit':resetCamera();break;
    case 'prev':case 'next':{
      const idx=viewTerms.findIndex(t=>t.id===active.id),step=b.dataset.action==='next'?1:-1;
      selectLocal(viewTerms[(idx+step+viewTerms.length)%viewTerms.length].id);return;
    }
    case 'isolate':isolated=!isolated;selectedPoint=null;chooseBest=false;updateVisible();setControls();updateDescription();break;
    default:return;
  }
  scheduleDraw();saveState();
});
function saveState(){
  if(!embedded||!window.openai?.setWidgetState)return;
  const snapshot={modelContent:{selected:terms.get(active.id).name,system:groups[group]},privateContent:{group,view,id:active.id,isolated,yaw,pitch,zoom}};
  Promise.resolve(window.openai.setWidgetState(snapshot)).catch(()=>{});
}
function restore(s){
  const p=s?.privateContent;
  if(!p||!groupScenes[p.group]?.includes(p.view)||!getScenePieces(p.group,p.view).some(o=>o.id===p.id))return;
  configureScene(p.group,p.view,p.id);
  if(p.isolated){isolated=true;updateVisible();setControls();updateDescription();}
  if(Number.isFinite(p.yaw)&&Number.isFinite(p.pitch)&&Number.isFinite(p.zoom)){
    yaw=p.yaw;pitch=clamp(p.pitch,-.12,1.39);zoom=clamp(p.zoom,.42,8);scheduleDraw();
  }
}
configureScene('all','house','common-rafter');
if(embedded){restore(window.openai?.widgetState);window.addEventListener('openai:set_globals',e=>restore(e.detail?.globals?.widgetState));}
new ResizeObserver(()=>{measureFit();scheduleDraw();}).observe(stage);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',scheduleDraw);

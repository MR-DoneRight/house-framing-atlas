const terms = new Map();
const pieces = [];
let sceneName = 'house';
const scene = name => { sceneName = name; };
const groups = {
  all:'Whole house', foundation:'Foundation', floor:'Floor framing', walls:'Wall framing',
  roof:'Roof framing', roofing:'Roofing', exterior:'Exterior', interior:'Interior & stairs', services:'Building services'
};
const sceneNames = {
  house:'House cutaway', junction:'Hip & valley junction', truss:'Engineered roof truss',
  flashing:'Roof flashing details', enclosure:'Window & door cutaway', stairs:'Stair assembly',
  services:'Building services cutaway'
};
const palette = {
  wood:['#dec090',1],darkwood:['#b5895b',1],endgrain:['#caa67c',1],
  ply:['#c9a676',2],osb:['#b99866',2],concrete:['#aeb4ad',3],
  steel:['#7d8b91',4],metal:['#9ba9ad',4],zinc:['#b1bab9',4],copper:['#b97959',4],
  membrane:['#687a80',5],ice:['#556a70',5],shingle:['#47575a',6],cap:['#465859',6],
  insulation:['#d8b58d',3],white:['#e4e4d7',0],brick:['#ad7361',3],
  pipe:['#d8dcce',0],rubber:['#494d4b',5],glass:['#83b7be',4],water:['#6a9fab',0],
  drywall:['#ddd8c9',3],wrap:['#b9c9c1',5],siding:['#718980',1],wire:['#c98a41',0],
  gravel:['#9b9f92',3],soil:['#a58a6b',3]
};
const rgb = hex => [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,n)=>a.map(v=>v*n);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
const average=verts=>mul(verts.reduce(add,[0,0,0]),1/verts.length);
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
function term(id,group,name,purpose,placement,importance,aliases=''){
  if(terms.has(id)||!groups[group]||![name,purpose,placement,importance].every(Boolean)) throw Error('Invalid glossary entry '+id);
  terms.set(id,{id,group,name,purpose,placement,importance,aliases,scenes:new Set()});
}
function makePiece(id,verts,faces,material,grain){
  if(!palette[material]||!verts.flat().every(Number.isFinite)) throw Error('Invalid geometry or material for '+id+' '+material);
  const center=average(verts);
  const obj={id,num:pieces.length+1,scene:sceneName,verts,faces:[],center,material,grain};
  for(const indices of faces){
    const pts=indices.map(i=>verts[i]);
    let n=unit(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0])));
    if(Math.hypot(...n)<.1) continue;
    if(dot(n,sub(average(pts),center))<0) n=mul(n,-1);
    obj.faces.push({pts,n});
  }
  pieces.push(obj);
}
function prism(id,c,axes,material,grain){
  const verts=[];
  for(let i=0;i<8;i++) verts.push(axes.reduce((p,axis,j)=>add(p,mul(axis,(i&(1<<j))?.5:-.5)),c));
  makePiece(id,verts,[[0,4,6,2],[1,3,7,5],[0,1,5,4],[2,6,7,3],[0,2,3,1],[4,5,7,6]],material,unit(grain));
}
function box(id,x,y,z,w,h,d,mat){
  const axes=[[w,0,0],[0,h,0],[0,0,d]];
  prism(id,[x,y,z],axes,mat,axes[[w,h,d].indexOf(Math.max(w,h,d))]);
}
function beam(id,a,b,w,h,mat){
  const axis=sub(b,a),dir=unit(axis);
  const side=Math.hypot(dir[0],dir[2])>.0001?unit(cross([0,1,0],dir)):[1,0,0];
  prism(id,mul(add(a,b),.5),[mul(side,w),mul(unit(cross(dir,side)),h),axis],mat,dir);
}
function panel(id,points,t,material){
  const n=unit(cross(sub(points[1],points[0]),sub(points[2],points[0])));
  const count=points.length, top=points.map((_,i)=>i), bottom=top.map(i=>i+count).reverse();
  const vertices=[...points,...points.map(p=>sub(p,mul(n,t)))];
  makePiece(id,vertices,[top,bottom,...top.map(i=>[i,(i+1)%count,(i+1)%count+count,i+count])],material,unit(sub(points[1],points[0])));
}
function getBounds(objects){
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(const obj of objects) for(const v of obj.verts) for(let i=0;i<3;i++){lo[i]=Math.min(lo[i],v[i]);hi[i]=Math.max(hi[i],v[i]);}
  return {lo,hi,center:mul(add(lo,hi),.5),spans:sub(hi,lo)};
}

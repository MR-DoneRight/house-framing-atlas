function getCamera(yaw,pitch){
  const forward=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)];
  const right=[Math.cos(yaw),0,-Math.sin(yaw)];
  return {forward,right,up:cross(forward,right)};
}
function project(point,camera){
  const rel=sub(point,camera.center);
  return [camera.w/2+camera.pan[0]+dot(rel,camera.right)*camera.scale,
    camera.h/2+camera.pan[1]-dot(rel,camera.up)*camera.scale,dot(rel,camera.forward)];
}
const light=getCamera(-.53,1.05);
function geometryBuffer(objects,floorY,groundSize){
  const data=[];
  function face(pts,n,color,kind,serial,grain){
    const across=unit(cross(n,grain));
    for(let i=1;i<pts.length-1;i++){
      const tri=[pts[0],pts[i],pts[i+1]];
      const boundary=[true,i===pts.length-2,i===1];
      const heights=tri.map((p,j)=>{
        const a=tri[(j+1)%3],b=tri[(j+2)%3];
        return Math.hypot(...cross(sub(a,p),sub(b,p)))/(Math.hypot(...sub(a,b))||1);
      });
      tri.forEach((p,j)=>{
        const edges=boundary.map((flag,k)=>flag?(k===j?heights[k]:0):100.);
        data.push(...p,...n,...color,kind,serial,dot(p,grain),dot(p,across),...edges);
      });
    }
  }
  for(const o of objects){
    const [hex,kind]=palette[o.material],color=rgb(hex);
    for(const f of o.faces) face(f.pts,f.n,color,kind,o.num,o.grain);
  }
  const s=groundSize;
  face([[-s,floorY,-s],[-s,floorY,s],[s,floorY,s],[s,floorY,-s]],[0,1,0],[1,1,1],-1,0,[1,0,0]);
  return new Float32Array(data);
}
const vertexSource=`
attribute vec3 pos,normal,color,edge; attribute vec2 info,uv;
uniform vec3 camCenter,camRight,camUp,camForward,lightCenter,lightRight,lightUp,lightForward;
uniform vec2 camScale,pan; uniform float lightSpan,pass;
varying vec3 vColor,vNorm,vPos,vShadow,vEdge; varying vec2 vUv,vInfo;
void main(){
  vec3 p=pos-camCenter, s=pos-lightCenter;
  vShadow=vec3(dot(s,lightRight),dot(s,lightUp),-dot(s,lightForward))/lightSpan;
  gl_Position=pass==1.0?vec4(vShadow,1.0):vec4(vec2(dot(p,camRight),dot(p,camUp))*camScale+pan,-dot(p,camForward)/150.0,1.0);
  vColor=color;vNorm=normal;vPos=pos;vEdge=edge;vInfo=info;vUv=uv;
}`;
const fragmentSource=`
precision highp float;
varying vec3 vColor,vNorm,vPos,vShadow,vEdge; varying vec2 vUv,vInfo;
uniform sampler2D shadeMap;uniform float pass,chosen,worldPixel,modelSpan;uniform vec3 lightForward,backdrop;uniform vec2 gridCenter;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.0),f.x),f.y);}
float visibility(){
  vec3 s=vShadow*.5+.5;
  if(min(s.x,s.y)<.002||max(s.x,s.y)>.998) return 1.;
  float lit=0.;
  for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++){
    vec2 depth=texture2D(shadeMap,s.xy+vec2(float(x),float(y))/1024.).rg;
    lit+=step(s.z-.0011,depth.x+depth.y/255.);
  }
  return lit/9.;
}
void main(){
  float kind=vInfo.x, id=floor(vInfo.y+.5);
  if(pass==1.){ if(kind<0.)discard;float z=gl_FragCoord.z*255.;gl_FragColor=vec4(floor(z)/255.,fract(z),0,1);return;}
  if(pass==2.){gl_FragColor=vec4(mod(id,256.),mod(floor(id/256.),256.),floor(id/65536.),255.)/255.;return;}
  float lit=visibility();
  if(kind<0.){
    vec2 dist=abs(fract(vPos.xz+.5)-.5);
    float grid=1.-smoothstep(worldPixel*.28,worldPixel*1.3,min(dist.x,dist.y));
    float fade=1.-smoothstep(modelSpan*.32,modelSpan*1.18,length(vPos.xz-gridCenter));
    gl_FragColor=vec4(backdrop*(1.-.052*grid*fade)*(1.-.18*(1.-lit)),1.);return;
  }
  vec3 c=vColor;float seed=fract(id*.618034);
  float edgeDist=min(vEdge.x,min(vEdge.y,vEdge.z));
  if(kind==1.){
    float wave=noise(vec2(vUv.x*1.65+seed*20.,vUv.y*6.));
    float grain=noise(vec2(vUv.x*.9+seed*17.,vUv.y*95.+wave*3.));
    c*=.94+.10*grain+.045*seed;
  } else if(kind==2.||kind==3.||kind==6.){
    float fleck=noise(vUv*vec2(45.,87.)+seed*33.);
    c*=.94+.095*fleck+.045*seed;
  }
  if(abs(id-chosen)<.25)c=mix(c,vec3(.99,.39,.12),.89);
  float diffuse=max(dot(vNorm,lightForward),0.);
  vec3 illum=vec3(.68,.71,.74)+(.29*diffuse+.075*max(vNorm.y,0.))*vec3(1.04,1.,.91);
  c*=illum*(.80+.20*lit);
  float border=1.-smoothstep(.0004,clamp(worldPixel*.53,.002,.018),edgeDist);
  c*=1.-border*.11;
  gl_FragColor=vec4(c,1.);
}`;
function createGlRenderer(canvas){
  const gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:true});
  if(!gl) return null;
  const program=gl.createProgram();
  for(const [type,source] of [[gl.VERTEX_SHADER,vertexSource],[gl.FRAGMENT_SHADER,fragmentSource]]){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program,shader);
  }
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program); gl.enable(gl.DEPTH_TEST);gl.disable(gl.DITHER);
  const uniform=Object.fromEntries('camCenter camRight camUp camForward camScale pan lightCenter lightRight lightUp lightForward lightSpan pass shadeMap chosen worldPixel modelSpan backdrop gridCenter'.split(' ').map(k=>[k,gl.getUniformLocation(program,k)]));
  const v3=(key,v)=>gl.uniform3fv(uniform[key],v),v2=(key,v)=>gl.uniform2fv(uniform[key],v),fl=(key,v)=>gl.uniform1f(uniform[key],v);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  let offset=0;
  for(const [name,n] of [['pos',3],['normal',3],['color',3],['info',2],['uv',2],['edge',3]]){
    const a=gl.getAttribLocation(program,name);
    gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,n,gl.FLOAT,false,64,offset*4);offset+=n;
  }
  function target(){
    const fb=gl.createFramebuffer(),tex=gl.createTexture(),depth=gl.createRenderbuffer();
    let width=0,height=0;
    return {fb,tex,resize(w,h){
      if(width===w&&height===h)return;
      width=w;height=h;gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
      gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
      gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('3D display buffer unavailable');
    }};
  }
  const shadow=target(),picking=target(),blank=gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D,blank);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
  shadow.resize(1024,1024);
  v3('lightRight',light.right);v3('lightUp',light.up);v3('lightForward',light.forward);
  gl.uniform1i(uniform.shadeMap,0);
  let count=0,needShadow=true,needPick=true,wCss=1,hCss=1;
  function drawTo(target,pass,w,h,bg){
    gl.bindFramebuffer(gl.FRAMEBUFFER,target);gl.viewport(0,0,w,h);fl('pass',pass);
    gl.clearColor(...bg,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,count);
  }
  return {
    set(objects,bounds){
      const span=Math.max(...bounds.spans,.2);
      const geometry=geometryBuffer(objects,bounds.lo[1]-Math.max(.012,span*.002),Math.max(80,span*8));
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,geometry,gl.STATIC_DRAW);
      count=geometry.length/16;v3('lightCenter',bounds.center);fl('lightSpan',Math.hypot(...bounds.spans)*.75+.25);
      fl('modelSpan',span);v2('gridCenter',[bounds.center[0],bounds.center[2]]);needShadow=true;
    },
    draw(c,selected,bg){
      const dpr=Math.min(devicePixelRatio||1,2);
      const w=Math.max(1,Math.round(c.w*dpr)),h=Math.max(1,Math.round(c.h*dpr));
      wCss=c.w;hCss=c.h;
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      picking.resize(w,h);
      v3('camCenter',c.center);v3('camRight',c.right);v3('camUp',c.up);v3('camForward',c.forward);
      v2('camScale',[2*c.scale/c.w,2*c.scale/c.h]);v2('pan',[2*c.pan[0]/c.w,-2*c.pan[1]/c.h]);
      fl('chosen',selected);fl('worldPixel',1/c.scale);v3('backdrop',bg);
      if(needShadow){gl.bindTexture(gl.TEXTURE_2D,blank);drawTo(shadow.fb,1,1024,1024,[1,1,1]);needShadow=false;}
      gl.bindTexture(gl.TEXTURE_2D,shadow.tex);drawTo(null,0,w,h,bg);
      needPick=true;
    },
    pick(x,y){
      if(needPick){drawTo(picking.fb,2,canvas.width,canvas.height,[0,0,0]);needPick=false;}
      gl.bindFramebuffer(gl.FRAMEBUFFER,picking.fb);
      const px=new Uint8Array(4);
      gl.readPixels(clamp(Math.floor(x*canvas.width/wCss),0,canvas.width-1),
        clamp(canvas.height-1-Math.floor(y*canvas.height/hCss),0,canvas.height-1),1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      return px[0]+256*px[1]+65536*px[2];
    }
  };
}

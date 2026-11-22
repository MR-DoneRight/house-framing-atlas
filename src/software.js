// A depth buffer keeps intersections and picking accurate on devices without WebGL.
function createSoftwareRenderer(canvas){
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  let objects=[],bounds,ids=null,w=1,h=1,ratio=1,zbuf;
  const shadowLayer=document.createElement('canvas'),shade=shadowLayer.getContext('2d');
  const colorText=(c,a=1)=>'rgba('+c.map(v=>Math.round(v*255)).join(',')+','+a+')';
  return {
    set(list,b){objects=list;bounds=b;},
    draw(cam,selected,bg){
      ratio=Math.min(devicePixelRatio||1,1.25,1200/cam.w);
      w=Math.max(1,Math.round(cam.w*ratio));h=Math.max(1,Math.round(cam.h*ratio));
      if(w!==canvas.width||h!==canvas.height||!ids){
        canvas.width=w;canvas.height=h;shadowLayer.width=w;shadowLayer.height=h;
        ids=new Uint32Array(w*h);zbuf=new Float32Array(w*h);
      }
      ids.fill(0);zbuf.fill(-Infinity);
      const c={...cam,w,h,scale:cam.scale*ratio,pan:mul(cam.pan,ratio)};
      const p=v=>project(v,c);
      ctx.fillStyle=colorText(bg);ctx.fillRect(0,0,w,h);
      const y=bounds.lo[1]-.02,span=Math.max(...bounds.spans),margin=span*.42;
      const xmin=Math.floor(bounds.lo[0]-margin),xmax=Math.ceil(bounds.hi[0]+margin);
      const zmin=Math.floor(bounds.lo[2]-margin),zmax=Math.ceil(bounds.hi[2]+margin);
      const gridLine=(a,b)=>{const u=p(a),v=p(b);ctx.moveTo(u[0],u[1]);ctx.lineTo(v[0],v[1]);};
      ctx.strokeStyle=colorText(mul(bg,.54),.15);ctx.lineWidth=.8;ctx.beginPath();
      for(let x=xmin;x<=xmax;x++)gridLine([x,y,zmin],[x,y,zmax]);
      for(let z=zmin;z<=zmax;z++)gridLine([xmin,y,z],[xmax,y,z]);ctx.stroke();
      shade.clearRect(0,0,w,h);shade.fillStyle='black';
      for(const o of objects){
        const shadowPts=o.verts.map(v=>p(sub(v,mul(light.forward,(v[1]-y)/light.forward[1]))));
        for(const f of o.faces){if(dot(f.n,light.forward)<.001)continue;
          shade.beginPath();f.pts.forEach((v,i)=>{const uv=shadowPts[o.verts.indexOf(v)];i?shade.lineTo(uv[0],uv[1]):shade.moveTo(uv[0],uv[1]);});shade.closePath();shade.fill();}
      }
      ctx.globalAlpha=.12;ctx.drawImage(shadowLayer,0,0);ctx.globalAlpha=1;
      const img=ctx.getImageData(0,0,w,h),pix=img.data;
      for(const o of objects){
        const coords=new Map(o.verts.map(v=>[v,p(v)]));
        const base=o.num===selected?[1,.43,.17]:rgb(palette[o.material][0]);
        for(const f of o.faces){
          if(dot(f.n,c.forward)<.00001)continue;
          const shadeValue=.695+.29*Math.max(dot(f.n,light.forward),0)+.072*Math.max(f.n[1],0);
          const col=base.map(v=>Math.min(255,Math.round(v*shadeValue*255*(.98+.03*((o.num*.618)%1)))));
          const pts=f.pts.map(v=>coords.get(v));
          for(let t=1;t<pts.length-1;t++){
            const a=pts[0],b=pts[t],e=pts[t+1];
            const abx=b[0]-a[0],aby=b[1]-a[1],aex=e[0]-a[0],aey=e[1]-a[1];
            const area=abx*aey-aby*aex;if(Math.abs(area)<.00001)continue;
            const xmin=Math.max(0,Math.floor(Math.min(a[0],b[0],e[0]))),xmax=Math.min(w-1,Math.ceil(Math.max(a[0],b[0],e[0])));
            const ymin=Math.max(0,Math.floor(Math.min(a[1],b[1],e[1]))),ymax=Math.min(h-1,Math.ceil(Math.max(a[1],b[1],e[1])));
            for(let yy=ymin;yy<=ymax;yy++){
              for(let xx=xmin;xx<=xmax;xx++){
                const px=xx+.5-a[0],py=yy+.5-a[1],u=(px*aey-py*aex)/area,v=(abx*py-aby*px)/area;
                if(u<0||v<0||u+v>1)continue;
                const depth=a[2]+u*(b[2]-a[2])+v*(e[2]-a[2]),i=yy*w+xx;
                if(depth<zbuf[i])continue;
                zbuf[i]=depth;ids[i]=o.num;
                pix[4*i]=col[0];pix[4*i+1]=col[1];pix[4*i+2]=col[2];
              }
            }
          }
        }
      }
      ctx.putImageData(img,0,0);
    },
    pick(x,y){return ids?.[clamp(Math.floor(y*ratio),0,h-1)*w+clamp(Math.floor(x*ratio),0,w-1)]||0;}
  };
}

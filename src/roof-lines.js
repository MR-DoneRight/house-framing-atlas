{
  scene('rooflines');
  const entries=[
    ['roof-plane','Roof plane','Forms one flat, sloping face of the roof.','Each broad surface between the marked edges is a plane. A plane can be triangular or have several sides.','Water travels downhill across the plane. Its area and slope help determine the covering it needs.','facet, roof face, roof field'],
    ['roof-ridge','Roof ridge','Forms the level peak where two opposing slopes meet.','Follow the high horizontal line along the main roof, or the shorter one above the projecting gable.','The roof covering must protect this joint while water drains away on both sides.','ridge line, ridgeline, peak'],
    ['roof-hip','Roof hip','Forms an outside corner between two sloping roof planes.','Trace the diagonal line from a main ridge end down to an outside corner.','Water drains away from a hip on both sides. Cap material protects the exposed joint.','hip line, outside roof corner'],
    ['roof-valley','Roof valley','Collects runoff where two sloping roof planes meet at an inside corner.','Follow either inward diagonal beside the projecting gable. The low end opens at the eave.','Two planes feed water into the same channel, making this joint particularly important for drainage.','valley line, inside roof corner'],
    ['roof-eave','Eave','Forms the low roof edge where runoff leaves a slope.','Follow the level edges along the bottoms of the roof planes. Gutters often attach here.','Water needs a clear path past the fascia and away from the walls below.','eaves, eave line, gutter edge'],
    ['roof-rake','Rake','Forms the sloping outside edge of a gable roof.','Follow either rising edge above the triangular end of the projecting wing.','Roofing and trim meet here, where the exposed edge is vulnerable to wind and rain.','rake edge, gable verge, gable edge'],
    ['roof-gable','Gable','Closes the triangular end wall beneath two roof slopes.','The upright triangle is directly under the two rake edges at the front of the projecting wing.','Its framing and covering enclose the space beneath the roof and resist wind on the end wall.','gable end, gable wall, gabled end']
  ];
  for(const [id,name,purpose,where,why,related] of entries)term(id,'roofing',name,purpose,where,why,related);
  const low=.48,k=.70,high=low+2*k;
  const mainY=z=>high-Math.abs(z)*k,wingY=x=>low+(1-Math.abs(x))*k;
  function plane(xz,level){
    const pts=xz.map(([x,z])=>[x,level(x,z),z]);
    if(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0]))[1]<0)pts.reverse();
    panel('roof-plane',pts,.045,'shingle');
  }
  plane([[-2,0],[2,0],[4,-2],[-4,-2]],(x,z)=>mainY(z));
  for(const s of [-1,1])plane([[s*2,0],[s*4,-2],[s*4,2]],x=>high-(Math.abs(x)-2)*k);
  plane([[-2,0],[2,0],[3,1],[-3,1]],(x,z)=>mainY(z));
  plane([[-3,1],[0,1],[-1,2],[-4,2]],(x,z)=>mainY(z));
  plane([[0,1],[3,1],[4,2],[1,2]],(x,z)=>mainY(z));
  for(const s of [-1,1])plane([[0,1],[s,2],[s,3.58],[0,3.58]],x=>wingY(x));
  const line=(id,a,b)=>beam(id,add(a,[0,.027,0]),add(b,[0,.027,0]),.068,.048,'metal');
  line('roof-ridge',[-2,high,0],[2,high,0]);line('roof-ridge',[0,wingY(0),1],[0,wingY(0),3.58]);
  for(const s of [-1,1]){
    for(const t of [-1,1])line('roof-hip',[s*2,high,0],[s*4,low,t*2]);
    line('roof-valley',[0,wingY(0),1],[s,low,2]);
    line('roof-rake',[0,wingY(0),3.58],[s,low,3.58]);
    line('roof-eave',[s*4,low,-2],[s*4,low,2]);
    line('roof-eave',[s*4,low,2],[s,low,2]);line('roof-eave',[s,low,2],[s,low,3.58]);
  }
  line('roof-eave',[-4,low,-2],[4,low,-2]);
  panel('roof-gable',[[-1,low,3.52],[1,low,3.52],[0,wingY(0)-.022,3.52]],.065,'siding');
  scene('house');
}

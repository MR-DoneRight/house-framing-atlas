{
  const foundationTerms = [
    ['footing', 'Strip footing', 'Spreads the weight of a wall over a wider strip of soil.', 'The broad concrete base under each exterior foundation wall.', 'A broad bearing surface helps limit settlement under the house.', 'continuous footing, wall footing, spread footing, footer'],
    ['stem-wall', 'Foundation wall', 'Raises the floor above the ground and carries the wall and floor loads to the footing.', 'The short concrete wall between the perimeter footing and the wood sill plate.', 'It supports the wood frame around the crawlspace.', 'stem wall, crawlspace wall, perimeter foundation'],
    ['pad-footing', 'Pad footing', 'Spreads the concentrated load from one support onto the soil.', 'A square concrete pad below each interior pier.', 'A post carries a large load through a small area. The pad gives that load a wider base.', 'isolated footing, pier footing, spread footing'],
    ['pier', 'Concrete pier', 'Raises an interior support and transfers its load to a footing.', 'The concrete pedestal on a square pad below the center girder.', 'It provides a bearing point for the post and keeps the wood above the ground.', 'foundation pier, pedestal'],
    ['rebar', 'Reinforcing bar', 'Helps concrete resist tension as the foundation bends.', 'Steel bars embedded in the concrete wall, visible here at the cutaway.', 'Concrete resists squeezing well. The embedded steel helps it resist being pulled apart.', 'rebar, reinforcing steel, reinforcement'],
    ['sill-gasket', 'Sill gasket', 'Seals the joint and interrupts moisture movement from concrete to wood.', 'The thin strip between the concrete foundation and the wood sill plate.', 'Sealing this long joint helps keep drafts and dampness out of the floor framing.', 'sill sealer, capillary break, sill seal'],
    ['sill-plate', 'Foundation sill plate', 'Provides a wood bearing surface for the floor frame.', 'The horizontal wood plate fastened on top of the foundation wall.', 'It links the wood floor platform to the foundation.', 'mud sill, mudsill, foundation plate, treated sill'],
    ['anchor-bolt', 'Anchor bolt', 'Fastens the sill plate to the concrete with a nut and washer.', 'The bolt passes through the sill plate and extends down into the foundation.', 'The anchorage helps resist sliding and uplift at the wood-to-concrete connection.', 'sill anchor, foundation bolt, J-bolt, washer, nut'],
    ['footing-drain', 'Footing drain', 'Collects groundwater and carries it to a suitable outlet or sump.', 'The perforated pipe in the stone alongside the footing.', 'It helps keep groundwater from building up against the foundation wall.', 'drain tile, perimeter drain, weeping tile'],
    ['drain-stone', 'Drainage stone', 'Provides an open path for water to reach the footing drain.', 'The stone bed around the drain pipe at the exterior base of the wall.', 'The spaces between the stones allow water to move toward the pipe.', 'washed stone, drainage aggregate, gravel'],
    ['ground-cover', 'Ground vapor retarder', 'Slows moisture from the ground from entering the crawlspace air.', 'Sheet material over the earth inside the foundation. Only a section is shown.', 'A continuous, sealed ground cover helps keep the framing above it drier.', 'ground vapor barrier, crawlspace liner, polyethylene'],
    ['foundation-coating', 'Foundation dampproofing', 'Limits the movement of soil moisture through a foundation wall.', 'The dark coating on the outside face of the concrete below grade.', 'It helps keep the wall dry where it touches damp soil. Pressure from standing water calls for a waterproofing strategy.', 'damp proofing, below-grade coating'],
  ];
  const floorTerms = [
    ['floor-joist', 'Floor joist', 'Carries the subfloor, people, furnishings, and other floor loads.', 'Repeated horizontal members spanning from an exterior sill to the center girder.', 'Together the joists carry floor loads to their supports and limit sag.', 'common joist, floor framing, dimensional lumber'],
    ['rim-joist', 'Rim joist', 'Closes the floor edge and ties the joist ends together.', 'The outside band across the ends of floor joists at the perimeter.', 'It helps hold the joists upright and supports loads at the floor edge.', 'band joist, band board, rim board, perimeter joist'],
    ['subfloor', 'Subfloor', 'Forms the structural deck beneath the finished flooring.', 'Wood panels laid across the top of the floor joists.', 'The panels distribute loads to several joists and help the platform resist sideways movement.', 'floor sheathing, structural floor deck, plywood'],
    ['girder', 'Center girder', 'Collects loads from the floor joists and carries them to the supports below.', 'The deep built-up wood beam running along the middle of the crawlspace.', 'By supporting the joists partway across the house, it shortens their spans.', 'floor beam, built-up beam, drop beam, girder'],
    ['support-post', 'Support post', 'Carries a concentrated load straight down.', 'Between the center girder and a concrete pier in the crawlspace.', 'It completes the load path from girder to footing.', 'column, girder post, wood post'],
    ['floor-blocking', 'Solid blocking', 'Keeps neighboring joists upright and provides restraint between them.', 'Short, full-depth pieces fitted sideways between adjacent floor joists.', 'Blocking helps the joists hold their position and resist twisting.', 'joist blocking, solid bridging, floor blocking'],
    ['cross-bridging', 'Cross bridging', 'Braces neighboring joists with crossed diagonal pieces.', 'An X-shaped pair between the sides of two floor joists.', 'The braces help restrain movement and keep the joists upright.', 'X bridging, herringbone bridging, diagonal bridging'],
    ['trimmer-joist', 'Trimmer joist', 'Carries reactions from the ends of the header joists.', 'Along each long side of the rectangular opening in the floor. The trimmers shown are doubled.', 'It directs loads around the hole to the floor supports.', 'floor trimmer, doubled joist, trimming joist'],
    ['header-joist', 'Header joist', 'Catches the ends of joists interrupted by a floor opening.', 'Across each short end of the opening, between the trimmer joists.', 'It redirects the cut joist loads into the opening’s side members.', 'floor header, framed opening, stair opening, floor access opening'],
    ['tail-joist', 'Tail joist', 'Supports the shorter strip of floor next to an opening.', 'A shortened joist running from a bearing point to a header at the opening.', 'The header gives the cut end a new support.', 'cut joist, shortened joist'],
    ['joist-hanger', 'Joist hanger', 'Cradles a framing member where it meets the side of another member.', 'The formed metal seats under member ends around the floor opening.', 'The hanger and its specified fasteners transfer load across the joint.', 'metal hanger, face-mount hanger, framing connector'],
  ];
  const wallTerms = [
    ['stud', 'Common stud', 'Supports the wall coverings and, in a bearing wall, carries loads from above.', 'One of the evenly spaced vertical members between the wall plates.', 'Studs form the wall frame and give sheathing and drywall a fastening surface.', 'wall stud, framing stud, stud bay, upright'],
    ['bottom-plate', 'Bottom plate', 'Locates the lower ends of the studs and fastens the wall to the floor.', 'The horizontal board at the base of each framed wall, interrupted at a doorway.', 'It keeps the stud layout together and transfers forces into the floor platform.', 'sole plate, wall plate, shoe plate'],
    ['top-plate', 'Top plate', 'Connects the stud tops and provides a bearing surface.', 'The lower of the two horizontal boards along the top of the exterior wall.', 'It ties the studs together beneath the framing above.', 'first top plate, lower top plate, wall plate'],
    ['cap-plate', 'Second top plate', 'Overlaps joints in the first top plate and ties meeting walls together.', 'The upper board in the double top plate, immediately below the roof framing.', 'The overlapping joints help the wall tops act together.', 'double top plate, cap plate, upper top plate, tie plate'],
    ['corner-stud', 'Corner stud assembly', 'Joins intersecting wall frames and provides an attachment point at the corner.', 'A group of studs where an end wall meets a long exterior wall.', 'The corner needs both a structural connection and backing for the wall finishes.', 'corner post, framing corner, stud pack'],
    ['king-stud', 'King stud', 'Provides a full-height side member beside a framed opening.', 'Immediately outside the shorter jack stud on each side of the door or window.', 'It stiffens the opening and gives the header and jack stud a full-height connection.', 'full-height opening stud, king'],
    ['jack-stud', 'Jack stud', 'Supports an end of the header above an opening.', 'The shorter upright just inside each king stud, directly under the header.', 'It carries the header’s load down to the wall base.', 'trimmer stud, shoulder stud, jack'],
    ['header', 'Wall header', 'Spans a door or window opening and carries loads to its sides.', 'The deep horizontal member above the rough opening, bearing on jack studs here.', 'It lets the space below stay open while loads pass safely around it.', 'lintel, window header, door header, rough opening'],
    ['rough-sill', 'Rough sill', 'Forms the bottom of a framed window opening.', 'The horizontal board between the jack studs under a window.', 'It establishes the opening height and provides support for the window assembly.', 'window rough sill, sill framing, window sill'],
    ['cripple-stud', 'Cripple stud', 'Fills the short framing runs above a header or beneath a rough sill.', 'Aligned with surrounding studs in the short spaces above and below openings.', 'These pieces support the plates or sill and give wall coverings a fastening surface.', 'cripple, short stud, header cripple, sill cripple'],
    ['wall-backing', 'Wall backing', 'Provides solid wood for attaching an item between studs.', 'Short horizontal blocks fitted into stud bays, shown along the front wall.', 'Cabinets, rails, and other wall-mounted items can fasten to this backing.', 'nailer, wall blocking, backing block, cabinet blocking'],
    ['partition', 'Partition wall', 'Divides the interior into rooms.', 'The short interior stud wall meeting the back wall. This example is nonbearing.', 'A partition can support finishes and services. Some interior walls also carry loads from above.', 'nonbearing wall, non-load-bearing wall, room divider'],
    ['bearing-wall', 'Load-bearing wall', 'Supports the weight of framing above it as well as the wall itself.', 'The rear exterior stud wall under one side of the roof in this example.', 'It passes roof loads down through the floor edge to the foundation.', 'bearing wall, load bearing wall, load path'],
  ];
  for (const [group, entries] of [['foundation', foundationTerms], ['floor', floorTerms], ['walls', wallTerms]]) {
    for (const [id, name, purpose, placement, importance, aliases] of entries) {
      term(id, group, name, purpose, placement, importance, aliases);
    }
  }

  // Positive Z is the window-and-door elevation. Intervals make cutaway edges explicit.
  const runX = (id, left, right, y, z, height, depth, material) =>
    box(id, (left + right) / 2, y, z, right - left, height, depth, material);
  const runZ = (id, back, front, x, y, width, height, material) =>
    box(id, x, y, (back + front) / 2, width, height, front - back, material);

  // The exposed pieces at the near wall are a teaching cut through a continuous assembly.
  for (const z of [-3.6, 3.6]) {
    runX('footing', -5.74, 5.74, -1.45, z, 0.28, 0.68, 'concrete');
  }
  for (const x of [-5.4, 5.4]) {
    runZ('footing', -3.26, 3.26, x, -1.45, 0.68, 0.28, 'concrete');
  }
  const longWallSegments = [[-5.52,5.52,-3.6],[-5.52,0.72,3.6],[3.12,5.52,3.6]];
  for (const [a, b, z] of longWallSegments) {
    runX('stem-wall', a, b, -0.87, z, 0.88, 0.24, 'concrete');
  }
  for (const x of [-5.4,5.4]) {
    runZ('stem-wall', -3.48, 3.48, x, -0.87, 0.24, 0.88, 'concrete');
  }
  runX('foundation-coating', -5.49, -3.05, -0.95, 3.725, 0.70, 0.012, 'membrane');
  for (const y of [-1.12,-0.65]) {
    runX('rebar', 0.72, 3.12, y, 3.60, 0.024, 0.024, 'steel');
  }
  for (const x of [1.0,1.65,2.30,2.95]) {
    box('rebar', x, -0.92, 3.586, 0.025, 0.96, 0.025, 'steel');
  }
  for (const z of [-3.6,3.6]) {
    runX('sill-gasket', -5.49, 5.49, -0.42, z, 0.02, 0.20, 'membrane');
    runX('sill-plate', -5.49, 5.49, -0.365, z, 0.09, 0.18, 'darkwood');
  }
  for (const x of [-5.4,5.4]) {
    runZ('sill-gasket', -3.5, 3.5, x, -0.42, 0.20, 0.02, 'membrane');
    runZ('sill-plate', -3.51, 3.51, x, -0.365, 0.18, 0.09, 'darkwood');
  }
  // Show one cast-in bolt in section, along with the exposed washer and nut at each sample.
  for (const x of [-4.1,-2.25,-0.38,1.43,3.27,5.0]) {
    const z = 3.55;
    box('anchor-bolt', x, -0.493, z, 0.028, 0.46, 0.028, 'steel');
    runX('anchor-bolt', x-0.015, x+0.11, -0.715, z, 0.03, 0.03, 'steel');
    box('anchor-bolt', x, -0.313, z, 0.076, 0.014, 0.076, 'metal');
    box('anchor-bolt', x, -0.292, z, 0.043, 0.028, 0.043, 'steel');
  }
  for (const x of [-4.8,-1.6,1.6,4.8]) {
    box('pad-footing', x, -1.45, 0, 0.80, 0.28, 0.80, 'concrete');
    box('pier', x, -1.17, 0, 0.37, 0.28, 0.37, 'concrete');
    box('support-post', x, -0.855, 0, 0.19, 0.35, 0.19, 'darkwood');
  }
  box('ground-cover', -2.60, -1.537, -1.82, 5.27, 0.014, 3.39, 'membrane');
  box('ground-cover', -2.60, -1.42, -3.466, 5.27, 0.22, 0.016, 'membrane');

  // A cut end exposes the bore. The ring is formed from ten thin planar facets.
  const pipeLeft = -4.85, pipeRight = -1.95, pipeZ = 4.0, pipeY = -1.49, radius = 0.084;
  runX('drain-stone', -5.02, -1.85, -1.56, 4.03, 0.105, 0.38, 'gravel');
  runX('drain-stone', -4.85, -3.42, -1.46, 4.035, 0.13, 0.36, 'gravel');
  for (let face = 0; face < 10; face++) {
    const angleA = face * Math.PI / 5, angleB = (face + 1) * Math.PI / 5;
    const p = (x,a) => [x, pipeY + radius*Math.cos(a), pipeZ + radius*Math.sin(a)];
    panel('footing-drain', [p(pipeLeft,angleA),p(pipeLeft,angleB),p(pipeRight,angleB),p(pipeRight,angleA)], 0.009, 'pipe');
  }

  for (const z of [-0.079,0,0.079]) {
    box('girder', 0, -0.50, z, 10.78, 0.36, 0.078, 'darkwood');
  }
  for (const z of [-3.64,3.64]) {
    runX('rim-joist', -5.48, 5.48, -0.18, z, 0.28, 0.06, 'wood');
  }
  for (let j = -9; j <= 9; j++) {
    const x = j*0.6;
    if (j === 0 || j === 3) {
      const mate = j === 0 ? -0.061 : 0.061;
      for (const offset of [0,mate]) {
        runZ('trimmer-joist', -3.61, 3.61, x+offset, -0.18, 0.06, 0.28, 'wood');
      }
    } else if (j === 1 || j === 2) {
      runZ('tail-joist', 0, 0.59, x, -0.18, 0.06, 0.28, 'wood');
      runZ('tail-joist', 2.26, 3.61, x, -0.18, 0.06, 0.28, 'wood');
      runZ('floor-joist', -3.61, 0, x, -0.18, 0.06, 0.28, 'wood');
    } else {
      runZ('floor-joist', -3.61, 3.61, x, -0.18, 0.06, 0.28, 'wood');
    }
  }
  for (const z of [0.62,2.23]) {
    runX('header-joist', 0.03, 1.77, -0.18, z, 0.28, 0.06, 'wood');
    for (const x of [0.6,1.2]) {
      const side = z < 1 ? -1 : 1;
      const hangerZ = z + side*0.071;
      box('joist-hanger', x, -0.32, hangerZ, 0.094, 0.016, 0.081, 'metal');
      for (const dx of [-0.042,0.042]) {
        box('joist-hanger',x+dx,-0.219,hangerZ,0.013,0.19,0.081,'metal');
        box('joist-hanger',x+dx*1.8,-0.219,z+side*0.038,0.067,0.19,0.012,'metal');
      }
    }
  }
  for (const x of [-4.5,-3.9,-3.3,-2.7]) {
    box('floor-blocking',x,-0.18,1.66,0.54,0.28,0.063,'wood');
  }
  for (const x of [3.6,4.2,4.8]) {
    beam('cross-bridging',[x+0.03,-0.071,2.12],[x+0.57,-0.289,2.12],0.045,0.043,'wood');
    beam('cross-bridging',[x+0.03,-0.289,2.17],[x+0.57,-0.071,2.17],0.045,0.043,'wood');
  }
  // The model removes several panels to reveal joists. Thin border strips retain the wall bearing line.
  function deckPatch(x0,x1,z0,z1) {
    box('subfloor',(x0+x1)/2,-0.02,(z0+z1)/2,x1-x0,0.04,z1-z0,'ply');
  }
  for (let row=0; row<6; row++) {
    const z0=-3.67+row*1.2, z1=z0+1.194;
    let left=-5.48;
    const coverTo=row<3 ? 5.48 : (row===3 ? -0.6 : -2.4);
    const edges=[-4.8,-2.4,0,2.4,4.8,5.48].map(x=>x+(row%2 ? 1.2 : 0));
    for (const endpoint of edges.concat([coverTo])) {
      const right=Math.min(coverTo,endpoint);
      if (right>left+0.01) deckPatch(left,right,z0,z1);
      left=Math.max(left,right+0.006);
    }
  }
  deckPatch(-5.48,5.48,3.53,3.68);
  deckPatch(5.33,5.48,-0.07,3.53);

  // Wall-axis helpers keep every member oriented correctly on long and gable walls.
  const studWidth=0.064, wallDepth=0.14, lowerTop=2.768;
  function wallBox(id,axis,plane,u0,u1,y0,y1,depth=wallDepth,material='wood') {
    if (axis==='x') box(id,(u0+u1)/2,(y0+y1)/2,plane,u1-u0,y1-y0,depth,material);
    else box(id,plane,(y0+y1)/2,(u0+u1)/2,depth,y1-y0,u1-u0,material);
  }
  function upright(id,axis,plane,u,y0,y1) {
    wallBox(id,axis,plane,u-studWidth/2,u+studWidth/2,y0,y1);
  }
  for (const [axis,plane,lo,hi,openings] of [
    ['x',3.6,-5.47,5.47,[[-2.5,-0.9,1],[1.6,2.6,0]]],
    ['x',-3.6,-5.47,5.47,[]],
    ['z',5.4,-3.53,3.53,[[-0.95,0.95,1]]],
    ['z',-5.4,-3.53,3.53,[]],
  ]) {
    const door = openings.find(opening=>opening[2]===0);
    if (door) {
      wallBox('bottom-plate',axis,plane,lo,door[0],0,0.062);
      wallBox('bottom-plate',axis,plane,door[1],hi,0,0.062);
    } else wallBox('bottom-plate',axis,plane,lo,hi,0,0.062);
    const mid=(lo+hi)/2;
    wallBox('top-plate',axis,plane,lo,mid-0.002,lowerTop,2.834);
    wallBox('top-plate',axis,plane,mid+0.002,hi,lowerTop,2.834);
    // Upper boards lap the first layer at the corners and across its middle splice.
    const lap=axis==='x' ? -wallDepth : wallDepth;
    wallBox('cap-plate',axis,plane,lo-lap,mid+1.798,2.834,2.9);
    wallBox('cap-plate',axis,plane,mid+1.802,hi+lap,2.834,2.9);
    const cornerLo=lo+0.044,cornerHi=hi-0.044;
    for (const pos of [cornerLo,cornerHi]) upright('corner-stud',axis,plane,pos,0.062,lowerTop);
    for (let n=1; n<Math.round((hi-lo)/0.6); n++) {
      const u=Math.round((lo+0.07+n*0.6)*100)/100;
      if (u>=cornerHi-0.08 || openings.some(([a,b])=>u>a-0.165 && u<b+0.165)) continue;
      upright(axis==='x' && plane<0 ? 'bearing-wall' : 'stud',axis,plane,u,0.062,lowerTop);
    }
    for (const [a,b,sill] of openings) {
      const headY=2.15, headTop=2.40;
      for (const [u,sign] of [[a,-1],[b,1]]) {
        upright('jack-stud',axis,plane,u+sign*studWidth*0.5,0.062,headY);
        upright('king-stud',axis,plane,u+sign*studWidth*1.5,0.062,lowerTop);
      }
      wallBox('header',axis,plane,a-studWidth,b+studWidth,headY,headTop,wallDepth,'darkwood');
      if (sill) wallBox('rough-sill',axis,plane,a,b,sill-0.064,sill);
      const spaces=Math.ceil((b-a)/0.6);
      for (let n=1;n<spaces;n++) {
        const u=a+(b-a)*n/spaces;
        upright('cripple-stud',axis,plane,u,headTop,lowerTop);
        if (sill) upright('cripple-stud',axis,plane,u,0.062,sill-0.064);
      }
    }
  }
  for (const x of [3.9,4.5]) {
    box('wall-backing',x,1.40,3.6,0.536,0.14,wallDepth,'wood');
  }
  // A short interior partition is independent of the exterior roof-bearing walls.
  const partX=-3.6;
  runZ('partition',-3.53,-1.36,partX,0.03,0.11,0.06,'wood');
  runZ('partition',-3.53,-1.36,partX,2.80,0.11,0.064,'wood');
  for (const z of [-3.50,-2.95,-2.40,-1.85,-1.39]) {
    box('partition',partX,1.414,z,0.11,2.708,0.06,'wood');
  }
}

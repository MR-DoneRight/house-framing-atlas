// Working wall, stair, and utility details for the timber-house teaching model.
{
  const vocabulary = {
    exterior: [
      ['e-sheathing','Wall sheathing','Covers the studs with a continuous backing. The wood panels shown can also brace the wall when fastened as designed.','On the outside face of the stud wall, behind the water-control layer.','It supports the layers outside it and helps the framed wall resist sideways forces.','OSB, oriented strand board, plywood sheathing, structural sheathing'],
      ['e-wrap','Housewrap','Forms the water-resistive barrier in this wall and drains water that gets behind the siding.','Over the sheathing and integrated with flashing at openings.','A continuous drainage path keeps rainwater from soaking the wood.','WRB, house wrap, water-resistive barrier, drainage plane, building wrap'],
      ['e-furring','Furring strip','Holds the siding away from the housewrap to form a drainage and drying gap.','Vertical strips between the wrap and the horizontal siding in this example.','The gap gives water a route down and provides an attachment surface for the siding.','rainscreen batten, strapping, rainscreen gap'],
      ['e-siding','Lap siding','Sheds most rain from the face of the wall.','Horizontal courses on the outside, with each upper board overlapping the board below.','The overlap directs water outward while protecting underlying materials.','clapboard, weatherboard, bevel siding, cladding'],
      ['e-corner','Corner board','Finishes the joint where siding ends at an outside corner.','Vertical trim at the end of the siding courses.','It protects vulnerable board ends and gives the siding a clean stopping point.','outside corner trim, corner trim'],
      ['e-frame','Window frame','Holds the sash and anchors the window unit in its opening.','The stationary perimeter around the sash. Its top is the head, its sides are jambs, and its bottom is the sill.','A square, supported frame lets the sash fit and seal.','window jamb, window sill, window head, fixed frame'],
      ['e-sash','Window sash','Holds the glass together as one framed panel.','Inside the fixed window frame, directly around the glass.','In an operable window, the sash moves while the outer frame stays attached to the wall.','sash rail, sash stile, casement sash'],
      ['e-glazing','Glazing','Admits daylight and provides a view through the window.','The glass area held inside the sash.','It separates the indoor space from the weather while letting light through.','windowpane, pane, glass, insulated glass unit'],
      ['e-pan','Sill pan flashing','Collects water that reaches the bottom of the window opening and directs it outside.','Below the window frame, across the rough sill and turned up at the ends.','It gives leaks a way out before they can soak the framing.','sill flashing, pan flashing, window pan'],
      ['e-jamb-flash','Jamb flashing','Seals the sides of the window installation against water entry.','Vertical strips at both sides of the unit, overlapping the ends of the sill pan.','It connects the window edges to the surrounding drainage plane.','flashing tape, side flashing, window flashing'],
      ['e-head-flash','Head flashing','Diverts water over the top of an opening.','Over the window head and side flashing, tied into the water-resistive barrier above.','It keeps runoff moving past the opening instead of behind the frame.','window head flashing, drip cap, cap flashing'],
      ['e-door-jamb','Door jamb','Provides the fixed sides of the doorway that carry the hinges and latch hardware.','Along the two vertical sides of the door leaf. A head jamb joins them at the top.','A secure frame keeps the door aligned so it can swing and latch.','door frame, hinge jamb, strike jamb, head jamb'],
      ['e-door','Door leaf','Opens or closes the passage through the wall.','The moving panel fitted inside the jambs and above the threshold.','The leaf, hardware and seals work together to control access and drafts.','door slab, entry door, exterior door'],
      ['e-threshold','Threshold','Forms the finished transition under the entry door.','Across the bottom of the doorway where indoor and outdoor floors meet.','Its profile and seal help keep wind-driven water and air out.','door sill, entry sill'],
      ['e-weatherstrip','Weatherstripping','Compresses against a closed door to limit air and water leaks.','Along the door stops at the jambs and head.','It seals the clearance that the door needs in order to move.','weather seal, compression seal, door gasket']
    ],
    interior: [
      ['i-batt','Batt insulation','Slows heat flow through the insulated part of the wall.','Fitted into open spaces between the framing members.','Gaps or compressed areas reduce its ability to insulate the wall evenly.','cavity insulation, fiberglass batt, mineral wool batt'],
      ['i-drywall','Drywall','Creates a smooth finish surface on the room side of the framing.','Gypsum panels fastened to studs or other framing behind the painted wall.','It encloses the wall cavity and can contribute to fire and sound control as part of an assembly.','wallboard, gypsum board, plasterboard, sheetrock'],
      ['i-baseboard','Baseboard','Covers the joint between the wall finish and the floor.','Along the bottom edge of the finished interior wall.','It hides the edge joint and protects the wall from everyday knocks.','base molding, base trim, skirting'],
      ['i-floor','Finish flooring','Provides the surface people walk on.','At the top of the floor assembly, above its supporting layers.','It takes foot traffic and everyday wear while the structure carries the load.','finished floor, hardwood flooring, floor covering'],
      ['i-casing','Door casing','Covers the joint between the jamb and the wall finish.','Around the room-side edges of the doorway.','It hides the installation gap and protects the edge of the drywall.','door trim, architrave, casing'],
      ['i-stringer','Stair stringer','Supports the steps along the slope of the stair.','Below the treads and risers. The cut stringers shown have a stepped upper edge.','It transfers weight from each step to the supports at the ends of the flight.','cut stringer, stair carriage'],
      ['i-tread','Stair tread','Forms the walking surface of each step.','Across the top of the stringers at each step.','Its depth and surface affect footing throughout the flight.','step, stair step'],
      ['i-riser','Stair riser','Closes the vertical face between neighboring treads in this closed-riser stair.','Directly below each tread’s front edge.','It closes the opening between steps. The height change between treads is called the rise.','closed riser, rise'],
      ['i-nosing','Stair nosing','Forms the projecting front edge of a tread.','At the leading edge of each step, just past the face of the riser.','A consistent edge helps people find the next foothold.','tread nose, bullnose'],
      ['i-landing','Landing','Provides a level surface at the end of a stair flight.','At the upper end of this flight. Other landings can occur at the bottom or between flights.','It gives people space to enter, leave or change direction on the stairs.','stair landing, half landing'],
      ['i-newel','Newel post','Anchors the stair rail assembly.','At the ends and changes of direction of the railing.','It gives the sloping rail and its infill a secure termination.','newel, stair post'],
      ['i-baluster','Baluster','Fills the space below the top rail on an open side.','The repeated upright spindles between the stair and the top rail.','Together with the rail and posts, the balusters form a barrier along the edge.','spindle, picket, stair balustrade'],
      ['i-handrail','Handrail','Offers a continuous handhold along the flight.','The sloping rail alongside the steps, within reach while climbing or descending.','It provides support and helps a person regain balance.','stair rail, banister'],
      ['i-guard','Landing guard','Forms a protective barrier along the open edge of a landing.','The level railing beside the upper platform.','It helps prevent someone from stepping or falling over the edge.','guardrail, guard, landing rail']
    ],
    services: [
      ['s-panel','Electrical panel','Distributes electricity to the branch circuits that serve the home.','The metal cabinet that houses the breakers.','It groups circuit protection and provides a place to identify individual circuits.','breaker panel, distribution panel, load center, panelboard'],
      ['s-breaker','Circuit breaker','Opens its circuit if the current exceeds its protective trip limits.','The small handled devices fitted inside the electrical panel.','It helps protect circuit wiring against excessive current.','breaker, overcurrent protection'],
      ['s-cable','Branch-circuit cable','Carries power from a breaker to devices on that circuit.','Routed through protected spaces in the building to electrical boxes.','It allows each circuit to serve its intended lights or outlets.','wiring, cable, branch circuit'],
      ['s-box','Electrical box','Encloses electrical connections and supports a device.','Recessed into the wall behind a receptacle, switch or cover.','It protects the connections and gives the device a stable mounting point.','device box, outlet box, junction box'],
      ['s-receptacle','Receptacle','Provides a plug-in connection for electrical equipment.','The slotted device mounted in a box at the wall surface.','It provides a convenient connection to a branch circuit.','outlet, socket, duplex receptacle'],
      ['s-fixture','Sink','Receives water from the faucet and discharges it through a drain.','The basin above the visible supply pipes and trap.','It is where the clean-water and drainage systems meet a daily household use.','lavatory, plumbing fixture, basin'],
      ['s-supply','Water supply line','Carries clean water under pressure to a fixture.','The pair of smaller pipes running toward the faucet.','Separate hot and cold supplies let the fixture deliver water at the desired temperature.','potable water, hot water, cold water, supply pipe'],
      ['s-stop','Fixture shutoff valve','Stops flow to one fixture for service.','Under the sink where each supply line connects to the faucet tubing.','It lets that fixture be isolated without shutting off the entire house.','angle stop, isolation valve, stop valve'],
      ['s-trap','P-trap','Retains a small water seal in the bend after a fixture drain.','In the curved drain fitting directly below the sink.','The water seal blocks sewer gases from entering the room through the drain.','fixture trap, water seal, p trap'],
      ['s-drain','Drain pipe','Carries used water away from the fixture by gravity.','Downstream of the trap and into the vertical drain below the vent connection.','It moves wastewater toward the building drain.','waste line, drainpipe, DWV, drainage pipe'],
      ['s-vent','Plumbing vent','Lets air move through the drainage system as wastewater flows.','The pipe rising above the fixture drain connection and continuing toward open air.','It limits pressure changes that could empty a trap’s water seal.','vent pipe, drain vent, sanitary vent'],
      ['s-handler','Air handler','Moves air through a forced-air heating or cooling system.','The equipment cabinet between the return and supply ducts.','Its blower circulates air between the equipment and the rooms it serves.','blower, fan coil, HVAC equipment'],
      ['s-supplyduct','Supply duct','Carries conditioned air from the equipment toward a room.','The upper duct connecting the air handler to the supply register.','It distributes heated or cooled air to the occupied space.','ductwork, forced air, supply air, HVAC'],
      ['s-return','Return duct','Carries room air back to the equipment.','Between the return grille and the intake side of the air handler.','It completes the circulation path so the system can move air through the home.','return air, return-air duct'],
      ['s-register','Supply register','Delivers air into the room through a louvered face.','At the room end of a supply duct.','Its louvers direct incoming air, and many registers include an adjustable damper.','air register, supply vent, diffuser'],
      ['s-grille','Return grille','Lets room air enter the return duct.','On the room-facing end of the return path.','An open return path lets the blower draw air back from the room.','return air grille, return vent']
    ]
  };
  for (const [group, entries] of Object.entries(vocabulary)) {
    for (const [id, name, purpose, placement, importance, aliases] of entries) {
      term(id, group, name, purpose, placement, importance, aliases);
    }
  }

  // One sloped plank per course. Thin strips of the underlying layers remain visible.
  function siding(left, right, top, z, lower = 0) {
    const courses = Math.max(1, Math.round((top - lower) / .172));
    const exposure = (top - lower) / courses;
    for (let i = 0; i < courses; i++) {
      const y = lower + i * exposure;
      panel('e-siding', [[left,y,z+.014],[right,y,z+.014],[right,y+exposure+.009,z],[left,y+exposure+.009,z]], .016, 'siding');
    }
  }
  scene('house');
  box('e-sheathing', -4.524,1.45,3.679,1.812,2.9,.023,'osb');
  box('e-wrap', -4.69,1.45,3.694,1.48,2.9,.005,'wrap');
  for (const x of [-5.36,-4.91,-4.42]) box('e-furring',x,1.45,3.715,.067,2.9,.036,'wood');
  siding(-5.38,-4.51,2.89,3.751);
  box('e-corner',-5.392,1.45,3.765,.115,2.91,.055,'white');

  scene('enclosure');
  // A single cutaway wall. Give the wall layers window and door openings.
  const wallSections = [
    [-2.55,-1.72,0,2.65],[-.32,.74,0,2.65],[1.8,2.45,0,2.65],
    [-1.72,-.32,0,.85],[-1.72,-.32,2.03,2.65],[.74,1.8,2.12,2.65]
  ];
  function wallLayer(id, z, depth, mat, cutoff, start=-2.55) {
    for (const [lo,hi,bottom,top] of wallSections) {
      const left = Math.max(lo,start), right = Math.min(hi,cutoff);
      if (right > left) box(id,(left+right)/2,(bottom+top)/2,z,right-left,top-bottom,depth,mat);
    }
  }
  wallLayer('i-drywall',-.13,.018,'drywall',2.45);
  wallLayer('i-batt',-.035,.14,'insulation',2.45);
  wallLayer('e-sheathing',.058,.022,'osb',2.26);
  wallLayer('e-wrap',.075,.006,'wrap',2.08);
  for (const x of [-2.46,-1.96,-1.53,-1.05,-.57,-.21,.29,.62,1.09,1.60,1.9]) {
    for (const [left,right,bottom,top] of wallSections) {
      if (x >= left && x <= right) box('e-furring',x,(bottom+top)/2,.103,.047,top-bottom,.048,'wood');
    }
  }
  siding(-2.5,-1.87,2.65,.15);
  siding(-1.87,.53,.68,.15);
  siding(-1.87,.53,2.65,.15,2.27);
  siding(-.16,.53,2.27,.15,.68);
  box('e-corner',-2.51,1.325,.16,.08,2.65,.067,'white');
  const windowX = -1.02;
  box('e-pan',windowX,.85,.031,1.51,.027,.38,'metal');
  box('e-pan',windowX,.819,.217,1.51,.073,.017,'metal');
  for (const x of [-1.756,-.284]) box('e-pan',x,.88,.03,.035,.087,.37,'metal');
  for (const x of [-1.755,-.285]) box('e-jamb-flash',x,1.45,.108,.113,1.24,.014,'membrane');
  box('e-head-flash',windowX,2.088,.10,1.67,.132,.015,'membrane');
  box('e-head-flash',windowX,2.032,.160,1.62,.019,.134,'metal');
  for (const x of [-1.684,-.356]) box('e-frame',x,1.44,.107,.066,1.18,.139,'white');
  for (const y of [.882,1.997]) box('e-frame',windowX,y,.107,1.274,.064,.139,'white');
  const sashLeft=-1.621, sashRight=-.419;
  for (const x of [sashLeft,sashRight]) box('e-sash',x,1.442,.113,.055,1.049,.079,'darkwood');
  for (const y of [.941,1.942]) box('e-sash',windowX,y,.113,1.148,.055,.079,'darkwood');
  box('e-glazing',windowX,1.44,.105,1.148,.947,.023,'glass');
  for (const x of [.774,1.766]) box('e-door-jamb',x,1.065,-.003,.067,2.115,.257,'wood');
  box('e-door-jamb',1.27,2.091,-.003,.929,.058,.257,'wood');
  for (const x of [.819,1.722]) box('e-weatherstrip',x,1.039,-.053,.022,2.04,.032,'rubber');
  box('e-weatherstrip',1.27,2.052,-.053,.919,.023,.032,'rubber');
  box('e-threshold',1.27,.029,.029,1.063,.058,.36,'metal');
  // A partly open door reveals the jamb and seal. The decorative panels and lever turn with it.
  const ux=Math.cos(.40), uz=Math.sin(.40), hinge=.808;
  function doorPoint(along, y, offset) {
    return [hinge+along*ux-offset*uz, y, .092+along*uz+offset*ux];
  }
  function doorFace(lo,hi,bottom,top,offset,thick,mat) {
    panel('e-door',[doorPoint(lo,bottom,offset),doorPoint(hi,bottom,offset),doorPoint(hi,top,offset),doorPoint(lo,top,offset)],thick,mat);
  }
  doorFace(0,.917,.062,2.052,.02,.044,'siding');
  for (const [lo,hi] of [[.07,.44],[.48,.847]]) {
    doorFace(lo,hi,.19,.87,.036,.017,'siding');
    doorFace(lo,hi,1.04,1.91,.036,.017,'siding');
  }
  doorFace(.769,.82,.94,1.055,.048,.03,'metal');
  beam('e-door',doorPoint(.794,1,.05),doorPoint(.794,1,.097),.022,.022,'metal');
  beam('e-door',doorPoint(.794,1,.097),doorPoint(.686,1,.097),.026,.023,'metal');
  for (const x of [.706,1.834]) box('i-casing',x,1.07,-.17,.081,2.14,.051,'white');
  box('i-casing',1.27,2.149,-.17,1.209,.083,.051,'white');
  for (const [lo,hi] of [[-2.55,.67],[1.876,2.45]])
    box('i-baseboard',(lo+hi)/2,.066,-.167,hi-lo,.132,.052,'white');
  for (let i=0;i<6;i++) box('i-floor',-.05,-.024,-.202-i*.129,5,.045,.127,'wood');

  scene('stairs');
  const count=8, run=.285, rise=.176, first=1.51, stairWidth=1.08;
  for (let i=0; i<count; i++) {
    const front=first-i*run, back=front-run, y=(i+1)*rise;
    box('i-tread',(front+back)/2,y-.019,0,run,.038,stairWidth,'wood');
    box('i-riser',front-.012,y-rise/2-.017,0,.023,rise-.035,stairWidth-.048,'white');
    box('i-nosing',front+.015,y-.019,0,.031,.038,stairWidth,'darkwood');
    for (const z of [-.434,.028,.489]) {
      const zFront=z+.024;
      const top=y-.039, lowFront=Math.max(0,top-.29-rise), lowBack=Math.max(0,top-.29);
      panel('i-stringer',[[back,lowBack,zFront],[front,lowFront,zFront],[front,top,zFront],[back,top,zFront]],.049,'darkwood');
    }
  }
  const lastBack=first-count*run, platformY=(count+1)*rise;
  box('i-riser',lastBack-.014,platformY-rise/2-.017,0,.027,rise-.035,stairWidth-.048,'white');
  box('i-landing',lastBack-.45,platformY-.08,0,.9,.16,stairWidth,'wood');
  const railZ=-.49, topX=lastBack-.05, bottomX=first-.075;
  const bottomRailY=rise+.89, topRailY=platformY+.89;
  const railAt=x=>bottomRailY+(topRailY-bottomRailY)*(bottomX-x)/(bottomX-topX);
  for (const [x,y,h] of [[bottomX,rise,.96],[topX,platformY,.96],[lastBack-.854,platformY,.96]]) {
    box('i-newel',x,y+h/2,railZ,.082,h,.082,'darkwood');
    box('i-newel',x,y+h+.011,railZ,.098,.023,.098,'wood');
  }
  beam('i-handrail',[topX,topRailY,railZ],[bottomX,bottomRailY,railZ],.073,.069,'wood');
  for (let i=0; i<count; i++) {
    const y=(i+1)*rise;
    for (const distance of [.134,.249]) {
      const x=first-i*run-distance, top=railAt(x)-.018;
      box('i-baluster',x,(y+top)/2,railZ,.028,top-y,.03,'white');
    }
  }
  const guardEnd=lastBack-.852;
  box('i-guard',(guardEnd+topX)/2,topRailY,railZ,topX-guardEnd,.069,.073,'wood');
  for (let j=1; j<=5; j++) {
    const x=topX-(topX-guardEnd)*j/6;
    box('i-guard',x,platformY+.438,railZ,.028,.876,.03,'white');
  }
  // A short flooring sample marks the start of the flight.
  for (let i=0;i<6;i++) box('i-floor',first+.338,-.027,-.451+i*.18,.68,.054,.176,'wood');

  scene('services');
  // A faceted round pipe is built from one end polygon, extruded along its own axis.
  function tube(id, a, b, diameter, mat) {
    const length=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
    if (!length) return;
    const n=b.map((v,i)=>(v-a[i])/length), cross=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const t=cross(Math.abs(n[1])>.85?[1,0,0]:[0,1,0],n), tLen=Math.hypot(...t);
    const u=t.map(v=>v/tLen), v=cross(n,u), radius=diameter/2, vertices=[];
    for (let j=0;j<8;j++) {
      const angle=j*Math.PI/4;
      vertices.push(b.map((p,k)=>p+radius*(u[k]*Math.cos(angle)+v[k]*Math.sin(angle))));
    }
    panel(id,vertices,length,mat);
  }
  function pipeRun(id, points, diameter, material) {
    for (let i=1; i<points.length; i++) tube(id,points[i-1],points[i],diameter,material);
  }
  // Recessed electrical cabinet, insulated cover and controls.
  box('s-panel',-2.20,1.56,.022,.694,.95,.201,'metal');
  box('s-panel',-2.20,1.56,.133,.623,.87,.033,'zinc');
  box('s-panel',-2.20,1.56,.153,.306,.68,.019,'rubber');
  panel('s-panel',[[-2.55,1.107,.143],[-2.55,2.015,.143],[-2.85,2.015,.466],[-2.85,1.107,.466]],.020,'zinc');
  for (let i=0;i<5;i++) for (const x of [-2.272,-2.128]) {
    box('s-breaker',x,1.30+i*.126,.178,.129,.103,.043,'rubber');
    box('s-breaker',x+(.008*(x< -2.2?1:-1)),1.30+i*.126,.212,.046,.072,.027,'metal');
  }
  pipeRun('s-cable',[[-2.05,1.09,.024],[-2.05,.61,.024],[-1.96,.48,.024],[-1.56,.48,.024],[-1.49,.55,.024],[-1.49,.77,.024]],.044,'wire');
  box('s-box',-1.49,.84,.051,.168,.248,.114,'metal');
  box('s-receptacle',-1.49,.84,.124,.129,.211,.04,'white');
  for (const y of [.789,.886]) {
    for (const x of [-1.507,-1.473]) box('s-receptacle',x,y+.012,.147,.009,.027,.006,'rubber');
    box('s-receptacle',-1.49,y-.013,.147,.012,.012,.006,'rubber');
  }
  // Open basin and faucet above its supply, trap and vent.
  const sx=-.445, frontZ=.565, rearZ=.10;
  box('s-fixture',sx,1.15,.333,.67,.055,.435,'white');
  for(const x of [sx-.332,sx+.332]) box('s-fixture',x,1.235,.333,.051,.139,.465,'white');
  for(const z of [frontZ,rearZ]) box('s-fixture',sx,1.235,z,.715,.139,.042,'white');
  pipeRun('s-fixture',[[sx,1.285,rearZ],[sx,1.436,rearZ],[sx,1.462,.137],[sx,1.462,.23],[sx,1.425,.245]],.039,'metal');
  for (const [x,mat] of [[sx-.176,'copper'],[sx+.176,'water']]) {
    pipeRun('s-supply',[[x,0,-.022],[x,.83,-.022],[x,.83,.08]],.032,mat);
    pipeRun('s-supply',[[x,.866,.078],[x,.966,.075],[x,1.065,.10],[sx+(x-sx)*.65,1.13,.106]],.02,mat);
    tube('s-stop',[x,.805,.079],[x,.869,.079],.068,'metal');
    tube('s-stop',[x,.834,.085],[x,.834,.127],.039,'metal');
    box('s-stop',x,.835,.144,.092,.034,.023,'metal');
  }
  pipeRun('s-trap',[[sx,1.122,.36],[sx,.895,.36],[sx+.019,.842,.36],[sx+.065,.81,.36],[sx+.117,.809,.36],[sx+.164,.835,.36],[sx+.184,.886,.36],[sx+.184,.914,.36],[sx+.213,.938,.36],[sx+.246,.94,.36]],.058,'white');
  const drainX=.274;
  pipeRun('s-drain',[[sx+.246,.94,.36],[drainX-.07,.922,.176],[drainX,.913,.135],[drainX,.72,.135],[drainX,.12,.135],[drainX+.04,.064,.135],[drainX+.303,.054,.135]],.067,'pipe');
  tube('s-vent',[drainX,.912,.135],[drainX,2.31,.135],.061,'pipe');
  // Supply leaves from above and return enters the side of the air handler.
  box('s-handler',1.41,.561,.026,.68,1.12,.53,'metal');
  for(const y of [.33,.852]) box('s-handler',1.41,y,.298,.619,.491,.029,'zinc');
  for(const y of [.364,.883]) box('s-handler',1.664,y,.324,.044,.091,.028,'rubber');
  box('s-supplyduct',1.41,1.56,.026,.438,.877,.36,'zinc');
  box('s-supplyduct',1.895,1.902,.026,.536,.193,.36,'zinc');
  box('s-supplyduct',2.14,1.901,.188,.181,.194,.254,'zinc');
  for (const y of [1.27,1.68,1.954]) box('s-supplyduct',1.408,y,.027,.452,.021,.37,'metal');
  box('s-return',1.984,.282,.026,.47,.364,.375,'zinc');
  box('s-return',2.20,.281,.14,.209,.362,.273,'zinc');
  function airFace(id,x,y,z,w,h) {
    box(id,x,y,z,w,h,.034,'white');
    box(id,x,y,z+.022,w-.035,h-.032,.016,'rubber');
    const slots=5;
    for(let i=0;i<slots;i++) box(id,x,y-h*.34+(h*.68)*i/(slots-1),z+.033,w-.048,.012,.022,'white');
  }
  airFace('s-register',2.14,1.902,.324,.41,.224);
  airFace('s-grille',2.20,.282,.285,.408,.404);
  scene('house');
}

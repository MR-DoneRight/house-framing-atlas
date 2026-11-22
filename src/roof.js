{
  // The house is a conventional tied-rafter gable. Alternate roof systems
  // are shown on separate models to keep their different load paths clear.
  const framing = [
    ['common-rafter','Common rafter','Carries the roof deck and covering.','Runs up the roof slope from an exterior wall to the ridge.','Passes the weight of the roof and snow to the supporting framing.','stick framing, roof rafter'],
    ['ridge-board','Ridge board','Provides a straight surface for fastening opposing rafters.','Stands on edge along the peak of this tied-rafter roof.','Aligns the two roof slopes. The low ties complete the structural triangle.','ridge, ridgeboard'],
    ['rafter-tail','Rafter tail','Extends the rafter past its supporting wall.','Projects outside the wall plate at the low roof edge, or eave.','Supports the overhang that helps keep runoff away from the wall.','eave, overhang, eaves'],
    ['ceiling-joist','Ceiling joist','Supports the ceiling finish below the attic.','Runs horizontally between opposite walls beside the rafter feet.','Carries ceiling loads. A joist properly connected across the building can also act as a rafter tie.','attic joist'],
    ['rafter-tie','Rafter tie','Holds opposing rafter feet together in tension.','Spans between the lower ends of opposing rafters. Here a ceiling-level member serves as the tie.','Keeps the roof load from pushing the supporting walls outward.','tension tie, lower tie'],
    ['collar-tie','Collar tie','Connects opposing rafters near their tops.','Crosses the upper third of the attic below the ridge.','Helps resist wind uplift that can separate rafters at the ridge.','upper tie'],
    ['gable-stud','Gable-end stud','Provides backing for the triangular end wall.','Rises from the end wall to the underside of the gable roof.','Supports the gable-end covering and helps transfer wind loads into the framing.','gable, gable end, gable framing'],
    ['lookout','Lookout','Supports the framing at a projecting gable edge.','Runs outward across the end wall to the fly rafter.','Carries the overhanging rake edge back to the main framing.','outlooker, outlook, gable ladder'],
    ['fly-rafter','Fly rafter','Supports the outer edge of a projecting gable roof.','Follows the sloping rake beyond the gable-end wall.','Gives roof sheathing and gable trim a continuous nailing edge.','barge rafter, verge rafter'],
    ['hurricane-tie','Rafter-to-wall tie','Connects a rafter to the supporting wall.','The bent steel strap wraps beside the rafter at the wall plate.','Helps transfer wind uplift from the roof to the wall connections below.','hurricane tie, hurricane clip, uplift connector'],
    ['hip-rafter','Hip rafter','Supports jack rafters at an outside roof corner.','Runs diagonally from the outside corner toward a ridge end.','Provides a bearing and nailing line where roof planes slope away from one another.','hip, hipped roof'],
    ['hip-jack','Hip jack rafter','Carries a shortened section of roof beside a hip.','Extends from the wall plate up to the hip rafter.','Lets the roof framing fill the narrowing triangular corner.','jack rafter'],
    ['valley-rafter','Valley rafter','Supports the framing along an inside roof intersection.','Runs diagonally up the hollow where a projecting gable meets the main roof.','Collects loads from the shorter rafters beside the valley.','valley, intersecting roof, cross gable'],
    ['valley-jack','Valley jack rafter','Carries a shortened section of roof above a valley.','Runs from the ridge down to the valley rafter.','Completes the framing where the intersecting roof cuts the slope short.','jack rafter'],
    ['roof-truss','Roof truss','Spans between bearings using a connected framework of triangles.','The rear example shows a complete Fink truss. The matching front truss shows its individual parts.','Its chords, webs and joints work together to transfer roof loads to the walls.','prefabricated truss, engineered truss, Fink truss'],
    ['top-chord','Top chord','Forms the upper edge of a roof truss.','Follows the sloping roofline on either side of the truss.','Receives load from the roof deck and passes it into the truss.','truss rafter'],
    ['bottom-chord','Bottom chord','Joins the ends of this triangular truss and supports the ceiling.','Runs horizontally across the bottom of the truss.','Usually carries tension under gravity loads, keeping the bearings from spreading.','ceiling chord'],
    ['truss-web','Truss web','Transfers force between the top and bottom chords.','Forms the W-shaped pattern inside this Fink truss.','Divides the span into connected triangles that resist changing shape.','diagonal web, W truss'],
    ['truss-plate','Truss connector plate','Joins the wood members at a truss joint.','A toothed steel plate is pressed into each face where members meet.','Transfers forces through the joint so the members act as one truss.','gang nail plate, nail plate, gang plate, metal plate connector'],
    ['truss-bearing','Truss bearing','Provides a support for the truss reaction.','At each end, the truss sits on the upper face of the supporting wall plate.','Carries the truss load into the supporting structure below.','bearing point, truss seat'],
    ['birdsmouth','Birdsmouth','Gives a sloping rafter a flat seat on its supporting wall.','The notch at the rafter foot has a horizontal seat cut and a vertical heel cut.','Provides a bearing surface so the rafter can deliver load into the plate.','bird’s mouth, seat cut, heel cut, birds mouth'],
    ['ridge-beam','Structural ridge beam','Carries the upper ends of the rafters.','Runs beneath the roof peak and bears on posts or other designed supports.','Transfers roof load vertically through those supports, allowing an open ceiling when designed for it.','load-bearing ridge, cathedral ceiling'],
    ['ridge-post','Ridge support post','Carries a concentrated load from the ridge beam.','Stands vertically under a beam support point.','Continues the ridge-beam load path toward a bearing wall or footing.','ridge beam post'],
    ['roof-run','Rafter run','Measures horizontal distance for a single roof slope.','The horizontal guide extends from the bearing line to the vertical line below the ridge.','Together with rise, it describes the steepness of the roof.','run, horizontal run'],
    ['roof-rise','Roof rise','Measures the vertical change in roof elevation over a run.','The vertical guide extends from the eave reference level up to ridge level.','Pairs with horizontal run to express slope or calculate rafter geometry.','rise, vertical rise'],
    ['roof-slope','Roof slope','Describes how steeply a roof rises.','The diagonal guide follows a roof with six units of rise for twelve units of horizontal run.','Slope affects drainage and the roof coverings that can be used.','pitch, roof pitch, rise over run, 6/12, six in twelve']
  ];
  const roofing = [
    ['roof-deck','Roof sheathing','Provides a continuous surface for the roof layers.','Panels span the rafters directly below the underlayment. The exposed tan strip is the deck.','Supports the roof covering and helps brace the framing when properly attached.','roof deck, decking, plywood, OSB'],
    ['roof-underlay','Synthetic underlayment','Provides a secondary water-shedding layer.','Covers the roof deck beneath the shingles and laps downslope layers.','Helps guide incidental water toward the eave if it passes the shingles.','roofing underlayment, synthetic felt, dry-in'],
    ['ice-barrier','Ice and water barrier','Seals vulnerable deck areas with a self-adhering membrane.','The exposed strip follows the eave under the starter and field shingles. Similar membranes protect valleys and penetrations.','Helps resist water that backs up beneath the shingles at ice dams or other vulnerable spots.','ice guard, ice shield, ice and water shield, ice-and-water, peel and stick'],
    ['starter-strip','Starter shingle','Forms the first sealed edge under the field shingles.','Runs along the eave beneath the first shingle course. Some systems also call for starter along the rake.','Helps seal the shingle edges against wind uplift and covers joints at the first course.','starter course, shingle starter'],
    ['field-shingle','Architectural shingle','Sheds rain through overlapping asphalt shingle courses.','Covers the main field of the roof, laid in rows that overlap from the eave upward.','The laps carry water downslope and the staggered joints interrupt direct water paths.','laminated shingle, dimensional shingle, asphalt shingle, course, exposure'],
    ['ridge-cap','Ridge cap shingle','Covers the joint between two roof slopes.','Bent cap shingles overlap one another along the ridge, over the ridge vent shown here.','Protects the vulnerable peak while finishing the uppermost shingle edges.','hip and ridge caps, ridge shingles, cap shingles, ridge capping'],
    ['drip-edge','Drip edge','Directs runoff clear of the edge of the roof deck.','A folded metal lip follows the eaves and rakes beneath the roof covering.','Protects the wood edge and helps guide eave runoff toward the gutter.','metal edging, eave flashing, roof edge metal'],
    ['fascia','Fascia','Closes and trims the vertical face at the eave.','Runs along the outer ends of the rafter tails, behind the gutter.','Protects the eave framing and gives the gutter line a finished edge.','fascia board, eave fascia'],
    ['rake-trim','Rake board','Trims the sloping roof edge at a gable end.','Follows the exposed outside face of the fly rafter, from eave to ridge.','Covers the end framing along the gable overhang.','rake, bargeboard, verge board, gable fascia'],
    ['soffit','Soffit','Closes the underside of the overhang.','Spans from the exterior wall to the fascia beneath the eave.','Protects the exposed underside and can carry intake vents.','eave soffit, boxed eaves'],
    ['soffit-vent','Soffit vent','Admits outside air to a vented attic.','The perforated strip fits into the soffit under the eave.','Feeds the ventilation path from the low edge of the roof toward the exhaust near the peak.','intake vent, eave vent, vented soffit'],
    ['vent-baffle','Vent baffle','Maintains a clear channel for intake air above the insulation.','Sits beneath the roof deck between rafters at a vented eave.','Keeps insulation from choking the path between soffit and attic.','rafter vent, ventilation chute, baffle'],
    ['ridge-vent','Ridge vent','Lets air escape near the top of a vented attic.','Sits above an opening in the deck at the ridge and under the cap shingles.','Works with lower intake vents to move air through the attic.','exhaust vent, continuous ridge vent'],
    ['gutter','Gutter','Collects water running off the lower roof edge.','The open trough follows the fascia at the eave and feeds a downspout.','Controls where roof runoff leaves the building.','eavestrough, rain gutter'],
    ['downspout','Downspout','Carries collected rainwater from the gutter toward grade.','The pipe drops from the gutter outlet along the outside wall.','Allows collected roof water to discharge at a planned location away from the foundation.','rain leader, leader, downpipe'],
    ['pipe-boot','Pipe boot flashing','Seals the joint around a pipe that passes through the roof.','A flexible collar grips the pipe and a broad flange laps into the roofing.','Diverts water around the circular opening while allowing some pipe movement.','vent boot, pipe jack, plumbing vent flashing, pipe flange'],
    ['roof-vent-pipe','Plumbing vent stack','Connects the plumbing vent system to outdoor air.','Projects above the roof through a sealed pipe boot.','Helps balance air pressure in the drain system and lets sewer gases escape outdoors.','vent pipe, soil vent, plumbing stack'],
    ['chimney','Masonry chimney','Encloses one or more flues that carry combustion gases outside.','The masonry stack projects through the roof.','Provides a protected path for exhaust and creates a roof intersection that needs flashing.','brick chimney, chimney stack'],
    ['chimney-crown','Chimney crown','Sheds water off the top of the masonry.','Caps the top of the brick stack around the projecting flue.','Helps keep water from entering and damaging the masonry below.','chimney wash'],
    ['flue-liner','Flue liner','Lines the passage carrying exhaust from a combustion appliance.','Projects above the chimney crown and continues down inside the masonry.','Helps contain hot gases inside the venting passage.','flue, clay liner, chimney flue'],
    ['apron-flashing','Apron flashing','Turns water from a vertical surface onto the roof covering below.','The lower face of the chimney has one leg up the masonry and one over the downslope shingles.','Protects the joint at the bottom face of the chimney.','base flashing, front flashing, headwall flashing'],
    ['step-flashing','Step flashing','Moves water past a sidewall in a series of overlapping steps.','Individual L-shaped pieces run up each chimney side, interwoven with the shingle courses.','Keeps the roof-to-wall joint protected as water travels down the slope.','sidewall flashing, step tins, baby tins'],
    ['counterflashing','Counterflashing','Covers the upper edge of the base and step flashings.','The upper edge is set into masonry joints and its lower edge overlaps the flashing below.','Stops water running down the chimney from slipping behind the roof flashing.','counter flashing, cap flashing, reglet'],
    ['cricket','Chimney cricket','Splits runoff and sends it around a chimney.','A small two-sided raised saddle sits on the uphill side of the chimney.','Reduces the water and debris that collect against a wide uphill obstruction.','saddle, chimney saddle, back cricket'],
    ['kickout','Kick-out flashing','Turns sidewall runoff outward at the bottom of a roof slope.','The flared diverter sits at the eave at the end of the sidewall step flashing.','Sends concentrated water away from the wall and toward the gutter.','kickout, diverter flashing'],
    ['skylight','Skylight','Brings daylight through a glazed roof opening.','The glass and frame sit over a raised curb in this example.','Admits light while the surrounding roof details manage water.','roof window, curb-mounted skylight'],
    ['skylight-curb','Skylight curb','Raises and supports a curb-mounted skylight.','The wood frame surrounds the opening between the roof deck and the skylight frame.','Provides an attachment surface and a vertical face for flashing around the opening.','curb frame'],
    ['valley-lining','Valley liner','Adds a waterproof layer along a roof valley.','Runs beneath the shingles in the inward angle between two roof slopes. The sample exposes a strip.','Backs up the roofing where the runoff from two slopes converges.','valley membrane, valley underlayment'],
    ['valley-cover','Closed-cut valley','Routes water through a shingle-covered valley.','One roof slope carries shingles across the valley. The other slope has a trimmed edge along the drainage path.','Sheds water from both roof faces while keeping the valley liner protected.','closed valley, cut valley']
  ];
  for (const entry of framing) term(entry[0], 'roof', ...entry.slice(1));
  for (const entry of roofing) term(entry[0], 'roofing', ...entry.slice(1));

  // Give each roof skin an upward-facing winding, including the back slope.
  function skin(id,x0,x1,z0,z1,elevation,d,mat) {
    if (z0>z1) [z0,z1]=[z1,z0];
    panel(id,[[x0,elevation(z0),z0],[x0,elevation(z1),z1],
              [x1,elevation(z1),z1],[x1,elevation(z0),z0]],d,mat);
  }
  const roofY=z=>5.43-Math.abs(z)*.67;
  const roofAt=offset=>z=>roofY(z)+offset;
  const ridgeX=5.74, tailZ=4.04;
  scene('house');
  box('ridge-board',0,5.25,0,11.48,.32,.084,'darkwood');
  for(let i=0;i<=18;i++){
    const x=-5.4+.6*i;
    for(const s of [-1,1]){
      // The rafter body and its exposed tail are portions of the same board.
      const axis=z=>roofY(z)-.13;
      beam('common-rafter',[x,axis(.04),s*.04],[x,axis(3.6),s*3.6],.087,.218,'wood');
      beam('rafter-tail',[x,axis(3.6),s*3.6],[x,axis(tailZ),s*tailZ],.087,.218,'wood');
      if (i>12 && i%2===0){
        const ox=x+.054;
        box('hurricane-tie',ox,2.893,s*3.555,.025,.243,.072,'zinc');
        box('hurricane-tie',ox+.04,2.794,s*3.575,.104,.045,.113,'zinc');
      }
    }
    const joistId=i%4===0?'rafter-tie':'ceiling-joist';
    box(joistId,x+(i===18?-.085:.085),2.997,0,.073,.193,7.23,'wood');
    if(i%3===0 && i>0 && i<18) box('collar-tie',x+.079,4.657,0,.063,.14,1.974,'wood');
  }
  for(const s of [-1,1]){
    for(let k=-5;k<=5;k++){
      const z=k*.6, h=roofY(z)-.255-2.9;
      box('gable-stud',s*5.4,2.9+h*.5,z,.118,h,.071,'wood');
    }
    for(const side of [-1,1]){
      for(let i=1;i<6;i++){
        const z=side*i*.69;
        box('lookout',s*5.57,roofY(z)-.102,z,.36,.145,.104,'wood');
      }
      beam('fly-rafter',[s*5.74,roofY(.025)-.127,side*.025],[s*5.74,roofY(tailZ)-.127,side*tailZ],.08,.203,'wood');
      if(s<0 || side<0) beam('rake-trim',[s*5.803,roofY(.025)-.108,side*.025],[s*5.803,roofY(tailZ)-.108,side*tailZ],.051,.226,'white');
    }
  }
  for(const side of [-1,1]){
    const back=side<0;
    const deckEnd=back?1.5:.12;
    // Visible steps run from shingles to membrane to OSB to bare rafters.
    const edges=[-5.79,-3.95,-2.12,-.29,deckEnd].filter((n,i,a)=>i===0||n>a[i-1]);
    if(edges[edges.length-1]!==deckEnd) edges.push(deckEnd);
    for(let k=0;k+1<edges.length;k++) for(let row=0;row<3;row++){
      const a=.055+row*1.329,b=row===2?tailZ:.055+(row+1)*1.329-.008;
      skin('roof-deck',edges[k]+.004,edges[k+1]-.004,side*a,side*b,roofAt(.038),.05,'osb');
    }
    skin('roof-underlay',-5.81,back?.68:-.68,side*.05,side*3.21,roofAt(.059),.015,'membrane');
    skin('ice-barrier',-5.81,back?.73:-.64,side*3.15,side*4.045,roofAt(.062),.014,'ice');
    // Under the visible starter edge and overlapping first shingle row.
    skin('starter-strip',-5.83,back?.25:-1.26,side*3.79,side*4.068,roofAt(.079),.02,'cap');
    const shingleEnd=back?-.28:-1.73;
    for(let row=0;row<18;row++){
      const edge=4.055-row*.226,upper=Math.max(.028,edge-.223);
      const xEnd=shingleEnd+(row%2===0?.12:-.10);
      const xStart=-5.833;
      // Every slab is a pickable exposed shingle face. Staggered joints
      // reproduce the coursing without constructing invisible overlap.
      for(let xx=xStart-(row%3)*.283;xx<xEnd;xx+=.869){
        const a=Math.max(xStart,xx+.004),b=Math.min(xEnd,xx+.864);
        if(b-a>.025) skin('field-shingle',a,b,side*upper,side*edge,roofAt(.102),.027,'shingle');
      }
    }
    skin('ridge-vent',-5.45,-.77,side*.012,side*.149,roofAt(.136),.064,'rubber');
    for(let x=-5.83;x<-.985;x+=.426){
      const x1=Math.min(x+.42,-.985);
      skin('ridge-cap',x,x1,side*.001,side*.194,roofAt(.167),.035,'cap');
    }
    // Deliberate cutaway at the eave leaves the remaining rafter tails exposed.
    const xf=back?5.75:.96;
    box('fascia',(xf-5.79)/2,roofY(tailZ)-.107,side*4.072,xf+5.79,.25,.052,'white');
    const xe=back?1.50:.12;
    skin('drip-edge',-5.825,xe,side*3.962,side*4.089,roofAt(.048),.011,'zinc');
    box('drip-edge',(xe-5.825)/2,roofY(4.083)+.021,side*4.091,xe+5.825,.071,.019,'zinc');
    box('soffit',-2.475,2.604,side*3.715,6.62,.035,.225,'white');
    box('soffit',-2.475,2.604,side*3.984,6.62,.035,.147,'white');
    box('soffit-vent',-2.475,2.604,side*3.871,6.62,.025,.084,'zinc');
    for(let j=0;j<14;j++) box('soffit-vent',-5.6+j*.469,2.588,side*3.871,.28,.008,.036,'rubber');
    if(!back){
      for(const x of [1.5,2.1]) {
        skin('vent-baffle',x-.226,x+.226,2.42,3.60,roofAt(-.088),.028,'ice');
        for(const dx of [-.228,.228]) beam('vent-baffle',[x+dx,roofY(2.42)-.071,2.42],[x+dx,roofY(3.60)-.071,3.60],.028,.05,'ice');
      }
    }
  }
  // Open trough with an outlet and elbow returning the leader toward the wall.
  const gutterX=-3.3,gutterLen=5.0,gy=2.622;
  box('gutter',gutterX,gy,4.19,gutterLen,.034,.186,'zinc');
  box('gutter',gutterX,gy+.073,4.094,gutterLen,.155,.022,'zinc');
  box('gutter',gutterX,gy+.064,4.284,gutterLen,.06,.025,'zinc');
  box('gutter',gutterX,gy+.115,4.26,gutterLen,.066,.045,'zinc');
  for(const x of [gutterX-gutterLen/2,gutterX+gutterLen/2]) box('gutter',x,gy+.062,4.185,.027,.14,.182,'zinc');
  const outletX=-5.14;
  box('downspout',outletX,2.518,4.2,.121,.20,.11,'zinc');
  beam('downspout',[outletX,2.43,4.2],[outletX,2.15,3.755],.122,.109,'zinc');
  box('downspout',outletX,1.03,3.755,.124,2.27,.108,'zinc');
  beam('downspout',[outletX,-.077,3.755],[outletX,-.215,4.1],.124,.11,'zinc');

  // Faceted hollow pipe. Surface panels preserve the dark open flue at its top.
  function tube(id,x,z,r0,r1,y0,y1,mat,segments=12){
    for(let j=0;j<segments;j++){
      const a=j*2*Math.PI/segments,b=(j+1)*2*Math.PI/segments;
      panel(id,[[x+Math.cos(a)*r0,y0,z+Math.sin(a)*r0],[x+Math.cos(a)*r1,y1,z+Math.sin(a)*r1],[x+Math.cos(b)*r1,y1,z+Math.sin(b)*r1],[x+Math.cos(b)*r0,y0,z+Math.sin(b)*r0]],.012,mat);
    }
  }
  const pz=1.67,px=-3.59,py=roofY(pz);
  skin('pipe-boot',px-.268,px+.268,pz-.339,pz+.336,roofAt(.132),.021,'zinc');
  tube('pipe-boot',px,pz,.205,.112,py+.17,py+.38,'rubber');
  tube('roof-vent-pipe',px,pz,.093,.093,py+.358,py+.883,'pipe');

  scene('junction');
  const half=2.5,hipEnd=4.4,ridgeEnd=hipEnd-half,eaveY=.48,pitch=.67;
  const peak=eaveY+half*pitch;
  const main=(z)=>peak-Math.abs(z)*pitch;
  const wing=(x)=>eaveY+(1.25-Math.abs(x))*pitch;
  box('ridge-board',0,peak,0,ridgeEnd*2,.17,.066,'darkwood');
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    beam('hip-rafter',[sx*ridgeEnd,peak,0],[sx*hipEnd,eaveY,sz*half],.125,.175,'darkwood');
    for(let i=1;i<5;i++){
      const t=i/5,x=ridgeEnd+half*t,z=half*t,y=eaveY+(half-z)*pitch;
      beam('hip-jack',[sx*x,y,sz*z],[sx*x,eaveY,sz*half],.071,.12,'wood');
      beam('hip-jack',[sx*x,y,sz*z],[sx*hipEnd,eaveY,sz*z],.071,.12,'wood');
    }
  }
  for(let i=-3;i<=3;i++){
    const x=i*.56,inside=Math.abs(x)<1.25;
    beam('common-rafter',[x,peak,-.03],[x,eaveY,-half],.071,.14,'wood');
    const z=inside?1.25+Math.abs(x):half;
    beam(inside?'valley-jack':'common-rafter',[x,peak,.03],[x,main(z),z],.071,.14,'wood');
  }
  const wingPeak=wing(0),tip=4.22;
  box('ridge-board',0,wingPeak,(1.25+tip)/2,.066,.15,tip-1.25,'darkwood');
  for(const s of [-1,1]){
    beam('valley-rafter',[0,wingPeak,1.25],[s*1.25,eaveY,2.5],.123,.174,'darkwood');
    for(const z of [1.63,2.03,2.43,2.86,3.28,3.7,4.18]){
      const to=z<2.5?z-1.25:1.25;
      beam(z<2.5?'valley-jack':'common-rafter',[s*.024,wingPeak,z],[s*to,wing(to),z],.073,.123,'wood');
    }
  }
  // A narrow cutaway along the left valley exposes deck and membrane.
  function valleyBand(id,t0,t1,offset0,offset1,wingSide,lift,material,thickness){
    const point=(t,o)=>{
      const x=-1.25*t+o,z=1.25+1.25*t+o;
      const y=wingSide?wing(x):main(z);
      return [x,y+lift,z];
    };
    const pts=[point(t0,offset0),point(t1,offset0),point(t1,offset1),point(t0,offset1)];
    // The first and second edges have a positive y cross product here.
    panel(id,pts,thickness,material);
  }
  for(const w of [false,true]){
    const side=w?1:-1;
    valleyBand('roof-deck',.1,.97,Math.min(0,side*.31),Math.max(0,side*.31),w,.127,'osb',.063);
    valleyBand('valley-lining',.14,.97,Math.min(0,side*.246),Math.max(0,side*.246),w,.15,'ice',.018);
    for(let i=0;i<5;i++){
      const a=.20+i*.112,b=a+.109;
      // The two surfaces meet at a closed shingled water channel.
      valleyBand('valley-cover',a,b,Math.min(0,side*.211),Math.max(0,side*.211),w,.175,'shingle',.021);
    }
  }

  scene('truss');
  // The front unit is dissected by member type. The rear unit is selectable as a whole.
  for (const [z,whole] of [[-1.38,true],[.95,false]]){
    const left=[-3.56,.62,z],right=[3.56,.62,z],apex=[0,2.65,z];
    const lt=[-1.78,1.635,z],rt=[1.78,1.635,z],lb=[-1.17,.62,z],rb=[1.17,.62,z];
    const id=(key)=>whole?'roof-truss':key;
    beam(id('top-chord'),left,apex,.116,.178,'wood');
    beam(id('top-chord'),apex,right,.116,.178,'wood');
    beam(id('bottom-chord'),left,right,.116,.171,'darkwood');
    for(const [a,b] of [[lt,lb],[lb,apex],[apex,rb],[rb,rt]]) beam(id('truss-web'),a,b,.11,.135,'wood');
    for(const v of [left,right,apex,lb,rb,lt,rt]) for(const side of [-1,1])
      box(id('truss-plate'),v[0],v[1],z+side*.065,.27,.184,.018,'zinc');
    for (const x of [-3.54,3.54]) box('truss-bearing',x,.411,z,.29,.22,.48,'wood');
  }

  scene('flashing');
  const flashY=(z)=>1.35-.47*z;
  const cover=(id,x0,x1,z0,z1,lift,d,mat)=>skin(id,x0,x1,z0,z1,z=>flashY(z)+lift,d,mat);
  const eave=2.22;
  term('roof-sidewall','roofing','Roof sidewall','Forms the vertical wall beside a sloping roof.','Runs parallel to the direction of drainage at the left edge of this detail.','Creates an inside corner that needs a continuous path for runoff.','roof-to-wall, wall abutment');
  term('skylight-head','roofing','Skylight head flashing','Diverts water around the top of the skylight.','The upper piece fits along the uphill side of the curb and under the roofing above.','Keeps runoff from entering behind the skylight.','skylight saddle, head flashing');
  term('skylight-sill','roofing','Skylight sill flashing','Carries water from the skylight onto the roofing.','The apron runs along the downhill side of the curb and laps over the shingles below.','Gives water from the glazing and side flashings a path back onto the roof.','sill flashing, skylight apron');
  function cutStrips(x0,x1,holes) {
    let intervals=[[x0,x1]];
    for (const [a,b] of holes){
      const next=[];
      for (const [lo,hi] of intervals){
        if(a>=hi||b<=lo) next.push([lo,hi]);
        else {if(a>lo) next.push([lo,a]); if(b<hi) next.push([b,hi]);}
      }
      intervals=next;
    }
    return intervals;
  }
  const chimney={x:-.40,z:-.08,w:1.32,d:1.08};
  const sky={x:1.85,z:.37,w:1.24,d:1.48};
  const holesAt=(zm0,zm1)=>[chimney,sky].filter(o=>zm0<o.z+o.d*.5&&zm1>o.z-o.d*.5).map(o=>[o.x-o.w*.5,o.x+o.w*.5]);
  // Tiling around the actual openings makes their underside legible when rotated.
  const boundaries=[-1.9,chimney.z-chimney.d/2,sky.z-sky.d/2,chimney.z+chimney.d/2,sky.z+sky.d/2,eave].sort((a,b)=>a-b);
  for(let k=0;k+1<boundaries.length;k++){
    const z0=boundaries[k],z1=boundaries[k+1];
    for(const [a,b] of cutStrips(-3.49,3.49,holesAt(z0+.002,z1-.002)))
      cover('roof-deck',a,b,z0,z1,0,.094,'osb');
  }
  for(let row=0;row<15;row++){
    const high=eave-row*.277,low=Math.max(-1.9,high-.273);
    const breaks=[low,...boundaries.filter(v=>v>low&&v<high),high].sort((a,b)=>a-b);
    for(let k=0;k+1<breaks.length;k++) {
      const a=breaks[k],b=breaks[k+1];
      for(const [l,r] of cutStrips(-3.47,3.47,holesAt(a+.0001,b-.0001))){
        for(let x=-3.49-(row%2)*.53;x<r;x+=1.08){
          const lft=Math.max(l,x+.003),rgt=Math.min(r,x+1.072);
          if(rgt-lft>.013)cover('field-shingle',lft,rgt,a,b,.022,.016,'shingle');
        }
      }
    }
  }
  // Sidewall step flashings and the distinct flared kick-out at the bottom.
  panel('roof-sidewall',[[-3.49,flashY(-1.9),-1.9],[-3.49,flashY(-1.9)+.98,-1.9],[-3.49,flashY(eave)+.98,eave],[-3.49,flashY(eave),eave]],.082,'ply');
  function stepPiece(x,z0,z1,side){
    const f=z=>flashY(z)+.036;
    const xEdge=x+side*.153;
    cover('step-flashing',Math.min(x,xEdge),Math.max(x,xEdge),z0,z1,.043,.018,'zinc');
    panel('step-flashing',[[x,f(z0),z0],[x,f(z0)+.217,z0],[x,f(z1)+.217,z1],[x,f(z1),z1]],.015,'zinc');
  }
  for(let i=0;i<14;i++){
    const z0=-1.9+i*.277;
    stepPiece(-3.441,z0,z0+.273,1);
  }
  const kz=eave-.255,ky=flashY(kz)+.035;
  panel('kickout',[[-3.428,ky,kz],[-3.428,ky+.243,kz],[-3.054,flashY(eave)+.228,eave],[-3.054,flashY(eave)+.025,eave]],.023,'zinc');
  cover('kickout',-3.438,-3.048,kz,eave,.047,.021,'zinc');
  box('gutter',0,flashY(eave)-.066,eave+.104,6.99,.035,.228,'zinc');
  for(const dz of [.002,.208])box('gutter',0,flashY(eave)-.01,eave+dz,6.99,.115,.022,'zinc');

  // Brick faces project a little above a mortar-colored core and its recessed joints.
  const cx=chimney.x,cz=chimney.z,hw=chimney.w*.5,hd=chimney.d*.5;
  const top=3.49,bt=flashY(cz+hd)-.23;
  box('chimney',cx,(bt+top)/2,cz,hw*2,top-bt,hd*2,'concrete');
  const courses=12,brickHeight=(top-bt)/courses;
  for(let i=0;i<courses;i++){
    const y=bt+(i+.5)*brickHeight;
    for(const [wallLen,alongX] of [[hw*2,true],[hd*2,false]]){
      const brickWidth=.461;
      for(let u=-wallLen/2-(i%2)*brickWidth/2;u<wallLen/2;u+=brickWidth){
        const a=Math.max(u,-wallLen/2)+.008,b=Math.min(u+brickWidth,wallLen/2)-.008;
        if(b<=a)continue;
        for(const s of [-1,1]){
          if(alongX)box('chimney',cx+(a+b)/2,y,cz+s*(hd+.006),b-a,brickHeight-.017,.019,'brick');
          else box('chimney',cx+s*(hw+.006),y,cz+(a+b)/2,.019,brickHeight-.017,b-a,'brick');
        }
      }
    }
  }
  box('chimney-crown',cx,top+.052,cz,1.48,.114,1.23,'concrete');
  const flueY=top+.208;
  for(const s of [-1,1]){
    box('flue-liner',cx+s*.254,flueY,cz,.056,.269,.491,'brick');
    box('flue-liner',cx,flueY,cz+s*.218,.453,.269,.056,'brick');
  }
  const front=cz+hd,back=cz-hd;
  cover('apron-flashing',cx-hw-.095,cx+hw+.095,front+.013,front+.30,.047,.014,'zinc');
  box('apron-flashing',cx,flashY(front)+.15,front+.031,hw*2+.066,.249,.022,'zinc');
  box('counterflashing',cx,flashY(front)+.302,front+.055,hw*2+.097,.194,.024,'copper');
  for(const side of [-1,1]){
    for(let i=0;i<4;i++){
      const a=back+i*hd*.5,b=a+hd*.5-.006;
      stepPiece(cx+side*(hw+.036),a,b,side);
      box('counterflashing',cx+side*(hw+.063),flashY(b)+.251,(a+b)*.5,.024,.197,b-a+.014,'copper');
    }
  }
  const saddleTip=[cx,flashY(back-.83)+.044,back-.83];
  const saddlePeak=[cx,flashY(back)+.436,back];
  for(const side of [-1,1]){
    const pts=[saddleTip,saddlePeak,[cx+side*(hw+.057),flashY(back)+.047,back]];
    panel('cricket',side>0?pts:pts.reverse(),.029,'zinc');
  }
  const sx=sky.x,sz=sky.z,sw=sky.w*.5,sd=sky.d*.5;
  for(const side of [-1,1]){
    cover('skylight-curb',sx+side*sw-.05,sx+side*sw+.05,sz-sd,sz+sd,.283,.255,'wood');
    cover('skylight-curb',sx-sw+.041,sx+sw-.041,sz+side*sd-.049,sz+side*sd+.049,.283,.255,'wood');
    cover('skylight',sx+side*sw-.066,sx+side*sw+.066,sz-sd-.055,sz+sd+.055,.33,.06,'metal');
    cover('skylight',sx-sw+.047,sx+sw-.047,sz+side*sd-.061,sz+side*sd+.061,.33,.06,'metal');
    for(let k=0;k<5;k++){
      const z0=sz-sd+k*(2*sd/5);
      stepPiece(sx+side*(sw+.056),z0,z0+2*sd/5-.005,side);
    }
  }
  cover('skylight',sx-sw+.059,sx+sw-.059,sz-sd+.053,sz+sd-.053,.306,.036,'glass');
  cover('skylight-head',sx-sw-.126,sx+sw+.126,sz-sd-.245,sz-sd-.024,.061,.022,'zinc');
  box('skylight-head',sx,flashY(sz-sd)+.153,sz-sd-.053,sky.w+.141,.189,.022,'zinc');
  cover('skylight-sill',sx-sw-.134,sx+sw+.134,sz+sd+.024,sz+sd+.258,.062,.022,'zinc');
  box('skylight-sill',sx,flashY(sz+sd)+.144,sz+sd+.058,sky.w+.152,.191,.022,'zinc');

  scene('slope');
  // Beam-and-post construction, kept apart from the ridge-board example.
  const rs=3.3,ry=2.87,raz=-.53;
  box('ridge-beam',0,ry-.233,raz,.224,.439,2.16,'darkwood');
  const postHeight=ry-.233-.439/2;
  for(const z of [raz-.96,raz+.96]){
    box('ridge-post',0,postHeight/2,z,.191,postHeight,.195,'wood');
  }
  // Section profiles keep the horizontal bearing notch visible on the front rafter.
  function seatedRafter(side,z){
    const point=(a,b)=>[side*a,b,z+.074];
    const topAt=x=>ry-.5*x+.198,botAt=x=>ry-.5*x-.037;
    const bearingX=3.19,bearingEnd=3.4,seat=botAt(bearingX);
    const toWorld=(pts)=>side>0?pts.slice().reverse():pts;
    const inner=.008;
    const wall=[point(inner,topAt(inner)),point(bearingX,topAt(bearingX)),point(bearingX,botAt(bearingX)),point(inner,botAt(inner))];
    const notch=[point(bearingX,topAt(bearingX)),point(bearingEnd,topAt(bearingEnd)),point(bearingEnd,seat),point(bearingX,seat)];
    const tail=[point(bearingEnd,topAt(bearingEnd)),point(3.89,topAt(3.89)),point(3.89,botAt(3.89)),point(bearingEnd,botAt(bearingEnd))];
    panel('common-rafter',toWorld(wall),.148,'wood');
    panel('birdsmouth',toWorld(notch),.148,'endgrain');
    panel('rafter-tail',toWorld(tail),.148,'wood');
    // Small wall-top sample shows the bearing surface below the notch.
    termSeat(side,seat,bearingX,bearingEnd,z);
  }
  term('rafter-bearing','roof','Rafter bearing','Provides the contact surface that supports the rafter foot.','The level seat at the birdsmouth rests on the wall plate.','Transfers roof load into the wall through direct wood-to-wood contact.','bearing seat, rafter seat');
  function termSeat(side,y,x0,x1,z){
    box('rafter-bearing',side*(x0+x1)/2,y-.105,z,x1-x0,.21,.44,'wood');
  }
  for(const z of [raz-.79,raz+.72]) for(const s of [-1,1])seatedRafter(s,z);
  const base=ry-rs*.5, guideZ=1.00;
  beam('roof-run',[0,base,guideZ],[rs,base,guideZ],.06,.052,'copper');
  box('roof-rise',0,(ry+base)/2,guideZ,.061,ry-base,.06,'copper');
  beam('roof-slope',[0,ry,guideZ],[rs,base,guideZ],.061,.055,'zinc');
  scene('house');
}

{
  scene('engineered');
  const floorTypes = [
    ['i-joist','Engineered wood I-joist','Carries floor loads with two wood flanges joined by a thin structural web.','The parallel I-shaped members under the subfloor, each spanning between the sill and the beam.','The flanges resist bending while the web transfers shear between them. Together they form one lightweight joist.','wood I-beam, wood I joist, engineered floor joist'],
    ['i-flange','I-joist flange','Resists the stretching and squeezing that occur as a joist bends.','The wider wood strips along the top and bottom edges of an I-joist.','Keeping the flanges apart gives the joist bending strength. A cut or notch can seriously weaken a flange.','top flange, bottom flange, chord'],
    ['i-web','I-joist web','Connects the flanges and carries shear, the force that tends to slide adjacent parts past one another.','The thin vertical panel between an I-joist’s two flanges. This example uses oriented strand board (OSB).','It lets the two flanges act together. Service holes must follow the rules for the particular joist.','web panel, OSB web, oriented strand board web'],
    ['lvl-beam','Laminated veneer lumber beam','Supports the crossing joists and carries their reactions to the posts below.','The deep beam beneath the joists near the projecting edge of the floor.','Its layers of wood veneer run mainly in the same direction, along the beam, to carry bending loads.','LVL, structural composite lumber, engineered drop beam'],
    ['engineered-rim','Engineered rim board','Closes the ends of an engineered floor and helps hold the joists upright.','A full-depth structural board across the joist ends. Part of the near corner is cut away to reveal their I shape.','It ties the floor perimeter together and can transfer loads through the floor edge.','rimboard, engineered band board, structural rim board'],
    ['web-stiffener','Web stiffener','Reinforces the thin joist web where there is a concentrated force.','A short wood panel on each side of the front web, over the sill between the flanges.','At this bearing point the stiffeners help the web resist buckling. Their fit depends on the joist and the location of the load.','bearing stiffener, I-joist reinforcement'],
    ['squash-block','Squash blocks','Carry a concentrated load through the depth of a floor, beside the joist.','The paired upright wood blocks directly beneath the cut-off column and on top of the beam.','They provide a short path around the joist for the load from above.','load-transfer block, crush block, column blocking'],
    ['edge-blocking','I-joist blocking panel','Restrains joists at a bearing line and helps transfer forces across the floor.','Short full-depth panels between the joists, over the beam at the start of the overhang.','Bracing at the support helps prevent the joists from turning on their sides.','engineered blocking panel, cantilever blocking, rim board blocking'],
    ['point-load','Point load','Concentrates weight into one small support area.','The cut-off wood column above the beam applies a load at its base.', 'The floor needs a continuous load path under that spot. Here the squash blocks carry the load to the beam.','concentrated load, column load, bearing point'],
    ['floor-cantilever','Floor cantilever','Extends the floor past the line of support.','The projecting end of the front I-joist, beyond the outer face of the beam.', 'The portion extending back into the floor anchors the projection. The permitted overhang depends on the loads and joist design.','floor overhang, projecting joist, backspan'],
    ['oc-spacing','On-center spacing','Describes the distance between the centerlines of repeated members.','The blue transverse marker beyond the joist ends connects the centers of the two front joists.','Center-to-center layout establishes consistent support spacing for the subfloor panels.','on centre, o.c., center to center, joist spacing'],
    ['clear-span','Clear span','Measures the open distance a framing member crosses between its supports.','The long blue marker alongside the front joist runs from the inside face of the sill support to the near face of the beam.','The unsupported distance affects how much a member bends under load.','unsupported span, bearing face, joist span'],
    ['floor-adhesive','Subfloor adhesive','Bonds the subfloor panel to the joist flange along the contact line.','The exposed bead on the top flange continues under the cut edge of the subfloor.','Used with the specified fasteners, it helps limit movement between the decking and the joists.','construction adhesive, glue bead, glued floor system'],
    ['panel-tongue','Tongue-and-groove joint','Interlocks the edges of adjoining subfloor panels.','The narrow projecting tongue at the exposed panel edge fits a groove in the adjoining panel.','The interlocking edges support each other between joists and limit differences in height at the seam.','T&G, T and G, panel joint, subfloor seam'],
  ];
  for (const entry of floorTypes) term(entry[0],'floor',...entry.slice(1));

  const zLines=[-1.65,-0.99,-0.33,0.33,0.99,1.65];
  const left=-3.08, right=2.82, bearingFace=2.16;
  const floorBottom=0.08, floorTop=0.54, flangeHeight=0.076;
  function joistSegment(a,b,z,flangeId,webId) {
    const x=(a+b)/2, length=b-a;
    for (const y of [floorBottom+flangeHeight/2, floorTop-flangeHeight/2]) {
      box(flangeId,x,y,z,length,flangeHeight,0.15,'wood');
    }
    box(webId,x,(floorTop+floorBottom)/2,z,length,floorTop-floorBottom-2*flangeHeight,0.029,'osb');
  }
  for (let i=0;i<zLines.length;i++) {
    const z=zLines[i];
    if (i===zLines.length-1) {
      joistSegment(left,bearingFace,z,'i-flange','i-web');
      joistSegment(bearingFace,right,z,'floor-cantilever','floor-cantilever');
    } else if (i===zLines.length-2) {
      joistSegment(left,right,z,'i-joist','i-joist');
    } else {
      joistSegment(left,right,z,'i-flange','i-web');
    }
  }

  // A section through two foundations exposes their distinct bearing arrangements.
  box('stem-wall',-2.96,-0.37,0,0.30,0.70,3.60,'concrete');
  box('sill-plate',-2.96,0.03,0,0.30,0.10,3.60,'darkwood');
  box('footing',-2.96,-0.82,0,0.54,0.20,3.77,'concrete');
  for (const z of [-1.35,1.35]) {
    box('pad-footing',2.00,-0.82,z,0.48,0.20,0.48,'concrete');
    box('pier',2.00,-0.66,z,0.34,0.12,0.34,'concrete');
    box('support-post',2.00,-0.51,z,0.22,0.18,0.22,'darkwood');
  }
  // Veneers run lengthwise along the beam. Their edges show at the cut end.
  const plies=9, plyWidth=0.32/plies;
  for (let i=0;i<plies;i++) {
    box('lvl-beam',1.84+(i+0.5)*plyWidth,-0.17,0,plyWidth,0.50,3.63,i%3===0?'ply':'wood');
  }
  const rimDepth=0.053;
  box('engineered-rim',left-rimDepth/2,0.31,0,rimDepth,0.46,3.45,'osb');
  box('engineered-rim',right+rimDepth/2,0.31,-0.665,rimDepth,0.46,2.12,'osb');

  // Reinforce the web at the bearing, with a visible gap beneath the top flange.
  for (const dz of [-0.043,0.043]) {
    box('web-stiffener',-2.955,0.301,1.65+dz,0.20,0.290,0.057,'ply');
  }
  for (const z of [-1.32,-0.66,1.32]) {
    box('edge-blocking',2.00,0.31,z,0.063,0.46,0.51,'osb');
  }
  // The column stacks over full-depth blocks on either side of one joist.
  for (const z of [0.205,0.455]) {
    box('squash-block',2.00,0.31,z,0.23,0.46,0.092,'wood');
  }
  box('subfloor',2.00,0.565,0.33,0.65,0.05,0.60,'ply');
  box('point-load',2.00,0.89,0.33,0.25,0.60,0.38,'darkwood');

  // The deck steps back to expose the web, flanges and adhesive below it.
  box('subfloor',-0.087,0.565,-1.028,6.02,0.05,1.394,'ply');
  box('subfloor',-2.145,0.565,0.3315,1.90,0.05,1.321,'ply');
  box('panel-tongue',-1.173,0.565,0.3315,0.044,0.022,1.315,'wood');
  box('floor-adhesive',-1.50,0.548,0.99,2.50,0.016,0.027,'wire');

  // Blue dimension marks depict distances, keeping physical members distinct.
  const guideZ=1.97, guideY=0.09;
  box('clear-span',(-2.81+1.84)/2,guideY,guideZ,1.84+2.81,0.019,0.019,'water');
  for(const x of [-2.81,1.84]) {
    box('clear-span',x,guideY,guideZ,0.021,0.021,0.22,'water');
  }
  const guideX=3.08;
  box('oc-spacing',guideX,0.545,1.32,0.02,0.020,0.66,'water');
  for (const z of [0.99,1.65]) {
    box('oc-spacing',2.985,0.545,z,0.32,0.020,0.020,'water');
  }
  scene('house');
}

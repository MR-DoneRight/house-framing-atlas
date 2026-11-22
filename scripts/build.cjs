const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,'src',f),'utf8');
const buildDir=path.join(root,'build');
fs.mkdirSync(buildDir,{recursive:true});
const iconPaths={
  brand:'M2 11 11 3l10 8 M5 10v10h13V10 M8 18v-6l3-3 4 4v5 M3 16l7-6',
  book:'M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z M12 6v14',
  help:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1.1-2 1.4-2 3 M12 16.8h.01',
  cube:'M12 2.5 21 7.5v9L12 22l-9-5.5v-9z M3 7.5 12 13l9-5.5 M12 13v9',
  orbit:'M17.8 10.3C20 10.7 21 11.4 21 12.4c0 2-4 3.6-9 3.6s-9-1.6-9-3.6c0-1.2 1.5-2.3 4-2.9 M6 7l1 2.5L5 11 M9 7a4 4 0 1 1 6 5 M12 19v2',
  'left-orbit':'M8 5 4 9l4 4 M4 9h10a5 5 0 0 1 0 10h-3',
  'right-orbit':'m16 5 4 4-4 4 M20 9H10a5 5 0 0 0 0 10h3',
  minus:'M5 12h14',plus:'M5 12h14 M12 5v14',fit:'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5',
  focus:'M3 8V3h5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5 M12 8l4 2v5l-4 2-4-2v-5z',
  'arrow-left':'m14.5 6-6 6 6 6','arrow-right':'m9.5 6 6 6-6 6',close:'m6 6 12 12 M18 6 6 18',
  search:'M17 17l4 4 M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z'
};
const lucideNames={book:'book-open',help:'circle-help',cube:'box',orbit:'rotate-3d','left-orbit':'rotate-ccw','right-orbit':'rotate-cw',minus:'minus',plus:'plus',fit:'maximize',focus:'focus','arrow-left':'chevron-left','arrow-right':'chevron-right',close:'x',search:'search'};
const shell=read('shell.html');
const files=['model.js','structure.js','envelope.js','roof.js','floortypes.js','roof-lines.js'];
files.push('renderer.js','software.js','application.js');
const script='<script>\n(()=>{\n"use strict";\n'+files.map(read).join('\n')+'\n})();\n</script>';
const standalone=shell.replace(/<span(?: class="brand-icon" aria-hidden="true")? data-icon="([^"]+)"><\/span>/g,(_,name)=>{
  const icon='<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="'+iconPaths[name]+'"/></svg>';
  return name==='brand'?'<span class="brand-icon">'+icon+'</span>':icon;
});
const html='<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>House Framing Atlas · Done Right Roofing</title><style>'+read('atlas.css')+'</style></head><body>'+standalone+script+'</body></html>';
fs.writeFileSync(path.join(buildDir,'House Framing Atlas.html'),html);
fs.copyFileSync(path.join(root,'share','Open on my phone.cmd'),path.join(buildDir,'Open on my phone.cmd'));
fs.writeFileSync(path.join(root,'index.html'),html.replace('</head>',read('share-head.html').trimEnd()+'\n</head>'));
const inline=shell.replace('<div id="framing-atlas">','<div id="framing-atlas" class="inline-atlas">')
  .replace(/<div class="brand">.*?<\/div>/,'<h2>House Framing Atlas</h2>')
  .replace(/<span data-icon="([^"]+)"><\/span>/g,(_,n)=>'<i data-lucide="'+lucideNames[n]+'" aria-hidden="true"></i>')
  .replace(/ title="([^"]+)"/g,' data-tooltip="$1"')
  .replaceAll('class="gesture"','class="gesture text-small"').replaceAll('class="legend"','class="legend text-small"')
  .replace('class="part-group"','class="part-group text-small"').replace('class="browse"','class="browse text-small"');
fs.writeFileSync(path.join(buildDir,'house-framing-atlas-inline.html'),'<style>'+read('inline.css')+'</style>\n'+inline+script);
console.log('Built index.html and the standalone and inline editions in build/.');

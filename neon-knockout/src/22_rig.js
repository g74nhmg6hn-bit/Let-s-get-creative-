// ===== CHARACTER RENDERER =====
// Each character is still the same skeleton rig (see targetPose), but every body
// part is rasterized pixel by pixel into an offscreen buffer: tapered, shaded
// limbs with hue-shifted colour ramps, costume details per part, hand-drawn
// pixel heads, then a clean 1px silhouette outline, inner lines where a part
// overlaps another, and a neon rim light on the back edge.

// --- colour ramps ---------------------------------------------------------
function hexRGB(h){const n=parseInt(h.slice(1,7),16);return [n>>16,(n>>8)&255,n&255]}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
 if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return [h,s,l]}
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;s=clamp(s,0,1);l=clamp(l,0,1);if(!s){const v=Math.round(l*255);return [v,v,v]}
 const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t<0&&(t+=1);t>1&&(t-=1);return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};
 return [Math.round(f(h+1/3)*255),Math.round(f(h)*255),Math.round(f(h-1/3)*255)]}
const U32=(r,g,b)=>(0xff000000|(b<<16)|(g<<8)|r)>>>0;
const hexU=h=>{const c=hexRGB(h);return U32(c[0],c[1],c[2])};
// hue moves toward purple in shadow and toward warm yellow in light
const hueTo=(h,tgt,amt)=>{let d=((tgt-h+540)%360)-180;return h+clamp(d,-amt,amt)};
const RAMPS=[];
// ramp levels: 0 line (darkest), 1 shadow, 2 base, 3 light, 4 highlight
function RA(hex,o){o=o||{};const [h,s,l]=rgb2hsl(...hexRGB(hex));const k=o.k||1;
 const mk=(dl,ht,ha,ds)=>U32(...hsl2rgb(hueTo(h,ht,ha*k),s+ds,l+dl*k));
 const c=[mk(-.30,265,26,.06),mk(-.15,260,14,.04),hexU(hex),mk(.11,50,8,-.03),mk(.24,50,14,-.12)];
 if(o.line)c[0]=hexU(o.line);
 const r={c,id:RAMPS.length,glow:!!o.glow,shiny:!!o.shiny};RAMPS.push(r);return r}
function FLAT(hex,glow){const u=hexU(hex);const r={c:[u,u,u,u,u],id:RAMPS.length,glow:!!glow};RAMPS.push(r);return r}
const M=(r,l)=>(r.id<<3)|clamp(l|0,0,4);

// --- buffer ---------------------------------------------------------------
const RBW=256,RBH=200,RAX=128,RAY=150;
const rcv=document.createElement('canvas');rcv.width=RBW;rcv.height=RBH;const rctx=rcv.getContext('2d');
const rimg=rctx.createImageData(RBW,RBH),rpx=new Uint32Array(rimg.data.buffer);
const rcode=new Int32Array(RBW*RBH),rgid=new Uint8Array(RBW*RBH);
let rx0,ry0,rx1,ry1,RF=1,RGID=0,RDIM=0,RTGT=null,RLAST=null;
const LX=.5,LY=-.7,LZ=.5;
function rbegin(f){rx0=RBW;ry0=RBH;rx1=-1;ry1=-1;RF=f;RGID=0}
function rgroup(dim){RGID++;RDIM=dim||0}
function rput(x,y,code){if(x<1||y<1||x>=RBW-1||y>=RBH-1||code<0)return;const i=y*RBW+x;rcode[i]=code;rgid[i]=RGID;
 if(x<rx0)rx0=x;if(x>rx1)rx1=x;if(y<ry0)ry0=y;if(y>ry1)ry1=y}
// default light level for a pixel with cross-section position v (-1 back/down .. 1 front/up)
function lvlOf(nl,shiny){return nl>(shiny?.64:9)?4:nl>.5?3:nl>.08?2:1}
// tapered capsule from A to B, radius r0 at A and r1 at B. mat(u,v,l,L,ny) returns M(ramp,level) or -1.
function rcap(ax,ay,bx,by,r0,r1,mat){
 const dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1e-4,ux=dx/L,uy=dy/L,px=uy*RF,py=-ux*RF,rm=Math.max(r0,r1);
 const k=px*LX*RF+py*LY;
 const x0=Math.floor(Math.min(ax,bx)-rm-1),x1=Math.ceil(Math.max(ax,bx)+rm+1),y0=Math.floor(Math.min(ay,by)-rm-1),y1=Math.ceil(Math.max(ay,by)+rm+1);
 for(let y=y0;y<=y1;y++){const yc=y+.5;let tlo=0,thi=1;
  if(Math.abs(dy)>1e-4){const t1=(yc-rm-ay)/dy,t2=(yc+rm-ay)/dy;tlo=Math.max(0,Math.min(t1,t2));thi=Math.min(1,Math.max(t1,t2));if(tlo>thi)continue}else if(Math.abs(yc-ay)>rm)continue;
  const xa=ax+dx*tlo,xb=ax+dx*thi,xs=Math.max(x0,Math.floor(Math.min(xa,xb)-rm)),xe=Math.min(x1,Math.ceil(Math.max(xa,xb)+rm));
  for(let x=xs;x<=xe;x++){const cx=x+.5-ax,cy=yc-ay;let t=(cx*ux+cy*uy)/L;const tc=t<0?0:t>1?1:t;
  const r=r0+(r1-r0)*tc,qx=cx-ux*L*tc,qy=cy-uy*L*tc,d2=qx*qx+qy*qy;if(d2>r*r)continue;
  const v=(qx*px+qy*py)/Math.max(.5,r),nl=v*k+Math.sqrt(Math.max(0,1-v*v))*LZ;
  const ny=v*py;rput(x,y,mat(tc*L,v,lvlOf(nl,0)-RDIM,L,ny,nl))}}}
// hand-drawn sprite: rows of chars, pal maps char -> code (or fn). anchor (cx,cy) in sprite = buffer (x,y)
function rspr(rows,pal,cx,cy,x,y,ang){
 const w=rows[0].length,h=rows.length;if(Math.abs(ang)<.22)ang=0;
 if(!ang){const X=Math.floor(x),Y=Math.floor(y);for(let gy=0;gy<h;gy++){const row=rows[gy];for(let i=-w;i<=w;i++){const gx=Math.floor((i+.5)*RF+cx);if(gx<0||gx>=w)continue;const ch=row[gx];if(ch==='.')continue;
   const c=pal[ch];if(c!==undefined)rput(X+i,Y+gy-Math.floor(cy),c)}}return}
 const cr=Math.cos(ang),sr=Math.sin(ang),R2=Math.ceil(Math.hypot(w,h)/2+2);
 for(let j=-R2;j<=R2;j++)for(let i=-R2;i<=R2;i++){const a=(i+.5)*RF,b=j+.5;const lx=a*cr+b*sr,ly=-a*sr+b*cr;
  const gx=Math.floor(lx+cx),gy=Math.floor(ly+cy);if(gx<0||gy<0||gx>=w||gy>=h)continue;const ch=rows[gy][gx];if(ch==='.')continue;
  const c=pal[ch];if(c===undefined)continue;rput(Math.floor(x)+i,Math.floor(y)+j,typeof c==='function'?c():c)}}
function rrect(x,y,w,h,fn){x=Math.round(x);y=Math.round(y);for(let j=0;j<h;j++)for(let i=0;i<w;i++)rput(x+i,y+j,fn(i,j,w,h))}
const RIMC={};function rimU(){return RIMC[RIM]||(RIMC[RIM]=hexRGB(RIM))}
// finish: inner lines, outline, rim light, blit to ctx at screen (sx,sy)
function rend(sx,sy,ov,noOutline){
 if(rx1<0)return;const X0=Math.max(0,rx0-1),Y0=Math.max(0,ry0-1),X1=Math.min(RBW-1,rx1+1),Y1=Math.min(RBH-1,ry1+1);
 const ovU=ov?hexU(ov):0,OUTU=hexU(ov||OUT),rim=rimU();
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const i=y*RBW+x,g=rgid[i];
  if(!g){if(noOutline){rpx[i]=0;continue}
   const n=(rgid[i-1]?1:0)|(rgid[i+1]?1:0)|(rgid[i-RBW]?1:0)|(rgid[i+RBW]?1:0);rpx[i]=n?OUTU:0;continue}
  if(ov){rpx[i]=ovU;continue}
  const code=rcode[i],rp=RAMPS[code>>3];let lv=code&7;
  if(!rp.glow){const gl=rgid[i-1],gr=rgid[i+1],gu=rgid[i-RBW],gd=rgid[i+RBW];
   if((gl&&gl<g)||(gr&&gr<g)||(gu&&gu<g)||(gd&&gd<g)){rpx[i]=rp.c[0];continue}
   const back=rgid[i-RF];
   if(!back&&lv<4){const c=rp.c[lv],r=c&255,gg=(c>>8)&255,b=(c>>16)&255;rpx[i]=U32((r*2+rim[0])/3|0,(gg*2+rim[1])/3|0,(b*2+rim[2])/3|0);continue}}
  rpx[i]=rp.c[lv]}
 const w=X1-X0+1,h=Y1-Y0+1;rctx.putImageData(rimg,0,0,X0,Y0,w,h);
 if(RTGT){const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(rcv,X0,Y0,w,h,0,0,w,h);RLAST={c,ox:X0-RAX,oy:Y0-RAY}}
 else ctx.drawImage(rcv,X0,Y0,w,h,sx-RAX+X0,sy-RAY+Y0,w,h);
 for(let y=Y0;y<=Y1;y++){rgid.fill(0,y*RBW+X0,y*RBW+X1+1);rpx.fill(0,y*RBW+X0,y*RBW+X1+1)}}

// --- palettes ---------------------------------------------------------------
const PAL={
 juno:{skin:RA('#f1b58c',{line:'#8a3f3a'}),hair:RA('#ff2a8a'),jak:RA('#16c9d9'),top:RA('#2a1d44'),pants:RA('#2b1f52',{k:.7}),stripe:RA('#ff3d96'),
  shoe:RA('#eeeef6',{k:.7}),sole:RA('#ff2a8a'),tape:RA('#e9e4f2',{k:.6}),belt:RA('#18121f'),buck:RA('#d8d8e8',{shiny:1}),eye:FLAT('#ffffff'),iris:FLAT('#1aa9c9'),pup:FLAT('#140a24'),mouth:FLAT('#7a2438'),band:RA('#f4f4f8',{k:.6})},
 grunt:{skin:RA('#c98b62',{line:'#5e2e1e'}),hood:RA('#ff7a1a'),pants:RA('#55566a',{k:.7}),patch:RA('#3d3e4e',{k:.7}),boot:RA('#2e2e38',{shiny:1}),sole:RA('#141418'),lace:RA('#9a9aaa'),
  tape:RA('#ddd3c2',{k:.6}),logo:FLAT('#ffe14a',1),str:RA('#f2e8da',{k:.5}),stub:RA('#7a5440'),eye:FLAT('#fff4d0'),pup:FLAT('#1a0e08'),mouth:FLAT('#4a1a14'),shade:RA('#2a2a33')},
 shield:{skin:RA('#a8735a',{line:'#4a2a1e'}),arm:RA('#3d5bd0',{shiny:1}),suit:RA('#262a40',{k:.7}),pad:RA('#56607e',{shiny:1}),glove:RA('#1c1e2a',{shiny:1}),belt:RA('#1a1b26'),pouch:RA('#323850'),
  buck:RA('#f9c80e',{shiny:1}),boot:RA('#181a24',{shiny:1}),helm:RA('#3a4668',{shiny:1}),visor:FLAT('#5ff3ff',1),visor2:FLAT('#c8ffff',1),visorA:FLAT('#ff3b5c',1),visorA2:FLAT('#ffc0c8',1),mouth:FLAT('#3a1a14'),
  glass:RA('#3f63d8'),gEdge:RA('#9cc0ff',{shiny:1}),tag:FLAT('#ff3df0'),tag2:FLAT('#f9c80e')},
 knife:{skin:RA('#e0a07a',{line:'#7a3a2a'}),jak:RA('#2b9a4a'),pants:RA('#202032',{k:.7}),strap:RA('#4a3424'),hilt:RA('#6a6a7a',{shiny:1}),shoe:RA('#3e3e4e',{shiny:1}),sole:RA('#7dff3f'),
  glove:RA('#16161f'),scarf:RA('#7dff3f'),visor:FLAT('#b6ff5c',1),visor2:FLAT('#f0ffd0',1),hawk:RA('#7dff3f'),mouth:FLAT('#5a2a20'),zip:RA('#c8d0c8',{shiny:1})},
 boss:{skin:RA('#8a5a3e',{line:'#2e1a10'}),suit:RA('#6a1fb0',{shiny:1}),lapel:RA('#3d1070'),shirt:RA('#1e1428'),gold:RA('#ffd23f',{shiny:1}),pants:RA('#2a1838',{k:.8}),boot:RA('#d4a017',{shiny:1}),
  cape:RA('#2e0a52'),lining:RA('#c0143c'),fur:RA('#f0e8dc',{k:.6}),beard:RA('#24140c',{k:.6}),gem:FLAT('#ff3df0',1),gemR:FLAT('#ff3b5c',1),eye:FLAT('#ff3df0',1),eyeR:FLAT('#ff3b5c',1),white:FLAT('#ffffff',1),teeth:FLAT('#f4ecdc'),shade:FLAT('#140a1c')}
};

// --- costume materials ------------------------------------------------------
// u: px along the part from its start, v: -1..1 across (front/up positive), l: shaded level, L: part length, ny: screen-down normal
const MAT={
 juno:{
  thigh:(u,v,l,L)=>Math.abs(v+.05)<.2?M(PAL.juno.stripe,l):M(PAL.juno.pants,l),
  shin:(u,v,l,L)=>u>L-1.6?M(PAL.juno.pants,l-1):Math.abs(v+.05)<.2?M(PAL.juno.stripe,l):M(PAL.juno.pants,l),
  foot:(u,v,l,L,ny)=>ny>.45?M(PAL.juno.sole,l):(u<2&&v>.3)?M(PAL.juno.sole,2):M(PAL.juno.shoe,l+(u>L-1.5?1:0)),
  pelvis:(u,v,l,L)=>Math.abs(v+.05)<.18?M(PAL.juno.stripe,l):M(PAL.juno.pants,l),
  torso:(u,v,l,L)=>{const k=u/L;if(k<.07)return v>.5?M(PAL.juno.buck,3):M(PAL.juno.belt,l);if(k<.15)return M(PAL.juno.jak,1);
   if(v>.5&&k<.9)return v<.64?M(PAL.juno.jak,4):M(PAL.juno.top,l);if(k>.84&&v<.1)return M(PAL.juno.jak,l+1);if(k>.45&&k<.6&&v<-.35)return M(PAL.juno.stripe,2);return M(PAL.juno.jak,l)},
  uarm:(u,v,l,L)=>u>L-1.8?M(PAL.juno.jak,l+1):M(PAL.juno.jak,l),
  farm:(u,v,l,L)=>u>L-2.4?M(PAL.juno.tape,l):M(PAL.juno.skin,l),
  hand:(u,v,l,L)=>u>L*.45?M(PAL.juno.tape,l):M(PAL.juno.skin,l),
  neck:(u,v,l)=>M(PAL.juno.skin,l-1)
 },
 grunt:{
  thigh:(u,v,l,L)=>(u>L*.35&&u<L*.7&&v>-.1&&v<.75)?(u<L*.35+1.2?M(PAL.grunt.patch,l+1):M(PAL.grunt.patch,l)):u>L-2.2?M(PAL.grunt.patch,l):M(PAL.grunt.pants,l),
  shin:(u,v,l,L)=>u<1.6?M(PAL.grunt.patch,l):u>L-2.5?(v>.1&&((u|0)%2)?M(PAL.grunt.lace,3):M(PAL.grunt.boot,l)):M(PAL.grunt.pants,l),
  foot:(u,v,l,L,ny)=>ny>.35?M(PAL.grunt.sole,l):M(PAL.grunt.boot,l+(u>L-1.5&&ny<-.2?1:0)),
  pelvis:(u,v,l,L)=>u>L-2?M(PAL.grunt.hood,l-1):M(PAL.grunt.pants,l),
  torso:(u,v,l,L)=>{const k=u/L;
   if(k<.16)return M(PAL.grunt.hood,l-1);
   if(k>.18&&k<.46&&v>.05&&v<.95)return (k<.22||v<.15)?M(PAL.grunt.hood,1):M(PAL.grunt.hood,l);
   if(k>.6&&k<.74&&v>.35&&v<.75){const yy=Math.floor((k-.6)/.14*4),xx=Math.floor((v-.35)/.4*3);return ((yy===0&&xx>0)||(yy===1&&xx===1)||(yy===2)||(yy===3&&xx<2))?M(PAL.grunt.logo,2):M(PAL.grunt.hood,l)}
   if(k>.74&&v>.78&&v<1)return M(PAL.grunt.str,l);
   return M(PAL.grunt.hood,l)},
  uarm:(u,v,l,L)=>u>L-2?M(PAL.grunt.hood,l-1):M(PAL.grunt.hood,l-(v<-.2?1:0)),
  farm:(u,v,l,L)=>u<1.4?M(PAL.grunt.hood,l-1):u>L-2.2?M(PAL.grunt.tape,l):M(PAL.grunt.skin,l),
  hand:(u,v,l,L)=>u>L*.4?M(PAL.grunt.tape,l):M(PAL.grunt.skin,l),
  neck:(u,v,l)=>M(PAL.grunt.hood,l-1)
 },
 shield:{
  thigh:(u,v,l,L)=>u>L-2.6?M(PAL.shield.pad,l+(v>.2?1:0)):(u>L*.3&&u<L*.6&&v<-.1)?M(PAL.shield.pouch,l):M(PAL.shield.suit,l),
  shin:(u,v,l,L)=>u<2.2?M(PAL.shield.pad,l+(v>.2?1:0)):u>L-3?M(PAL.shield.boot,l):((u|0)===Math.round(L*.45)?M(PAL.shield.suit,1):M(PAL.shield.suit,l)),
  foot:(u,v,l,L,ny)=>ny>.4?M(PAL.shield.belt,1):M(PAL.shield.boot,l),
  pelvis:(u,v,l,L)=>u>L-2.4?(v>.5?M(PAL.shield.buck,3):(v<-.3?M(PAL.shield.pouch,l):M(PAL.shield.belt,l))):M(PAL.shield.suit,l),
  torso:(u,v,l,L)=>{const k=u/L;if(k<.12)return M(PAL.shield.suit,l);
   const band=Math.floor((k-.12)/.88*5);const fr=(k-.12)/.88*5-band;
   if(fr<.18)return M(PAL.shield.arm,1);if(band===4&&v<-.2)return M(PAL.shield.arm,l+1);
   if(v>.15&&v<.32)return M(PAL.shield.arm,l-1);return M(PAL.shield.arm,l+(fr>.75&&v>.3?1:0))},
  uarm:(u,v,l,L)=>u<L*.45?M(PAL.shield.pad,l+(u<1.5?1:0)):u>L-2?M(PAL.shield.pad,l):M(PAL.shield.suit,l),
  farm:(u,v,l,L)=>u>L-3?M(PAL.shield.glove,l):M(PAL.shield.arm,l),
  hand:(u,v,l)=>M(PAL.shield.glove,l),
  neck:(u,v,l)=>M(PAL.shield.suit,l-1)
 },
 knife:{
  thigh:(u,v,l,L)=>(Math.abs(u-L*.45)<1.1)?M(PAL.knife.strap,l):(u>L*.45-4&&u<L*.45+1&&v<-.35&&v>-.95)?M(PAL.knife.hilt,l):M(PAL.knife.pants,l),
  shin:(u,v,l,L)=>(Math.abs(u-L*.5)<.9)?M(PAL.knife.strap,l):M(PAL.knife.pants,l),
  foot:(u,v,l,L,ny)=>ny>.45?M(PAL.knife.sole,2):M(PAL.knife.shoe,l),
  pelvis:(u,v,l,L)=>u>L-1.8?M(PAL.knife.strap,l):M(PAL.knife.pants,l),
  torso:(u,v,l,L)=>{const k=u/L;if(k<.12)return M(PAL.knife.jak,l-1);if(Math.abs(v-.5)<.13&&k<.85)return M(PAL.knife.zip,l);
   if(k>.8)return M(PAL.knife.jak,l+(v<0?1:0));if(k>.35&&k<.5&&v<-.2)return M(PAL.knife.jak,1);return M(PAL.knife.jak,l)},
  uarm:(u,v,l,L)=>M(PAL.knife.jak,l),
  farm:(u,v,l,L)=>u<1.3?M(PAL.knife.jak,l-1):u>L-3?M(PAL.knife.glove,l):M(PAL.knife.skin,l),
  hand:(u,v,l,L)=>u>L*.55?M(PAL.knife.skin,l):M(PAL.knife.glove,l),
  neck:(u,v,l)=>M(PAL.knife.skin,l-1)
 },
 boss:{
  thigh:(u,v,l,L)=>M(PAL.boss.pants,l+(Math.abs(v-.4)<.12?1:0)),
  shin:(u,v,l,L)=>u>L-4.5?(u<L-3.5?M(PAL.boss.gold,4):M(PAL.boss.boot,l)):M(PAL.boss.pants,l+(Math.abs(v-.4)<.12?1:0)),
  foot:(u,v,l,L,ny)=>ny>.4?M(PAL.boss.gold,1):M(PAL.boss.boot,l+(u>L-2&&ny<0?1:0)),
  pelvis:(u,v,l,L)=>u>L-2.8?(v>.45?M(PAL.boss.gold,l+1):M(PAL.boss.shirt,l)):M(PAL.boss.pants,l),
  torso:(u,v,l,L)=>{const k=u/L;
   if(v>.25&&v<.62&&k>.2)return (v<.33?M(PAL.boss.lapel,1):(k>.55?M(PAL.boss.shirt,l):M(PAL.boss.lapel,l)));
   if(v>=.62&&k>.25&&k<.75){const bt=(k-.25)/.5*3;if(Math.abs(bt-Math.round(bt))<.14&&v>.7&&v<.9)return M(PAL.boss.gold,4)}
   if(k>.6&&k<.86&&Math.abs(v-(k-.6)*2.2)<.12)return M(PAL.boss.gold,(u|0)%2?4:2);
   if(k<.12)return M(PAL.boss.suit,l-1);return M(PAL.boss.suit,l)},
  uarm:(u,v,l,L)=>u<1.6&&v>0?M(PAL.boss.gold,3):M(PAL.boss.suit,l-(v<-.3?1:0)),
  farm:(u,v,l,L)=>u>L-2.6?M(PAL.boss.fur,l):M(PAL.boss.suit,l),
  hand:(u,v,l)=>M(PAL.boss.skin,l),
  neck:(u,v,l)=>M(PAL.boss.fur,l)
 }
};
// secondary (springy) parts
const SECM={
 hair:(u,v,l,L)=>M(PAL.juno.hair,l+(Math.abs(v-.1)<.25&&u<L*.7?1:0)-(u>L-2?1:0)),
 tail:(u,v,l)=>M(PAL.juno.jak,l-1),
 hood:(u,v,l)=>M(PAL.grunt.hood,l-1),
 scarf:(u,v,l,L)=>M(PAL.knife.scarf,l+((u|0)%4===0?-1:0)),
 cape:(u,v,l,L)=>{if(v<-.82)return M(PAL.boss.gold,2);if(v>.78&&u<L*.6)return M(PAL.boss.lining,1);const f=Math.sin(v*7+u*.15);return M(PAL.boss.cape,f>.55?3:f<-.5?1:2)}
};
// part radii (as fractions of the rig widths)
const BUILD={
 juno:{th:[1.15,.85],sh:[.85,.7],ft:[.75,.6],ua:[1,.9],fa:[.9,.8],hd:1.15,to:[.38,.5],pv:.3},
 grunt:{th:[1.15,.85],sh:[.85,.8],ft:[.8,.7],ua:[1.2,1],fa:[1.05,.95],hd:1.2,to:[.45,.56],pv:.36},
 shield:{th:[1.1,.9],sh:[.95,.85],ft:[.85,.75],ua:[1.25,1],fa:[1,1],hd:1.15,to:[.46,.56],pv:.36},
 knife:{th:[1.2,.8],sh:[.8,.65],ft:[.7,.55],ua:[.9,.8],fa:[.85,.75],hd:1.1,to:[.38,.46],pv:.36},
 boss:{th:[1.1,.85],sh:[.85,.8],ft:[.8,.7],ua:[1.3,1.05],fa:[1.15,1.05],hd:1.2,to:[.44,.58],pv:.36}
};

// --- heads (facing right). '.' = empty ------------------------------------
const HEADS={
 juno:{cx:6.5,cy:7.5,rows:[
  '....34443....',
  '..233455432..',
  '.23334444332.',
  '1233333333332',
  '12wwwwwwwwwww',
  '12333cc3ccc3.',
  '123ccbbcccbbd',
  '123ac@#cc@#c.',
  '12acc$#cc$#dc',
  '123bbcccccccb',
  '1232bcccc&&c.',
  '.12.bbcccccb.',
  '......bbbb...'],
  pal:()=>{const P=PAL.juno;return {'1':M(P.hair,0),'2':M(P.hair,1),'3':M(P.hair,2),'4':M(P.hair,3),'5':M(P.hair,4),w:M(P.band,3),a:M(P.skin,0),b:M(P.skin,1),c:M(P.skin,2),d:M(P.skin,3),
   '@':M(P.eye,2),'#':M(P.pup,2),'$':M(P.iris,2),'&':M(P.mouth,2)}},
  ex:{angry:{6:'123cccbbccbbb',7:'123ac@#cc@#c.',10:'1232bccc&&&c.'},hurt:{6:'123ccbccccbcd',7:'123acc#cc#cc.',8:'12acc#ccc#cdc',10:'1232bccc&&cc.'},happy:{7:'123acbcccbcc.',8:'12accbccccbdc',10:'1232bcc&&&&c.'}}},
 grunt:{cx:7,cy:8,rows:[
  '.....3333.....',
  '...33344443...',
  '..3333444443..',
  '.233333344443.',
  '.2333333333433',
  '12333bbbbbbb33',
  '1233baaabbaab3',
  '1233bc@#cc@#c3',
  '1233bcc#ccc#c.',
  '123bbcccccccdd',
  '1223bcccccccd.',
  '12233sssm&&s..',
  '.1223ssssss...',
  '..122.sss.....'],
  pal:()=>{const P=PAL.grunt;return {'1':M(P.hood,0),'2':M(P.hood,1),'3':M(P.hood,2),'4':M(P.hood,3),a:M(P.skin,0),b:M(P.skin,1),c:M(P.skin,2),d:M(P.skin,3),s:M(P.stub,2),m:M(P.stub,1),
   '@':M(P.eye,2),'#':M(P.pup,2),'&':M(P.mouth,2)}},
  ex:{angry:{6:'1233bbaabaaab3',7:'1233bc@#cb@#c3',11:'12233ss&&&&s..'},hurt:{6:'1233bbabbbbab3',7:'1233bcc#ccc#c3',8:'1233bc#cccc#c.',11:'12233ssm&&&s..'},happy:{7:'1233bcbccccbc3',8:'1233bccccccc..',11:'12233s&&&&ss..'}}},
 shield:{cx:7,cy:8,rows:[
  '....444444....',
  '..3344555443..',
  '.333444444443.',
  '23333333333332',
  '23333333333333',
  '2233gggggggGGG',
  '2233gggggGGGGg',
  '22233333333333',
  '2223333333333.',
  '222233bcccccc.',
  '.222213bccc&c.',
  '..222.1bcccc..',
  '.......bbb....'],
  pal:()=>{const P=PAL.shield;return {'1':M(P.helm,0),'2':M(P.helm,1),'3':M(P.helm,2),'4':M(P.helm,3),'5':M(P.helm,4),b:M(P.skin,1),c:M(P.skin,2),'&':M(P.mouth,2),g:M(P.visor,2),G:M(P.visor2,2)}},
  ex:{angry:{5:'2233xxxxxxxXXX',6:'2233xxxxxXXXXx',10:'.222213bcc&&c.'}},angryPal:()=>({x:M(PAL.shield.visorA,2),X:M(PAL.shield.visorA2,2)})},
 knife:{cx:6,cy:9,rows:[
  '......44.....',
  '.....3453....',
  '....33443....',
  '...2333442...',
  '..2bbbbbbb...',
  '.2bcccccccc..',
  '.2bccbbbccc..',
  '.2bgggggGGGg.',
  '.2bccgggggc..',
  '.2bbcccccccc.',
  '..2bccccccc..',
  '...bbccc&&c..',
  '....bbcccc...',
  '......bb.....'],
  pal:()=>{const P=PAL.knife;return {'2':M(P.hawk,1),'3':M(P.hawk,2),'4':M(P.hawk,3),'5':M(P.hawk,4),b:M(P.skin,1),c:M(P.skin,2),'&':M(P.mouth,2),g:M(P.visor,2),G:M(P.visor2,2)}},
  ex:{angry:{11:'...bbcc&&&c..'},hurt:{11:'...bbccc&cc..'},happy:{11:'...bbc&&&&c..'}}},
 boss:{cx:9,cy:12,rows:[
  '......g...g...g.....',
  '.....gGg.gRg.gGg....',
  '.....gggggggggggg...',
  '.....GGGGGGGGGGGG...',
  '.....gggggggggggg...',
  '....bbbbbbbbbbbbbb..',
  '...bbcccccccccccccb.',
  '..bbcccccccccccccccb',
  '..bccccccccccccccccc',
  '..bccccccaaaacaaaaac',
  '..bcccccc##eccc##ec.',
  '..abccccccccccccccc.',
  '..abcccccccccccbcccc',
  '..aabccccccccccbccc.',
  '..aaabzzzzzzzzzzzzz.',
  '...aazzzzzzttttzzzz.',
  '....azzzzzzzzzzzzz..',
  '.....azzzzzzzzzzz...',
  '......zzzzzzzzzz....',
  '........zzzzzz......'],
  pal:()=>{const P=PAL.boss;return {g:M(P.gold,2),G:M(P.gold,4),R:M(P.gem,2),a:M(P.skin,0),b:M(P.skin,1),c:M(P.skin,2),'#':M(P.shade,2),e:M(P.eye,2),z:M(P.beard,2),t:M(P.teeth,2)}},
  ex:{angry:{9:'..bccccccaaaaaaaaaac',10:'..bcccccca##ecca##ec',15:'...aazzzzzttttttzzz.'},hurt:{10:'..bcccccc###cccc###.',15:'...aazzzzzzzttzzzzz.'},happy:{15:'...aazzzzztttttttzz.'}}}
};
for(const k in HEADS){const H=HEADS[k];H.P=H.pal();if(H.angryPal)Object.assign(H.P,H.angryPal());H.exr={};for(const e in H.ex){const r=H.rows.slice();for(const j in H.ex[e])r[j]=H.ex[e][j];H.exr[e]=r}}

function drawRig(a,sx,sy,ov,pose,noOutline){
 const r=a.rig,p=pose||a.pose,f=a.face,s=r.s,type=r.deco==='juno'?'juno':a.type;
 const th=r.thigh*s,sh=r.shin*s,to=r.torso*s,ua=r.uarm*s,fa=r.farm*s,hr=Math.round(r.hr*s);
 const lw=Math.max(2,r.lw*s),aw=Math.max(2,r.aw*s),tw=r.tw*s;
 const D=(o,an,l)=>[o[0]+Math.sin(an)*l,o[1]+Math.cos(an)*l];
 const hipY=-(th+sh)+p.cr,hip=[0,hipY];
 const kF=D(hip,p.fl1,th),fF=D(kF,p.fl2,sh),kB=D(hip,p.bl1,th),fB=D(kB,p.bl2,sh);
 const neck=[Math.sin(p.ln)*to,hipY-Math.cos(p.ln)*to],waist=[Math.sin(p.ln)*3*s,hipY-Math.cos(p.ln)*3*s];
 const chest=[lerp(waist[0],neck[0],.55),lerp(waist[1],neck[1],.55)];
 const shF=[neck[0]+1.2*s,neck[1]+2*s],shB=[neck[0]-1.5*s,neck[1]+2*s];
 const eF=D(shF,p.fa1,ua),hF=D(eF,p.fa2,fa),eB=D(shB,p.ba1,ua),hB=D(eB,p.ba2,fa);
 const head=[neck[0]+Math.sin(p.ln)*(hr+1),neck[1]-Math.cos(p.ln)*(hr+1)];
 const tF=[fF[0]+3.2*s,fF[1]+.3],tB=[fB[0]+3.2*s,fB[1]+.3];
 const cr=Math.cos(p.rot),sr=Math.sin(p.rot);
 const T=q=>{const x=q[0],y=q[1]-hipY;return [sx+(x*cr-y*sr)*f,sy+(x*sr+y*cr)+hipY+p.hy]};
 const B=q=>{const t=T(q);return [t[0]-sx+RAX,t[1]-sy+RAY]};
 const mat=MAT[type],bd=BUILD[type];
 const ext=(A,Bq,k)=>[Bq[0]+(Bq[0]-A[0])*k,Bq[1]+(Bq[1]-A[1])*k];
 const cap=(A,Bq,r0,r1,m)=>{const a1=B(A),b1=B(Bq);rcap(a1[0],a1[1],b1[0],b1[1],r0,r1,m)};
 const limbArm=(sh0,el,ha)=>{const hr2=aw*.62;cap(sh0,el,aw*bd.ua[0]/2+.3,aw*bd.ua[1]/2,mat.uarm);cap(el,ha,aw*bd.fa[0]/2,aw*bd.fa[1]/2,mat.farm);
  const he=ext(el,ha,(hr2*.9)/Math.max(1,Math.hypot(ha[0]-el[0],ha[1]-el[1])));cap(ha,he,hr2+.4,hr2+.2,mat.hand)};
 const limbLeg=(k,ft,to2)=>{cap(hip,k,lw*bd.th[0]/2,lw*bd.th[1]/2,mat.thigh);cap(k,ft,lw*bd.sh[0]/2,lw*bd.sh[1]/2,mat.shin);cap(ft,to2,lw*bd.ft[0]/2+.3,lw*bd.ft[1]/2,mat.foot)};
 rbegin(f);
 // secondary motion parts (behind everything)
 const secs=(!noOutline&&!a.noSec&&SEC[type])||[];
 const anchors={head,waist,shB,neck};
 for(const d of secs){const an=anchors[d.at];const lp=[an[0]+d.ox*(d.at==='head'?hr:tw),an[1]+d.oy*(d.at==='head'?hr:1)];const A=T(lp);
  const tip=springPt(a,'_'+d.k,A[0]+RCAM,A[1],A[0]+RCAM+d.rx*f*s,A[1]+d.ry*s,d.len*s);
  const tx=tip.x-RCAM,ty=tip.y,mx=(A[0]+tx)/2+(-f)*1,my=(A[1]+ty)/2+1.5;
  const w0=d.w0*s/2,w1=d.w1*s/2,ax=A[0]-sx+RAX,ay=A[1]-sy+RAY,bx=mx-sx+RAX,by=my-sy+RAY,cx=tx-sx+RAX,cy=ty-sy+RAY;
  rgroup();rcap(ax,ay,bx,by,w0+.4,(w0+w1)/2+.3,SECM[d.k]);rcap(bx,by,cx,cy,(w0+w1)/2+.3,d.k==='cape'?w1:Math.max(.8,w1*.6),SECM[d.k])}
 // back arm, back leg
 rgroup(1);limbArm(shB,eB,hB);
 rgroup(1);limbLeg(kB,fB,tB);
 // front leg, body, head
 rgroup();limbLeg(kF,fF,tF);
 rgroup();cap([hip[0],hip[1]+1],waist,tw*bd.pv,tw*(bd.pv+.06),mat.pelvis);cap(waist,neck,tw*bd.to[0],tw*bd.to[1],mat.torso);
 if(type==='boss'){const sb=B(shB),sf=B(shF);rcap(sb[0]-1,sb[1]-2,sf[0],sf[1]-1,aw*.5,aw*.42,(u,v,l)=>M(PAL.boss.fur,l+(v>.3?1:0)))}
 rgroup();const nk=B(neck),hd=B(head);rcap(nk[0],nk[1]+1,lerp(nk[0],hd[0],.5),lerp(nk[1],hd[1],.5),hr*.42,hr*.42,mat.neck);
 const H=HEADS[type],ex=exprOf(a);rspr(H.exr[ex]||H.rows,H.P,H.cx,H.cy,hd[0],hd[1],p.rot+(Math.abs(p.ln)>.3?p.ln*.5:0));
 // riot shield (translucent polycarbonate)
 if(type==='shield'&&p.rot===0){const q=B(hF);const up=a.gbT>0?10:0,sw=Math.round(7*s),shh=Math.round(24*s),x0=f>0?q[0]+1:q[0]-sw-1,y0=q[1]-shh/2+up,P=PAL.shield,brk=a.gbT>0;
  rgroup();rrect(x0,y0,sw,shh,(i,j,w,h)=>{const edge=i===0||j===0||i===w-1||j===h-1;const fi=f>0?i:w-1-i;
   if(edge)return M(P.gEdge,j<3?4:3);if(j>3&&j<6&&fi>1&&fi<w-2)return M(P.gEdge,1);
   if(j>h*.42&&j<h*.42+5&&fi>0&&fi<w-1){const k=j-Math.floor(h*.42);return (k===0||k===4)?M(P.tag2,2):(fi===(k%3)+1||fi===w-2-(k%2))?M(P.tag,2):M(P.glass,1)}
   if(brk&&((i+j)%7===0))return M(P.gEdge,4);
   return M(P.glass,(fi===w-2||(fi+j)%9===0)?3:2)})}
 // front arm
 rgroup();limbArm(shF,eF,hF);
 rend(sx,sy,ov,noOutline);
 // attack smear
 if(!noOutline&&!ov){const atk=a.state==='atk'&&a.atk&&!a.atk.proj&&!a.atk.grab?a.atk:null;const air=a.jatk&&a.state==='jump';
  if(atk&&a.t>=atk.a0-1&&a.t<=atk.a1+1||air){const n=a.atkName;const lim=air||n==='l3'?T(tF):(n==='l2'||n==='gp2')?T(hB):a.weapon&&a.weapon.kind==='sign'?(()=>{const e1=T(eF),h1=T(hF);let dx=h1[0]-e1[0],dy=h1[1]-e1[1];const m=Math.hypot(dx,dy)||1;return [h1[0]+dx/m*20,h1[1]+dy/m*20]})():T(hF);
   const lp=a._smear;if(lp&&Math.hypot(lp[0]-lim[0],lp[1]-lim[1])>2&&Math.hypot(lp[0]-lim[0],lp[1]-lim[1])<50){ctx.globalAlpha=.55;const col=a.team===0?'#bffcff':'#ffd9a8';
    seg(lp[0],lp[1],lim[0],lim[1],aw+3,col);ctx.globalAlpha=.9;seg(lp[0],lp[1],lim[0],lim[1],1,'#ffffff');ctx.globalAlpha=1}
   a._smear=lim}else a._smear=null}
 if(!noOutline){
  if(a.weapon&&a.weapon.kind==='sign'&&a.state!=='wthrow'){const e1=T(eF),h1=T(hF);let dx=h1[0]-e1[0],dy=h1[1]-e1[1];const m=Math.hypot(dx,dy)||1;dx/=m;dy/=m;
   seg(h1[0]-dx*4,h1[1]-dy*4,h1[0]+dx*17,h1[1]+dy*17,4,OUT);seg(h1[0]-dx*4,h1[1]-dy*4,h1[0]+dx*17,h1[1]+dy*17,2,ov||'#9a9ab0');
   drawSignPlate(h1[0]+dx*20,h1[1]+dy*20,ov)}
  if(a.weapon&&a.weapon.kind==='crate'&&!ov){const h1=T(hF),h2=T(hB);drawCrate((h1[0]+h2[0])/2,(h1[1]+h2[1])/2-2)}
  if(a.type==='knife'&&!ov&&p.rot===0){const e1=T(eF),h1=T(hF);let dx=h1[0]-e1[0],dy=h1[1]-e1[1];const m=Math.hypot(dx,dy)||1;dx/=m;dy/=m;
   seg(h1[0]+dx*1,h1[1]+dy*1,h1[0]+dx*9,h1[1]+dy*9,3,OUT);seg(h1[0]+dx*2,h1[1]+dy*2,h1[0]+dx*8,h1[1]+dy*8,1,'#cfe8f0');seg(h1[0]+dx*4,h1[1]+dy*4,h1[0]+dx*8,h1[1]+dy*8,1,'#7ff9ff');R(ctx,h1[0]+dx*8,h1[1]+dy*8,1,1,'#ffffff')}
  if(a.type==='boss'&&!ov){const g1=a.phase>=3?'#ff3b8a':'#b45cff',g2=a.phase>=3?'#ffb0d0':'#e2c4ff';for(const hp of [hF,hB]){const q=T(hp);blob(q[0],q[1],5,OUT);blob(q[0],q[1],4,g1);blob(q[0]-1,q[1]-1,2,g2);R(ctx,q[0]-2,q[1]-3,2,1,'#fff');
   if((G.t>>1)%3===0){const an=G.t*.7+hp[0];seg(q[0],q[1],q[0]+Math.cos(an)*7,q[1]+Math.sin(an)*7,1,g2)}if(a.phase>=2&&(G.t>>2)%2)ringPix(q[0],q[1],7,7,g2,10)}}
 }
 return {hF:T(hF),head:T(head)};
}

// ghosts (afterimages) never change, so render each one once and reuse the image
function ghostImg(a,col,pose,face){RTGT=1;RLAST=null;const f0=a.face;a.face=face;drawRig(a,0,0,col,pose,true);a.face=f0;RTGT=null;return RLAST}

// ===== BACKGROUND DETAIL =====
// Extra pixel detail painted into the stage backgrounds when a stage loads.
// Everything here runs once per stage (the result is a cached canvas), so it
// costs nothing per frame. Uses the seeded rnd() so stages look the same every time.

// lighten (k>0) or darken (k<0) a #rrggbb colour
function shd(hex,k){const n=parseInt(hex.slice(1,7),16);let r=n>>16,g=(n>>8)&255,b=n&255;
 if(k>0){r+=(255-r)*k;g+=(255-g)*k;b+=(255-b)*k}else{r*=1+k;g*=1+k;b*=1+k}
 return '#'+((1<<24)|(Math.round(r)<<16)|(Math.round(g)<<8)|Math.round(b)).toString(16).slice(1)}
function A(c,a,fn){c.globalAlpha=a;fn();c.globalAlpha=1}

// --- street -----------------------------------------------------------------
function brickWall(c,x,y,w,h,base){
 const mort=shd(base,-.35),hi=shd(base,.1),lo=shd(base,-.12);
 for(let row=0,yy=y;yy<y+h;row++,yy+=4){R(c,x,yy+3,w,1,mort);
  for(let bx=x-(row%2)*5;bx<x+w;bx+=10){const x0=Math.max(x,bx),x1=Math.min(x+w,bx+9);if(x1<=x0)continue;
   const r=rnd();if(r<.18)R(c,x0,yy,x1-x0,3,lo);else if(r<.3)R(c,x0,yy,x1-x0,3,hi);
   R(c,x1,yy,1,3,mort);if(rnd()<.35)R(c,x0,yy,x1-x0,1,shd(base,.06))}}
 // grime gets heavier toward the street
 for(let i=0;i<w/3;i++){const gx=x+rnd()*w|0,gl=rri(6,30);A(c,.18,()=>R(c,gx,y+h-gl,1,gl,'#0a0614'))}
 A(c,.25,()=>{for(let k=0;k<6;k++)R(c,x,y+h-6+k,w,1,'#0a0614')})}
function winDetail(c,wx,wy,lit,col){
 R(c,wx-2,wy-2,13,15,'#120a22');R(c,wx-1,wy-1,11,13,'#3a2a58');R(c,wx,wy,9,11,'#140b26');
 if(lit){R(c,wx,wy,9,11,col);const dk=shd(col,-.35),lt=shd(col,.35);const kind=rri(0,3);
  if(kind===0){for(let k=1;k<11;k+=2)R(c,wx,wy+k,9,1,dk)}                       // blinds
  else if(kind===1){R(c,wx,wy,2,11,dk);R(c,wx+7,wy,2,11,dk);R(c,wx,wy,9,1,dk);R(c,wx+3,wy+6,3,5,'#1a0f2a');R(c,wx+4,wy+4,1,2,'#1a0f2a')} // curtains + lamp
  else if(kind===2){R(c,wx+5,wy+6,3,5,'#1a0f2a');R(c,wx+4,wy+4,5,3,'#1a3a20');R(c,wx+5,wy+3,2,1,'#2a5a30')} // plant
  else{R(c,wx+2,wy+4,3,7,'#1a0f2a');R(c,wx+2,wy+2,3,2,'#1a0f2a')}                 // someone at the window
  R(c,wx+1,wy+1,2,1,lt);A(c,.12,()=>R(c,wx-3,wy-3,15,17,col))}
 else{R(c,wx,wy,9,11,'#1a1232');for(let k=0;k<5;k++)R(c,wx+4+k,wy+1+k,1,1,'#2c2350')}
 R(c,wx,wy+5,9,1,'#3a2a58');R(c,wx+4,wy,1,11,'#2a1d44');                         // frame bars
 R(c,wx-2,wy+11,13,2,'#5a4a7e');R(c,wx-2,wy+13,13,1,'#120a22')}                 // sill
function drip(c,x,y){A(c,.35,()=>{for(let k=0;k<rri(8,22);k++)R(c,x+(k>8?1:0),y+k,1,1,'#0a0614')})}
function pipeV(c,x,y0,y1){R(c,x-1,y0,4,y1-y0,'#0e0818');R(c,x,y0,2,y1-y0,'#4a4060');R(c,x,y0,1,y1-y0,'#6a5e86');
 for(let y=y0+8;y<y1;y+=18){R(c,x-1,y,4,2,'#2a2240');R(c,x-2,y,1,2,'#0e0818')}R(c,x-2,y1-3,6,3,'#4a4060')}
function awning(c,x,y,w){const cols=[rpick(['#c2185b','#1b8a9a','#7a2fb0','#b8501a']),'#e9ddf5'];
 for(let k=0;k<w;k+=6){const col=cols[(k/6)%2|0];R(c,x+k,y,6,6,col);R(c,x+k,y,6,1,shd(col,.25));R(c,x+k+5,y,1,6,shd(col,-.3));
  R(c,x+k+1,y+6,4,1,col);R(c,x+k+2,y+7,2,1,shd(col,-.25))}
 R(c,x-1,y-1,w+2,1,'#120a20');A(c,.35,()=>R(c,x,y+8,w,4,'#05020c'))}
function shopWindow(c,x,y,w,h){R(c,x,y,w,h,'#0e0a1a');R(c,x+1,y+1,w-2,h-2,'#123445');
 // warm interior light and shelves with goods
 R(c,x+1,y+1,w-2,6,'#1d5a6a');for(let sy=y+12;sy<y+h-6;sy+=10){R(c,x+2,sy,w-4,1,'#0b2a35');
  for(let gx=x+4;gx<x+w-6;gx+=rri(4,7)){const gh=rri(2,5);R(c,gx,sy-gh,rri(2,3),gh,rpick(['#ff7ac0','#7ff9ff','#f9c80e','#a0ffb0','#c9a0ff','#2a6a7a']))}}
 R(c,x+1,y+h-8,w-2,7,'#184a58');
 for(let k=0;k<w;k+=14)A(c,.5,()=>seg2(c,x+3+k,y+2,x+12+k,y+16,'#9ff0ff'));       // reflections
 R(c,x+(w>>1),y,1,h,'#0e0a1a');R(c,x,y+h-1,w,2,'#3a2a5a')}
function door(c,x,y){R(c,x,y,18,44,'#0e0a1a');R(c,x+1,y+1,16,43,'#2a1d40');R(c,x+3,y+3,12,18,'#26405a');R(c,x+3,y+3,12,1,'#3d6a8a');
 A(c,.6,()=>seg2(c,x+5,y+4,x+10,y+12,'#8fd8ff'));R(c,x+3,y+24,12,8,'#22163a');R(c,x+4,y+25,10,6,'#2e2050');R(c,x+14,y+22,2,3,'#f9c80e');R(c,x-2,y+43,22,2,'#4a3a6a')}
function poster(c,x,y){const w=rri(8,12),h=rri(11,15),col=rpick(['#ff2a6d','#2de2e6','#f9c80e','#b45cff','#e9ddf5']);
 R(c,x,y,w,h,col);R(c,x+1,y+1,w-2,4,shd(col,-.45));R(c,x+1,y+h-4,w-2,1,shd(col,-.4));R(c,x+1,y+h-2,w-4,1,shd(col,-.4));
 R(c,x+w-3,y+h-3,3,3,shd(col,-.25));A(c,.3,()=>R(c,x,y,w,h,'#1a0f2a'))}
function graffiti(c,x,y){const col=rpick(NEONS),n=rri(3,5);A(c,.55,()=>{let px=x;for(let i=0;i<n;i++){const hh=rri(6,10);
  seg2(c,px,y+10,px+2,y+10-hh,col);seg2(c,px+2,y+10-hh,px+5,y+10,col);seg2(c,px+1,y+6,px+4,y+6,col);px+=rri(5,7)}
  seg2(c,x-2,y+12,px+2,y+11,shd(col,.3))})}
function streetLamp(c,x){R(c,x-3,FLOOR-2,7,3,'#2a2240');R(c,x-1,40,3,FLOOR-40,'#0e0818');R(c,x,40,1,FLOOR-40,'#5a4e78');
 R(c,x-1,40,14,2,'#0e0818');R(c,x,40,13,1,'#5a4e78');R(c,x+9,42,8,3,'#0e0818');R(c,x+10,43,6,2,'#ffe9a8');R(c,x+11,45,4,1,'#fff6d0');
 A(c,.10,()=>{for(let k=0;k<30;k++)R(c,x+13-k*.6,46+k,1+k*1.2,1,'#ffe9a8')})}
function hydrant(c,x){const y=FLOOR+2;R(c,x-3,y-11,7,12,OUT);R(c,x-2,y-10,5,11,'#c2283a');R(c,x-2,y-10,2,11,'#e8485a');R(c,x-4,y-7,9,2,'#a01a2a');R(c,x-1,y-12,3,2,'#c2283a');R(c,x-3,y,7,1,'#5a1a22')}
function trashBags(c,x){const y=FLOOR+3;for(let i=0;i<3;i++){const bx=x+i*6-(i===2?9:0),by=y-(i===2?5:0);ell(c,bx,by-4,5,4,'#0a0814');ell(c,bx,by-4,4,3,'#1e1a2e');R(c,bx-2,by-6,2,1,'#3a3450');R(c,bx,by-9,1,2,'#0a0814')}}
function newsBox(c,x){const y=FLOOR+2;R(c,x-1,y-15,12,16,OUT);R(c,x,y-14,10,14,'#1f6a8a');R(c,x+1,y-12,8,5,'#cfe8f0');R(c,x+2,y-11,6,1,'#5a6a7a');R(c,x+2,y-9,4,1,'#5a6a7a');R(c,x,y-14,10,1,'#3a9aba')}
function cables(c,width){for(let x=rri(40,120);x<width;x+=rri(140,260)){const w=rri(90,170),y0=rri(10,26),sag=rri(8,18),col=rnd()<.5?'#0c0718':'#140c24';
 for(let i=0;i<=w;i++){const t=i/w;R(c,x+i,y0+sag*4*t*(1-t)|0,1,1,col)}
 if(rnd()<.4){const t=.5,px=x+w*t|0,py=y0+sag|0;R(c,px-1,py,3,6,'#0c0718');R(c,px,py+1,1,4,rpick(['#f9c80e','#ff2a6d']))}}}
function streetFloor(c,width){
 // sidewalk slabs with cracks, then a curb, then asphalt
 R(c,0,FLOOR-3,width,3,'#120a20');R(c,0,FLOOR,width,16,'#2a2240');
 for(let xx=0;xx<width;xx+=24){R(c,xx,FLOOR,1,16,'#1d1630');R(c,xx+1,FLOOR,1,16,'#352c50');const t=rnd();if(t<.35)R(c,xx+2,FLOOR,22,8,'#2e2546');else if(t<.5)R(c,xx+2,FLOOR+8,22,8,'#262038')
  if(rnd()<.3){let px=xx+rri(4,18),py=FLOOR+rri(1,6);for(let k=0;k<rri(4,9);k++){R(c,px,py,1,1,'#17111f');px+=rnd()<.5?1:0;py++}}}
 R(c,0,FLOOR+8,width,1,'#251e3a');speck(c,0,FLOOR,width,16,'#3a3056',width*.6);
 R(c,0,FLOOR+16,width,1,'#7a6aa8');R(c,0,FLOOR+17,width,1,'#56487e');R(c,0,FLOOR+18,width,2,'#1a1328');
 R(c,0,FLOOR+20,width,H-FLOOR-20,'#17111f');speck(c,0,FLOOR+20,width,H-FLOOR,'#211830',width*2.2);speck(c,0,FLOOR+20,width,H-FLOOR,'#0f0a16',width*1.6);speck(c,0,FLOOR+20,width,H-FLOOR,'#2a2040',width*.5);
 A(c,.5,()=>R(c,0,FLOOR+20,width,4,'#0a0712'));
 for(let i=0;i<width/90;i++){let px=rr(0,width),py=rr(FLOOR+26,H-6);for(let k=0;k<rri(10,24);k++){R(c,px,py,1,1,'#0c0812');px+=rnd()<.7?1:0;py+=rnd()<.4?(rnd()<.5?1:-1):0}}
 for(let xx=10;xx<width;xx+=64){R(c,xx,FLOOR+52,24,2,'#6b5a2a');for(let k=0;k<5;k++)R(c,xx+rri(0,23),FLOOR+52+rri(0,1),1,1,'#3a3020')}
 for(let mx=rri(150,300);mx<width;mx+=rri(380,560)){const my=FLOOR+rri(34,60);ell(c,mx,my,10,3,'#0a0712');ell(c,mx,my,9,2,'#2a2236');R(c,mx-6,my,13,1,'#1a1428');R(c,mx-3,my-1,7,1,'#1a1428')}
 for(let i=0;i<width/80;i++){const px=rr(0,width),py=rr(FLOOR+26,H-8),pw=rri(14,36);ell(c,px,py,pw,3,'#1c1530');ell(c,px,py,pw-2,2,'#221a3c');
  for(let k=0;k<6;k++)R(c,px+rr(-pw*.7,pw*.7),py-1,1,rri(1,3),rpick(['#6a2a5a','#2a5a6a','#6a5a2a','#8a3a7a']));R(c,px-pw+3,py-2,pw/2,1,'#3a3058')}}
function streetProps(c,width){
 for(let x=rri(60,140);x<width-20;x+=rri(150,260)){const k=rnd();if(k<.38)streetLamp(c,x);else if(k<.55)hydrant(c,x);else if(k<.78)trashBags(c,x);else newsBox(c,x)}
 cables(c,width)}

// --- garage -----------------------------------------------------------------
function garageWallDetail(c,ww){
 for(let i=0;i<ww/30;i++){const x=rr(0,ww),w=rri(8,30);A(c,.22,()=>{for(let k=0;k<rri(20,70);k++)R(c,x+rr(0,w),24+k,1,1,'#14141c')})}       // water streaks
 for(let i=0;i<ww/60;i++){const x=rr(0,ww),y=rr(50,170);let px=x,py=y;for(let k=0;k<rri(6,14);k++){R(c,px,py,1,1,'#16161f');px+=rnd()<.5?1:-1;py++}}   // cracks
 R(c,0,50,ww,3,'#2e2e3c');R(c,0,50,ww,1,'#45455a');R(c,0,53,ww,1,'#15151d');                                                               // pipe
 R(c,0,58,ww,2,'#5a2a2a');R(c,0,58,ww,1,'#7a3a3a');
 for(let x=20;x<ww;x+=70){R(c,x,49,2,5,'#1a1a24');R(c,x+30,57,3,4,'#1a1a24')}
 for(let x=rri(40,90);x<ww;x+=rri(150,260)){R(c,x-1,57,5,5,'#0c0c12');R(c,x,58,3,3,'#c2283a');R(c,x+1,58,1,1,'#ff6a7a')}               // valves
 for(let x=rri(30,100);x<ww;x+=rri(200,320)){R(c,x,120,14,10,'#0c0c12');R(c,x+1,121,12,8,'#d0d0d8');R(c,x+3,123,8,1,'#c2283a');R(c,x+3,125,6,1,'#22222d');R(c,x+3,127,7,1,'#22222d')} // notices
 // wheel stops and car detail pass over the stalls
 for(let xx=20;xx<ww;xx+=92){R(c,xx+18,180,30,3,'#0c0c12');R(c,xx+19,180,28,2,'#b8a040');R(c,xx+19,180,28,1,'#e0c860')}}
function carDetail(c,cx,cy,col){
 const hi=shd(col,.3),lo=shd(col,-.35);
 R(c,cx,cy-26,64,2,hi);R(c,cx+13,cy-37,36,2,hi);R(c,cx,cy-8,64,2,lo);R(c,cx+32,cy-25,1,17,lo);R(c,cx+14,cy-25,1,17,lo);  // body shading, door lines
 R(c,cx+28,cy-20,4,1,shd(col,-.5));R(c,cx+46,cy-20,4,1,shd(col,-.5));                                                        // handles
 R(c,cx+16,cy-35,14,8,'#152434');R(c,cx+32,cy-35,14,8,'#152434');seg2(c,cx+18,cy-34,cx+22,cy-29,'#4a7a9a');seg2(c,cx+34,cy-34,cx+38,cy-29,'#4a7a9a'); // glass
 R(c,cx+48,cy-31,3,2,lo);                                                                                                    // mirror
 R(c,cx+26,cy-12,12,4,'#0c0c12');R(c,cx+27,cy-11,10,2,'#e8e8d8');
 for(const wx of [cx+12,cx+52]){ell(c,wx,cy-6,6,5,'#0a0a0e');ell(c,wx,cy-6,3,3,'#5a5a6a');R(c,wx-1,cy-7,2,1,'#9a9aaa')}
 A(c,.25,()=>R(c,cx-2,cy-2,68,3,'#000000'))}
function garageFloorDetail(n,width){
 for(let i=0;i<width/140;i++){const x=rr(0,width),y=rr(FLOOR+18,H-10),w=rri(40,90);A(n,.35,()=>{for(let k=0;k<w;k++){R(n,x+k,y+Math.sin(k*.08)*3|0,1,1,'#18181f');R(n,x+k,y+5+Math.sin(k*.08)*3|0,1,1,'#18181f')}})}
 for(let x=rri(100,200);x<width;x+=rri(300,460)){const y=FLOOR+rri(30,58);R(n,x,y,16,6,'#121218');for(let k=1;k<16;k+=2)R(n,x+k,y+1,1,4,'#3a3a46')}
 for(let i=0;i<width/50;i++){let px=rr(0,width),py=rr(FLOOR+4,H-4);for(let k=0;k<rri(5,14);k++){R(n,px,py,1,1,'#1e1e26');px+=rnd()<.7?1:0;py+=rnd()<.3?1:0}}
 A(n,.5,()=>R(n,0,FLOOR,width,3,'#14141a'))}
function pillarDetail(n,px){
 for(let k=0;k<10;k++)R(n,px+rri(3,22),rri(40,FLOOR-30),rri(1,3),1,'#2c2c38');
 for(let y=40;y<FLOOR-30;y+=34){R(n,px+3,y,1,1,'#5a5a72');R(n,px+24,y,1,1,'#22222d')}
 R(n,px+3,24,22,3,'#2c2c38');A(n,.3,()=>R(n,px,FLOOR-30,28,4,'#000000'))}

// --- rooftop ----------------------------------------------------------------
function roofGround(n){
 // gravel and tar patches
 for(let i=0;i<14;i++){const x=rr(0,W),y=rr(FLOOR+6,H-10);ell(n,x,y,rri(14,34),rri(3,6),'#1b1726')}
 speck(n,0,FLOOR,W,H-FLOOR,'#2f2840',900);speck(n,0,FLOOR,W,H-FLOOR,'#15111d',900);speck(n,0,FLOOR,W,H-FLOOR,'#3a3250',200);
 A(n,.6,()=>R(n,0,FLOOR,W,4,'#120e1a'));
}
function roofDetail(n){
 // parapet caps and stains
 R(n,0,FLOOR-26,W,2,'#5a4a7e');for(let x=0;x<W;x+=16){R(n,x,FLOOR-24,1,24,'#1a1226');R(n,x+1,FLOOR-24,1,24,'#33284a')}
 for(let i=0;i<W/10;i++){const x=rr(0,W);A(n,.3,()=>R(n,x,FLOOR-24,1,rri(4,16),'#120c1c'))}
 // vents and pipes
 for(const [vx,vy] of [[130,FLOOR+8],[350,FLOOR+10],[455,FLOOR+20]]){R(n,vx-1,vy-12,10,13,OUT);R(n,vx,vy-11,8,12,'#4a4a60');R(n,vx,vy-11,2,12,'#6a6a84');R(n,vx-3,vy-14,14,4,OUT);R(n,vx-2,vy-13,12,2,'#5a5a72');R(n,vx-2,vy-13,12,1,'#7a7a94');A(n,.4,()=>R(n,vx-2,vy+1,14,2,'#000'))}
 R(n,180,FLOOR-6,120,3,OUT);R(n,180,FLOOR-5,120,2,'#5a5a72');R(n,180,FLOOR-5,120,1,'#7a7a94');for(let x=190;x<300;x+=26){R(n,x,FLOOR-7,3,7,'#2a2a38')}
 // AC unit grilles and fan blades
 for(const ax of [24,404]){for(let k=0;k<52;k+=3)R(n,ax+k,FLOOR-38,1,6,'#3a3a4e');for(const fx of [ax+16,ax+38]){ell(n,fx,FLOOR-22,9,9,'#1e1e2a');
   for(let b=0;b<4;b++){const a=b*Math.PI/2+.4;seg2(n,fx,FLOOR-22,fx+Math.cos(a)*7,FLOOR-22+Math.sin(a)*7,'#4a4a60')}ell(n,fx,FLOOR-22,2,2,'#7a7a94')}
  R(n,ax+2,FLOOR-38,2,2,'#7a7a94');R(n,ax+48,FLOOR-38,2,2,'#7a7a94');R(n,ax+2,FLOOR-6,2,2,'#7a7a94');R(n,ax+48,FLOOR-6,2,2,'#7a7a94');A(n,.45,()=>R(n,ax+30,FLOOR-14,2,12,'#7a4a2a'))}
 // puddles reflecting the sign
 for(const [px,py,pw] of [[150,FLOOR+56,26],[330,FLOOR+70,34]]){ell(n,px,py,pw,3,'#2a2440');ell(n,px,py,pw-3,2,'#3a2c58');R(n,px-6,py-1,4,1,'#ff2a6d');R(n,px+4,py,5,1,'#2de2e6')}}
function roofSkyDetail(s){
 // water tower planks and bands, billboard frame lights
 for(let x=27;x<57;x+=3)R(s,x,40,1,24,'#341a56');R(s,26,46,32,1,'#4a2a6e');R(s,26,56,32,1,'#4a2a6e');R(s,36,34,12,4,'#2a1546');R(s,40,30,4,4,'#2a1546');
 seg2(s,30,64,52,104,'#24123c');seg2(s,54,64,32,104,'#24123c');
 for(let x=154;x<330;x+=12)R(s,x,80,1,1,'#ffe9a8');for(let x=176;x<306;x+=6)seg2(s,x,80,x+6,90,'#1a1030')}

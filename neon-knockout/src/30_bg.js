// ===== BACKGROUNDS (procedural pixel art) =====
const BG={};
const NEONS=['#ff2a6d','#2de2e6','#f9c80e','#b45cff','#7dff6a','#ff7a1a'];
const SHOPS=['RAMEN','ARCADE','24/7','PAWN','TATTOO','KARAOKE','NOODLES','HOTEL','BAR','VOLT','PHONES','REPAIR','DUMPLING','LAUNDRY','CYBER','DINER','PIZZA','LIQUOR','VINYL','GYM','SUSHI','CAFE'];
function ell(c,x,y,rx,ry,col){c.fillStyle=col;for(let dy=-ry;dy<=ry;dy++){const hw=Math.round(rx*Math.sqrt(Math.max(0,1-(dy*dy)/(ry*ry+.01))));c.fillRect(Math.round(x-hw),Math.round(y+dy),hw*2,1)}}
function speck(c,x,y,w,h,col,n){c.fillStyle=col;for(let i=0;i<n;i++)c.fillRect(Math.round(x+rnd()*w),Math.round(y+rnd()*h),1,1)}
function skyBands(c,cols,y0,bh){cols.forEach((col,i)=>{R(c,0,y0+i*bh,W,bh+1,col);if(i)for(let x=0;x<W;x+=2)for(let j=0;j<3;j++)if(rnd()<.5-j*.15)R(c,x+(j%2),y0+i*bh-1-j,1,1,cols[i-1])})}
function skyline(c,w,yMin,yMax,col,winCols,dens,lights,step){
 let x=-5;while(x<w){const bw=rri(step[0],step[1]),top=rri(yMin,yMax);R(c,x,top,bw,H-top,col);
  if(rnd()<.3){R(c,x+bw/2,top-rri(6,16),1,16,col);lights&&lights.push({x:x+bw/2,y:top-rri(6,16),ph:rri(0,90)})}
  if(rnd()<.25)R(c,x+2,top-3,bw-4,3,col);
  for(let yy=top+3;yy<FLOOR;yy+=3)for(let xx=x+2;xx<x+bw-2;xx+=3)if(rnd()<dens)R(c,xx,yy,1,1,rpick(winCols));
  x+=bw+rri(0,4)}}
function makeStreet(width){
 srand(77);const B={signs:[],msigns:[],lights:[],vents:[]};
 const [sky,s]=mkCanvas(W,H);skyBands(s,['#07031a','#0b0424','#11062e','#190838','#230a42','#310c4b','#441052','#5c1658'],0,18);
 for(let i=0;i<40;i++)R(s,rr(0,W),rr(0,60),1,1,'#4a3a7a');B.sky=sky;
 const fw=W+(width-W)*.25+8,[far,f]=mkCanvas(fw,H);skyline(f,fw,40,120,'#170a30',['#4a2160','#21405a','#5a4630','#33245e'],.18,B.lights,[14,36]);B.far=far;
 const mw=W+(width-W)*.5+8,[mid,m]=mkCanvas(mw,H);
 let x=-4;while(x<mw){const bw=rri(30,70),top=rri(60,115);R(m,x,top,bw,H-top,'#1e0f3c');R(m,x,top,1,H-top,'#2c1752');
  for(let yy=top+5;yy<FLOOR;yy+=7)for(let xx=x+4;xx<x+bw-4;xx+=6)if(rnd()<.35)R(m,xx,yy,2,3,rpick(['#5a2a6e','#2a5a6e','#6e5a2a','#3a2a6e']));
  if(rnd()<.45){const t=rpick(['BAR','HOTEL','VOLT','24H','CLUB','NEON','RAMEN']);B.msigns.push({x:x+bw/2,y:top+8,t,col:rpick(NEONS),fl:rnd()<.3,ph:rri(0,200)});R(m,x+bw/2-5,top+5,10,t.length*8+4,'#120824')}
  if(rnd()<.3){R(m,x+6,top-10,10,10,'#160a2e');R(m,x+8,top-14,6,4,'#160a2e')}
  x+=bw+rri(2,10)}
 B.mid=mid;
 const [near,c]=mkCanvas(width,H);
 x=0;let n=0;
 while(x<width){
  if(rnd()<.2&&x>120&&n>1){const gw=rri(34,50);R(c,x,0,gw,FLOOR,'#0b0618');R(c,x+gw/2,20,2,FLOOR-20,'#150c26');for(let yy=40;yy<FLOOR-30;yy+=26)R(c,x+3,yy,gw-6,2,'#140b24');
   R(c,x+5,FLOOR-21,28,21,OUT);R(c,x+6,FLOOR-20,26,19,'#1f5240');R(c,x+5,FLOOR-23,30,4,'#2c7058');R(c,x+9,FLOOR-15,20,1,'#163b2e');R(c,x+9,FLOOR-10,20,1,'#163b2e');B.vents.push({x:x+gw/2,y:2});x+=gw;n=0;continue}
  n++;const bw=rri(120,200),top=rri(16,56),base=rpick(['#26163f','#2b1848','#221339','#2e1b50']);
  R(c,x,top,bw,FLOOR-top,base);R(c,x,top,bw,3,'#3d2766');R(c,x,top,1,FLOOR-top,'#3a2560');R(c,x+bw-1,top,1,FLOOR-top,'#160c2a');
  brickWall(c,x+1,top+3,bw-2,105-top,base);for(let k=4;k<bw-4;k+=6)R(c,x+k,top+3,3,2,'#33205a');
  const fire=rnd()<.45;
  for(let wy=top+9;wy<100;wy+=19)for(let wx=x+9;wx<x+bw-14;wx+=17){const lit=rnd()<.45;winDetail(c,wx,wy,lit,rpick(['#a8407a','#3f8f9a','#b08a4a','#6a54b0']))}
  if(fire){const fx=x+bw*.55|0;for(let wy=top+20;wy<100;wy+=19){R(c,fx,wy,bw*.35,1,'#0e0a1c');for(let k=0;k<bw*.35;k+=4)R(c,fx+k,wy-5,1,5,'#0e0a1c');seg2(c,fx+2,wy,fx+bw*.3,wy+18,'#0e0a1c')}}
  if(rnd()<.6){const ax=x+rri(10,bw-24),ay=rri(top+12,92);R(c,ax-1,ay-1,14,10,OUT);R(c,ax,ay,12,8,'#5a5a72');for(let k=1;k<8;k+=2)R(c,ax+1,ay+k,10,1,'#3a3a4e');R(c,ax,ay,12,1,'#7a7a94');drip(c,ax+3,ay+9)}
  if(rnd()<.55)pipeV(c,x+bw-6,top+4,FLOOR);
  // storefront
  const sw=bw-20,signW=Math.min(sw,rri(50,100)),sx=x+(bw-signW)/2;R(c,sx-1,108,signW+2,16,'#3a2a5a');R(c,sx,109,signW,14,'#0e0819');
  const opts=SHOPS.filter(t=>t.length*6<=signW-8);B.signs.push({x:sx+signW/2,y:113,t:rpick(opts),col:rpick(NEONS),fl:rnd()<.25,ph:rri(0,300),w:signW});
  awning(c,x+6,125,bw-12);
  const ww=Math.round(bw*.55);shopWindow(c,x+8,136,ww,42);
  const dx=x+ww+14;door(c,dx,140);
  {const fx=dx+22,fw=x+bw-fx-4;if(fw>12){for(let k=0;k<rri(1,3);k++)poster(c,fx+rri(0,fw-12),rri(140,158));if(rnd()<.6)graffiti(c,fx+rri(0,Math.max(1,fw-20)),rri(162,170))}}
  if(rnd()<.5){const col=rpick(NEONS);B.signs.push({x:x+bw-6,y:60,t:'|',col,fl:false,ph:0,tube:true,h:60})}
  x+=bw}
 streetFloor(c,width);streetProps(c,width);
 B.near=near;return B}
function seg2(c,x0,y0,x1,y1,col){c.fillStyle=col;const dx=x1-x0,dy=y1-y0,n=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy)))||1;for(let i=0;i<=n;i++)c.fillRect(Math.round(x0+dx*i/n),Math.round(y0+dy*i/n),1,1)}
function makeGarage(width){
 srand(303);const B={lights:[],exits:[]};
 const ww=W+(width-W)*.8+8,[wall,c]=mkCanvas(ww,H);
 R(c,0,0,ww,H,'#22222d');for(let y=30;y<FLOOR;y+=22)R(c,0,y,ww,1,'#1b1b25');for(let xx=0;xx<ww;xx+=48)R(c,xx,24,1,FLOOR-24,'#1b1b25');speck(c,0,24,ww,FLOOR-24,'#2a2a36',ww*1.4);
 R(c,0,34,ww,4,'#3e3e52');R(c,0,34,ww,1,'#5a5a72');R(c,0,44,ww,3,'#4a3a3a');for(let xx=0;xx<ww;xx+=60){R(c,xx,32,3,16,'#2a2a38')}
 R(c,0,94,ww,6,'#a8862a');R(c,0,100,ww,1,'#6a5418');
 let k=1;for(let xx=20;xx<ww;xx+=92){textC(c,'B3-'+(k<10?'0':'')+k,xx+28,112,'#7a7a92',1,1);k++;
  if(rnd()<.8){const col=rpick(['#7a1f3d','#1f4d7a','#c9a13b','#3a3a46','#2b6b4f','#5a2b7a','#b0b0c0']);const cx=xx+12,cy=184;
   R(c,cx-1,cy-27,66,22,OUT);R(c,cx,cy-26,64,20,col);R(c,cx+12,cy-38,38,13,OUT);R(c,cx+13,cy-37,36,12,col);R(c,cx+16,cy-35,14,8,'#1a2a3a');R(c,cx+32,cy-35,14,8,'#1a2a3a');R(c,cx+17,cy-34,3,6,'#3a5a7a');
   R(c,cx,cy-20,64,1,'#00000055');ell(c,cx+12,cy-6,6,5,'#0a0a0e');ell(c,cx+52,cy-6,6,5,'#0a0a0e');R(c,cx+62,cy-22,2,3,'#ff3b3b');R(c,cx,cy-22,2,3,'#ffe9a8');carDetail(c,cx,cy,col)}
  if(rnd()<.25)B.exits.push({x:xx+60,y:60})}
 garageWallDetail(c,ww);
 B.wall=wall;
 const [near,n]=mkCanvas(width,H);
 R(n,0,0,width,24,'#111118');for(let xx=0;xx<width;xx+=64){R(n,xx,0,12,28,'#191924');R(n,xx,26,12,2,'#0c0c12')}R(n,0,10,width,2,'#2a2a38');
 for(let xx=60;xx<width;xx+=120)B.lights.push({x:xx,fl:rnd()<.22,ph:rri(0,500)});
 for(let px=130;px<width;px+=250){R(n,px-1,24,30,FLOOR-20,OUT);R(n,px,24,28,FLOOR-20,'#3c3c4c');R(n,px,24,3,FLOOR-20,'#4c4c60');R(n,px+24,24,4,FLOOR-20,'#2c2c38');
  for(let yy=FLOOR-24;yy<FLOOR+4;yy+=2)for(let xx=0;xx<28;xx++)R(n,px+xx,yy,1,2,((xx+yy)>>2)%2?'#d4a017':'#1a1a1a');
  pillarDetail(n,px);R(n,px+6,70,16,12,'#d8d8e0');textC(n,'C'+(((px-130)/250)+1),px+14,72,'#22222d',1,1)}
 R(n,0,FLOOR,width,H-FLOOR,'#2a2a34');speck(n,0,FLOOR,width,H-FLOOR,'#34343f',width*2);speck(n,0,FLOOR,width,H-FLOOR,'#202029',width*1.5);
 for(let yy=FLOOR+20;yy<H;yy+=26)R(n,0,yy,width,1,'#24242d');
 for(let xx=0;xx<width;xx+=92){for(let t=0;t<40;t++){R(n,xx-t*.45,FLOOR+t,2,1,'#a8a8b8')}}
 for(let xx=0;xx<width;xx+=40)R(n,xx,FLOOR+56,22,2,'#b08a22');
 for(let i=0;i<width/110;i++){const ox=rr(0,width),oy=rr(FLOOR+10,H-8);ell(n,ox,oy,rri(10,24),3,'#18181f');R(n,ox-4,oy-1,3,1,'#3a5a7a');R(n,ox,oy,3,1,'#6a3a7a');R(n,ox+3,oy-1,2,1,'#3a7a5a')}
 garageFloorDetail(n,width);
 B.near=near;return B}
function makeRoof(){
 srand(909);const B={stars:[]};
 const [sky,s]=mkCanvas(W,H);skyBands(s,['#05020f','#080319','#0c0422','#12052c','#1a0735','#24093e','#320c48','#44104f'],0,22);
 for(let i=0;i<70;i++)B.stars.push({x:rr(0,W),y:rr(0,110),ph:rri(0,200)});
 ell(s,392,44,15,15,'#f2e8ff');ell(s,388,40,4,4,'#d8caee');ell(s,397,50,3,3,'#d8caee');ell(s,384,50,2,2,'#d8caee');
 skyline(s,W,110,160,'#160a2c',['#4a2160','#21405a','#5a4630'],.15,null,[12,30]);skyline(s,W,135,170,'#1d0e38',['#6a2a6e','#2a6a6e'],.22,null,[18,40]);
 R(s,40,60,4,110,'#24123c');R(s,26,40,32,24,'#2a1546');R(s,24,38,36,3,'#341a56');R(s,30,64,2,40,'#24123c');R(s,54,64,2,40,'#24123c');
 R(s,438,30,2,140,'#2a1546');for(let y=40;y<160;y+=12)seg2(s,432,y,446,y+12,'#2a1546');
 R(s,150,28,180,52,'#0f0820');R(s,148,26,184,2,'#3a2a5a');R(s,170,80,4,90,'#1e1230');R(s,306,80,4,90,'#1e1230');
 roofSkyDetail(s);B.sky=sky;
 const [near,n]=mkCanvas(W,H);
 R(n,0,FLOOR-24,W,24,'#2a1f3d');R(n,0,FLOOR-25,W,2,'#4a3a6a');for(let x=0;x<W;x+=16)R(n,x,FLOOR-24,1,24,'#221830');
 for(let x=6;x<W;x+=30){R(n,x,FLOOR-44,2,20,'#5a5a72')}R(n,0,FLOOR-44,W,2,'#6a6a84');R(n,0,FLOOR-35,W,1,'#4a4a60');
 for(const ax of [24,404]){R(n,ax-1,FLOOR-41,54,40,OUT);R(n,ax,FLOOR-40,52,38,'#4a4a60');R(n,ax,FLOOR-40,52,2,'#6a6a84');ell(n,ax+16,FLOOR-22,10,10,'#2a2a38');ell(n,ax+38,FLOOR-22,10,10,'#2a2a38');R(n,ax+15,FLOOR-31,2,18,'#5a5a72');R(n,ax+37,FLOOR-31,2,18,'#5a5a72')}
 R(n,0,FLOOR,W,H-FLOOR,'#1f1a2b');speck(n,0,FLOOR,W,H-FLOOR,'#2a2338',1400);for(let y=FLOOR+18;y<H;y+=22)R(n,0,y,W,1,'#191523');roofGround(n);
 n.fillStyle='#b08a22';for(let i=0;i<500;i++){const a=i/500*TAU;n.fillRect(Math.round(240+Math.cos(a)*112),Math.round(FLOOR+40+Math.sin(a)*27),2,1)}
 R(n,214,FLOOR+28,8,24,'#8a6c1a');R(n,258,FLOOR+28,8,24,'#8a6c1a');R(n,214,FLOOR+37,52,6,'#8a6c1a');
 R(n,60,FLOOR+50,40,14,'#2c3a5a');R(n,61,FLOOR+51,38,12,'#3a5a8a');R(n,380,FLOOR+46,44,14,'#2c3a5a');R(n,381,FLOOR+47,42,12,'#3a5a8a');
 roofDetail(n);
 B.near=near;return B}
function makeBG(theme,width){if(theme==='street')return makeStreet(width);if(theme==='garage')return makeGarage(width);return makeRoof()}
// live layers
const rain=[];for(let i=0;i<130;i++)rain.push({x:Math.random()*W,y:Math.random()*H,s:rand(5,8)});
function drawRain(heavy){ctx.fillStyle=heavy?'rgba(190,210,255,.42)':'rgba(170,190,255,.3)';for(const d of rain){d.y+=d.s;d.x-=d.s*.28;if(d.y>H){d.y=-10;d.x=Math.random()*(W+60)}if(d.x<-10)d.x+=W+20;const L=heavy?7:5;for(let i=0;i<L;i++)ctx.fillRect(Math.round(d.x+i*.28),Math.round(d.y-i),1,1)}
 if(Math.random()<.6){const x=Math.random()*W,y=FLOOR+Math.random()*(H-FLOOR);ctx.fillStyle='rgba(200,220,255,.5)';ctx.fillRect(x|0,y|0,1,1);ctx.fillRect((x-1)|0,(y-1)|0,1,1);ctx.fillRect((x+1)|0,(y-1)|0,1,1)}}
function signOn(sg,t){if(!sg.fl)return true;const k=(t+sg.ph)%240;return !(k>200&&k<208||k>214&&k<217||k>226&&k<232)}
function drawBG(theme,cam,t){
 const B=BG[theme];
 if(theme==='street'){
  ctx.drawImage(B.sky,0,0);const fc=Math.round(cam*.25);ctx.drawImage(B.far,fc,0,W,H,0,0,W,H);
  for(const l of B.lights){const x=l.x-fc;if(x>-2&&x<W+2&&(t+l.ph)%80<40)R(ctx,x,l.y,1,1,'#ff3b3b')}
  const mc=Math.round(cam*.5);ctx.drawImage(B.mid,mc,0,W,H,0,0,W,H);
  for(const sg of B.msigns){const x=sg.x-mc;if(x<-10||x>W+10)continue;const on=signOn(sg,t);for(let i=0;i<sg.t.length;i++){if(on)neon(ctx,sg.t[i],x,sg.y+i*8,sg.col,1,1,.3);else text(sg.t[i],x,sg.y+i*8,'#3a2a4a',1,1)}}
  const nc=Math.round(cam);ctx.drawImage(B.near,nc,0,W,H,0,0,W,H);
  for(const sg of B.signs){const x=sg.x-nc;if(x<-60||x>W+60)continue;const on=signOn(sg,t);
   if(sg.tube){if(on){ctx.globalAlpha=.25;R(ctx,x-2,sg.y-2,5,sg.h+4,sg.col);ctx.globalAlpha=1;R(ctx,x,sg.y,1,sg.h,sg.col);R(ctx,x,sg.y,1,sg.h,'#ffffff66')}continue}
   if(on){ctx.globalAlpha=.13;R(ctx,x-sg.w/2-3,sg.y-6,sg.w+6,20,sg.col);ctx.globalAlpha=.07;R(ctx,x-sg.w/2,FLOOR+2,sg.w,14,sg.col);ctx.globalAlpha=1;neon(ctx,sg.t,x,sg.y,sg.col,1,1,.45)}else text(sg.t,x,sg.y,'#3a2a4a',1,1)}
  if(t%5===0)for(const v of B.vents){const x=v.x;if(x-nc>-20&&x-nc<W+20)P('dust',x,v.y,rand(30,60),{vx:rand(-.2,.2),vz:rand(.4,.8),life:40,sz:3,col:'#5a4a7a',drag:.98})}
 }else if(theme==='garage'){
  const wc=Math.round(cam*.8);ctx.drawImage(B.wall,wc,0,W,H,0,0,W,H);
  for(const e of B.exits){const x=e.x-wc;if(x<-30||x>W+30)continue;R(ctx,x-1,e.y-1,26,11,OUT);R(ctx,x,e.y,24,9,'#0f3a1a');neon(ctx,'EXIT',x+12,e.y+1,'#5dff7a',1,1,.4)}
  const nc=Math.round(cam);ctx.drawImage(B.near,nc,0,W,H,0,0,W,H);
  for(const l of B.lights){const x=l.x-nc;if(x<-80||x>W+80)continue;const on=!l.fl||((t+l.ph)%300>18&&(t+l.ph)%300<260||(t+l.ph)%7<3);
   R(ctx,x-12,23,24,4,OUT);R(ctx,x-11,24,22,2,on?'#eafcff':'#3a4a50');
   if(on){ctx.fillStyle='rgba(200,240,255,.045)';ctx.beginPath();ctx.moveTo(x-10,26);ctx.lineTo(x+10,26);ctx.lineTo(x+52,H);ctx.lineTo(x-52,H);ctx.fill();ctx.globalAlpha=.25;R(ctx,x-14,22,28,8,'#bfefff');ctx.globalAlpha=1}}
 }else{
  ctx.drawImage(B.sky,0,0);for(const s of B.stars)if((t+s.ph)%200<170)R(ctx,s.x,s.y,1,1,(t+s.ph)%60<30?'#c8b8ff':'#7a6aaa');
  const b=G.boss,red=b&&b.phase>=3;const on=red?(t%90>6):true;
  if(on){neon(ctx,'STATIC',240,36,red?'#ff3b5c':'#ff2a6d',3,1,.3);neon(ctx,'KINGS',240,58,red?'#ff7a1a':'#2de2e6',3,1,.3)}else{text('STATIC',240,36,'#3a1a2a',3,1);text('KINGS',240,58,'#1a2a3a',3,1)}
  if(red&&(t%173<4)){ctx.globalAlpha=.25;R(ctx,0,0,W,FLOOR-30,'#d8c8ff');ctx.globalAlpha=1}
  ctx.drawImage(B.near,0,0);
  if(t%60<30)R(ctx,439,28,2,2,'#ff3b3b');
 }
}

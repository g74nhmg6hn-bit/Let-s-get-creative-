// ===== PIXEL FONT 5x7 =====
const FONT={
A:'.###. #...# #...# ##### #...# #...# #...#',B:'####. #...# #...# ####. #...# #...# ####.',C:'.###. #...# #.... #.... #.... #...# .###.',
D:'####. #...# #...# #...# #...# #...# ####.',E:'##### #.... #.... ####. #.... #.... #####',F:'##### #.... #.... ####. #.... #.... #....',
G:'.###. #...# #.... #.### #...# #...# .####',H:'#...# #...# #...# ##### #...# #...# #...#',I:'.###. ..#.. ..#.. ..#.. ..#.. ..#.. .###.',
J:'..### ...#. ...#. ...#. ...#. #..#. .##..',K:'#...# #..#. #.#.. ##... #.#.. #..#. #...#',L:'#.... #.... #.... #.... #.... #.... #####',
M:'#...# ##.## #.#.# #.#.# #...# #...# #...#',N:'#...# #...# ##..# #.#.# #..## #...# #...#',O:'.###. #...# #...# #...# #...# #...# .###.',
P:'####. #...# #...# ####. #.... #.... #....',Q:'.###. #...# #...# #...# #.#.# #..#. .##.#',R:'####. #...# #...# ####. #.#.. #..#. #...#',
S:'.#### #.... #.... .###. ....# ....# ####.',T:'##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..',U:'#...# #...# #...# #...# #...# #...# .###.',
V:'#...# #...# #...# #...# #...# .#.#. ..#..',W:'#...# #...# #...# #.#.# #.#.# #.#.# .#.#.',X:'#...# #...# .#.#. ..#.. .#.#. #...# #...#',
Y:'#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..',Z:'##### ....# ...#. ..#.. .#... #.... #####',
'0':'.###. #...# #..## #.#.# ##..# #...# .###.','1':'..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.','2':'.###. #...# ....# ...#. ..#.. .#... #####',
'3':'####. ....# ....# .###. ....# ....# ####.','4':'...#. ..##. .#.#. #..#. ##### ...#. ...#.','5':'##### #.... ####. ....# ....# #...# .###.',
'6':'..##. .#... #.... ####. #...# #...# .###.','7':'##### ....# ...#. ..#.. .#... .#... .#...','8':'.###. #...# #...# .###. #...# #...# .###.',
'9':'.###. #...# #...# .#### ....# ...#. .##..','.':'..... ..... ..... ..... ..... .##.. .##..',',':'..... ..... ..... ..... .##.. ..#.. .#...',
'!':'..#.. ..#.. ..#.. ..#.. ..#.. ..... ..#..','?':'.###. #...# ....# ...#. ..#.. ..... ..#..','-':'..... ..... ..... .###. ..... ..... .....',
':':'..... .##.. .##.. ..... .##.. .##.. .....',"'":'..#.. ..#.. .#... ..... ..... ..... .....','/':'....# ....# ...#. ..#.. .#... #.... #....',
'>':'.#... ..#.. ...#. ....# ...#. ..#.. .#...','<':'...#. ..#.. .#... #.... .#... ..#.. ...#.','+':'..... ..#.. ..#.. ##### ..#.. ..#.. .....',
'%':'##..# ##.#. ...#. ..#.. .#... .#.## #..##','(':'...#. ..#.. .#... .#... .#... ..#.. ...#.',')':'.#... ..#.. ...#. ...#. ...#. ..#.. .#...',
'[':'.###. .#... .#... .#... .#... .#... .###.',']':'.###. ...#. ...#. ...#. ...#. ...#. .###.','=':'..... ..... ##### ..... ##### ..... .....',
'#':'.#.#. ##### .#.#. .#.#. .#.#. ##### .#.#.','^':'..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..','|':'..#.. ..#.. ..#.. ..#.. ..#.. ..#.. ..#..',
'*':'..... #.#.# .###. ##### .###. #.#.# .....','&':'.##.. #..#. .##.. .##.# #..#. #..#. .##.#'
};
const GLY={};for(const k in FONT)GLY[k]=FONT[k].replace(/ /g,'');
const gcache=new Map();
function glyph(ch,col){const key=ch+col;let g=gcache.get(key);if(g)return g;const s=GLY[ch];if(!s)return null;
 const cc=mkCanvas(5,7);g=cc[0];cc[1].fillStyle=col;for(let i=0;i<35;i++)if(s[i]==='#')cc[1].fillRect(i%5,(i/5)|0,1,1);gcache.set(key,g);return g}
const textW=(s,sc=1)=>String(s).length*6*sc-sc;
function drawStr(c,s,x,y,col,sc){for(let i=0;i<s.length;i++){const g=glyph(s[i],col);if(g)c.drawImage(g,x+i*6*sc,y,5*sc,7*sc)}}
function textC(c,s,x,y,col='#fff',sc=1,al=0,sh=null){s=String(s).toUpperCase();if(al===1)x-=Math.round(textW(s,sc)/2);else if(al===2)x-=textW(s,sc);x=Math.round(x);y=Math.round(y);
 if(sh)drawStr(c,s,x,y+sc,sh,sc);drawStr(c,s,x,y,col,sc)}
function text(s,x,y,col,sc,al,sh){textC(ctx,s,x,y,col,sc,al,sh)}
function neon(c,s,x,y,col,sc=1,al=0,glow=.35){s=String(s).toUpperCase();if(al===1)x-=Math.round(textW(s,sc)/2);else if(al===2)x-=textW(s,sc);x=Math.round(x);y=Math.round(y);
 c.globalAlpha=glow;for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])drawStr(c,s,x+dx,y+dy,col,sc);c.globalAlpha=glow*.45;for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2],[-1,-1],[1,1],[1,-1],[-1,1]])drawStr(c,s,x+dx,y+dy,col,sc);
 c.globalAlpha=1;drawStr(c,s,x,y,col,sc)}

// ===== CHARACTER RIGS (all original designs) =====
const RIGS={
 juno:{s:1,thigh:9,shin:9,torso:13,uarm:7,farm:7,lw:4,aw:3,tw:9,hr:4.6,deco:'juno',
  c:{skin:'#f1b58c',skinD:'#c47f5c',top:'#16c9d9',topD:'#0b7d8c',pants:'#2b1f52',pantsD:'#1b1335',shoe:'#f4f4f8',shoeD:'#9d9db0'}},
 grunt:{s:1.06,thigh:9,shin:8.5,torso:14,uarm:8,farm:7,lw:5,aw:4,tw:11,hr:5,deco:'hood',
  c:{skin:'#c98b62',skinD:'#93603f',top:'#ff7a1a',topD:'#b14c0a',pants:'#3b3b4a',pantsD:'#25252f',shoe:'#1c1c24',shoeD:'#121218'}},
 shield:{s:1.1,thigh:9,shin:9,torso:14,uarm:8,farm:7,lw:5,aw:4,tw:12,hr:5,deco:'helmet',
  c:{skin:'#a8735a',skinD:'#7a4f3c',top:'#3d5bd0',topD:'#263a8a',pants:'#22253a',pantsD:'#161827',shoe:'#0f1018',shoeD:'#0a0a10'}},
 knife:{s:.98,thigh:10,shin:9,torso:12,uarm:7,farm:7,lw:3,aw:3,tw:8,hr:4.4,deco:'visor',
  c:{skin:'#e0a07a',skinD:'#a8714f',top:'#2b9a4a',topD:'#1a6330',pants:'#1d1d2b',pantsD:'#12121c',shoe:'#3a3a48',shoeD:'#22222c'}},
 boss:{s:1.42,thigh:9,shin:9,torso:15,uarm:8,farm:7,lw:5,aw:5,tw:13,hr:5,deco:'crown',
  c:{skin:'#8a5a3e',skinD:'#5e3b28',top:'#6a1fb0',topD:'#43127a',pants:'#1e1428',pantsD:'#140d1c',shoe:'#d4a017',shoeD:'#8a6a10'}}
};
const OUT='#0c0614';for(const k in RIGS)RIGS[k].s*=1.35;
function P0(){return {ln:.08,cr:0,rot:0,hy:0,fa1:.6,fa2:2.5,ba1:.35,ba2:2.3,fl1:.3,fl2:.08,bl1:-.3,bl2:-.12}}
const PKEYS=Object.keys(P0());
const AP={
 l1:[{fa1:.25,fa2:2.0},{fa1:1.57,fa2:1.57,ln:.22,fl1:.45,bl1:-.4}],
 l2:[{ba1:.1,ba2:2.0,ln:-.05},{ba1:1.55,ba2:1.55,ln:.32,fa1:.2,fa2:2.3,fl1:.5,bl1:-.5}],
 l3:[{fl1:1.0,fl2:-.3,ln:-.1,cr:1},{fl1:1.62,fl2:1.62,ln:-.3,bl1:-.15,bl2:-.1,fa1:-.4,fa2:.8,ba1:.9,ba2:2.2}],
 hv:[{ln:-.32,fa1:-1.0,fa2:.5,cr:2,fl1:.4,bl1:-.4},{ln:.5,fa1:1.65,fa2:1.55,fl1:.75,fl2:.15,bl1:-.7,bl2:-.3,cr:2}],
 fin:[{cr:5,ln:.25,fa1:.1,fa2:.9},{cr:-3,ln:.05,fa1:2.75,fa2:3.0,fl1:.15,bl1:-.15,bl2:-.5}],
 sw1:[{fa1:-1.6,fa2:-1.3,ln:-.15},{fa1:1.5,fa2:1.7,ln:.35,fl1:.6,bl1:-.5}],
 sw2:[{fa1:2.9,fa2:3.0,ba1:2.7,ba2:3.0,ln:-.25,cr:-1},{fa1:1.0,fa2:.8,ba1:1.0,ba2:.8,ln:.55,cr:4,fl1:.7,bl1:-.6}],
 knee:[{fl1:.6,fa1:1.2,fa2:1.2,ba1:1.2,ba2:1.2},{fl1:1.5,fl2:.2,ln:.2,fa1:1.2,fa2:1.2,ba1:1.2,ba2:1.2}],
 gp:[{ln:-.2,fa1:-.7,fa2:1.0,cr:1},{ln:.3,fa1:1.6,fa2:1.55,fl1:.5,bl1:-.5}],
 gp2:[{ba1:.1,ba2:2.0},{ba1:1.6,ba2:1.55,ln:.35,fl1:.5,bl1:-.5}],
 kt:[{fa1:2.7,fa2:2.9,ln:-.25},{fa1:1.4,fa2:1.5,ln:.3,fl1:.5,bl1:-.5}],
 ks:[{fa1:-1.0,fa2:-.4,ln:-.1},{fa1:1.8,fa2:2.0,ln:.35,fl1:.5}],
 bj:[{ln:-.2,fa1:-.6,fa2:1.0},{ln:.35,fa1:1.6,fa2:1.55,fl1:.5,bl1:-.4}],
 bj3:[{ln:-.35,fa1:-1.1,fa2:.4,cr:3},{ln:.55,fa1:1.7,fa2:1.6,fl1:.8,bl1:-.7,cr:2}]
};
const LIMP={fa1:-1.3,fa2:-1.0,ba1:-1.6,ba2:-1.2,fl1:.6,fl2:.2,bl1:-.2,bl2:-.3};
function walkPose(p,at,spd){const w=at*.22*spd;p.fl1=Math.sin(w)*.55;p.fl2=p.fl1-Math.max(0,Math.sin(w+1.6))*.9;p.bl1=Math.sin(w+Math.PI)*.55;p.bl2=p.bl1-Math.max(0,Math.sin(w+Math.PI+1.6))*.9;p.cr=Math.abs(Math.sin(w))*1.2;p.ln=.15;p.fa1=.6+Math.sin(w+Math.PI)*.15;p.ba1=.35+Math.sin(w)*.2}
function targetPose(a){
 const p=P0(),st=a.state,t=a.t,s=a.rig.s;const legs=(a.rig.thigh+a.rig.shin)*s;
 switch(st){
  case 'idle':p.cr=Math.sin(a.at*.09)*.8+.5;break;
  case 'walk':case 'enter':walkPose(p,a.at,a.d.spd||1);break;
  case 'atk':{const q=AP[a.atkName];if(q){const k=a.atk,ph=t<k.a0?0:(t<=k.a1+3?1:2);if(q[ph])Object.assign(p,q[ph])}break}
  case 'jump':if(a.jatk==='jk'||a.jatk==='dive')Object.assign(p,{fl1:1.15,fl2:1.15,bl1:.5,bl2:-.7,ln:-.35,fa1:-.5,fa2:.5,ba1:.8,ba2:2.2,rot:a.jatk==='dive'?.35:0});
   else Object.assign(p,{fl1:1.0,fl2:-.2,bl1:.3,bl2:-.6,fa1:.3,fa2:2.4,ba1:-.3,ba2:1.8});break;
  case 'hop':Object.assign(p,{fl1:.8,fl2:-.2,bl1:.2,bl2:-.5,ln:-.2});break;
  case 'land':p.cr=4;p.ln=.25;break;
  case 'dodge':Object.assign(p,{fl1:1.7,fl2:-.9,bl1:1.5,bl2:-1,fa1:1.4,fa2:2.8,ba1:1.2,ba2:2.6,ln:.6,cr:7,rot:Math.min(1,t/20)*TAU});break;
  case 'hurt':case 'grabbed':Object.assign(p,{ln:-.35,fa1:-.6,fa2:-.2,ba1:-.8,ba2:-.4,cr:st==='grabbed'?2:1});break;
  case 'knock':case 'thrown':Object.assign(p,LIMP,{rot:st==='thrown'?-(t*.35):-.9-Math.min(.6,t*.02),ln:-.2});break;
  case 'down':Object.assign(p,LIMP,{rot:-1.57,hy:legs-3,ln:0,fa1:-2.2,fa2:-2.4,ba1:-2,ba2:-2.2,fl1:.15,fl2:.1,bl1:.25,bl2:.2});break;
  case 'getup':{const k=Math.min(1,t/14);Object.assign(p,{rot:-1.57*(1-k),hy:(legs-3)*(1-k),cr:4*k,ln:.3})}break;
  case 'block':p.ln=-.15;break;
  case 'stagger':Object.assign(p,{ln:-.4,cr:3,fa1:-.3,fa2:.1,ba1:-.4,ba2:0});break;
  case 'grab':Object.assign(p,{fa1:1.3,fa2:1.3,ba1:1.2,ba2:1.3,ln:.15});break;
  case 'throw':{const k=Math.min(1,t/8);Object.assign(p,{fa1:lerp(1.3,2.9,k),fa2:lerp(1.3,3.0,k),ba1:lerp(1.2,2.8,k),ba2:lerp(1.2,3,k),ln:lerp(.2,-.35,k)})}break;
  case 'wthrow':Object.assign(p,t<6?{fa1:2.9,fa2:3.1,ba1:2.9,ba2:3.1,ln:-.25}:{fa1:1.5,fa2:1.5,ba1:1.4,ba2:1.5,ln:.35,fl1:.5,bl1:-.5});break;
  case 'pickup':Object.assign(p,{cr:6,fa1:.7,fa2:.9,ba1:.6,ba2:.8,ln:.4});break;
  case 'grabmiss':Object.assign(p,{fa1:1.5,fa2:1.5,ba1:1.4,ba2:1.5,ln:.3});break;
  case 'victory':Object.assign(p,{fa1:3.0,fa2:3.1,ln:-.05,cr:Math.sin(a.at*.15)});break;
  case 'bashw':Object.assign(p,{cr:3,ln:-.1});break;
  case 'bash':walkPose(p,a.at*2,1);Object.assign(p,{ln:.5,cr:2});break;
  case 'rec':Object.assign(p,{ln:.15,cr:2,fa1:.3,fa2:.6,ba1:.2,ba2:.5});break;
  case 'chargew':Object.assign(p,{ln:.5,cr:4,fa1:-.6,fa2:.8,ba1:-.7,ba2:.6,fl1:.6,bl1:-.7});break;
  case 'charge':walkPose(p,a.at*2.4,1);Object.assign(p,{ln:.6,cr:2,fa1:1.6,fa2:1.6});break;
  case 'tired':Object.assign(p,{ln:.35,cr:4+Math.sin(a.at*.3),fa1:.2,fa2:.3,ba1:.1,ba2:.2});break;
  case 'slamw':Object.assign(p,{cr:6,fa1:2.8,fa2:3,ba1:2.8,ba2:3});break;
  case 'slamair':Object.assign(p,{fa1:2.9,fa2:3.0,ba1:2.9,ba2:3.0,fl1:1.2,fl2:-.4,bl1:.6,bl2:-.8});break;
  case 'storm':Object.assign(p,{fa1:3.0,fa2:3.1,ba1:.3,ba2:.6,ln:-.1,cr:Math.sin(a.at*.5)});break;
  case 'roar':Object.assign(p,{ln:-.3,fa1:-1.3,fa2:-.7,ba1:-1.1,ba2:-.5,cr:2,fl1:.5,bl1:-.5});break;
  case 'taunt':Object.assign(p,{fa1:2.8,fa2:3.0,ba1:2.6,ba2:2.9,cr:Math.abs(Math.sin(a.at*.2))*3});break;
 }
 // per-type holds
 const hold=['idle','walk','enter','block','bashw','jump','land','hurt'].includes(st);
 if(a.type==='shield'&&hold&&a.gbT<=0){p.fa1=.9;p.fa2=1.45}
 if(a.type==='knife'&&(st==='idle'||st==='walk')){p.fa1=.3;p.fa2=1.0}
 if(a.type==='boss'&&(st==='idle'||st==='walk')){p.fl1+=.15;p.bl1-=.15;p.fa1=.5;p.fa2=1.9;p.ba1=.3;p.ba2=1.7}
 if(a.weapon&&['idle','walk','jump','land'].includes(st)&&!a.jatk){
  if(a.weapon.kind==='crate'){p.fa1=2.8;p.fa2=2.95;p.ba1=2.8;p.ba2=2.95}else{p.fa1=.45;p.fa2=2.0}}
 return p;
}
// stamp segment & blobs
function seg(x0,y0,x1,y1,w,col){ctx.fillStyle=col;const dx=x1-x0,dy=y1-y0,n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy)))),h=w/2;
 for(let i=0;i<=n;i++){const t=i/n;ctx.fillRect(Math.round(x0+dx*t-h),Math.round(y0+dy*t-h),w,w)}}
function blob(x,y,r,col){ctx.fillStyle=col;x=Math.round(x);y=Math.round(y);for(let dy=-r;dy<=r;dy++){const hw=Math.round(Math.sqrt(Math.max(0,r*r-dy*dy+r*.6)));ctx.fillRect(x-hw,y+dy,hw*2+1,1)}}
const LC={};function LT(h){if(LC[h])return LC[h];const n=parseInt(h.slice(1,7),16);let r=n>>16,g=(n>>8)&255,b=n&255;
 r=Math.min(255,r+(255-r)*.32+14)|0;g=Math.min(255,g+(255-g)*.32+14)|0;b=Math.min(255,b+(255-b)*.32+14)|0;return LC[h]='#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
let RIM='#ff4fa0',RCAM=0;
const SEC={juno:[{k:'hair',at:'head',ox:-.6,oy:-.4,rx:-7,ry:3,len:9,w0:4,w1:2,col:'#ff2a8a',hi:'#ff7ac0'},{k:'tail',at:'waist',ox:-.45,oy:1,rx:-3,ry:8,len:9,w0:5,w1:3,col:'#0b7d8c',hi:'#16c9d9'}],
 boss:[{k:'cape',at:'shB',ox:0,oy:0,rx:-13,ry:22,len:28,w0:12,w1:10,col:'#2e0a52',hi:'#ffd23f'}],
 knife:[{k:'scarf',at:'neck',ox:-.2,oy:1,rx:-8,ry:7,len:12,w0:3,w1:2,col:'#7dff3f',hi:'#d4ff8a'}],
 grunt:[{k:'hood',at:'head',ox:-.8,oy:.3,rx:-4,ry:6,len:7,w0:4,w1:3,col:'#b14c0a',hi:'#ff9a4a'}]};
function springPt(a,key,ax,ay,tx,ty,len){let s=a[key];
 if(!s||Math.abs(s.x-tx)>70||Math.abs(s.y-ty)>70)s=a[key]={x:tx,y:ty,vx:0,vy:0};
 if(!G.paused&&G.hitstop<=0){s.vx=(s.vx+(tx-s.x)*.16)*.74;s.vy=(s.vy+(ty-s.y)*.16+.2)*.74;s.x+=s.vx;s.y+=s.vy;
  const dx=s.x-ax,dy=s.y-ay,d=Math.hypot(dx,dy);if(d>len){s.x=ax+dx/d*len;s.y=ay+dy/d*len}}
 return s}
function exprOf(a){const st=a.state;if(['hurt','knock','thrown','grabbed','stagger','down'].includes(st))return 'hurt';if(st==='victory'||st==='taunt')return 'happy';
 if((st==='atk'&&a.atk&&a.t>=a.atk.a0-3)||['charge','chargew','bash','roar','storm','slamw'].includes(st)||a.jatk)return 'angry';return ''}
function drawSignPlate(x,y,ov){x=Math.round(x);y=Math.round(y);for(let r=0;r<2;r++){const rad=r?5:6,col=r?(ov||'#f9c80e'):(ov||OUT);ctx.fillStyle=col;for(let dy=-rad;dy<=rad;dy++){const hw=rad-Math.abs(dy);ctx.fillRect(x-hw,y+dy,hw*2+1,1)}}
 if(!ov){R(ctx,x-2,y,5,1,'#1a1205');R(ctx,x+1,y-1,1,3,'#1a1205');R(ctx,x+2,y,1,1,'#1a1205')}}
function drawCrate(x,y){x=Math.round(x);y=Math.round(y);R(ctx,x-8,y-13,16,14,OUT);R(ctx,x-7,y-12,14,12,'#9a6431');R(ctx,x-7,y-12,14,1,'#c98a4a');R(ctx,x-7,y-8,14,1,'#5e3b1a');R(ctx,x-7,y-4,14,1,'#5e3b1a');R(ctx,x-5,y-12,1,12,'#6e4520');R(ctx,x+4,y-12,1,12,'#6e4520')}
function drawSignProp(x,y){x=Math.round(x);y=Math.round(y);R(ctx,x-5,y-3,10,4,OUT);R(ctx,x-4,y-2,8,2,'#5a5a70');R(ctx,x-2,y-30,4,28,OUT);R(ctx,x-1,y-30,2,28,'#9a9ab0');drawSignPlate(x,y-33)}
function shadow(x,y,w,z){const k=Math.max(.35,1-z/110);const rx=Math.round(w*k),ry=Math.max(1,Math.round(2.5*k));ctx.fillStyle='rgba(0,0,0,.42)';x=Math.round(x);y=Math.round(y);
 for(let dy=-ry;dy<=ry;dy++){const hw=Math.round(rx*Math.sqrt(1-(dy*dy)/(ry*ry+.5)));ctx.fillRect(x-hw,y+dy,hw*2,1)}}
function ringPix(x,y,rx,ry,col,n){ctx.fillStyle=col;n=n||Math.max(12,Math.round(rx*1.6));for(let i=0;i<n;i++){const a=i/n*TAU;ctx.fillRect(Math.round(x+Math.cos(a)*rx),Math.round(y+Math.sin(a)*ry),1,1)}}

// ===== PARTICLES =====
const parts=[];
function P(type,x,y,z,o){const p={type,x,y,z,vx:0,vy:0,vz:0,g:0,life:20,col:'#fff',sz:1,drag:1};Object.assign(p,o);p.max=p.life;parts.push(p);return p}
function sparks(x,y,z,dir,n,cols){for(let i=0;i<n;i++){const a=rand(-1.1,1.1)+(dir<0?Math.PI:0);const sp=rand(2,5.5);P('spark',x,y,z,{vx:Math.cos(a)*sp,vz:Math.sin(a)*sp*.8+1,g:.18,life:randi(8,16),col:pickR(cols),drag:.88})}}
function hitFX(t,dir,big){const z=t.z+28*t.rig.s;P('star',t.x-dir*9,t.y+1,z,{life:big?7:5,sz:big?11:7,col:big?'#fff6a8':'#7ff9ff'});
 sparks(t.x,t.y+1,z,dir,big?14:8,big?['#fff6a8','#ff2a6d','#ffd23f','#ffffff']:['#ffffff','#7ff9ff','#2de2e6']);if(big)P('ring',t.x,t.y,z,{life:10,sz:4,col:'#ffd23f'})}
function puff(x,y,n,col){for(let i=0;i<n;i++)P('dust',x+rand(-6,6),y+rand(-2,2),rand(0,3),{vx:rand(-1,1),vz:rand(.2,.9),life:randi(14,24),sz:randi(2,4),col:col||'#6a5a8a',drag:.9})}
function ghost(a,col){P('ghost',a.x,a.y,a.z,{life:12,a,pose:Object.assign({},a.pose),face:a.face,col:col||(a.team===0?'#2de2e6':'#ff3df0')})}
function addText(s,x,y,z,col,sc){P('txt',x,y,z,{s,col:col||'#fff',sz:sc||1,vz:.9,drag:.92,life:46})}
function updParts(){for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life--;if(p.life<=0){parts.splice(i,1);continue}
 p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;p.vz-=p.g;p.vx*=p.drag;p.vy*=p.drag;if(p.type==='txt')p.vz*=p.drag;
 if(p.z<0&&p.g>0){p.z=0;p.vz*=-.35;p.vx*=.6}}}
function drawParts(cam){for(const p of parts){const x=Math.round(p.x-cam),y=Math.round(FLOOR+p.y-p.z),k=p.life/p.max;
 switch(p.type){
  case 'spark':seg(x,y,x-p.vx*1.6,y+p.vz*1.6,1,p.col);break;
  case 'dot':R(ctx,x,y,p.sz,p.sz,p.col);break;
  case 'dust':ctx.globalAlpha=k*.7;R(ctx,x-p.sz/2,y-p.sz/2,p.sz+(1-k)*3,p.sz+(1-k)*3,p.col);ctx.globalAlpha=1;break;
  case 'splinter':R(ctx,x,y,(p.life>>1)%2?3:1,(p.life>>1)%2?1:3,p.col);break;
  case 'star':{const r=Math.round(p.sz*(.6+k*.6));ctx.fillStyle=p.col;ctx.fillRect(x-r,y-1,r*2+1,3);ctx.fillRect(x-1,y-r,3,r*2+1);const d=Math.round(r*.55);for(let i=-d;i<=d;i++){ctx.fillRect(x+i,y+i,1,1);ctx.fillRect(x+i,y-i,1,1)}ctx.fillStyle='#fff';ctx.fillRect(x-2,y-2,5,5);break}
  case 'ring':ringPix(x,y,p.sz+(p.max-p.life)*2.5,(p.sz+(p.max-p.life)*2.5)*.4,p.col);break;
  case 'ghost':{if(p.img===undefined)p.img=ghostImg(p.a,p.col,p.pose,p.face);if(p.img){ctx.globalAlpha=k*.45;ctx.drawImage(p.img.c,x+p.img.ox,y+p.img.oy);ctx.globalAlpha=1}break}
  case 'txt':ctx.globalAlpha=Math.min(1,k*2);text(p.s,x,y,p.col,p.sz,1,'#120a20');ctx.globalAlpha=1;break;
  case 'zap':{ctx.fillStyle=p.col;let px=x,py=y;for(let i=0;i<4;i++){const nx=px+rand(-3,3),ny=py+rand(-4,1);seg(px,py,nx,ny,1,p.col);px=nx;py=ny}break}
 }}}

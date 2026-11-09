// ===== SCENES / UI =====
let scene='title',sceneT=0,curMenu=null,titleReady=false;
function mkMenu(items,back){return {items,idx:0,back,rects:[]}}
function updMenu(m){if(!m)return;const n=m.items.length;
 if(I.nav('up')){m.idx=(m.idx-1+n)%n;AU.sfx('menu')}
 if(I.nav('down')){m.idx=(m.idx+1)%n;AU.sfx('menu')}
 const it=m.items[m.idx];
 if(it.adj){if(I.nav('left')){it.adj(-1);AU.sfx('menu')}if(I.nav('right')){it.adj(1);AU.sfx('menu')}}
 if(I.p.confirm){if(it.act){AU.sfx('select');it.act()}else if(it.adj){it.adj(1);AU.sfx('menu')}return}
 if(I.p.back&&m.back){AU.sfx('back');m.back();return}
 if(ptr.moved||ptr.click){for(let i=0;i<m.rects.length;i++){const r=m.rects[i];if(r&&ptr.x>=r[0]&&ptr.x<r[0]+r[2]&&ptr.y>=r[1]&&ptr.y<r[1]+r[3]){
  if(ptr.moved&&m.idx!==i){m.idx=i;AU.sfx('menu')}
  if(ptr.click){m.idx=i;const t=m.items[i];if(t.act){AU.sfx('select');t.act()}else if(t.adj){t.adj(ptr.x<r[0]+r[2]/2?-1:1);AU.sfx('menu')}}break}}}}
function drawMenu(m,cx,y,gap,sc){gap=gap||16;sc=sc||1;m.rects=[];
 m.items.forEach((it,i)=>{const sel=i===m.idx,val=it.val?it.val():null;const s=val!=null?it.label+':  < '+val+' >':it.label;const w=Math.max(170,textW(s,sc)+30),x=Math.round(cx-w/2),yy=y+i*gap,h=7*sc+7;
  m.rects[i]=[x,yy-4,w,h];
  if(sel){ctx.globalAlpha=.28;R(ctx,x,yy-4,w,h,'#ff2a6d');ctx.globalAlpha=1;R(ctx,x,yy-4,2,h,'#ff2a6d');R(ctx,x+w-2,yy-4,2,h,'#ff2a6d');if((G.t>>3)%2)text('>',x+6,yy,'#ff2a6d',sc)}
  text(s,cx,yy,sel?'#ffffff':'#a497d4',sc,1,'#140a24')})}
function go(s){scene=s;sceneT=0;curMenu=MENUS[s]?MENUS[s]():null;updTouch()}
let returnFn=null;
function settingsItems(back){const shakeV=[0,.5,1],shakeN=['OFF','LOW','FULL'];return mkMenu([
 {label:'MUSIC',val:()=>Math.round(settings.music*100)+'%',adj:d=>{settings.music=clamp(Math.round(settings.music*10+d)/10,0,1);saveSettings()}},
 {label:'SOUND FX',val:()=>Math.round(settings.sfx*100)+'%',adj:d=>{settings.sfx=clamp(Math.round(settings.sfx*10+d)/10,0,1);saveSettings();AU.sfx('hitL')}},
 {label:'SCREEN SHAKE',val:()=>shakeN[shakeV.indexOf(settings.shake)]||'FULL',adj:d=>{let i=shakeV.indexOf(settings.shake);if(i<0)i=2;settings.shake=shakeV[clamp(i+d,0,2)];saveSettings()}},
 {label:'DIFFICULTY',val:()=>DIFF().name,adj:d=>{settings.diff=clamp(settings.diff+d,0,2);saveSettings()}},
 {label:'CRT SCANLINES',val:()=>settings.crt?'ON':'OFF',adj:()=>{settings.crt=!settings.crt;saveSettings()}},
 {label:'BACK',act:back}],back)}
const MENUS={
 title:()=>mkMenu([{label:'START GAME',act:()=>{tryFull();newGame()}},{label:'HOW TO PLAY',act:()=>{returnFn=()=>go('title');go('howto')}},{label:'SETTINGS',act:()=>{returnFn=()=>go('title');go('settings')}},{label:'BEST SCORES',act:()=>go('scores')},{label:'CREDITS',act:()=>go('credits')}]),
 settings:()=>settingsItems(()=>returnFn()),
 scores:()=>mkMenu([{label:'BACK',act:()=>go('title')}],()=>go('title')),
 credits:()=>mkMenu([{label:'BACK',act:()=>go('title')}],()=>go('title')),
 howto:()=>mkMenu([{label:'BACK',act:()=>returnFn()}],()=>returnFn()),
 results:()=>G.result&&G.result.win?mkMenu([{label:'PLAY AGAIN',act:newGame},{label:'TITLE SCREEN',act:()=>{go('title');AU.playSong('title')}}]):
  mkMenu([{label:'RETRY STAGE',act:retryStage},{label:'NEW GAME',act:newGame},{label:'TITLE SCREEN',act:()=>{go('title');AU.playSong('title')}}])
};
function tryFull(){if(I.dev!=='touch')return;try{const d=document.documentElement;if(!document.fullscreenElement&&d.requestFullscreen)d.requestFullscreen({navigationUI:'hide'}).then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{})}catch(e){}}
function pauseMenu(){return mkMenu([{label:'RESUME',act:closePause},{label:'RESTART STAGE',act:()=>{G.paused=false;retryStage()}},{label:'HOW TO PLAY',act:()=>{G.pmode='howto';curMenu=mkMenu([{label:'BACK',act:backToPause}],backToPause)}},
 {label:'SETTINGS',act:()=>{G.pmode='settings';curMenu=settingsItems(backToPause)}},{label:'QUIT TO TITLE',act:()=>{G.paused=false;go('title');AU.playSong('title')}}],closePause)}
function backToPause(){G.pmode='menu';curMenu=pauseMenu();curMenu.idx=G.pmIdx||0}
function openPause(){G.paused=true;G.pmode='menu';curMenu=pauseMenu();AU.sfx('back');updTouch()}
function closePause(){G.paused=false;curMenu=null;updTouch()}
let touchShown=null;
function updTouch(){const on=I.dev==='touch'&&scene==='play'&&!G.paused&&G.sub!=='tutorial';if(on!==touchShown){touchShown=on;document.body.classList.toggle('touch-on',on)}}

function updTitle(){
 if(!titleReady){if(I.p.confirm||ptr.click||I.p.light||I.p.jump||I.p.pause){titleReady=true;AU.init();AU.playSong('title');AU.sfx('select');curMenu=MENUS.title()}return}
 updMenu(curMenu)}
function updScene(){
 switch(scene){
  case 'title':updTitle();break;
  case 'play':if(G.paused){updMenu(curMenu);if(G.pmode==='menu'&&curMenu)G.pmIdx=curMenu.idx}else updPlay();break;
  default:updMenu(curMenu)}
 updTouch()}

// ===== RENDER =====
function drawActorAt(a,cam){
 if(a.state==='down'&&a.dead&&a.team===1&&a.t>25&&(a.t>>2)%2)return;
 const sx=Math.round(a.x-cam),sy=Math.round(FLOOR+a.y-a.z);
 const ov=a.flash>0&&(a.flash>>1)%2?'#ffffff':null;
 if(a.team===0&&a.inv>0&&a.state!=='dodge'&&a.state!=='getup'&&(G.t>>2)%2)ctx.globalAlpha=.55;
 drawRig(a,sx,sy,ov);ctx.globalAlpha=1;
 if(a.team===1&&a.state==='atk'&&a.t<a.atk.a0&&!a.dead){if((a.t>>2)%2===0)text('!',sx,sy-Math.round(52*a.rig.s),'#f9c80e',1,1,OUT)}
 if(a.team===1&&(a.state==='bashw'||a.state==='chargew'||a.state==='slamw')&&(a.t>>2)%2===0)text('!',sx,sy-Math.round(52*a.rig.s),'#ff3b5c',1,1,OUT);
 if(a.state==='stagger'&&a.type==='shield'){for(let i=0;i<3;i++){const an=G.t*.15+i*2.1;R(ctx,sx+Math.cos(an)*8,sy-62+Math.sin(an)*2,2,2,'#f9c80e')}}}
function renderPlay(){
 const sh=G.shake*G.shake*7,shx=(Math.random()*2-1)*sh,shy=(Math.random()*2-1)*sh;
 const cam=G.camX+shx,def=G.L.def;
 ctx.save();ctx.translate(0,Math.round(shy));
 drawBG(def.theme,Math.round(cam),G.t);
 const camR=Math.round(cam);RCAM=camR;
 for(const pj of G.projs)if(pj.kind==='bolt'&&pj.t<pj.delay&&(pj.t>>2)%2===0){const x=pj.x-camR,y=FLOOR+pj.y;ringPix(x,y,14,4,'#ff3b5c',28);ringPix(x,y,8,2.5,'#ff7a9a',18)}
 for(const a of G.actors)if(!(a.dead&&a.state==='down'&&a.t>25&&(a.t>>2)%2))shadow(a.x-camR,FLOOR+a.y,a.w*.9,a.z);
 for(const k of G.picks)shadow(k.x-camR,FLOOR+k.y,5,0);
 for(const pj of G.projs)if(pj.kind==='knife'||pj.kind==='crate')shadow(pj.x-camR,FLOOR+pj.y,pj.kind==='crate'?7:4,pj.z);
 const list=[];
 for(const a of G.actors)list.push([a.y+(a.state==='down'?-2:0),0,a]);
 for(const pr of G.props)list.push([pr.y,1,pr]);
 for(const k of G.picks)list.push([k.y,2,k]);
 for(const pj of G.projs)list.push([pj.y+.5,3,pj]);
 list.sort((a,b)=>a[0]-b[0]);
 const p=G.player;
 for(const [,k,o] of list){
  if(k===0)drawActorAt(o,camR);
  else if(k===1){const x=o.x-camR,y=FLOOR+o.y;if(o.kind==='crate')drawCrate(x,y);else drawSignProp(x,y);
   if(p&&!p.weapon&&G.sub==='fight'&&Math.abs(o.x-p.x)<24&&Math.abs(o.y-p.y)<12&&(p.state==='idle'||p.state==='walk')){const l=lbl('pick');const w=textW(l)+4;R(ctx,x-w/2-1,y-(o.kind==='crate'?27:50),w+2,10,OUT);R(ctx,x-w/2,y-(o.kind==='crate'?26:49),w,8,'#f9c80e');text(l,x,y-(o.kind==='crate'?26:49)+1,OUT,1,1)}}
  else if(k===2){if(o.life<120&&(o.life>>2)%2)continue;const x=Math.round(o.x-camR),y=Math.round(FLOOR+o.y-3-Math.abs(Math.sin(G.t*.08))*3);
   if(o.kind==='food'){R(ctx,x-5,y-8,10,9,OUT);R(ctx,x-4,y-7,8,7,'#f2efe9');R(ctx,x-4,y-5,8,2,'#e63946');R(ctx,x-5,y-8,10,1,'#c8c0b0');if((G.t>>3)%2)R(ctx,x-1,y-12,1,2,'#ffffff88');else R(ctx,x+1,y-13,1,2,'#ffffff88')}
   else{R(ctx,x-6,y-6,12,7,OUT);R(ctx,x-5,y-5,10,5,'#3fa34d');R(ctx,x-5,y-4,10,1,'#7bd88f');R(ctx,x-1,y-5,2,5,'#2a6b33');if((G.t>>2)%8===0)R(ctx,x+4,y-8,1,1,'#fff')}}
  else{const x=Math.round(o.x-camR),y=Math.round(FLOOR+o.y-(o.z||0));
   if(o.kind==='knife'){R(ctx,x-5,y-1,10,3,OUT);R(ctx,x-4,y,8,1,'#bffcff');R(ctx,o.vx>0?x-4:x+2,y,2,1,'#2a2a38')}
   else if(o.kind==='crate')drawCrate(x,y+(G.t%4<2?0:1));
   else if(o.kind==='shock'&&o.t>=0){for(let i=0;i<5;i++){const hh=rand(4,14);R(ctx,x+rand(-3,3),FLOOR+o.y-hh,1,hh,pickR(['#b45cff','#ffffff','#ff3df0']))}ringPix(x,FLOOR+o.y,8,2.5,'#b45cff',14)}
   else if(o.kind==='bolt'&&o.t>=o.delay){let px=x,py=0;for(let yy=0;yy<FLOOR+o.y;yy+=10){const nx=x+rand(-6,6);seg(px,py,nx,yy+10,4,'#7a2fd0');seg(px,py,nx,yy+10,2,'#ffffff');px=nx;py=yy+10}ringPix(x,FLOOR+o.y,16,4,'#ffffff',30)}}}
 drawParts(camR);
 ctx.restore();
 if(def.theme!=='garage')drawRain(def.theme==='roof'&&G.boss&&G.boss.phase>=3);
 else{ctx.fillStyle='rgba(200,200,220,.25)';for(let i=0;i<14;i++){const x=(i*97+G.t*.3)%W,y=(i*53+Math.sin(G.t*.01+i)*20+G.t*.1)%FLOOR;ctx.fillRect(x|0,y|0,1,1)}}
 if(G.flash>0){ctx.globalAlpha=G.flash>3?.35:.2;R(ctx,0,0,W,H,'#ffffff');ctx.globalAlpha=1}
 if(G.sub==='dead'||G.sub==='won'){ctx.globalAlpha=Math.min(.45,G.subT/200);R(ctx,0,0,W,H,G.sub==='won'?'#1a0a30':'#2a0010');ctx.globalAlpha=1}
 drawHUD()}
function bar(x,y,w,h,v,ghost,col,col2){R(ctx,x-1,y-1,w+2,h+2,OUT);R(ctx,x,y,w,h,'#2a1a3a');R(ctx,x,y,Math.round(w*clamp(ghost,0,1)),h,'#ff2a6d');R(ctx,x,y,Math.round(w*clamp(v,0,1)),h,col);R(ctx,x,y,Math.round(w*clamp(v,0,1)),1,col2)}
function drawHUD(){
 const p=G.player,L=G.L;
 R(ctx,5,5,22,22,OUT);R(ctx,6,6,20,20,'#1b1035');R(ctx,6,6,20,1,'#2de2e6');
 {const sv={...p,state:'idle',face:1,flash:0,weapon:null,pose:P0(),noSec:true,jatk:null};ctx.save();ctx.beginPath();ctx.rect(6,6,20,20);ctx.clip();const sc=RIGS.juno;drawRig(sv,14,95,null);ctx.restore()}
 text('JUNO',31,6,'#2de2e6',1,0,OUT);
 const low=p.hp<p.maxhp*.3&&(G.t>>3)%2;bar(31,15,118,6,p.hp/p.maxhp,G.hpGhost/p.maxhp,low?'#ff3b5c':'#2de2e6','#bffcff');
 text(String(Math.ceil(p.hp)),152,15,'#ffffff',1,0,OUT);
 if(p.weapon){const lab=p.weapon.kind==='crate'?'CRATE: THROW':'SIGN';text(lab,31,25,'#f9c80e',1,0,OUT);if(p.weapon.kind==='sign')for(let i=0;i<8;i++)R(ctx,31+textW(lab)+5+i*4,25,3,6,i<p.weapon.dur?'#f9c80e':'#3a2a4a')}
 if(G.lastHit&&!G.lastHit.e.remove&&G.lastHit.e.type!=='boss'){const e=G.lastHit.e;text(e.d.name,190,6,'#ff7a1a',1,0,OUT);bar(190,15,70,4,e.hp/e.maxhp,e.hp/e.maxhp,'#ff7a1a','#ffc08a')}
 text('SCORE',W-6,5,'#a497d4',1,2,OUT);text(String(G.score).padStart(7,'0'),W-6,14,'#ffffff',1,2,OUT);
 if(I.dev!=='touch'){R(ctx,W-18,24,13,10,OUT);R(ctx,W-17,25,11,8,'#2a1a4a');R(ctx,W-14,27,2,4,'#fff');R(ctx,W-10,27,2,4,'#fff');}
 const def=L.def;
 if(!def.boss){text(def.name,W/2,H-12,'#6a5a9a',1,1,OUT);if(L.lock!==null)text('WAVE '+(L.wave+1)+'/'+def.waves.length,W/2,H-22,'#ff2a6d',1,1,OUT)}
 if(G.combo>=2){const pop=G.comboPop>0?1:0,sc=2+pop;const x=W-8,y=56;text(String(G.combo),x,y-pop*3,'#ffffff',sc,2,OUT);text('HITS',x,y+16,'#f9c80e',1,2,OUT);
  const r=rating(G.combo);if(r){neon(ctx,r[1],x-34,y+27,r[3],2,1,.35);text(r[2],x,y+45,r[3],1,2,OUT)}
  R(ctx,x-50,y+55,50,2,'#2a1a3a');R(ctx,x-50,y+55,Math.round(50*G.comboT/120),2,'#f9c80e')}
 if(G.go>0&&L.lock===null&&G.sub==='fight'&&(G.t>>4)%2===0){neon(ctx,'GO',W-30,110,'#f9c80e',2,1,.4);neon(ctx,'>>',W-30,128,'#f9c80e',2,1,.4)}
 if(G.boss&&(G.sub==='fight'||G.sub==='won'||G.sub==='dead')){const b=G.boss,x=100,w=280,y=H-12;text(b.d.name,x,y-10,'#b45cff',1,0,OUT);
  for(let i=0;i<3;i++)R(ctx,x+w-22+i*8,y-10,6,6,i<4-b.phase?'#b45cff':'#3a2a4a');
  bar(x,y,w,6,b.hp/b.maxhp,G.bossGhost/b.maxhp,b.phase>=3?'#ff3b8a':'#b45cff','#e2c4ff');R(ctx,x+Math.round(w*.33),y,1,6,OUT);R(ctx,x+Math.round(w*.66),y,1,6,OUT)}
 if(G.level===0&&G.sub==='fight'&&G.stageTime<60*22){const a=G.stageTime>60*19?(60*22-G.stageTime)/180:1;ctx.globalAlpha=a;
  const s=I.dev==='touch'?'HIT x3 = COMBO   HIT HIT HEAVY = UPPERCUT   PICK UP PROPS':`${lbl('light')} LIGHT  ${lbl('heavy')} HEAVY  ${lbl('jump')} JUMP  ${lbl('dodge')} ROLL  ${lbl('grab')} GRAB  ${lbl('pick')} PICK UP`;
  const ry=I.dev==='touch'?34:H-36;R(ctx,0,ry,W,11,'#0c0614cc');text(s,W/2,ry+2,'#d6ccff',1,1);ctx.globalAlpha=1}
 if(G.banner){const b=G.banner,k=b.t;const x=W/2,y=b.big?92:78;const slide=Math.max(0,(10-k))*30;const fade=b.t>(b.big?130:80)?1-(b.t-(b.big?130:80))/20:1;ctx.globalAlpha=clamp(fade,0,1);
  R(ctx,0,y-6,W,b.sub?36:26,'#0c0614aa');R(ctx,0,y-6,W,1,b.col);R(ctx,0,y+(b.sub?29:19),W,1,b.col);neon(ctx,b.s,x-slide,y,b.col,b.big?3:2,1,.4);if(b.sub)text(b.sub,x+slide,y+(b.big?24:18),'#ffffff',1,1,OUT);ctx.globalAlpha=1}
 if(G.sub==='intro'){const k=G.subT;ctx.globalAlpha=k<10?k/10:k>66?Math.max(0,(80-k)/14):1;R(ctx,0,96,W,52,'#0c0614cc');R(ctx,0,96,W,1,'#ff2a6d');R(ctx,0,147,W,1,'#2de2e6');
  text(G.L.def.boss?'FINAL STAGE':'STAGE '+(G.level+1),W/2,102,'#ff2a6d',1,1);neon(ctx,G.L.def.name,W/2,114,'#2de2e6',2,1,.4);text(G.L.def.sub,W/2,134,'#a497d4',1,1);ctx.globalAlpha=1}
 if(G.sub==='clear'){const k=G.subT;R(ctx,0,80,W,80,'#0c0614cc');neon(ctx,'STAGE CLEAR!',W/2,88,'#f9c80e',3,1,.4);
  if(k>40)text('TIME BONUS   '+String(Math.min(G.clearBonus[0],Math.round(G.clearBonus[0]*(k-40)/40))).padStart(5,' '),W/2,120,'#ffffff',1,1,OUT);
  if(k>70)text('HEALTH BONUS '+String(Math.min(G.clearBonus[1],Math.round(G.clearBonus[1]*(k-70)/40))).padStart(5,' '),W/2,132,'#ffffff',1,1,OUT);
  if(k>110)text('SCORE '+G.score,W/2,146,'#2de2e6',1,1,OUT)}
 if(G.sub==='dead'&&G.subT>30)neon(ctx,'KNOCKED OUT',W/2,100,'#ff3b5c',3,1,.4);
 if(G.sub==='won'&&G.subT>40){neon(ctx,'THE BARON FALLS!',W/2,90,'#f9c80e',3,1,.4);if(G.subT>90)text('VOLT ALLEY IS FREE',W/2,120,'#ffffff',1,1,OUT)}
 if(G.sub==='tutorial')drawHowTo(true);
 if(G.paused){R(ctx,0,0,W,H,'#07031acc');if(G.pmode==='howto')drawHowTo(false);else{neon(ctx,G.pmode==='settings'?'SETTINGS':'PAUSED',W/2,50,'#ff2a6d',3,1,.4);drawMenu(curMenu,W/2,96,18,1)}}}
function drawHowTo(first){
 R(ctx,14,10,W-28,H-20,'#0c0614ee');R(ctx,14,10,W-28,1,'#2de2e6');R(ctx,14,H-11,W-28,1,'#ff2a6d');
 neon(ctx,'HOW TO FIGHT',W/2,17,'#2de2e6',2,1,.4);
 const rows=[['','KEYBOARD / MOUSE','GAMEPAD','TOUCH'],['MOVE','WASD / ARROWS','STICK / D-PAD','LEFT STICK'],['LIGHT ATTACK','J / LEFT CLICK','X','HIT'],['HEAVY ATTACK','K / RIGHT CLICK','Y','HEAVY'],
  ['JUMP / AIR ATTACK','SPACE','A','JUMP'],['DODGE ROLL','L / SHIFT / MID CLICK','B / RT','ROLL'],['GRAB (THEN J / K)','G','RB','GRAB'],['PICK UP / DROP PROP','E','LB','PICK'],['PAUSE','ESC','START','II']];
 const cx=[22,146,292,394];rows.forEach((r,i)=>{const y=38+i*11;if(i===0)R(ctx,20,y+8,W-40,1,'#3a2a5a');r.forEach((s,j)=>text(s,cx[j],y,i===0?'#ff2a6d':j===0?'#f9c80e':(I.dev==='kb'&&j===1||I.dev==='pad'&&j===2||I.dev==='touch'&&j===3)?'#ffffff':'#8a7cb8',1))});
 const tips=['LIGHT x3 = KNOCKDOWN.  LIGHT, LIGHT, HEAVY = UPPERCUT LAUNCHER','SPARK GRUNT: BRAWLER - KEEP HITTING, ROLL AWAY FROM GROUPS','RIOT WALL: BLOCKS FRONT HITS - USE HEAVY, A THROW, OR HIT FROM BEHIND','NEEDLE: THROWS KNIVES - JUMP OR ROLL THROUGH, OR PUNCH A KNIFE TO PARRY','ROLL RIGHT BEFORE A HIT = PERFECT DODGE.  SMASH CRATES FOR FOOD.'];
 tips.forEach((s,i)=>text(s,W/2,146+i*12,i===0?'#2de2e6':'#d6ccff',1,1));
 if((G.t>>4)%2===0)text(first?'PRESS '+lbl('confirm')+' TO FIGHT':'PRESS '+lbl('confirm')+' OR BACK',W/2,H-24,'#f9c80e',1,1,OUT);
 if(!first&&curMenu)curMenu.rects=[[0,H-30,W,20]]}
function renderTitle(){
 if(!BG.street)BG.street=makeBG('street',LEVELS[0].width);
 const cam=(G.t*.6)%(LEVELS[0].width-W);drawBG('street',cam,G.t);ctx.globalAlpha=.55;R(ctx,0,0,W,H,'#07031a');ctx.globalAlpha=1;drawRain(false);
 const bob=Math.round(Math.sin(G.t*.05)*2);const fl=(G.t%180)>170&&(G.t%4<2);
 neon(ctx,'NEON',W/2,28+bob,fl?'#5a1030':'#ff2a6d',6,1,.35);neon(ctx,'KNOCKOUT',W/2,74+bob,'#2de2e6',4,1,.35);
 text('TAKE BACK VOLT ALLEY FROM THE STATIC KINGS',W/2,108,'#d6ccff',1,1,OUT);
 if(!titleReady){if((G.t>>4)%2===0)text(I.dev==='touch'?'TAP TO START':'PRESS ENTER',W/2,170,'#f9c80e',2,1,OUT)}
 else drawMenu(curMenu,W/2,134,17,1);
 text('V1.0  ORIGINAL GAME - ALL ART, MUSIC AND SOUND MADE IN CODE',W/2,H-10,'#6a5a9a',1,1)}
function renderMenuScene(){
 if(!BG.street)BG.street=makeBG('street',LEVELS[0].width);
 drawBG('street',(G.t*.3)%(LEVELS[0].width-W),G.t);ctx.globalAlpha=.78;R(ctx,0,0,W,H,'#07031a');ctx.globalAlpha=1;
 if(scene==='settings'){neon(ctx,'SETTINGS',W/2,30,'#ff2a6d',3,1,.4);drawMenu(curMenu,W/2,84,20,1);text('LEFT / RIGHT TO CHANGE',W/2,H-18,'#6a5a9a',1,1)}
 else if(scene==='scores'){neon(ctx,'BEST SCORES',W/2,24,'#f9c80e',3,1,.4);const l=store.get('nk_scores',[]);
  if(!l.length)text('NO SCORES YET - GO MAKE SOME NOISE',W/2,110,'#a497d4',1,1);
  l.slice(0,8).forEach((e,i)=>{const y=62+i*16;text((i+1)+'.',120,y,i===0?'#f9c80e':'#a497d4',1,2);text(String(e.s).padStart(7,'0'),132,y,'#ffffff',1);text('RANK '+e.r,200,y,'#ff2a6d',1);text(e.st,260,y,'#2de2e6',1);text(e.d,320,y,'#6a5a9a',1)});
  drawMenu(curMenu,W/2,H-28,16,1)}
 else if(scene==='credits'){neon(ctx,'CREDITS',W/2,24,'#2de2e6',3,1,.4);
  ['NEON KNOCKOUT','AN ORIGINAL NEON BEAT \'EM UP','','CHARACTERS: JUNO, THE STATIC KINGS, BARON VOLT','PIXEL ART, ANIMATION, MUSIC AND SOUND EFFECTS','ARE ALL GENERATED FROM SCRATCH IN CODE','NO EXTERNAL ASSETS OR SAMPLES','','MADE WITH CLAUDE','THANKS FOR PLAYING!'].forEach((s,i)=>text(s,W/2,62+i*14,i===0?'#ff2a6d':i===8?'#f9c80e':'#d6ccff',1,1));
  drawMenu(curMenu,W/2,H-28,16,1)}
 else if(scene==='howto')drawHowTo(false)}
function renderResults(){
 if(!BG.street)BG.street=makeBG('street',LEVELS[0].width);
 drawBG(G.result.win?'street':'street',(G.t*.3)%(LEVELS[0].width-W),G.t);ctx.globalAlpha=.8;R(ctx,0,0,W,H,G.result.win?'#0a0420':'#1a0410');ctx.globalAlpha=1;
 const r=G.result,k=sceneT;
 neon(ctx,r.win?'VICTORY!':'KNOCKED OUT',W/2,18,r.win?'#f9c80e':'#ff3b5c',3,1,.4);
 const rows=[['SCORE',r.score],['MAX COMBO',r.maxCombo+' HITS'],['ENEMIES DEFEATED',r.kos],['TIME',Math.floor(r.time/3600)+':'+String(Math.floor(r.time/60)%60).padStart(2,'0')]];
 rows.forEach((row,i)=>{if(k>20+i*12){text(row[0],110,58+i*16,'#a497d4',1);text(String(row[1]),300,58+i*16,'#ffffff',1,2)}});
 if(k>80){const rc={S:'#ff3df0',A:'#ff7a1a',B:'#f9c80e',C:'#7dff6a',D:'#2de2e6'}[r.rank];text('RANK',360,56,'#a497d4',1,1);neon(ctx,r.rank,360,68,rc,6,1,.4)}
 if(r.newBest&&k>90&&(G.t>>3)%2)neon(ctx,'NEW BEST!',360,124,'#f9c80e',1,1,.5);
 if(k>60)drawMenu(curMenu,W/2,150,18,1)}
function render(){
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;R(ctx,0,0,W,H,'#05030a');
 if(scene==='title')renderTitle();else if(scene==='play')renderPlay();else if(scene==='results')renderResults();else renderMenuScene()}

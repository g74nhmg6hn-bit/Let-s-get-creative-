// ===== GAME DATA =====
const LEVELS=[
 {name:'NEON STREET',sub:'VOLT ALLEY - 2:14 AM',theme:'street',width:2300,music:'street',
  waves:[{at:260,groups:[['grunt','grunt'],['grunt']]},
         {at:900,groups:[['grunt','shield'],['grunt','grunt']]},
         {at:1560,groups:[['knife','grunt'],['shield','grunt','knife']]}],
  props:[['crate',200,24],['sign',470,58],['crate',740,16],['crate',1080,52],['sign',1300,22],['crate',1720,44],['crate',1950,20]]},
 {name:'UNDERGROUND GARAGE',sub:'LEVEL B3 - STATIC KINGS TURF',theme:'garage',width:2500,music:'garage',
  waves:[{at:240,groups:[['shield','knife'],['grunt','grunt','grunt']]},
         {at:940,groups:[['knife','knife','grunt'],['shield','shield','grunt']]},
         {at:1700,groups:[['grunt','shield','knife'],['grunt','knife','shield','grunt']]}],
  props:[['sign',150,40],['crate',420,20],['crate',650,60],['sign',1110,30],['crate',1380,50],['crate',1520,14],['sign',1880,56],['crate',2150,30]]},
 {name:'THE VOLT CROWN',sub:"BARON VOLT'S ROOFTOP",theme:'roof',width:W,music:'boss',boss:true,waves:[],props:[['crate',70,20],['crate',410,60],['sign',90,62]]}
];
const TYPES={
 juno:{hp:130,rig:'juno',w:12,spd:1},
 grunt:{hp:38,rig:'grunt',w:14,spd:1.05,score:300,name:'SPARK GRUNT'},
 shield:{hp:60,rig:'shield',w:15,spd:.72,score:450,name:'RIOT WALL'},
 knife:{hp:28,rig:'knife',w:12,spd:1.25,score:400,name:'NEEDLE'},
 boss:{hp:560,rig:'boss',w:22,spd:.95,score:6000,name:'BARON VOLT'}
};
const ATK={
 l1:{dur:15,a0:4,a1:6,dmg:6,kb:1.2,rch:30,hs:3,stun:16,sfx:'hitL',sw:'swing',next:'l2',fin:'fin'},
 l2:{dur:17,a0:4,a1:7,dmg:7,kb:1.5,rch:31,hs:3,stun:17,sfx:'hitL',sw:'swing',next:'l3',fin:'fin',st:.5},
 l3:{dur:26,a0:6,a1:10,dmg:11,kb:3.6,launch:3.2,knock:1,rch:38,hs:6,sfx:'hitH',sw:'swingH',st:1.2,shake:.35},
 hv:{dur:30,a0:11,a1:14,dmg:15,kb:4.6,launch:2.6,knock:1,gb:1,rch:37,hs:7,sfx:'hitH',sw:'swingH',st:2.2,shake:.45},
 fin:{dur:32,a0:7,a1:12,dmg:17,kb:1.6,launch:6.2,knock:1,gb:1,rch:33,hs:9,sfx:'hitH',sw:'swingH',st:.6,shake:.55,flash:1},
 sw1:{dur:22,a0:7,a1:11,dmg:15,kb:3,launch:1.5,knock:1,rch:48,hs:6,sfx:'hitH',sw:'swingH',st:.8,shake:.35,wpn:1},
 sw2:{dur:34,a0:15,a1:18,dmg:24,kb:4.2,launch:3.5,knock:1,gb:1,rch:50,hs:9,sfx:'hitH',sw:'swingH',st:1,shake:.6,wpn:1,flash:1},
 knee:{dur:15,a0:5,a1:7,dmg:5,kb:0,rch:28,hs:3,stun:30,sfx:'hitL',grab:1},
 jk:{dmg:11,kb:3.4,launch:2.5,knock:1,rch:30,hs:5,sfx:'hitH',shake:.3},
 dive:{dmg:13,kb:4,launch:3,knock:1,gb:1,rch:28,hs:6,sfx:'hitH',shake:.4},
 diveShock:{dmg:6,kb:2.5,launch:2,knock:1,hs:3,sfx:'hitL'},
 body:{dmg:14,kb:3.5,launch:3,knock:1,hs:6,thrown:1,sfx:'hitH',shake:.3},
 crateHit:{dmg:18,kb:4,launch:3,knock:1,hs:7,thrown:1,sfx:'hitH',shake:.4},
 gp:{dur:30,a0:14,a1:17,dmg:7,kb:2,rch:30,hs:4,stun:18,sfx:'hitL',sw:'swing'},
 gp2:{dur:24,a0:7,a1:10,dmg:8,kb:3,rch:30,hs:4,stun:20,sfx:'hitL',sw:'swing'},
 ks:{dur:28,a0:12,a1:15,dmg:7,kb:2,rch:30,hs:3,stun:16,sfx:'hitL',sw:'swing'},
 kt:{dur:40,a0:24,a1:24,proj:1},
 knife:{dmg:9,kb:2,stun:18,hs:4,sfx:'hitL'},
 bash:{dmg:11,kb:4,launch:2.5,knock:1,hs:6,sfx:'hitH',shake:.3},
 bj:{dur:26,a0:11,a1:14,dmg:9,kb:2.4,rch:42,hs:5,stun:20,sfx:'hitH',sw:'swingH'},
 bj3:{dur:36,a0:13,a1:17,dmg:14,kb:5,launch:3,knock:1,rch:46,hs:7,sfx:'hitH',sw:'swingH',shake:.4},
 charge:{dmg:17,kb:5,launch:4,knock:1,hs:8,sfx:'hitH',shake:.5},
 slam:{dmg:14,kb:4,launch:3.5,knock:1,hs:6,sfx:'hitH',shake:.4},
 shock:{dmg:12,kb:3,launch:3,knock:1,hs:5,sfx:'hitH',shake:.3},
 bolt:{dmg:15,kb:2,launch:4,knock:1,hs:6,sfx:'hitH',shake:.4},
 roar:{dmg:3,kb:4,launch:2.5,knock:1,hs:3,sfx:'hitL'}
};
const RATINGS=[[50,'SSS','NEON GOD','#ff3df0'],[35,'S','SAVAGE','#ff2a6d'],[24,'A','FIERCE','#ff7a1a'],[16,'B','GREAT','#f9c80e'],[10,'C','COOL','#7dff6a'],[5,'D','NICE','#2de2e6']];
const rating=n=>RATINGS.find(r=>n>=r[0]);
const G={t:0,actors:[],props:[],projs:[],picks:[],player:null,camX:0,shake:0,hitstop:0,slow:0,flash:0,level:0,L:null,score:0,combo:0,comboT:0,comboPop:0,maxCombo:0,kos:0,dmgTaken:0,time:0,sub:'',subT:0,go:0,paused:false,banner:null,lastHit:null,hpGhost:0,bossGhost:0,minX:0,maxX:9999,boss:null,pdCD:0};

function mkActor(type,x,y){const d=TYPES[type];const hp=Math.round(d.hp*(type==='juno'?1:DIFF().hp));
 return {type,d,team:type==='juno'?0:1,rig:RIGS[d.rig],x,y,z:0,vx:0,vy:0,vz:0,face:1,hp,maxhp:hp,state:'idle',t:0,at:Math.random()*100,flash:0,inv:0,pose:P0(),hitList:[],cd:rand(40,90),w:d.w,buf:null,juggle:0,aggro:false,ofs:rand(-10,25),yofs:rand(-22,22),guard:type==='shield',gbT:0,poise:48,stunT:0,phase:1,combo:0}}
const ST={};const stat=k=>{ST[k]=(ST[k]||0)+1};
const setState=(a,s)=>{a.state=s;a.t=0};
function startAtk(a,n){if(a.team===0)stat('atk_'+n);a.state='atk';a.t=0;a.atk=ATK[n];a.atkName=n;a.hitList=[];a.wore=false}
function addShake(v){G.shake=Math.min(1,G.shake+v*settings.shake)}
function addCombo(){G.combo++;G.comboT=120;G.comboPop=6;if(G.combo>G.maxCombo)G.maxCombo=G.combo;const r=rating(G.combo);if(r&&r[0]===G.combo)AU.sfx('combo')}
function endCombo(){if(G.combo>=5&&G.player){const b=G.combo*30;G.score+=b;addText(G.combo+' HITS +'+b,G.player.x,G.player.y,62,'#f9c80e')}G.combo=0}
function inReach(a,t,rch){rch*=1.15;const dx=(t.x-a.x)*a.face;return dx>-6&&dx<rch+t.w*.5&&Math.abs(t.y-a.y)<9&&Math.abs(t.z-a.z)<40}
function releaseGrab(a){if(a.grabbing){const e=a.grabbing;a.grabbing=null;e.grabbedBy=null;if(e.state==='grabbed')setState(e,'idle')}
 if(a.grabbedBy){const g=a.grabbedBy;a.grabbedBy=null;g.grabbing=null;if(g.state==='grab'||(g.state==='atk'&&g.atk.grab))setState(g,'idle')}}
function koCount(t){if(t.koCounted)return;t.koCounted=1;if(t.team!==1)return;G.kos++;G.score+=t.d.score;addText('+'+t.d.score,t.x,t.y,58,'#f9c80e');AU.sfx('ko');
 if(t.type!=='boss'&&Math.random()<.12)G.picks.push({kind:'food',x:t.x,y:t.y,life:900});
 if(t.type==='boss')bossDefeated(t)}

function damage(src,t,atk,dir){
 if(t.inv>0||t.state==='down'||t.state==='getup'||t.gone)return false;
 if(t.dead&&t.state!=='knock'&&t.state!=='thrown')return false;
 dir=dir||sign(t.x-src.x)||src.face;
 const isP=t.team===0;
 if(isP&&t.state==='dodge'&&t.t<17){if(t.t<=11&&G.pdCD<=0){G.pdCD=60;G.slow=26;stat('perfect');addText('PERFECT!',t.x,t.y,56,'#2de2e6');G.score+=250;AU.sfx('perfect')}return false}
 if(t.type==='shield'&&t.guard&&!atk.thrown&&t.face===-dir){
  if(atk.gb){stat('guardbreak');t.guard=false;t.gbT=180;setState(t,'stagger');t.vx=dir*2.5;G.hitstop=Math.max(G.hitstop,8);addShake(.4);addCombo();G.score+=200;
   addText('GUARD BREAK!',t.x,t.y,60,'#f9c80e');sparks(t.x,t.y,26,dir,16,['#9cc0ff','#ffffff','#f9c80e']);P('ring',t.x,t.y,26,{life:12,sz:5,col:'#9cc0ff'});AU.sfx('guardbreak');G.lastHit={e:t,t:180};return true}
  setState(t,'block');t.vx=dir*1.3;src.vx=-dir*1.8;G.hitstop=Math.max(G.hitstop,2);sparks(t.x-dir*8,t.y,26,-dir,6,['#9cc0ff','#ffffff']);addText('BLOCK',t.x,t.y,54,'#9cc0ff');AU.sfx('block');G.lastHit={e:t,t:180};return false}
 let dmg=atk.dmg;if(isP)dmg=Math.round(dmg*DIFF().dmg);
 t.hp-=dmg;t.flash=8;
 if(isP){stat('hitsTaken');G.dmgTaken+=dmg;if(G.combo)endCombo();G.comboT=0;AU.sfx('hurt');releaseGrab(t)}
 else{addCombo();G.score+=Math.round(dmg*10*(1+Math.min(G.combo,60)*.05));G.lastHit={e:t,t:180}}
 let knock=atk.knock,launch=atk.launch||0,stun=atk.stun||18;
 if(t.type==='boss'){if(t.armor){knock=0;stun=0}else{t.poise-=dmg;if(t.poise>0){knock=0;stun=0}else{t.poise=t.phase>=3?44:56;launch=Math.min(launch||2.5,3);if(!knock)stun=30;addText('STAGGER!',t.x,t.y,80,'#f9c80e')}}}
 if(t.hp<=0){t.hp=0;t.dead=true;knock=1;launch=Math.max(launch,3.5)}
 if(isP&&dmg>=13)knock=1;
 if(t.state==='grabbed'&&!atk.grab&&!t.dead){releaseGrab(t)}
 if(atk.grab&&!t.dead){/* stays grabbed */}
 else if(t.state==='knock'&&t.z>0){t.juggle++;t.vz=Math.max(t.vz,(launch||2.6)*Math.max(.35,1-t.juggle*.14));t.vx=dir*Math.max(1.2,(atk.kb||2)*.6)}
 else if(knock){releaseGrab(t);if(isP&&t.weapon)dropWeapon(t);setState(t,'knock');t.vz=launch||2.2;t.vx=dir*(atk.kb||2);t.z=Math.max(t.z,1);t.juggle=0;t.bounced=false}
 else if(stun){setState(t,'hurt');t.stunT=stun;t.vx=dir*(atk.kb||1)}
 if(t.type!=='boss'||!t.armor)t.face=-dir;
 G.hitstop=Math.max(G.hitstop,atk.hs||3);addShake(atk.shake||(.12+dmg*.008));
 hitFX(t,dir,(atk.hs||3)>=6);AU.sfx(atk.sfx||'hitL');if(atk.flash)G.flash=3;
 if(t.dead){if(t.team===1)koCount(t);else playerDown()}
 return true}

function resolveHits(a,k){
 const tg=a.team===0?G.actors.filter(e=>e.team===1):[G.player];
 for(const t of tg){if(a.hitList.includes(t))continue;if(k.grab&&t!==a.grabbing)continue;
  if(inReach(a,t,k.rch)){a.hitList.push(t);const hit=damage(a,t,k);if(hit&&k.wpn&&a.weapon&&!a.wore){a.wore=true;wear(a)}}}
 if(a.team===0&&!k.grab){
  for(const pr of G.props)if(pr.kind==='crate'&&!a.hitList.includes(pr)){const dx=(pr.x-a.x)*a.face;if(dx>-4&&dx<k.rch+6&&Math.abs(pr.y-a.y)<10){a.hitList.push(pr);pr.broken=true;breakCrate(pr.x,pr.y,6);G.hitstop=Math.max(G.hitstop,3)}}
  for(const pj of G.projs)if(pj.kind==='knife'&&!pj.dead){const dx=(pj.x-a.x)*a.face;if(dx>-4&&dx<k.rch+8&&Math.abs(pj.y-a.y)<10){pj.dead=true;sparks(pj.x,pj.y,pj.z,a.face,8,['#7ff9ff','#fff']);stat('parry');addText('PARRY!',pj.x,pj.y,50,'#7ff9ff');G.score+=100;AU.sfx('parry');G.hitstop=Math.max(G.hitstop,4)}}
  G.props=G.props.filter(p=>!p.broken)}}
function wear(a){a.weapon.dur--;if(a.weapon.dur<=0){sparks(a.x+a.face*20,a.y,30,a.face,12,['#f9c80e','#9a9ab0','#fff']);addText('SIGN BROKE!',a.x,a.y,60,'#f9c80e');AU.sfx('break');a.weapon=null}}
function breakCrate(x,y,z){for(let i=0;i<12;i++)P('splinter',x,y,z+rand(0,10),{vx:rand(-2.5,2.5),vy:rand(-.4,.4),vz:rand(1,4),g:.2,life:randi(25,40),col:pickR(['#9a6431','#c98a4a','#5e3b1a'])});puff(x,y,5,'#7a6a5a');AU.sfx('crate');
 const r=Math.random();if(r<.45)G.picks.push({kind:'food',x,y,life:900});else if(r<.8)G.picks.push({kind:'cash',x,y,life:900})}
function dropWeapon(p){if(!p.weapon)return;G.props.push({kind:p.weapon.kind,x:p.x+p.face*12,y:p.y,dur:p.weapon.dur});p.weapon=null}

// ===== PLAYER =====
const BUFA=['light','heavy','jump','dodge','grab','pick'];
function updPlayer(p){
 const m=I.move;if(p.buf&&--p.buf.t<=0)p.buf=null;
 const ctrl=G.sub==='fight'||G.sub==='clear'&&false;
 if(ctrl)for(const a of BUFA)if(I.p[a])p.buf={a,t:a==='jump'?5:9};
 const take=a=>{if(p.buf&&p.buf.a===a){p.buf=null;return true}return false};
 if(!ctrl){if(p.state==='idle'||p.state==='walk'){p.vx=p.autoVx||0;p.vy=0;p.state=p.vx?'walk':'idle';if(p.vx)p.face=sign(p.vx)}else if(p.state==='atk')runAtk(p);else if(p.state==='jump'){}else if(p.state==='dodge'){if(p.t>=22)setState(p,'idle')}else common(p);return}
 switch(p.state){
  case 'idle':case 'walk':{
   p.vx=m.x*1.8;p.vy=m.y*1.2;if(Math.abs(m.x)>.2)p.face=sign(m.x);
   p.state=(Math.abs(m.x)+Math.abs(m.y)>.12)?'walk':'idle';
   if(p.state==='walk'&&p.at%16===0)puff(p.x-p.face*4,p.y,1);
   if(take('dodge'))return startDodge(p,m);
   if(take('jump')){setState(p,'jump');p.vz=5.6;p.z=.1;p.vx=m.x*2;p.vy=m.y*1.1;p.jatk=null;p.hitList=[];AU.sfx('jump');puff(p.x,p.y,4);return}
   if(take('pick'))return tryPick(p);
   if(take('grab'))return tryGrab(p);
   if(take('light'))return p.weapon?weaponAtk(p,'light'):startAtk(p,'l1');
   if(take('heavy'))return p.weapon?weaponAtk(p,'heavy'):startAtk(p,'hv');
   break}
  case 'atk':runAtk(p,take);break;
  case 'jump':{
   p.vx+=(m.x*2-p.vx)*.06;p.vy+=(m.y*1.1-p.vy)*.06;if(Math.abs(m.x)>.3&&!p.jatk)p.face=sign(m.x);
   if(!p.jatk){
    if(p.weapon&&p.weapon.kind==='crate'&&(take('light')||take('heavy')))throwCrateProj(p);
    else if(take('light')){stat('jk');p.jatk='jk';p.hitList=[];AU.sfx('swing')}
    else if(take('heavy')){stat('dive');p.jatk='dive';p.hitList=[];p.vz=Math.min(p.vz,-1);p.vx=p.face*3.8;AU.sfx('swingH')}
   }else{resolveAir(p);if(G.t%3===0)ghost(p)}
   break}
  case 'land':p.vx*=.6;p.vy*=.6;if(p.t>=p.landT)setState(p,'idle');break;
  case 'dodge':p.vx*=.95;p.vy*=.95;if(p.t%3===0)ghost(p);
   if(p.t>=22){setState(p,'idle');p.pose.rot=0}else if(p.t>14){if(take('light')){p.pose.rot=0;return startAtk(p,'l1')}if(take('heavy')){p.pose.rot=0;return startAtk(p,'hv')}}break;
  case 'grab':updGrab(p,take,m);break;
  case 'throw':p.vx=0;p.vy=0;if(p.t>=20)setState(p,'idle');break;
  case 'wthrow':p.vx=0;p.vy=0;if(p.t===6)throwCrateProj(p);if(p.t>=16)setState(p,'idle');break;
  case 'pickup':p.vx=0;p.vy=0;if(p.t>=9)setState(p,'idle');break;
  case 'grabmiss':p.vx*=.5;p.vy*=.5;if(p.t>=12)setState(p,'idle');break;
  case 'victory':p.vx=0;p.vy=0;break;
  default:common(p);
 }}
function startDodge(p,m){releaseGrab(p);setState(p,'dodge');p.pose.rot=0;
 if(Math.abs(m.x)>.3){p.face=sign(m.x);p.vx=p.face*4.4;p.vy=m.y*1.5}else if(Math.abs(m.y)>.3){p.vx=0;p.vy=sign(m.y)*2.8}else{p.vx=p.face*4.4;p.vy=0}AU.sfx('dodge')}
function runAtk(a,take){
 const k=a.atk;
 if(k.grab&&a.grabbing){const e=a.grabbing;e.x=a.x+a.face*19;e.y=a.y;e.z=0}
 if(a.t<=k.a1){if(k.st)a.vx=a.face*k.st*(a.t<k.a0?.4:1);else a.vx*=.6}else a.vx*=.7;
 a.vy*=.5;
 if(a.t===k.a0){if(k.sw)AU.sfx(k.sw);if(k.proj)spawnKnife(a)}
 if(a.t>=k.a0&&a.t<=k.a1&&!k.proj)resolveHits(a,k);
 if(take&&a.t>=k.a1+2){
  if(k.next&&take('light'))return startAtk(a,k.next);
  if(k.fin&&take('heavy'))return startAtk(a,k.fin);
  if(!k.grab&&take('dodge'))return startDodge(a,I.move);
 }
 if(a.t>=k.dur){
  if(k.grab){a.knees=(a.knees||0)+1;if(!a.grabbing||a.grabbing.state!=='grabbed'){a.grabbing=null;setState(a,'idle');return}if(a.knees>=3)return doThrow(a,a.face);a.state='grab';a.t=0;return}
  if(a.team===1&&a.combo>0&&a.atkName==='gp'){a.combo=0;return startAtk(a,'gp2')}
  if(a.type==='boss'&&a.combo>0){a.combo--;return startAtk(a,a.combo===0?'bj3':'bj')}
  setState(a,'idle')}}
function resolveAir(p){const k=ATK[p.jatk];
 for(const e of G.actors){if(e.team!==1||p.hitList.includes(e))continue;const dx=(e.x-p.x)*p.face;
  if(dx>-6&&dx<k.rch+e.w*.5&&Math.abs(e.y-p.y)<10&&p.z<e.z+54&&p.z+12>e.z){p.hitList.push(e);damage(p,e,k)}}
 for(const pr of G.props)if(pr.kind==='crate'&&p.z<20&&Math.abs(pr.x-p.x-p.face*12)<14&&Math.abs(pr.y-p.y)<10){pr.broken=true;breakCrate(pr.x,pr.y,6)}
 G.props=G.props.filter(q=>!q.broken)}
function diveImpact(p){for(const e of G.actors){if(e.team!==1||p.hitList.includes(e))continue;if(Math.abs(e.x-p.x)<32&&Math.abs(e.y-p.y)<12&&e.z<10){p.hitList.push(e);damage(p,e,ATK.diveShock)}}
 P('ring',p.x,p.y,0,{life:10,sz:6,col:'#2de2e6'});puff(p.x,p.y,8);addShake(.25);AU.sfx('slam')}
function tryGrab(p){let best=null,bd=99;
 for(const e of G.actors){if(e.team!==1||e.dead||e.type==='boss'||e.z>1||['knock','down','getup','thrown','grabbed','enter'].includes(e.state))continue;
  const dx=(e.x-p.x)*p.face,dy=Math.abs(e.y-p.y);if(dx>-6&&dx<26&&dy<10&&dx+dy<bd){bd=dx+dy;best=e}}
 if(!best){setState(p,'grabmiss');AU.sfx('swing');return}
 stat('grab');setState(p,'grab');p.grabbing=best;p.gt=0;p.knees=0;best.grabbedBy=p;setState(best,'grabbed');best.face=-p.face;best.vx=best.vy=0;AU.sfx('grab')}
function updGrab(p,take,m){const e=p.grabbing;if(!e||e.state!=='grabbed'){p.grabbing=null;setState(p,'idle');return}
 p.vx=0;p.vy=0;p.gt++;e.x=p.x+p.face*19;e.y=p.y;e.z=0;e.face=-p.face;
 if(take('light'))return startAtk(p,'knee');
 if(take('heavy')||take('grab')||take('jump'))return doThrow(p,Math.abs(m.x)>.3?sign(m.x):p.face);
 if(p.gt>120){e.grabbedBy=null;setState(e,'idle');e.vx=p.face*2;p.grabbing=null;setState(p,'idle');p.vx=-p.face*1.5}}
function doThrow(p,dir){const e=p.grabbing;p.grabbing=null;if(!e){setState(p,'idle');return}e.grabbedBy=null;p.face=dir;setState(p,'throw');
 setState(e,'thrown');e.hitList=[];e.x=p.x+dir*8;e.z=16;e.vz=3.4;e.vx=dir*5;e.vy=0;e.face=-dir;e.bounced=false;e.juggle=0;
 stat('throw');AU.sfx('throw');G.score+=150;addCombo();addShake(.2)}
function tryPick(p){if(p.weapon){dropWeapon(p);AU.sfx('back');return}
 let best=null,bd=1e9;for(const pr of G.props){const dx=Math.abs(pr.x-p.x),dy=Math.abs(pr.y-p.y);if(dx<24&&dy<12&&dx+dy<bd){bd=dx+dy;best=pr}}
 if(!best)return;G.props.splice(G.props.indexOf(best),1);stat('pick_'+best.kind);p.weapon={kind:best.kind,dur:best.dur||8};setState(p,'pickup');AU.sfx('pickup')}
function weaponAtk(p,btn){if(p.weapon.kind==='crate'){setState(p,'wthrow');AU.sfx('swingH')}else startAtk(p,btn==='light'?'sw1':'sw2')}
function throwCrateProj(p){if(!p.weapon)return;G.projs.push({kind:'crate',x:p.x+p.face*8,y:p.y,z:p.z+36,vx:p.face*6.5,vz:.6,src:p,team:0,hit:[],life:120});p.weapon=null;AU.sfx('throw')}
function spawnKnife(a){G.projs.push({kind:'knife',x:a.x+a.face*10,y:a.y,z:32,vx:a.face*(settings.diff===2?5:4.3),src:a,team:1,life:170});AU.sfx('knife')}
function playerDown(){if(G.sub!=='fight')return;G.sub='dead';G.subT=0;G.slow=50;endCombo();AU.stopSong();AU.sfx('defeat')}

// ===== COMMON STATES & PHYSICS =====
function common(a){
 switch(a.state){
  case 'hurt':a.vx*=.8;a.vy*=.8;if(a.t>=a.stunT)setState(a,'idle');break;
  case 'thrown':thrownHits(a);break;
  case 'down':{a.vx*=.75;a.vy=0;const lim=a.team===0?(a.dead?999:34):(a.dead?55:(a.type==='boss'?36:48));if(a.t>=lim){if(a.dead){if(a.team===1)a.remove=true}else setState(a,'getup')}break}
  case 'getup':a.vx=0;a.vy=0;a.inv=Math.max(a.inv,2);if(a.t>=16){setState(a,'idle');a.inv=a.team===0?45:6}break;
  case 'block':a.vx*=.8;if(a.t>=12)setState(a,'idle');break;
  case 'stagger':a.vx*=.85;a.vy=0;if(a.t>=60)setState(a,'idle');break;
  case 'land':a.vx*=.6;if(a.t>=(a.landT||6))setState(a,'idle');break;
  case 'grabbed':if(!a.grabbedBy)setState(a,'idle');break;
  case 'idle':case 'walk':a.vx*=.7;a.vy*=.7;break;
 }}
function thrownHits(a){for(const e of G.actors){if(e.team!==1||e===a||e.dead||a.hitList.includes(e))continue;
 if(Math.abs(e.x-a.x)<16&&Math.abs(e.y-a.y)<10&&e.z<30){a.hitList.push(e);damage(G.player,e,ATK.body,sign(a.vx))}}}
function land(a,v){
 if(a.state==='jump'){if(a.jatk==='dive')diveImpact(a);setState(a,'land');a.landT=a.jatk?(a.jatk==='dive'?14:8):3;a.jatk=null;a.vx*=.3;a.vy*=.3;puff(a.x,a.y,4);AU.sfx('land');return}
 if(a.state==='knock'||a.state==='thrown'){
  if(a.state==='thrown'){a.hp-=12;addShake(.4);AU.sfx('slam');P('ring',a.x,a.y,0,{life:10,sz:5,col:'#ff7a1a'});G.hitstop=Math.max(G.hitstop,4);a.flash=6;
   if(a.hp<=0){a.hp=0;if(!a.dead){a.dead=true;koCount(a)}}if(a.type==='shield')a.gbT=200;setState(a,'knock')}
  if(v<-3.2&&!a.bounced){a.bounced=true;a.vz=-v*.38;a.z=.5;a.vx*=.6;puff(a.x,a.y,4);AU.sfx('land');return}
  a.bounced=false;setState(a,'down');a.vx*=.4;puff(a.x,a.y,6);AU.sfx('thud');addShake(.1);return}
 if(a.state==='slamair'){bossSlamLand(a);return}
 if(a.state==='hop'){setState(a,'idle');return}
 if(['idle','walk','hurt','atk'].includes(a.state))return;
 setState(a,'idle')}
function physics(a){
 if(a.state==='grabbed')return;
 a.x+=a.vx;a.y+=a.vy;
 if(a.z>0||a.vz>0){a.vz-=GRAV*(a.state==='knock'||a.state==='thrown'?.85:1);a.z+=a.vz;if(a.z<=0){a.z=0;const v=a.vz;a.vz=0;land(a,v)}}
 a.y=clamp(a.y,0,DEPTH);
 if(a.team===0)a.x=clamp(a.x,G.minX,G.maxX);
 else if(a.state!=='enter'){if(G.L.lock!==null)a.x=clamp(a.x,G.camX+6,G.camX+W-6);else a.x=clamp(a.x,-40,G.L.def.width+40)}}
function updateActor(a){
 a.t++;a.at++;if(a.flash>0)a.flash--;if(a.inv>0)a.inv--;
 if(a.team===0)updPlayer(a);else if(a.type==='boss')updBoss(a);else updEnemy(a);
 physics(a);
 const tp=targetPose(a),k=(a.state==='atk'&&a.t>=a.atk.a0)?.78:(a.state==='atk'||a.state==='dodge'||a.state==='throw')?.55:.33;
 for(const key of PKEYS){if(key==='rot'&&(a.state==='dodge'||a.state==='thrown'||(a.pose.rot>3&&tp.rot===0))){a.pose.rot=tp.rot;continue}a.pose[key]+=(tp[key]-a.pose[key])*k}}

// ===== ENEMIES =====
function moveTo(e,tx,ty,spd){const dx=tx-e.x,dy=ty-e.y;e.vx=Math.abs(dx)>3?sign(dx)*spd:0;e.vy=Math.abs(dy)>2?sign(dy)*spd*.65:0;e.state=(e.vx||e.vy)?'walk':'idle'}
function updEnemy(e){
 const p=G.player;
 if(e.type==='shield'){if(e.gbT>0)e.gbT--;e.guard=e.gbT<=0&&['idle','walk','bashw','block','enter'].includes(e.state)}
 switch(e.state){
  case 'enter':{const tx=clamp(e.x,G.camX+30,G.camX+W-30),dx=tx-e.x;e.vx=sign(dx)*Math.max(1.1,e.d.spd*1.3);e.face=sign(dx)||e.face;e.vy=0;if(Math.abs(dx)<2){e.vx=0;setState(e,'idle')}return}
  case 'idle':case 'walk':case 'taunt':break;
  case 'atk':return runAtk(e);
  case 'bashw':e.vx=0;e.vy*=.8;if(e.t>=24){setState(e,'bash');e.hitList=[];AU.sfx('swingH')}return;
  case 'bash':e.vx=e.face*3.6;e.vy=0;if(e.t%3===0)puff(e.x,e.y,1);if(!e.hitList.length&&inReach(e,p,20)){e.hitList.push(p);damage(e,p,ATK.bash)}if(e.t>=20)setState(e,'rec');return;
  case 'rec':e.vx*=.8;if(e.t>=38)setState(e,'idle');return;
  case 'hop':return;
  default:return common(e);
 }
 e.cd--;
 if(p.dead||G.sub!=='fight'){e.vx*=.7;e.vy*=.7;e.state=p.dead?'taunt':'idle';return}
 const dx=p.x-e.x,dy=p.y-e.y,adx=Math.abs(dx),pDown=p.state==='down'||p.state==='getup';
 const side=e.x<p.x?-1:1;e.face=sign(dx)||e.face;
 if(e.type==='grunt'){
  if(e.aggro&&!pDown){const tx=p.x+side*25;moveTo(e,tx,p.y,e.d.spd);e.face=sign(dx)||e.face;
   if(Math.abs(e.x-tx)<9&&Math.abs(dy)<5&&e.cd<=0){startAtk(e,'gp');e.combo=Math.random()<.6?1:0;e.cd=rand(45,85)*DIFF().cd}}
  else{moveTo(e,p.x+side*(72+e.ofs),clamp(p.y+e.yofs,2,DEPTH-2),e.d.spd*.55);e.face=sign(dx)||e.face}}
 else if(e.type==='shield'){
  if(e.aggro&&!pDown){moveTo(e,p.x+side*40,p.y,e.d.spd);e.face=sign(dx)||e.face;
   if(adx<95&&adx>18&&Math.abs(dy)<6&&e.cd<=0){setState(e,'bashw');e.vx=0;e.cd=rand(90,140)*DIFF().cd}}
  else{moveTo(e,p.x+side*(88+e.ofs),clamp(p.y+e.yofs,2,DEPTH-2),e.d.spd*.6);e.face=sign(dx)||e.face}}
 else if(e.type==='knife'){
  let tx=p.x+side*125;const lo=G.camX+14,hi=G.camX+W-14;
  if(tx<lo||tx>hi){const alt=p.x-side*125;if(alt>=lo&&alt<=hi&&adx>60)tx=alt;else tx=clamp(tx,lo,hi)}
  moveTo(e,tx,clamp(p.y+e.yofs*.15,0,DEPTH),e.d.spd*(adx<55?1.35:1));e.face=sign(dx)||e.face;
  if(adx<34&&Math.abs(dy)<6&&e.cd<=0&&!pDown){startAtk(e,'ks');e.cd=rand(50,80)*DIFF().cd}
  else if(adx>70&&Math.abs(dy)<6&&e.cd<=0&&!pDown){startAtk(e,'kt');e.vx=e.vy=0;e.cd=rand(85,140)*DIFF().cd}}}

// ===== BOSS: BARON VOLT =====
function updBoss(b){
 const p=G.player;const ph=b.hp>b.maxhp*.66?1:b.hp>b.maxhp*.33?2:3;
 if(ph>b.phase&&!b.dead&&!['knock','down','getup','enter'].includes(b.state)){b.phase=ph;setState(b,'roar');AU.sfx('roar');addShake(.8);
  G.banner={s:'PHASE '+ph,sub:ph===2?'THE BARON GETS SERIOUS':'OVERCHARGED!',t:0,col:ph===3?'#ff3b5c':'#f9c80e'};
  if(Math.abs(p.x-b.x)<70&&!p.dead&&p.state!=='down')damage(b,p,ATK.roar,sign(p.x-b.x)||1);summon(b)}
 b.armor=['roar','chargew','charge','slamw','slamair','storm'].includes(b.state);
 const spd=b.phase===3?1.25:1;
 if(b.phase>=2&&G.t%5===0&&!b.dead)P('zap',b.x+rand(-14,14),b.y,rand(10,50),{life:6,col:b.phase>=3?'#ff3b8a':'#b45cff'});
 switch(b.state){
  case 'enter':b.vx=-1;b.vy=0;b.face=-1;if(b.x<G.camX+W-90){b.vx=0;setState(b,'roar');AU.sfx('roar');addShake(.6)}return;
  case 'roar':b.vx=0;b.vy=0;b.inv=2;if(b.t%6===0)P('ring',b.x,b.y,30,{life:12,sz:8,col:'#b45cff'});if(b.t>=70){setState(b,'idle');b.cd=40}return;
  case 'atk':return runAtk(b);
  case 'chargew':b.vx=0;b.vy=clamp(p.y-b.y,-1.2,1.2);b.face=sign(p.x-b.x)||b.face;if(G.t%3===0)sparks(b.x,b.y,30,-b.face,2,['#b45cff','#fff']);if(b.t>=(b.phase===3?26:38)){setState(b,'charge');b.hitList=[];AU.sfx('charge')}return;
  case 'charge':b.vx=b.face*(b.phase===3?6:5.2);b.vy=0;if(G.t%2===0)ghost(b);
   if(!b.hitList.length&&inReach(b,p,26)){b.hitList.push(p);damage(b,p,ATK.charge)}
   if(b.t>=50||(b.face>0&&b.x>G.camX+W-26)||(b.face<0&&b.x<G.camX+26)){setState(b,'tired');addShake(.3);AU.sfx('thud');puff(b.x,b.y,8)}return;
  case 'tired':b.vx*=.8;if(b.t>=(b.phase===3?42:60))setState(b,'idle');return;
  case 'slamw':b.vx=0;b.vy=0;if(b.t>=18){setState(b,'slamair');b.vz=6.6;b.z=.1;b.vx=clamp((p.x-b.x)/38,-3.5,3.5);b.vy=clamp((p.y-b.y)/38,-1.5,1.5);AU.sfx('jump')}return;
  case 'slamair':return;
  case 'storm':b.vx=0;b.vy=0;if(b.t%4===0)P('zap',b.x+b.face*8,b.y,62,{life:6,col:'#fff'});
   if(b.t===24){const n=b.phase===3?6:4;for(let i=0;i<n;i++)G.projs.push({kind:'bolt',x:clamp(p.x+(i===0?0:rand(-80,80)),G.camX+10,G.camX+W-10),y:clamp(p.y+(i===0?0:rand(-26,26)),0,DEPTH),t:0,delay:44+i*13,team:1,src:b});AU.sfx('zapup')}
   if(b.t>=74)setState(b,'rec');return;
  case 'rec':b.vx*=.8;b.vy=0;if(b.t>=36)setState(b,'idle');return;
  case 'idle':case 'walk':case 'taunt':break;
  default:return common(b);
 }
 if(p.dead||G.sub!=='fight'){b.vx=0;b.vy=0;b.state=p.dead?'taunt':'idle';return}
 b.cd--;
 const dx=p.x-b.x,dy=p.y-b.y,adx=Math.abs(dx);b.face=sign(dx)||b.face;
 const pDown=p.state==='down'||p.state==='getup';
 if(b.phase>=2){b.sumT=(b.sumT||0)+1;if(b.sumT>760){b.sumT=0;summon(b)}}
 if(b.cd<=0&&!pDown){const r=Math.random();
  if(adx<50&&Math.abs(dy)<8){startAtk(b,'bj');b.combo=b.phase>=2?2:1;b.cd=rand(45,75)/spd;return}
  if(b.phase>=3&&r<.32){setState(b,'storm');b.cd=rand(80,110);return}
  if(b.phase>=2&&r<.62&&adx>40){setState(b,'slamw');b.cd=rand(70,100)/spd;return}
  if(adx>90&&r<.85){setState(b,'chargew');b.cd=rand(80,110)/spd;return}}
 moveTo(b,p.x-sign(dx)*42,p.y,b.d.spd*spd)}
function bossSlamLand(b){setState(b,'rec');addShake(.8);AU.sfx('slam');P('ring',b.x,b.y,0,{life:14,sz:10,col:'#b45cff'});puff(b.x,b.y,12);
 for(const d of [-1,1]){G.projs.push({kind:'shock',x:b.x+d*16,y:b.y,vx:d*3.5,team:1,src:b,life:140,t:0});if(b.phase>=3)G.projs.push({kind:'shock',x:b.x+d*16,y:b.y,vx:d*3.5,team:1,src:b,life:160,t:-28})}
 const p=G.player;if(Math.abs(p.x-b.x)<36&&Math.abs(p.y-b.y)<13&&p.z<10)damage(b,p,ATK.slam)}
function summon(b){const alive=G.actors.filter(a=>a.team===1&&a.type!=='boss'&&!a.dead).length;if(alive>=2)return;
 const types=b.phase>=3?['grunt','knife']:['grunt','grunt'];types.forEach((t,i)=>spawnEnemy(t,i?1:-1))}
function bossDefeated(b){G.sub='won';G.subT=0;G.slow=100;G.flash=10;addShake(1);AU.stopSong();AU.sfx('bossdie');
 for(const a of G.actors)if(a.team===1&&a!==b&&!a.dead){a.dead=true;a.hp=0;setState(a,'knock');a.vz=3;a.vx=sign(a.x-b.x)*3;koCount(a)}
 for(let i=0;i<30;i++)sparks(b.x,b.y,30,i%2?1:-1,1,['#b45cff','#fff','#f9c80e','#ff3df0']);G.projs.length=0}

// ===== PROJECTILES & PICKUPS =====
function updProjs(){const p=G.player;
 for(const pj of G.projs){pj.life=(pj.life||999)-1;if(pj.life<=0)pj.dead=true;
  if(pj.kind==='knife'){pj.x+=pj.vx;if(G.t%2===0)P('dot',pj.x-sign(pj.vx)*4,pj.y,pj.z,{life:6,col:'#2de2e6',sz:1});
   if(Math.abs(pj.y-p.y)<7&&Math.abs(pj.x-p.x)<8&&pj.z>=p.z-2&&pj.z<=p.z+48&&!p.dead){if(damage(pj.src,p,ATK.knife,sign(pj.vx)))pj.dead=true}
   if(pj.x<G.camX-30||pj.x>G.camX+W+30)pj.dead=true}
  else if(pj.kind==='crate'){pj.x+=pj.vx;pj.z+=pj.vz;pj.vz-=.11;let hit=false;
   for(const e of G.actors){if(e.team!==1||e.dead||e.state==='down')continue;if(Math.abs(e.x-pj.x)<14&&Math.abs(e.y-pj.y)<10&&pj.z<e.z+54){damage(G.player,e,ATK.crateHit,sign(pj.vx));hit=true;break}}
   if(hit||pj.z<=0||pj.x<G.camX-20||pj.x>G.camX+W+20){pj.dead=true;breakCrate(pj.x,pj.y,Math.max(0,pj.z))}}
  else if(pj.kind==='shock'){pj.t++;if(pj.t<0)continue;pj.x+=pj.vx;if(G.t%2===0)P('zap',pj.x,pj.y,rand(0,8),{life:5,col:pickR(['#b45cff','#fff','#ff3df0'])});
   if(!pj.hitP&&Math.abs(pj.x-p.x)<10&&Math.abs(pj.y-p.y)<16&&p.z<9){pj.hitP=true;damage(pj.src,p,ATK.shock,sign(pj.vx))}
   if(pj.x<G.camX-20||pj.x>G.camX+W+20)pj.dead=true}
  else if(pj.kind==='bolt'){pj.t++;if(pj.t===pj.delay){AU.sfx('bolt');addShake(.35);G.flash=Math.max(G.flash,2);puff(pj.x,pj.y,6,'#b45cff');for(let i=0;i<10;i++)P('zap',pj.x+rand(-8,8),pj.y,rand(0,6),{life:8,col:'#fff'});
    if(Math.abs(p.x-pj.x)<16&&Math.abs(p.y-pj.y)<11&&p.z<30)damage(pj.src,p,ATK.bolt,sign(p.x-pj.x)||1)}
   if(pj.t>pj.delay+10)pj.dead=true}}
 G.projs=G.projs.filter(q=>!q.dead);
 for(const k of G.picks){k.life--;if(Math.abs(k.x-p.x)<13&&Math.abs(k.y-p.y)<9&&p.z<12&&!p.dead&&G.sub==='fight'){k.got=true;
  if(k.kind==='food'){p.hp=Math.min(p.maxhp,p.hp+35);addText('+35 HP',p.x,p.y,56,'#7dff6a');AU.sfx('heal')}else{G.score+=500;addText('+500',p.x,p.y,56,'#7dff6a');AU.sfx('cash')}}}
 G.picks=G.picks.filter(k=>!k.got&&k.life>0)}

// ===== LEVEL FLOW =====
function spawnEnemy(type,side){const e=mkActor(type,side<0?G.camX-26:G.camX+W+26,rand(8,DEPTH-8));e.state='enter';e.face=-side;e.cd=rand(50,100);G.actors.push(e);return e}
function newGame(){G.score=0;G.kos=0;G.maxCombo=0;G.dmgTaken=0;G.time=0;G.player=mkActor('juno',20,40);go('play');startLevel(0);if(!store.get('nk_tut',0)){G.sub='tutorial';G.tutFirst=true}}
function startLevel(i){
 const def=LEVELS[i];G.level=i;G.L={def,wave:0,group:0,lock:def.boss?0:null,queue:[],qT:0};
 if(!BG[def.theme])BG[def.theme]=makeBG(def.theme,def.width);
 const p=G.player;Object.assign(p,{x:-14,y:40,z:0,vx:0,vy:0,vz:0,face:1,weapon:null,dead:false,inv:0,grabbing:null,grabbedBy:null,buf:null,jatk:null,autoVx:0});setState(p,'idle');p.pose=P0();
 G.actors=[p];G.props=def.props.map(([k,x,y])=>({kind:k,x,y,dur:8}));G.projs=[];G.picks=[];parts.length=0;
 G.camX=0;G.sub='intro';G.subT=0;G.stageTime=0;G.go=0;G.combo=0;G.comboT=0;G.lastHit=null;G.banner=null;G.hitstop=0;G.slow=0;G.flash=0;G.shake=0;G.paused=false;
 G.snap={score:G.score,kos:G.kos,maxCombo:G.maxCombo,dmg:G.dmgTaken,time:G.time};G.hpGhost=p.hp;
 RIM={street:'#ff4fa0',garage:'#bfefff',roof:'#c48cff'}[def.theme];G.boss=null;if(def.boss){const b=mkActor('boss',W+40,40);b.state='enter';b.face=-1;G.actors.push(b);G.boss=b;G.bossGhost=b.hp}
 AU.playSong(def.music)}
function retryStage(){const s=G.snap;G.score=s.score;G.kos=s.kos;G.maxCombo=s.maxCombo;G.dmgTaken=s.dmg;G.time=s.time;G.player.hp=G.player.maxhp;go('play');startLevel(G.level)}
function stageClear(){G.sub='clear';G.subT=0;const p=G.player;const tb=Math.max(0,Math.round(4000-G.stageTime/60*22));const hb=p.hp*15;G.clearBonus=[tb,hb];G.score+=tb+hb;AU.sfx('clear');setState(p,'victory');endCombo()}
function queueGroup(){const L=G.L,g=L.def.waves[L.wave].groups[L.group];let s=L.group%2?1:-1;for(const t of g){L.queue.push({t,s});s=-s}L.qT=10}
function updLevel(){
 const L=G.L,def=L.def,p=G.player;
 if(L.queue.length&&--L.qT<=0){const it=L.queue.shift();spawnEnemy(it.t,it.s);L.qT=24}
 if(!def.boss&&G.sub==='fight'){
  if(L.lock===null){
   if(L.wave<def.waves.length&&G.camX>=def.waves[L.wave].at-2){L.lock=def.waves[L.wave].at;L.group=0;queueGroup();G.banner={s:'HOSTILES!',sub:'WAVE '+(L.wave+1)+' / '+def.waves.length,t:0,col:'#ff2a6d'};AU.sfx('alarm');G.go=0}
   else if(L.wave>=def.waves.length&&p.x>=def.width-50)stageClear()}
  else{const alive=G.actors.filter(a=>a.team===1&&!a.dead).length,groups=def.waves[L.wave].groups;
   if(!L.queue.length){if(L.group<groups.length-1){if(alive<=1){L.group++;queueGroup()}}
    else if(alive===0){L.lock=null;L.wave++;G.go=240;AU.sfx('wave');G.banner={s:L.wave>=def.waves.length?'AREA CLEAR!':'WAVE CLEAR!',sub:'',t:0,col:'#2de2e6'}}}}}
 if(G.sub==='fight'&&G.t%15===0){const mel=G.actors.filter(a=>a.team===1&&!a.dead&&(a.type==='grunt'||a.type==='shield'));
  mel.sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x));mel.forEach((e,i)=>e.aggro=i<DIFF().slots||(e.state==='atk'))}
 // camera
 let tx=p.x-W*.42+p.face*18;
 if(L.lock!==null)tx=L.lock;else{const nw=def.waves[L.wave];if(nw)tx=Math.min(tx,nw.at)}
 tx=clamp(tx,0,def.width-W);G.camX+=(tx-G.camX)*(L.lock!==null?.12:.085);if(Math.abs(tx-G.camX)<.05)G.camX=tx;
 G.minX=G.camX+8;
 if(L.lock!==null)G.maxX=L.lock+W-10;else{const nw=def.waves[L.wave];G.maxX=nw?nw.at+W-10:def.width-10}
 if(G.sub==='intro')G.minX=-30}
function separate(){const A=G.actors;for(let i=0;i<A.length;i++){const a=A[i];if(a.dead||a.z>2||a.state==='grabbed'||a.state==='enter')continue;
 for(let j=i+1;j<A.length;j++){const b=A[j];if(b.dead||b.z>2||b.state==='grabbed'||b.state==='enter')continue;
  const dx=b.x-a.x,dy=b.y-a.y,mx=a.team===b.team?13:9;if(Math.abs(dx)<mx&&Math.abs(dy)<5){const push=(mx-Math.abs(dx))*.25*(sign(dx)||1);
   if(a.team===0){b.x+=push*2}else if(b.team===0){a.x-=push*2}else{a.x-=push;b.x+=push;a.y-=sign(dy||1)*.3;b.y+=sign(dy||1)*.3}}}}}
function updPlay(){
 const p=G.player;
 if((I.p.pause||(ptr.click&&ptr.x>W-22&&ptr.y<34&&ptr.y>20))&&['fight','intro','clear','bossintro','tutorial'].includes(G.sub)){openPause();return}
 if(G.sub==='tutorial'){if(sceneT>12&&(I.p.confirm||I.p.light||I.p.jump||ptr.click)){store.set('nk_tut',1);G.sub='intro';G.subT=0;AU.sfx('select')}return}
 if(G.shake>0)G.shake*=.88;if(G.flash>0)G.flash--;
 if(G.hitstop>0){G.hitstop--;return}
 if(G.slow>0){G.slow--;if(G.slow%2===1)return}
 G.subT++;if(G.sub==='fight'){G.time++;G.stageTime++}
 if(G.pdCD>0)G.pdCD--;
 if(G.sub==='intro'){p.autoVx=G.subT<46?1.5:0;if(G.subT>=80){if(G.L.def.boss){G.sub='bossintro';G.subT=0;G.banner={s:'BARON VOLT',sub:'KING OF STATIC',t:0,col:'#b45cff',big:1}}else{G.sub='fight';G.subT=0}}}
 if(G.sub==='bossintro'&&G.boss&&G.boss.state==='idle'&&G.subT>60){G.sub='fight';G.subT=0}
 for(const a of G.actors)updateActor(a);
 separate();updProjs();updParts();updLevel();
 G.actors=G.actors.filter(a=>!a.remove);
 if(G.comboT>0&&--G.comboT===0)endCombo();
 if(G.comboPop>0)G.comboPop--;if(G.go>0)G.go--;if(G.lastHit&&--G.lastHit.t<=0)G.lastHit=null;
 if(G.banner&&++G.banner.t>(G.banner.big?150:100))G.banner=null;
 G.hpGhost=p.hp<G.hpGhost?Math.max(p.hp,G.hpGhost-.5):p.hp;
 if(G.boss)G.bossGhost=G.boss.hp<G.bossGhost?Math.max(G.boss.hp,G.bossGhost-1.2):G.boss.hp;
 if(G.sub==='clear'&&G.subT>=230){p.hp=Math.min(p.maxhp,p.hp+50);startLevel(G.level+1)}
 if(G.sub==='dead'&&G.subT>=130)showResults(false);
 if(G.sub==='won'){if(G.subT===80){setState(p,'victory');AU.playSong('win')}if(G.subT>=260)showResults(true)}}
function calcRank(win){const s=G.score;let r=s>=78000?'S':s>=62000?'A':s>=46000?'B':s>=30000?'C':'D';if(!win&&(r==='S'||r==='A'||r==='B'))r='C';return r}
function showResults(win){const rank=calcRank(win);const list=store.get('nk_scores',[]);const best=list.length?list[0].s:0;
 const entry={s:G.score,r:rank,st:win?'CLEAR':'STAGE '+(G.level+1),d:new Date().toISOString().slice(0,10)};list.push(entry);list.sort((a,b)=>b.s-a.s);store.set('nk_scores',list.slice(0,8));
 G.result={win,score:G.score,maxCombo:G.maxCombo,kos:G.kos,time:G.time,rank,newBest:G.score>best&&G.score>0};go('results');if(!win)AU.playSong('title')}

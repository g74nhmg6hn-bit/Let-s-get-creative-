// ===== AUDIO (procedural, Web Audio) =====
const mtof=m=>440*Math.pow(2,(m-69)/12);
const CH={m:[0,3,7],M:[0,4,7],M7:[0,4,7,11],m7:[0,3,7,10],s:[0,5,7]};
const SONGS={
 title:{bpm:84,prog:[[41,'M7'],[43,'M'],[40,'m7'],[45,'m7']],k:'x.........x.....',s:'................',h:'....x.......x...',bass:'x.......x.....x.',arp:1,arpT:'triangle',pad:1,lead:[72,0,0,0,76,0,74,0, 74,0,0,0,71,0,67,0, 76,0,0,0,79,0,76,74, 72,0,0,0,0,0,0,0],leadT:'triangle'},
 street:{bpm:118,prog:[[45,'m'],[41,'M'],[48,'M'],[43,'M']],k:'x...x...x...x...',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',bass:'x.xx.x.xx.xx.x.x',arp:1,arpT:'square',pad:1,
  lead:[69,0,72,0,76,0,74,72, 72,0,69,0,65,0,67,69, 67,0,72,0,76,0,79,76, 74,0,0,71,74,0,79,0],leadT:'square'},
 garage:{bpm:126,prog:[[38,'m'],[46,'M'],[43,'m'],[45,'M']],k:'x..x..x.x..x..x.',s:'....x.......x..x',h:'..x...x...x...x.',bass:'xxxxxxxxxxxxxxxx',bassLp:500,arp:1,arpT:'sawtooth',arpLp:1400,pad:0,
  lead:[62,0,0,65,0,0,69,0, 70,0,0,69,0,0,65,0, 67,0,0,70,0,0,74,0, 73,0,69,0,64,0,61,0],leadT:'sawtooth'},
 boss:{bpm:144,prog:[[40,'m'],[41,'M'],[40,'m'],[38,'M']],k:'x.x.x.x.x.x.x.x.',s:'....x..x....x...',h:'xxxxxxxxxxxxxxxx',bass:'x.xxx.xxx.xxx.xx',bassT:'square',bassLp:900,arp:1,arpT:'square',pad:1,
  lead:[76,0,76,79,0,76,74,0, 77,0,77,81,0,77,76,0, 76,0,79,83,0,79,76,74, 74,0,78,81,0,78,74,0],leadT:'sawtooth'},
 win:{bpm:110,prog:[[48,'M'],[43,'M'],[45,'m'],[41,'M']],k:'x.......x.......',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',bass:'x...x...x...x.x.',arp:1,arpT:'square',pad:1,
  lead:[72,0,76,0,79,0,84,0, 83,0,79,0,74,0,79,0, 81,0,76,0,72,0,76,0, 77,0,81,0,84,0,0,0],leadT:'square'}
};
const AU={ctx:null,on:false,song:null,sd:null,step:0,nextT:0,timer:null,pending:null,
 init(){
  if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume();return}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  let c;try{c=this.ctx=new AC()}catch(e){return}
  this.master=c.createGain();this.master.gain.value=.9;
  const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;
  this.master.connect(comp);comp.connect(c.destination);
  this.mus=c.createGain();this.sfxG=c.createGain();this.mus.connect(this.master);this.sfxG.connect(this.master);
  const d=c.createDelay(1);d.delayTime.value=.27;const fb=c.createGain();fb.gain.value=.3;const lp=c.createBiquadFilter();lp.frequency.value=2400;
  this.fx=c.createGain();this.fx.gain.value=.3;this.fx.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(this.mus);
  const nb=c.createBuffer(1,c.sampleRate,c.sampleRate),dd=nb.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;this.nbuf=nb;
  this.on=true;this.applyVol();
  if(this.pending){const p=this.pending;this.pending=null;this.song=null;this.playSong(p)}
 },
 applyVol(){if(!this.ctx)return;this.mus.gain.value=settings.music*.55;this.sfxG.gain.value=settings.sfx*.9},
 tone(f,dur,o={}){
  const c=this.ctx;if(!c)return;const t=o.at!=null?o.at:c.currentTime+(o.t0||0);
  const os=c.createOscillator(),g=c.createGain();os.type=o.type||'square';os.frequency.setValueAtTime(f,t);
  if(o.f2)os.frequency.exponentialRampToValueAtTime(Math.max(20,o.f2),t+dur);
  if(o.det)os.detune.value=o.det;
  const v=o.vol==null?.2:o.vol,a=o.attack||.004;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0006,t+dur);
  let node=os;if(o.lp){const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.lp;fl.Q.value=o.q||1;os.connect(fl);node=fl}
  node.connect(g);g.connect(o.dest||this.sfxG);if(o.fx)g.connect(this.fx);
  os.start(t);os.stop(t+dur+.03);
 },
 noise(dur,o={}){
  const c=this.ctx;if(!c)return;const t=o.at!=null?o.at:c.currentTime+(o.t0||0);
  const s=c.createBufferSource();s.buffer=this.nbuf;s.loop=true;const fl=c.createBiquadFilter();fl.type=o.type||'bandpass';
  fl.frequency.setValueAtTime(o.f||2000,t);if(o.f2)fl.frequency.exponentialRampToValueAtTime(o.f2,t+dur);fl.Q.value=o.q||1;
  const g=c.createGain();const v=o.vol==null?.3:o.vol;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0006,t+dur);
  s.connect(fl);fl.connect(g);g.connect(o.dest||this.sfxG);s.start(t,Math.random()*.5);s.stop(t+dur+.03);
 },
 sfx(n){
  if(!this.ctx||!this.on)return;const T=(f,d,o)=>this.tone(f,d,o),N=(d,o)=>this.noise(d,o);
  switch(n){
   case 'hitL':N(.07,{vol:.55,f:1900,q:.8});T(170,.09,{type:'sine',vol:.55,f2:60});break;
   case 'hitH':N(.16,{vol:.7,f:1000,q:.6,f2:250});T(120,.22,{type:'sine',vol:.8,f2:38});T(240,.07,{type:'square',vol:.12,f2:70});break;
   case 'swing':N(.09,{vol:.16,f:1200,q:2,f2:3200});break;
   case 'swingH':N(.17,{vol:.24,f:500,q:2,f2:2600});break;
   case 'block':T(1500,.12,{type:'square',vol:.1,f2:900});T(2200,.14,{type:'triangle',vol:.12});N(.05,{vol:.3,f:5000});break;
   case 'guardbreak':T(320,.35,{type:'sawtooth',vol:.22,f2:55});N(.3,{vol:.5,f:3200,f2:300});T(1800,.2,{type:'square',vol:.07,f2:400});break;
   case 'parry':T(2400,.18,{type:'triangle',vol:.16,f2:3200});N(.05,{vol:.25,f:6000});break;
   case 'knife':N(.14,{vol:.18,f:3000,q:4,f2:7000});T(1700,.1,{type:'sine',vol:.07,f2:2800});break;
   case 'crate':for(let i=0;i<4;i++)N(.06,{vol:.35,f:700+i*300,q:1.5,t0:i*.025});T(95,.15,{type:'sine',vol:.5,f2:50});break;
   case 'break':T(900,.2,{type:'square',vol:.1,f2:200});N(.2,{vol:.35,f:4000,f2:800});break;
   case 'pickup':[660,990,1320].forEach((f,i)=>T(f,.1,{type:'square',vol:.07,t0:i*.045}));break;
   case 'heal':[523,659,784,1047].forEach((f,i)=>T(f,.14,{type:'triangle',vol:.14,t0:i*.06}));break;
   case 'cash':T(1568,.08,{type:'square',vol:.07});T(2093,.16,{type:'square',vol:.07,t0:.06});break;
   case 'jump':T(260,.11,{type:'square',vol:.06,f2:560});break;
   case 'land':N(.06,{vol:.22,f:380,type:'lowpass'});break;
   case 'thud':N(.12,{vol:.4,f:300,type:'lowpass'});T(70,.15,{type:'sine',vol:.45,f2:35});break;
   case 'dodge':N(.18,{vol:.2,f:700,f2:2600,q:1.4});break;
   case 'grab':N(.06,{vol:.28,f:600});T(190,.07,{type:'square',vol:.07});break;
   case 'throw':N(.22,{vol:.3,f:400,f2:1600});break;
   case 'slam':T(78,.4,{type:'sine',vol:.9,f2:28});N(.35,{vol:.6,f:420,type:'lowpass'});break;
   case 'hurt':T(230,.16,{type:'sawtooth',vol:.14,f2:100});N(.08,{vol:.35,f:1300});break;
   case 'ko':T(520,.45,{type:'square',vol:.1,f2:70});break;
   case 'alarm':[0,.18].forEach(t=>T(880,.12,{type:'square',vol:.08,t0:t,f2:660}));break;
   case 'wave':[523,659,784,1047].forEach((f,i)=>T(f,.16,{type:'square',vol:.08,t0:i*.07,fx:1}));break;
   case 'clear':[523,659,784,1047,784,1047,1319].forEach((f,i)=>T(f,.2,{type:'square',vol:.08,t0:i*.09,fx:1}));break;
   case 'perfect':T(1400,.25,{type:'sine',vol:.18,f2:2600});T(700,.25,{type:'triangle',vol:.1,f2:1300});break;
   case 'roar':T(96,1,{type:'sawtooth',vol:.32,f2:52,lp:900});T(101,1,{type:'square',vol:.14,f2:50,lp:700});N(.9,{vol:.35,f:500,type:'lowpass'});break;
   case 'charge':T(160,.55,{type:'sawtooth',vol:.12,f2:900,lp:2000});break;
   case 'zapup':T(300,.6,{type:'sawtooth',vol:.1,f2:1600,lp:3000});N(.5,{vol:.15,f:3000,f2:8000,type:'highpass'});break;
   case 'bolt':N(.45,{vol:.55,f:5000,f2:200,type:'highpass'});T(1300,.3,{type:'sawtooth',vol:.12,f2:80});T(60,.35,{type:'sine',vol:.6,f2:30});break;
   case 'shock':N(.25,{vol:.25,f:1800,q:3});break;
   case 'bossdie':T(110,1.6,{type:'sawtooth',vol:.3,f2:30,lp:1200});N(1.4,{vol:.5,f:800,f2:60,type:'lowpass'});for(let i=0;i<6;i++)N(.2,{vol:.4,f:600,type:'lowpass',t0:.15*i});break;
   case 'menu':T(660,.045,{type:'square',vol:.06});break;
   case 'select':T(880,.07,{type:'square',vol:.08});T(1320,.1,{type:'square',vol:.07,t0:.05});break;
   case 'back':T(500,.08,{type:'square',vol:.06,f2:330});break;
   case 'defeat':[392,349,311,262].forEach((f,i)=>T(f,.3,{type:'triangle',vol:.16,t0:i*.22}));break;
   case 'combo':T(1046,.08,{type:'square',vol:.06});T(1568,.12,{type:'square',vol:.06,t0:.06});break;
  }
 },
 kick(t){this.tone(150,.28,{at:t,type:'sine',vol:.55,f2:38,dest:this.mus})},
 snare(t){this.noise(.16,{at:t,vol:.32,f:1800,q:.7,dest:this.mus});this.tone(190,.09,{at:t,type:'triangle',vol:.18,f2:120,dest:this.mus});this.noise(.1,{at:t,vol:.08,f:3000,dest:this.fx})},
 hat(t,open){this.noise(open?.12:.035,{at:t,vol:.09,f:8000,type:'highpass',dest:this.mus})},
 playSong(n){
  if(!this.ctx){this.pending=n;return}
  if(this.song===n)return;this.song=n;this.sd=SONGS[n];this.step=0;this.nextT=this.ctx.currentTime+.12;
  if(!this.timer)this.timer=setInterval(()=>this.sched(),25);
 },
 stopSong(){this.song=null;this.sd=null;this.pending=null},
 sched(){
  const c=this.ctx;if(!c||!this.sd)return;
  if(this.nextT<c.currentTime-.5)this.nextT=c.currentTime+.05;
  const spb=60/this.sd.bpm/4;
  while(this.nextT<c.currentTime+.14){this.playStep(this.sd,this.step,this.nextT,spb);this.nextT+=spb;this.step++}
 },
 playStep(sd,step,t,spb){
  const s=step%16,bar=Math.floor(step/16),pr=sd.prog[bar%sd.prog.length],root=pr[0],iv=CH[pr[1]];
  if(sd.k[s]==='x')this.kick(t);if(sd.s[s]==='x')this.snare(t);if(sd.h[s]==='x')this.hat(t,s%8===6);
  if(sd.bass[s]==='x'){const oc=(s%4===2&&sd.bass==='x.xx.x.xx.xx.x.x')?12:0;this.tone(mtof(root+oc),spb*.95,{at:t,type:sd.bassT||'sawtooth',vol:.17,lp:sd.bassLp||700,q:4,dest:this.mus})}
  if(sd.arp){const n=root+24+iv[s%iv.length]+(Math.floor(s/4)%2?12:0);this.tone(mtof(n),spb*.8,{at:t,type:sd.arpT,vol:.035,lp:sd.arpLp||3500,dest:this.mus,fx:1})}
  if(sd.pad&&s===0)iv.forEach((i,k)=>this.tone(mtof(root+12+i+(k===0?12:0)),spb*16,{at:t,type:'sawtooth',vol:.022,attack:.4,lp:1000,det:k*7,dest:this.mus,fx:1}));
  if(sd.lead&&(bar%8)>=4&&s%2===0){const n=sd.lead[(bar%4)*8+s/2];if(n)this.tone(mtof(n),spb*1.9,{at:t,type:sd.leadT,vol:.055,lp:2600,dest:this.mus,fx:1})}
 }
};

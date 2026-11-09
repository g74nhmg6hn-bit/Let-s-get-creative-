'use strict';
// ===== CORE =====
const W=480,H=270,FLOOR=184,DEPTH=74,GRAV=0.34,TAU=Math.PI*2;
const cv=document.getElementById('game'),ctx=cv.getContext('2d');
ctx.imageSmoothingEnabled=false;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,sign=v=>v<0?-1:v>0?1:0;
const rand=(a,b)=>a+Math.random()*(b-a),randi=(a,b)=>Math.floor(rand(a,b+1)),pickR=a=>a[Math.floor(Math.random()*a.length)];
let _seed=1;const srand=s=>{_seed=(s>>>0)||1};
const rnd=()=>{_seed^=_seed<<13;_seed>>>=0;_seed^=_seed>>>17;_seed^=_seed<<5;_seed>>>=0;return _seed/4294967296};
const rr=(a,b)=>a+rnd()*(b-a),rri=(a,b)=>Math.floor(rr(a,b+1)),rpick=a=>a[Math.floor(rnd()*a.length)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const settings=Object.assign({music:.6,sfx:.8,shake:1,crt:true,diff:1},store.get('nk_settings',{}));
function saveSettings(){store.set('nk_settings',settings);document.body.classList.toggle('crt',!!settings.crt);if(typeof AU!=='undefined')AU.applyVol()}
const DIFFS=[{name:'EASY',dmg:.6,hp:.85,slots:1,cd:1.35},{name:'NORMAL',dmg:1,hp:1,slots:2,cd:1},{name:'HARD',dmg:1.45,hp:1.2,slots:3,cd:.72}];
const DIFF=()=>DIFFS[settings.diff];
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);const x=c.getContext('2d');x.imageSmoothingEnabled=false;return [c,x]}

// ===== INPUT =====
const ACT=['left','right','up','down','light','heavy','jump','dodge','grab','pick','pause','confirm','back'];
const KEYMAP={ArrowLeft:['left'],KeyA:['left'],ArrowRight:['right'],KeyD:['right'],ArrowUp:['up'],KeyW:['up'],ArrowDown:['down'],KeyS:['down'],
 KeyJ:['light'],KeyZ:['light'],KeyK:['heavy'],KeyX:['heavy'],Space:['jump','confirm'],KeyL:['dodge'],ShiftLeft:['dodge'],ShiftRight:['dodge'],KeyC:['dodge'],
 KeyG:['grab'],KeyF:['grab'],KeyE:['pick'],Escape:['pause','back'],KeyP:['pause'],Enter:['confirm'],NumpadEnter:['confirm'],Backspace:['back']};
const I={held:{},p:{},latch:{},keys:new Set(),mouse:{},touch:{},move:{x:0,y:0},dev:'kb',hold:{},stick:{x:0,y:0,on:false}};
const ptr={x:-1,y:-1,click:false,moved:false};
addEventListener('keydown',e=>{const m=KEYMAP[e.code];if(m){e.preventDefault();if(!e.repeat)m.forEach(a=>I.latch[a]=true)}I.keys.add(e.code);I.dev='kb';AU.init()});
addEventListener('keyup',e=>I.keys.delete(e.code));
addEventListener('blur',()=>{I.keys.clear();I.mouse={};I.touch={}});
function toV(e){const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const v=toV(e);ptr.x=v[0];ptr.y=v[1];ptr.moved=true}});
addEventListener('pointerdown',e=>{
 AU.init();
 if(e.target.closest&&e.target.closest('#touch .tb,#tpause,#tleft'))return;
 const v=toV(e);ptr.x=v[0];ptr.y=v[1];
 if(e.pointerType==='mouse'){
  I.dev='kb';const a={0:'light',2:'heavy',1:'dodge'}[e.button];
  if(e.button===1)e.preventDefault();
  if(a){I.mouse[e.button]=true;I.latch[a]=true}
  if(e.button===0)ptr.click=true;
 }else{ptr.click=true;I.dev='touch'}
});
addEventListener('pointerup',e=>{if(e.pointerType==='mouse')I.mouse[e.button]=false});
addEventListener('mousedown',e=>{if(e.button===1)e.preventDefault()});
addEventListener('contextmenu',e=>e.preventDefault());
// touch controls
document.querySelectorAll('#touch .tb').forEach(b=>{
 const a=b.dataset.a;
 b.addEventListener('pointerdown',e=>{e.preventDefault();AU.init();I.dev='touch';I.touch[a]=true;I.latch[a]=true;b.classList.add('on');try{b.setPointerCapture(e.pointerId)}catch(_){}});
 const up=()=>{I.touch[a]=false;b.classList.remove('on')};
 b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
});
document.getElementById('tpause').addEventListener('pointerdown',e=>{e.preventDefault();I.latch.pause=true});
(function(){const z=document.getElementById('tleft'),st=document.getElementById('stick'),kn=document.getElementById('knob');let id=null,ox=0,oy=0;
 z.addEventListener('pointerdown',e=>{e.preventDefault();AU.init();I.dev='touch';id=e.pointerId;ox=e.clientX;oy=e.clientY;st.style.display='block';document.getElementById('stickhint').style.display='none';st.style.left=ox+'px';st.style.top=oy+'px';I.stick.on=true;I.stick.x=I.stick.y=0;try{z.setPointerCapture(id)}catch(_){}});
 z.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;let dx=e.clientX-ox,dy=e.clientY-oy;const m=Math.hypot(dx,dy),mx=46;if(m>mx){dx=dx/m*mx;dy=dy/m*mx}kn.style.left=(35+dx)+'px';kn.style.top=(35+dy)+'px';const s=Math.min(1,m/mx);I.stick.x=m>6?dx/Math.max(m,1)*s:0;I.stick.y=m>6?dy/Math.max(m,1)*s:0});
 const end=e=>{if(e.pointerId!==id)return;id=null;st.style.display='none';document.getElementById('stickhint').style.display='flex';kn.style.left='35px';kn.style.top='35px';I.stick.on=false;I.stick.x=I.stick.y=0};
 z.addEventListener('pointerup',end);z.addEventListener('pointercancel',end);})();
I.poll=function(){
 const h={};for(const a of ACT)h[a]=false;
 for(const k of I.keys){const m=KEYMAP[k];if(m)for(const a of m)h[a]=true}
 if(I.mouse[0])h.light=true;if(I.mouse[2])h.heavy=true;if(I.mouse[1])h.dodge=true;
 for(const a in I.touch)if(I.touch[a])h[a]=true;
 let mx=0,my=0;
 let gp=null;try{const gps=navigator.getGamepads?navigator.getGamepads():[];for(const g of gps)if(g&&g.connected){gp=g;break}}catch(e){}
 if(gp){const b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed);const ax=gp.axes[0]||0,ay=gp.axes[1]||0;
  const ph={light:b(2),heavy:b(3),jump:b(0),dodge:b(1)||b(7)||b(6),grab:b(5),pick:b(4),pause:b(9),confirm:b(0)||b(9),back:b(1)||b(8),left:b(14)||ax<-.5,right:b(15)||ax>.5,up:b(12)||ay<-.5,down:b(13)||ay>.5};
  let any=false;for(const a in ph)if(ph[a]){h[a]=true;any=true}
  if(Math.hypot(ax,ay)>.25){mx=ax;my=ay;any=true}
  if(any)I.dev='pad';}
 if(!mx&&!my){
  if(I.stick.on&&(I.stick.x||I.stick.y)){mx=I.stick.x;my=I.stick.y;if(mx<-.5)h.left=true;if(mx>.5)h.right=true;if(my<-.5)h.up=true;if(my>.5)h.down=true}
  else{mx=(h.right?1:0)-(h.left?1:0);my=(h.down?1:0)-(h.up?1:0)}
 }
 const mm=Math.hypot(mx,my);if(mm>1){mx/=mm;my/=mm}
 I.move.x=mx;I.move.y=my;
 for(const a of ACT){I.p[a]=!!I.latch[a]||(h[a]&&!I.held[a]);I.hold[a]=h[a]?(I.hold[a]||0)+1:0}
 I.held=h;I.latch={};
};
I.nav=d=>I.p[d]||(I.hold[d]>18&&I.hold[d]%5===0);
const LBL={kb:{light:'J',heavy:'K',jump:'SPACE',dodge:'L',grab:'G',pick:'E',pause:'ESC',confirm:'ENTER',move:'WASD'},
 pad:{light:'X',heavy:'Y',jump:'A',dodge:'B',grab:'RB',pick:'LB',pause:'START',confirm:'A',move:'STICK'},
 touch:{light:'HIT',heavy:'HEAVY',jump:'JUMP',dodge:'ROLL',grab:'GRAB',pick:'PICK',pause:'II',confirm:'TAP',move:'STICK'}};
const lbl=a=>LBL[I.dev][a];

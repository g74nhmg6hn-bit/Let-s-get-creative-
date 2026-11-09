// ===== MAIN LOOP =====
function resize(){const s=Math.min(innerWidth/W,innerHeight/H);const el=document.getElementById('screen');el.style.width=Math.floor(W*s)+'px';el.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',resize);resize();saveSettings();
function tick(){I.poll();if(NK.bot)NK.bot();G.t++;sceneT++;
 if(scene==='results'&&sceneT<60){}else updScene();
 ptr.click=false;ptr.moved=false}
let last=performance.now(),acc=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.1,(now-last)/1000);last=now;if(NK.manual)return;acc+=dt;let n=0;while(acc>=1/60&&n<4){tick();acc-=1/60;n++}if(n>=4)acc=0;try{render()}catch(e){console.error(e);throw e}}
const NK={ST,G,I,ptr,bot:null,manual:false,step(n){for(let i=0;i<n;i++)tick()},render,get scene(){return scene},go,newGame,startLevel,AU};
window.NK=NK;
AU.playSong('title');
requestAnimationFrame(frame);

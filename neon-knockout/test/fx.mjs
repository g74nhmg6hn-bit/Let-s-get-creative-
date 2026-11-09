import { chromium } from 'playwright';
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const GAME = 'file://' + ROOT + 'dist/index.html';
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto(GAME); await p.waitForTimeout(300);
await p.evaluate(() => { NK.manual = true; localStorage.setItem('nk_tut','1'); NK.newGame(); NK.step(100); });
// scene A: hit spark moment with light combo
const snap = async (n) => { await p.evaluate(() => NK.render()); await p.screenshot({ path: ROOT + `test/shots/${n}.png` }); };
await p.evaluate(() => { const G=NK.G; const pl=G.player; pl.x=150; pl.y=40; const e=G.actors.length; 
  window.spawn=(t,x,y)=>{const a=NK.G.actors; const m={type:t}; return null};});
await p.evaluate(() => { const G=NK.G,pl=G.player; G.sub='fight';
  const mk=(t,x,y,f)=>{ const e=Object.assign(NK.G.actors[0].constructor===Object?{}:{},{}); return e};
});
// use internal functions via eval in page scope
await p.evaluate(() => { const G=NK.G,pl=G.player; pl.x=150;pl.y=40;pl.face=1;
  const g=mkActor('grunt',176,40); g.face=-1; G.actors.push(g); const s=mkActor('shield',110,44); s.face=1; G.actors.push(s);
  const k=mkActor('knife',330,30); k.face=-1; G.actors.push(k);
  startAtk(pl,'l1'); for(let i=0;i<60;i++){ tick(); if(G.hitstop>0) break; } });
await snap('60-fx-hit');
await p.evaluate(() => { const G=NK.G,pl=G.player; for(let i=0;i<10;i++)tick(); startAtk(pl,'fin'); for(let i=0;i<40;i++){ tick(); if(G.hitstop>3) break; } });
await snap('61-fx-uppercut');
await p.evaluate(() => { const G=NK.G,pl=G.player; for(let i=0;i<14;i++)tick(); pl.weapon={kind:'sign',dur:8}; setState(pl,'idle'); for(let i=0;i<10;i++)tick(); });
await snap('62-fx-sign');
await p.evaluate(() => { const G=NK.G,pl=G.player; pl.weapon={kind:'crate',dur:8}; setState(pl,'idle'); for(let i=0;i<8;i++)tick(); });
await snap('63-fx-crate');
await b.close();

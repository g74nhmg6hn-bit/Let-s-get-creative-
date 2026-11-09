import { chromium } from 'playwright';
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const GAME = 'file://' + ROOT + 'dist/index.html';
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined, args:['--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(GAME); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
const r = await p.evaluate(async () => {
  const out = {}; NK.manual = true; localStorage.setItem('nk_tut','1'); NK.newGame();
  for (const lv of [0,1,2]) { NK.startLevel(lv); NK.step(200); const G=NK.G;
    for(let i=0;i<4;i++){const e={...G.actors[0]};} 
    const t0 = performance.now(); for (let i = 0; i < 120; i++) { NK.step(1); NK.render(); } out['L'+lv] = ((performance.now() - t0) / 120).toFixed(2) + 'ms/frame'; }
  out.audio = { on: NK.AU.on, state: NK.AU.ctx && NK.AU.ctx.state, song: NK.AU.song };
  return out; });
await p.waitForTimeout(500);
console.log(JSON.stringify(r), errs);
await b.close();

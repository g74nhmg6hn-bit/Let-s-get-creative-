// Close-up lineup of every character in several poses, for checking the art.
import { chromium } from 'playwright';
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const p = await b.newPage({ viewport: { width: 1440, height: 810 } });
const errs = []; p.on('pageerror', e => errs.push(e.message + e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + ROOT + 'dist/index.html'); await p.waitForTimeout(300);
const states = (process.env.POSES || 'idle,atk:l1,atk:hv,walk,hurt,victory').split(',');
await p.evaluate(() => { NK.manual = true; localStorage.setItem('nk_tut', '1'); NK.newGame(); NK.step(100); NK.G.sub = 'fight'; });
for (const st of states) {
  await p.evaluate(st => {
    const G = NK.G; G.actors.length = 0; G.projs && (G.projs.length = 0);
    const types = ['juno', 'grunt', 'shield', 'knife', 'boss']; const xs = [70, 140, 210, 280, 380];
    const list = types.map((t, i) => { const a = t === 'juno' ? G.player : mkActor(t, xs[i], 40); a.x = xs[i] + G.camX; a.y = 40; a.z = 0; a.face = 1; a.dead = false; a.hp = a.maxhp; if (t === 'juno') { a.inv = 0; } G.actors.push(a); return a; });
    for (let n = 0; n < 40; n++) {
      for (const a of list) {
        const [s, k] = st.split(':');
        if (s === 'atk') { if (n % 20 === 0) { a.state = 'idle'; startAtk(a, a.type === 'juno' ? k : (a.type === 'boss' ? 'bj3' : 'gp')); } }
        else { if (a.state !== s) setState(a, s); a.t = Math.min(a.t, 8); }
        a.x = list.indexOf(a) * 0 + a.x; a.vx = 0; a.vy = 0; a.ai = null;
      }
      for (const a of list) { a.at++; const tp = targetPose(a); for (const k in tp) a.pose[k] += (tp[k] - a.pose[k]) * .35; a.t++; }
    }
    G.boss = null;
  }, st);
  await p.evaluate(() => NK.render());
  const c = await p.locator('#game').boundingBox(); const sc = c.width / 480;
  await p.screenshot({ path: ROOT + `test/shots/80-chars-${st.replace(':', '-')}.png`, clip: { x: c.x + 40 * sc, y: c.y + 110 * sc, width: 380 * sc, height: 120 * sc } });
}
console.log('ERRORS', errs.length, errs.slice(0, 3).join('\n'));
await b.close();

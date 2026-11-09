// Screenshots of each stage background (no actors), for checking the art.
import { chromium } from 'playwright';
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const p = await b.newPage({ viewport: { width: 1440, height: 810 } });
const errs = []; p.on('pageerror', e => errs.push(e.message + e.stack));
await p.goto('file://' + ROOT + 'dist/index.html'); await p.waitForTimeout(300);
for (const lv of [0, 1, 2]) for (const cx of lv === 2 ? [0] : [0, 600]) {
  await p.evaluate(([lv, cx]) => { NK.manual = true; localStorage.setItem('nk_tut', '1'); NK.newGame(); NK.startLevel(lv); NK.step(5); const G = NK.G; G.actors.length = 0; G.boss = null; G.sub = 'fight'; G.banner = null; G.camX = cx; G.picks && (G.picks.length = 0); NK.render(); }, [lv, cx]);
  await p.screenshot({ path: ROOT + `test/shots/90-stage${lv + 1}-${cx}.png` });
}
console.log('ERRORS', errs.length, errs.slice(0, 2).join('\n'));
await b.close();

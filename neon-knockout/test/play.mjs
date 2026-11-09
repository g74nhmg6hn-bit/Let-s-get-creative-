import { chromium } from 'playwright';
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const GAME = 'file://' + ROOT + 'dist/index.html';
import fs from 'fs';
const OUT = process.env.OUT || ROOT + 'test/shots';
fs.mkdirSync(OUT, { recursive: true });
const diff = +(process.env.DIFF || 1);
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message + '\n' + e.stack));
await page.addInitScript(d => { localStorage.clear(); localStorage.setItem('nk_settings', JSON.stringify({ music: .6, sfx: .8, shake: 1, crt: true, diff: d })); }, diff);
await page.goto(GAME);
await page.waitForTimeout(500);
const shot = async n => { await page.evaluate(() => NK.render()); await page.screenshot({ path: `${OUT}/${n}.png` }); };
await page.evaluate(() => { NK.manual = true; });
await shot('01-title-press');
// install bot
await page.evaluate(() => {
  const B = window.BOT = { log: [], press: null, deaths: 0, stageStart: 0, plan: 0, t: 0, stats: [] };
  const I = NK.I, G = NK.G;
  NK.bot = () => {
    B.t++;
    const P = a => { I.p[a] = true; };
    const sc = NK.scene;
    if (B.press) { P(B.press); B.press = null; return; }
    if (sc !== 'play' || G.paused) return;
    if (G.sub === 'tutorial') { if (B.t % 30 === 0) P('confirm'); return; }
    if (G.sub !== 'fight') return;
    const p = G.player; if (p.dead) return;
    I.move.x = 0; I.move.y = 0;
    const foes = G.actors.filter(a => a.team === 1 && !a.dead && a.state !== 'enter');
    // threats
    for (const pj of G.projs) {
      if (pj.kind === 'knife' && Math.abs(pj.y - p.y) < 8 && sign(pj.vx) === sign(p.x - pj.x) && Math.abs(pj.x - p.x) < 40) { if (Math.random() < .5) P('jump'); else { I.move.y = p.y > 37 ? -1 : 1; P('dodge'); } return; }
      if (pj.kind === 'shock' && pj.t >= 0 && Math.abs(pj.y - p.y) < 16 && Math.abs(pj.x - p.x) < 34 && sign(pj.vx) === sign(p.x - pj.x)) { P('jump'); return; }
      if (pj.kind === 'bolt' && pj.t < pj.delay && pj.delay - pj.t < 30 && Math.abs(p.x - pj.x) < 20 && Math.abs(p.y - pj.y) < 13) { I.move.y = p.y > 37 ? -1 : 1; I.move.x = p.x > pj.x ? 1 : -1; if (pj.delay - pj.t < 12) P('dodge'); return; }
    }
    for (const e of foes) {
      const dx = Math.abs(e.x - p.x), dy = Math.abs(e.y - p.y);
      const wind = (e.state === 'atk' && e.atk && !e.atk.proj && e.t < e.atk.a0 && e.t > e.atk.a0 - 8) || (e.state === 'bashw' && e.t > 14) || (e.state === 'chargew' && e.t > 18) || e.state === 'charge' && dx < 90;
      if (wind && dx < (e.type === 'boss' ? 110 : 50) && dy < 14 && Math.random() < .55) { I.move.y = p.y > 37 ? -1 : 1; I.move.x = 0; P('dodge'); return; }
    }
    if (!['idle', 'walk', 'atk'].includes(p.state)) return;
    if (!foes.length) {
      // pick up props sometimes
      const pr = G.props.find(q => Math.abs(q.x - p.x) < 140 && q.kind === 'sign');
      if (pr && !p.weapon && B.t % 3 === 0 && G.L.lock === null && Math.random() < .5) { I.move.x = sign(pr.x - p.x); I.move.y = sign(pr.y - p.y); if (Math.abs(pr.x - p.x) < 18 && Math.abs(pr.y - p.y) < 10) P('pick'); return; }
      I.move.x = 1; I.move.y = sign(40 - p.y) * .4; return;
    }
    let tgt = foes.reduce((a, b) => (Math.abs(a.x - p.x) + Math.abs(a.y - p.y) * 2 < Math.abs(b.x - p.x) + Math.abs(b.y - p.y) * 2 ? a : b));
    if (tgt.state === 'down' || tgt.state === 'getup') { const o = foes.filter(f => f !== tgt && f.state !== 'down'); if (o.length) tgt = o[0]; }
    const side = p.x < tgt.x ? -1 : 1;
    const want = tgt.type === 'boss' ? 30 : 24;
    const tx = tgt.x + side * want, ty = tgt.y;
    const dx = tx - p.x, dy = ty - p.y;
    if (p.state === 'atk') { // continue combos
      if (p.atkName === 'l1' || p.atkName === 'l2') { if (B.plan === 1 && p.atkName === 'l2') P('heavy'); else P('light'); }
      return;
    }
    if (Math.abs(dx) > 6) I.move.x = sign(dx);
    if (Math.abs(dy) > 3) I.move.y = sign(dy) * .8;
    if (Math.abs(p.x - tgt.x) < 36 && Math.abs(dy) < 6) {
      I.move.x = 0; p.face = sign(tgt.x - p.x) || p.face;
      if (p.weapon) { P(Math.random() < .5 ? 'light' : 'heavy'); return; }
      if (tgt.type === 'shield' && tgt.guard && tgt.face === -sign(tgt.x - p.x)) { if (Math.random() < .5) P('heavy'); else P('grab'); return; }
      const r = Math.random();
      if (r < .1 && tgt.type !== 'boss') { P('grab'); return; }
      if (r < .18) { P('jump'); setTimeout(() => {}, 0); B.jk = 6; return; }
      B.plan = Math.random() < .5 ? 1 : 0; P('light');
    }
    if (p.state === 'grab') { P(Math.random() < .5 ? 'light' : 'heavy'); }
  };
  const origBot = NK.bot;
  NK.bot = () => { const p = G.player; if (G.sub === 'fight' && p && p.state === 'grab') { if (B.t % 8 === 0) I.p[Math.random() < .6 ? 'light' : 'heavy'] = true; return; }
    if (G.sub === 'fight' && p && p.state === 'jump' && !p.jatk && p.vz < 1) { I.p[Math.random() < .5 ? 'light' : 'heavy'] = true; return; }
    origBot(); };
  window.sign = v => v < 0 ? -1 : v > 0 ? 1 : 0;
});
const ev = (f, a) => page.evaluate(f, a);
await ev(() => { BOT.press = 'confirm'; NK.step(3); });
await shot('02-title-menu');
await ev(() => { BOT.press = 'confirm'; NK.step(1); NK.bot0=NK.bot; NK.bot=null; NK.step(20); });
await shot('03-tutorial');
await ev(() => { NK.bot=NK.bot0; NK.step(30); });
let lastSub = '', shots = new Set(), stage = -1, frames = 0, info = [];
const t0 = Date.now();
while (frames < 60 * 60 * 25) {
  const s = await ev(() => { NK.step(30); const G = NK.G; return { scene: NK.scene, sub: G.sub, level: G.level, hp: G.player && G.player.hp, score: G.score, combo: G.combo, max: G.maxCombo, kos: G.kos, foes: G.actors.filter(a => a.team === 1 && !a.dead).length, wave: G.L && G.L.wave, boss: G.boss && G.boss.hp, phase: G.boss && G.boss.phase, st: G.stageTime }; });
  frames += 30;
  const key = s.scene + s.sub + s.level;
  if (s.scene === 'play' && s.sub === 'fight' && s.foes >= 2 && !shots.has('fight' + s.level) && s.combo >= 3) { shots.add('fight' + s.level); await shot(`1${s.level}-stage${s.level + 1}-combat`); }
  if (s.boss != null && s.phase >= 2 && !shots.has('p' + s.phase)) { shots.add('p' + s.phase); await shot(`2${s.phase}-boss-phase${s.phase}`); }
  if (key !== lastSub) {
    info.push(`${(frames / 60).toFixed(0)}s ${s.scene}/${s.sub} L${s.level} hp=${s.hp} score=${s.score} kos=${s.kos} max=${s.max} stageT=${(s.st / 60).toFixed(0)}`);
    if (s.sub === 'intro' && !shots.has('intro' + s.level)) { await ev(() => NK.step(30)); shots.add('intro' + s.level); await shot(`1${s.level}-stage${s.level + 1}-intro`); }
    if (s.sub === 'bossintro') { await ev(() => NK.step(80)); await shot('20-boss-intro'); }
    if (s.sub === 'clear') { await ev(() => NK.step(150)); await shot(`1${s.level}-stage${s.level + 1}-clear`); }
    if (s.sub === 'won') { await ev(() => NK.step(120)); await shot('29-boss-defeated'); }
    lastSub = key;
  }
  if (s.scene === 'results') {
    await ev(() => NK.step(120)); await shot(s.sub === 'won' ? '30-results-victory' : '30-results-defeat');
    const r = await ev(() => NK.G.result);
    info.push('RESULT ' + JSON.stringify(r));
    if (r.win) break;
    // retry
    await ev(() => { BOT.deaths++; BOT.press = 'confirm'; NK.step(2); });
    info.push('RETRY');
  }
}
info.push('real secs ' + ((Date.now() - t0) / 1000).toFixed(1) + ' deaths ' + await ev(() => BOT.deaths));
info.push('STATS '+JSON.stringify(await ev(()=>NK.ST)));
console.log(info.join('\n'));
console.log('ERRORS', errors.length, errors.slice(0, 5).join('\n'));
await browser.close();

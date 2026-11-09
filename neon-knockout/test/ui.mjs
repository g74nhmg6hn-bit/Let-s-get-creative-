import { chromium } from 'playwright';
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const GAME = 'file://' + ROOT + 'dist/index.html';
const OUT = ROOT + 'test/shots';
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const errors = [];
async function mk(opts) { const ctx = await browser.newContext(opts); const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) }); await page.goto(GAME); await page.waitForTimeout(400); return page; }
// ---- desktop keyboard + mouse
let page = await mk({ viewport: { width: 1280, height: 720 } });
const key = async (k, wait = 120) => { await page.keyboard.press(k); await page.waitForTimeout(wait); };
await key('Enter'); await key('ArrowDown'); await key('ArrowDown'); await key('Enter'); // settings
await key('ArrowLeft'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowDown'); await key('ArrowRight'); // diff hard
await page.screenshot({ path: `${OUT}/40-settings.png` });
const s1 = await page.evaluate(() => JSON.parse(localStorage.getItem('nk_settings')));
await key('Escape'); await key('ArrowDown'); await key('Enter'); await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/41-scores.png` });
await key('Escape'); await key('ArrowDown'); await key('Enter'); await page.screenshot({ path: `${OUT}/42-credits.png` });
await key('Escape'); await key('ArrowUp'); await key('ArrowUp'); await key('ArrowUp'); await key('Enter'); await page.screenshot({ path: `${OUT}/43-howto.png` });
await key('Escape');
const sc1 = await page.evaluate(() => NK.scene);
// mouse click START GAME
const box = await page.locator('#game').boundingBox();
const clickV = async (vx, vy, button = 'left') => { await page.mouse.click(box.x + vx / 480 * box.width, box.y + vy / 270 * box.height, { button }); await page.waitForTimeout(150); };
await page.mouse.move(box.x + 240 / 480 * box.width, box.y + 134 / 270 * box.height); await page.waitForTimeout(100);
await clickV(240, 135);
const sc2 = await page.evaluate(() => [NK.scene, NK.G.sub]);
await page.screenshot({ path: `${OUT}/44-first-tutorial.png` });
await key('Enter', 2200);
// play with keyboard: walk right, attack
await page.keyboard.down('KeyD'); await page.waitForTimeout(1500); await page.keyboard.up('KeyD');
for (let i = 0; i < 6; i++) { await key('KeyJ', 90); }
await clickV(200, 150, 'right'); await page.waitForTimeout(300);
const st = await page.evaluate(() => ({ sub: NK.G.sub, x: NK.G.player.x, atk: NK.ST }));
await key('Escape'); await page.screenshot({ path: `${OUT}/45-pause.png` });
const paused = await page.evaluate(() => NK.G.paused);
await key('Escape'); const resumed = await page.evaluate(() => !NK.G.paused);
// pause icon click
await clickV(472, 29); const paused2 = await page.evaluate(() => NK.G.paused);
await key('Escape');
console.log('desktop', JSON.stringify({ s1, sc1, sc2, st, paused, resumed, paused2 }));
// ---- gamepad (mocked)
page = await mk({ viewport: { width: 1280, height: 720 } });
await page.evaluate(() => { window.__pad = { connected: true, buttons: Array.from({ length: 17 }, () => ({ pressed: false })), axes: [0, 0, 0, 0] }; navigator.getGamepads = () => [window.__pad]; localStorage.setItem('nk_tut', '1'); });
const btn = async (i, ms = 100) => { await page.evaluate(i => window.__pad.buttons[i].pressed = true, i); await page.waitForTimeout(ms); await page.evaluate(i => window.__pad.buttons[i].pressed = false, i); await page.waitForTimeout(80); };
await btn(0); await btn(0); await page.waitForTimeout(2500);
await page.evaluate(() => window.__pad.axes[0] = 1); await page.waitForTimeout(1200); await page.evaluate(() => window.__pad.axes[0] = 0);
await btn(2); await btn(2); await btn(3); await btn(0, 300);
const gp = await page.evaluate(() => ({ dev: NK.I.dev, scene: NK.scene, sub: NK.G.sub, x: Math.round(NK.G.player.x), ST: NK.ST }));
await btn(9); const gpPause = await page.evaluate(() => NK.G.paused);
console.log('gamepad', JSON.stringify({ gp, gpPause }));
// ---- phone landscape touch
page = await mk({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
await page.screenshot({ path: `${OUT}/50-phone-title.png` });
await page.touchscreen.tap(422, 300); await page.waitForTimeout(200);
await page.evaluate(() => localStorage.setItem('nk_tut', '1'));
const b2 = await page.locator('#game').boundingBox();
await page.touchscreen.tap(b2.x + 240 / 480 * b2.width, b2.y + 135 / 270 * b2.height); await page.waitForTimeout(2500);
const touchOn = await page.evaluate(() => [document.body.className, NK.scene, NK.G.sub, NK.I.dev]);
// press HIT via pointer events on the touch button
const hit = page.locator('.tb[data-a="light"]'); const hb = await hit.boundingBox();
for (let i = 0; i < 3; i++) { await page.touchscreen.tap(hb.x + hb.width / 2, hb.y + hb.height / 2); await page.waitForTimeout(120); }
const tst = await page.evaluate(() => NK.ST);
// stick drag via CDP touch
const cdp = await page.context().newCDPSession(page);
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 120, y: 300, id: 1 }] });
for (let i = 1; i <= 5; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 120 + i * 10, y: 300, id: 1 }] }); await page.waitForTimeout(30); }
await page.waitForTimeout(800);
const px1 = await page.evaluate(() => NK.G.player.x);
await page.screenshot({ path: `${OUT}/51-phone-play.png` });
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
console.log('touch', JSON.stringify({ touchOn, tst, px1 }));
console.log('ERRORS', errors);
await browser.close();

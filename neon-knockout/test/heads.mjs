// Renders every pixel head (and its expressions) at 10x, for checking the art.
import { chromium } from 'playwright';
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + ROOT + 'dist/index.html'); await p.waitForTimeout(200);
const url = await p.evaluate(() => {
  const Z = 10, c = document.createElement('canvas'); c.width = 1400; c.height = 900; const g = c.getContext('2d'); g.fillStyle = '#4a4646'; g.fillRect(0, 0, 1400, 900);
  let y = 10;
  for (const k in HEADS) { const H = HEADS[k]; let x = 10; let hh = 0;
    for (const rows of [H.rows, ...Object.values(H.exr)]) {
      rows.forEach((row, j) => [...row].forEach((ch, i) => { const code = H.P[ch]; if (code === undefined) return; const u = RAMPS[code >> 3].c[code & 7];
        g.fillStyle = `rgb(${u & 255},${(u >> 8) & 255},${(u >> 16) & 255})`; g.fillRect(x + i * Z, y + j * Z, Z, Z); }));
      x += (rows[0].length + 2) * Z; hh = Math.max(hh, rows.length); }
    y += (hh + 1) * Z; if (y > 820) break; }
  return c.toDataURL(); });
const fs = await import('fs'); fs.writeFileSync(ROOT + 'test/shots/85-heads.png', Buffer.from(url.split(',')[1], 'base64'));
console.log('ERRORS', errs.length, errs.join('\n'));
await b.close();

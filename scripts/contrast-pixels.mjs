import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';

/**
 * Contrast audit, measured off RENDERED PIXELS.
 *
 *   npm run dev
 *   npm run check:contrast-pixels
 *
 * WHY THIS EXISTS ALONGSIDE contrast.mjs. That one reads computed CSS and
 * walks up for the field a text run sits on. It is exact for a flat colour
 * or a gradient and BLIND to a picture: every band now carries a slice of
 * a painted mural, and what CSS reports for those bands is the fallback
 * colour underneath, which is a field no reader ever sees. Scoring a
 * sunflower field against the ochre behind it is scoring it against
 * something that is not there.
 *
 * It is also the gate that has caught real work rather than confirming it.
 * The mural took this from 11 failing runs to 0, and the two it held out
 * on were genuine: two cream buttons at oklch 0.94 on a night sky built
 * for `--on-color`'s 0.97. That slice is scored against the button now.
 *
 * So: screenshot the page twice, once normally and once with every glyph
 * made transparent. Diffing them gives a mask of THE PIXELS THE GLYPHS
 * COVER, and the second shot gives the ground under each of those. The
 * worst ratio among them is what a reader actually has to cope with.
 *
 * SAMPLING THE WHOLE BOX INSTEAD OF THE GLYPHS DOES NOT WORK, and the
 * first cut of this proved it with about forty findings, every one of them
 * false. A calendar numeral is `position:absolute; inset:0`, so its box is
 * the entire cell: the darkest pixel in it is a corner of the photograph,
 * nowhere near the digit sitting on its scrim in the middle. Same for a
 * legend whose box contains its own red dot. A gate that reports the
 * darkest pixel NEAR some text is measuring something nobody reads.
 *
 * The two gates are complementary, not redundant. This one cannot see a
 * text run that is clipped or overdrawn and it costs two full-page
 * screenshots per route; the CSS one is cheap and exhaustive. Run both.
 */
const PAGES = (process.env.PAGES || '/,/beta,/waitlist,/support,/install,/privacy,/terms').split(',');
const BASE = process.env.BASE || 'http://localhost:3000';

const srgb = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [x, y] = [a, b].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const b = await puppeteer.launch({
  executablePath:
    process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
});

const fails = [];
let checked = 0;
for (const scheme of ['light', 'dark']) {
  for (const path of PAGES) {
    const page = await b.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(() =>
      document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')),
    );
    // a lazy image in a section nobody scrolled to never loads, and an
    // unloaded scene screenshots as no scene at all, which would pass
    // this gate by measuring a band that does not ship
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach((i) => {
        i.loading = 'eager';
        const s = i.src;
        i.src = '';
        i.src = s;
      });
    });
    await page.waitForFunction(() => [...document.images].every((i) => i.complete), {
      timeout: 30000,
    });
    // The band scenes are CSS backgrounds, not <img>, so the loop above
    // cannot reach them and there is nothing to poll for `complete` on.
    // Walking the whole page forces every band to paint; a scene that had
    // not decoded yet would screenshot as its flat fallback colour, and
    // this gate would then pass a band that does not ship.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30)));
      }
      window.scrollTo(0, 0);
    });
    // A FIXED FULL-PAGE OVERLAY IS THIS GATE'S BLIND SPOT, so it refuses to
    // score a page carrying one rather than reporting a pass it cannot back
    // up. `fullPage` composites a tall image out of a scrolling viewport and
    // `position: fixed` renders ONCE, at the top, so every band below the
    // fold gets measured without a layer that a reader sees over all of
    // them. The site carried exactly that for months (two grain passes and a
    // vignette at z-index 9996-9998) and this gate reported pass throughout,
    // truthfully, about a page that does not exist.
    const overlays = await page.evaluate(() => {
      const out = [];
      for (const el of [document.documentElement, document.body, ...document.querySelectorAll('body *')])
        for (const pe of [null, '::before', '::after']) {
          const cs = getComputedStyle(el, pe);
          if (cs.position !== 'fixed') continue;
          if (pe && (cs.content === 'none' || cs.content === 'normal')) continue;
          const paints = cs.backgroundImage !== 'none' || cs.backgroundColor !== 'rgba(0, 0, 0, 0)';
          if (!paints) continue;
          const r = el.getBoundingClientRect();
          const covers = pe ? true : r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.6;
          if (!covers) continue;
          out.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : '') + (pe || ''));
        }
      return [...new Set(out)];
    });
    if (overlays.length) {
      console.log(`PIXEL CONTRAST: cannot score ${path} [${scheme}].`);
      console.log(`  A fixed full-page layer is present and a full-page screenshot`);
      console.log(`  reproduces it only at the top: ${overlays.join(', ')}`);
      console.log(`  Give it to the surfaces it textures, or teach this gate to scroll.`);
      process.exit(2);
    }

    // FREEZE EVERYTHING FIRST. The whole method is a diff of two captures,
    // so anything that moves between them reads as a glyph, and the
    // stickers drift on an infinite loop. A cream popcorn box that shifted
    // three pixels was reported as the CTA's own text sitting on a 2.86:1
    // grey, which is a finding about nothing, arrived at from real pixels.
    await page.evaluate(() => {
      const s = document.createElement('style');
      s.textContent =
        '*,*::before,*::after{animation:none!important;transition:none!important}';
      document.head.appendChild(s);
    });
    await new Promise((r) => setTimeout(r, 400));

    const runs = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('[aria-hidden="true"]')) continue;
        // Text inside role="img" is not text: the element carries one
        // aria-label and everything under it is paint. The calendar is the
        // case here: its greyed out-of-month numerals are DELIBERATELY at
        // 1.2:1, which is a drawing decision, not a legibility failure.
        if (el.closest('[role="img"]')) continue;
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1))
          continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const size = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 600;
        out.push({
          x: Math.round(r.left + window.scrollX),
          y: Math.round(r.top + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
          fg: cs.color,
          need: size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5,
          sel:
            el.tagName.toLowerCase() +
            '.' +
            String(el.className || '').trim().split(/\s+/).slice(0, 2).join('.'),
          text: (el.textContent || '').trim().slice(0, 32),
        });
      }
      return out;
    });

    // resolve each foreground to a concrete rgb (they may be translucent,
    // in which case they composite onto whatever is behind: measured below)
    const fgs = await page.evaluate((list) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 1;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      return list.map((r) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = '#808080';
        cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = r.fg;
        cx.fillRect(0, 0, 1, 1);
        const d = cx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]];
      });
    }, runs);

    const inked = PNG.sync.read(Buffer.from(await page.screenshot({ fullPage: true })));
    await page.evaluate(() => {
      const s = document.createElement('style');
      s.textContent = '*{color:transparent!important;-webkit-text-fill-color:transparent!important}';
      document.head.appendChild(s);
    });
    const bare = PNG.sync.read(Buffer.from(await page.screenshot({ fullPage: true })));

    runs.forEach((r, i) => {
      const [fr, fg_, fb] = fgs[i];
      const fgL = lum(fr, fg_, fb);
      let worst = Infinity;
      let px = null;
      let hits = 0;
      for (let y = Math.max(0, r.y); y < Math.min(r.y + r.h, bare.height); y++) {
        for (let x = Math.max(0, r.x); x < Math.min(r.x + r.w, bare.width); x++) {
          const o = (bare.width * y + x) << 2;
          // a glyph pixel: it changed when the text was made transparent,
          // and it changed TOWARD this run's own colour, which is what
          // keeps a parent from being judged on its child's differently
          // coloured text sitting inside the same box
          const dr = inked.data[o] - bare.data[o];
          const dg = inked.data[o + 1] - bare.data[o + 1];
          const db = inked.data[o + 2] - bare.data[o + 2];
          if (dr * dr + dg * dg + db * db < 900) continue;
          const near =
            Math.abs(inked.data[o] - fr) < 46 &&
            Math.abs(inked.data[o + 1] - fg_) < 46 &&
            Math.abs(inked.data[o + 2] - fb) < 46;
          if (!near) continue; // an antialiased edge, or somebody else's glyph
          hits++;
          const c = ratio(fgL, lum(bare.data[o], bare.data[o + 1], bare.data[o + 2]));
          if (c < worst) {
            worst = c;
            px = [bare.data[o], bare.data[o + 1], bare.data[o + 2]];
          }
        }
      }
      // no fully-inked pixel found: the run is off-screen, clipped, or drawn
      // entirely in antialiasing. Nothing measured, nothing claimed.
      if (!hits) return;
      checked++;
      if (worst < r.need)
        fails.push({ scheme, path, ...r, ratio: Math.round(worst * 100) / 100, px });
    });
    await page.close();
  }
}
await b.close();

if (!fails.length) {
  console.log(`PIXEL CONTRAST: pass, ${checked} text runs against their darkest real ground`);
  process.exit(0);
}
console.log(`PIXEL CONTRAST: ${fails.length} failing run(s) of ${checked}`);
for (const f of fails.slice(0, Number(process.env.LIMIT || 25)))
  console.log(
    `  [${f.scheme}] ${f.path}  ${f.ratio}:1 (need ${f.need})  ${f.sel}  "${f.text}"\n      fg=${f.fg}  darkest ground=rgb(${f.px})`,
  );
process.exit(1);

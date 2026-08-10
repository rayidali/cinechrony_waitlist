import puppeteer from 'puppeteer-core';

/**
 * Contrast audit. Run against a local server:
 *
 *   npm run dev            # or npm run build && npm start
 *   npm run check:contrast
 *
 * Set CHROME to override the browser path, BASE to override the origin.
 *
 * WHY THIS EXISTS. The dark-mode failure (dark text on a dark green field)
 * survived three rounds of screenshots because a full-page capture scaled to
 * thumbnail size hides it completely. This reads the COMPUTED colour of every
 * piece of text, finds the field it actually sits on — including sampling
 * every stop of a gradient, and taking the worst one — and reports the ratio.
 */
const PAGES = ['/', '/beta', '/waitlist', '/support', '/install', '/privacy', '/terms'];
const BASE = process.env.BASE || 'http://localhost:3000';
const b = await puppeteer.launch({
  executablePath:
    process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
});

let worst = [];
for (const scheme of ['light', 'dark']) {
  for (const path of PAGES) {
    const page = await b.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));

    const rows = await page.evaluate(() => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 1;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      const rgb = (c) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = '#ffffff';
        cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = c;
        cx.fillRect(0, 0, 1, 1);
        const d = cx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]];
      };
      const lum = (c) => {
        const [r, g, bl] = rgb(c).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
      };
      // composite the (possibly translucent) text colour onto its own field
      // before measuring, which is what the eye actually sees
      const over = (fgc, bgc) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = bgc; cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = fgc; cx.fillRect(0, 0, 1, 1);
        const d = cx.getImageData(0, 0, 1, 1).data;
        return `rgb(${d[0]},${d[1]},${d[2]})`;
      };
      const ratio2 = (fgc, bgc) => {
        const [x, y] = [lum(over(fgc, bgc)), lum(bgc)].sort((p, q) => q - p);
        return (x + 0.05) / (y + 0.05);
      };
      // A gradient's falloff stops are `transparent`, which Chrome computes
      // to rgba(0,0,0,0). Treating those as a background is how the first
      // run produced nineteen findings, seventeen of them imaginary: a
      // transparent stop is not a field, it is a hole showing the one below.
      const clear = (c) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
        const a = cx.getImageData(0, 0, 1, 1).data;
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = '#000000'; cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
        const z = cx.getImageData(0, 0, 1, 1).data;
        return a[0] !== z[0] || a[1] !== z[1] || a[2] !== z[2];
      };
      // every colour literal inside a background-image (gradient stops)
      const stops = (img) =>
        (img.match(/(oklch|oklab|rgba?|lab|color)\([^)]*\)/g) || [])
          .filter((c) => !/gradient/.test(c))
          .filter((c) => !clear(c));

      const opaque = (c) => c && c !== 'transparent' && !/rgba\([^)]*,\s*0\s*\)/.test(c);
      // fully opaque: composites identically over white and over black
      const solid = (c) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
        const a = cx.getImageData(0, 0, 1, 1).data;
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = '#000000'; cx.fillRect(0, 0, 1, 1);
        cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
        const z = cx.getImageData(0, 0, 1, 1).data;
        return a[0] === z[0] && a[1] === z[1] && a[2] === z[2];
      };

      const out = [];
      const nodes = [...document.querySelectorAll('body *')].filter((el) => {
        if (el.closest('[aria-hidden="true"]')) return false;
        const t = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
        if (!t) return false;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && cs.opacity !== '0';
      });

      for (const el of nodes) {
        const cs = getComputedStyle(el);
        const fg = cs.color;
        // walk up for the field this text actually sits on
        let node = el;
        let bgs = [];
        let sealed = false;
        while (node && node !== document.documentElement) {
          const s = getComputedStyle(node);
          if (s.backgroundImage && s.backgroundImage !== 'none') {
            const st = stops(s.backgroundImage);
            if (st.length) {
              bgs = st;
              // A GRADIENT WITH A FULLY OPAQUE STOP SEALS THE WALK. A
              // linear-gradient painted with no background-color under it
              // leaves backgroundColor transparent, so the old loop kept
              // climbing to <body> and reported the cream PAGE as the field
              // for cream type sitting on an opaque green band — twenty
              // failures, every one of them imaginary. If the gradient is
              // opaque it covers whatever is behind it, and behind it is
              // not a field any more.
              if (st.some((c) => solid(c))) sealed = true;
            }
          }
          if (sealed) break;
          if (opaque(s.backgroundColor)) {
            bgs = bgs.concat([s.backgroundColor]);
            break;
          }
          node = node.parentElement;
        }
        if (!bgs.length) bgs = [getComputedStyle(document.body).backgroundColor];

        let low = Infinity;
        let against = '';
        for (const bg of bgs) {
          const r = ratio2(fg, bg);
          if (r < low) { low = r; against = bg; }
        }
        const size = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 600;
        const large = size >= 24 || (size >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        if (low < need) {
          out.push({
            sel: el.tagName.toLowerCase() + '.' + String(el.className || '').trim().split(/\s+/).slice(0, 2).join('.'),
            text: (el.textContent || '').trim().slice(0, 34),
            ratio: Math.round(low * 100) / 100,
            need,
            fg,
            against,
          });
        }
      }
      return out;
    });

    for (const r of rows) worst.push({ scheme, path, ...r });
    await page.close();
  }
}

if (!worst.length) {
  console.log('CONTRAST: pass — every text run clears WCAG AA against the worst stop of its field');
  await b.close();
  process.exit(0);
} else {
  console.log(`CONTRAST: ${worst.length} failing run(s)`);
  for (const w of worst.slice(0, 25)) {
    console.log(
      `  [${w.scheme}] ${w.path}  ${w.ratio}:1 (need ${w.need})  ${w.sel}  "${w.text}"\n      fg=${w.fg}  bg=${w.against}`,
    );
  }
  await b.close();
  process.exit(1);
}

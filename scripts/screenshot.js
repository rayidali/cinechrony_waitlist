/* Screenshot every route in light+dark at desktop+mobile widths.
   Usage: node shoot.js [baseUrl] [outDir] */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = process.argv[3] || path.join(__dirname, "shots");
const ROUTES = ["/", "/waitlist", "/install", "/beta", "/support", "/privacy", "/terms", "/nope-404"];
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const THEMES = ["light", "dark"];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const errors = [];
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    for (const theme of THEMES) {
      const page = await ctx.newPage();
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(`[console ${vp.name}/${theme}] ${m.text()}`);
      });
      page.on("pageerror", (e) => errors.push(`[pageerror ${vp.name}/${theme}] ${e.message}`));
      await page.addInitScript((t) => {
        localStorage.setItem("cinechrony-theme", t);
      }, theme);
      for (const route of ROUTES) {
        const slug = route === "/" ? "home" : route.replace(/\//g, "") || "home";
        try {
          const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 20000 });
          if (resp && resp.status() >= 500) errors.push(`[http] ${route} -> ${resp.status()}`);
          // scroll through the page to fire the IntersectionObserver reveals
          await page.evaluate(async () => {
            document.documentElement.style.scrollBehavior = "auto";
            const step = window.innerHeight * 0.8;
            for (let y = 0; y <= document.body.scrollHeight; y += step) {
              window.scrollTo({ top: y, behavior: "instant" });
              await new Promise((r) => setTimeout(r, 150));
            }
            await new Promise((r) => setTimeout(r, 300));
            window.scrollTo({ top: 0, behavior: "instant" });
          });
          // deterministic capture: reveals are verified by the scroll pass;
          // freeze them visible so fullPage expansion can't race the fade
          await page.addStyleTag({ content: ".reveal{transition:none !important}" });
          await page.evaluate(() => {
            document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
          });
          await page.waitForTimeout(1200); // let the demo animate in
          await page.screenshot({
            path: path.join(OUT, `${slug}-${vp.name}-${theme}.png`),
            fullPage: true,
          });
        } catch (e) {
          errors.push(`[nav] ${route} ${vp.name}/${theme}: ${e.message}`);
        }
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "errors.txt"), errors.join("\n"));
  console.log(`done. ${errors.length} errors -> ${path.join(OUT, "errors.txt")}`);
})();

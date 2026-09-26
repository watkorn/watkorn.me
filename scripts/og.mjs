// scripts/og.mjs — link-preview images (Open Graph, 1200×630) for every post and project, per language,
// plus the Thai site's default card. Runs after prerender: renders an HTML card in headless Chromium
// (from @playwright/test, already used for the tests) so Thai text is shaped and wrapped properly.
//
//   build/og/blogs/<slug>.png        English post
//   build/og/th/blogs/<slug>.png     Thai post
//   build/og/th.png                  Thai home / index pages (English ones use public/og.png)
//
// No Chromium locally? The build still works: every card falls back to a copy of og.png and a warning
// is printed. In CI (process.env.CI) a failure is an error instead, so a deploy never ships the fallback.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { strings } from "../src/i18n/strings.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "build");
const GEN = path.join(ROOT, "src", "generated");
const LOCALES = { en: "en-GB", th: "th-TH" };
const KIND = { en: { blog: "blog", project: "project" }, th: { blog: "บล็อก", project: "ผลงาน" } };

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const t = (lang, key, vars = {}) => {
  const v = strings[lang][key] ?? strings.en[key];
  return typeof v === "function" ? v(vars) : v.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
};
const date = (iso, lang) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString(LOCALES[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// the same self-hosted Mali the site uses (@fontsource): its @font-face rules, with every woff2 inlined
// as a data URI (the card is rendered from a string, so it can't fetch relative files)
function fontFaces(weight) {
  const dir = path.join(ROOT, "node_modules", "@fontsource", "mali");
  return fs
    .readFileSync(path.join(dir, `${weight}.css`), "utf8")
    .replace(/url\(\.\/files\/([^)]+\.woff2)\) format\('woff2'\)(, url\([^)]+\) format\('woff'\))?/g, (m, file) => {
      const data = fs.readFileSync(path.join(dir, "files", file)).toString("base64");
      return `url(data:font/woff2;base64,${data}) format('woff2')`;
    });
}

// ---- which cards to draw
const read = (type) => JSON.parse(fs.readFileSync(path.join(GEN, type, "index.json"), "utf8"));
const cards = [
  {
    out: "og/th.png",
    lang: "th",
    chips: [],
    title: t("th", "home.title"),
    foot: "writeup CTF · เครื่องมือสาย security",
    home: true,
  },
];
for (const b of read("blogs")) {
  for (const lang of b.langs) {
    const chips = [b.category ? "writeup" : KIND[lang].blog, b.category, b.difficulty].filter(Boolean);
    cards.push({
      out: `og/${lang === "en" ? "" : `${lang}/`}blogs/${b.slug}.png`,
      lang,
      chips,
      difficulty: b.difficulty,
      title: b.text[lang].title,
      // no-break spaces inside each part, so a long footer only wraps between parts
      foot: [b.event, date(b.date, lang), t(lang, "list.minRead", { n: b.text[lang].readingMinutes })]
        .filter(Boolean)
        .map((part) => part.replace(/ /g, "\u00a0"))
        .join(" · "),
    });
  }
}
for (const p of read("projects")) {
  for (const lang of p.langs) {
    cards.push({
      out: `og/${lang === "en" ? "" : `${lang}/`}projects/${p.slug}.png`,
      lang,
      chips: [KIND[lang].project, p.category],
      title: p.text[lang].title,
      sub: p.text[lang].desc,
      foot: (p.tags || []).map((tag) => `#${tag}`).join("  "),
    });
  }
}

// ---- the card: Handheld Quest shell, title on the left, the yeti on a handheld screen on the right
const yeti = fs.readFileSync(path.join(ROOT, "brand", "svg", "yeti-dandelion.svg"), "utf8");
const yetiUri = `data:image/svg+xml;base64,${Buffer.from(yeti).toString("base64")}`;

const html = (card, fonts) => `<!doctype html>
<html lang="${card.lang}"><head><meta charset="utf-8"><style>
${fonts}
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: oklch(87% 0.15 92); color: oklch(22% 0.04 70);
  font-family: Mali, sans-serif; display: grid; grid-template-columns: 1fr 380px; gap: 56px; padding: 64px 72px; }
.text { display: flex; flex-direction: column; min-width: 0; }
.chips { display: flex; gap: 12px; height: 44px; }
.chip { font-size: 24px; font-weight: 700; line-height: 1; padding: 9px 18px 10px; border-radius: 999px;
  background: oklch(29% 0.035 285); color: oklch(87% 0.15 92); text-transform: lowercase; }
.chip--easy { background: oklch(86% 0.085 128); color: oklch(22% 0.03 285); }
.chip--medium { background: oklch(96% 0.12 100); color: oklch(22% 0.03 285); }
.chip--hard, .chip--insane { background: oklch(56% 0.2 12); color: #fff; }
h1 { flex: 1 1 0; min-height: 0; overflow: hidden; display: flex; align-items: center; font-weight: 700; letter-spacing: -0.01em; overflow-wrap: anywhere;
  text-wrap: balance; }
h1 span { display: block; }
:lang(th) h1 { letter-spacing: 0; }
.sub, .foot { font-weight: 500; color: oklch(38% 0.05 70); overflow: hidden; display: -webkit-box;
  -webkit-box-orient: vertical; }
.sub { font-size: 30px; line-height: 1.35; -webkit-line-clamp: 3; margin-bottom: 20px; }
.foot { font-size: 26px; line-height: 1.35; -webkit-line-clamp: 2; min-height: 35px; }
.brand { margin-top: 10px; font-size: 34px; font-weight: 700; color: oklch(50% 0.2 12); letter-spacing: 0.02em; }
.screen { align-self: center; width: 380px; height: 380px; background: oklch(29% 0.035 285);
  border-radius: 28px 28px 96px 28px; display: grid; place-items: center; box-shadow: 0 10px 0 oklch(68% 0.14 78); }
.screen img { width: 320px; height: 320px; image-rendering: pixelated; }
</style></head><body>
<div class="text">
  <div class="chips">${card.chips.map((c) => `<span class="chip${c === card.difficulty ? ` chip--${c}` : ""}">${esc(c)}</span>`).join("")}</div>
  <h1 id="title"><span>${esc(card.title)}</span></h1>
  ${card.sub ? `<p class="sub">${esc(card.sub)}</p>` : ""}
  <p class="foot">${esc(card.foot || "")}</p>
  <p class="brand">WATKORN.ME</p>
</div>
<div class="screen"><img src="${yetiUri}" alt=""></div>
</body></html>`;

// largest title size (96px → 44px) that fits the space between the chips and the footer
const fitTitle = () => {
  const h1 = document.getElementById("title");
  const span = h1.firstElementChild;
  for (let size = 96; size >= 44; size -= 4) {
    h1.style.fontSize = `${size}px`;
    h1.style.lineHeight = document.documentElement.lang === "th" ? "1.3" : "1.1";
    if (span.scrollHeight <= h1.clientHeight && span.scrollWidth <= h1.clientWidth) return size;
  }
  return 44;
};

function fallback(reason) {
  if (process.env.CI) throw new Error(`[og] ${reason}`);
  console.warn(`[og] ${reason} -> using og.png for every card (install Chromium: npx playwright install chromium)`);
  for (const card of cards) {
    const file = path.join(OUT, card.out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.copyFileSync(path.join(ROOT, "public", "og.png"), file);
  }
}

let browser;
try {
  const fonts = fontFaces(500) + fontFaces(700);
  const { chromium } = await import("@playwright/test");
  browser = await chromium.launch(
    process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  );
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const card of cards) {
    await page.setContent(html(card, fonts));
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(fitTitle);
    const file = path.join(OUT, card.out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await page.screenshot({ path: file, type: "png" });
  }
  console.log(`[og] ${cards.length} link-preview images -> build/og/`);
} catch (err) {
  fallback(err.message.split("\n")[0]);
} finally {
  await browser?.close();
}

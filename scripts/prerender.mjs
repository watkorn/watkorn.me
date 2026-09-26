// scripts/prerender.mjs
// หลัง vite build: render ทุกหน้า (ทั้ง / และ /th/) เป็นไฟล์ HTML ของตัวเอง (ดีต่อ SEO + ลิงก์พรีวิว)
// แล้วสร้าง 404.html, sitemap.xml (พร้อม hreflang), rss.xml และ th/rss.xml
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "build");
const SSR_DIR = path.join(ROOT, "build-ssr");
const SITE = "https://watkorn.me";

const { render, routes, blogs, LANGS, localizePath } = await import(
  pathToFileURL(path.join(SSR_DIR, "entry-server.js")).href
);
const template = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
for (const marker of ["<!--app-html-->", "<!--app-head-->", '<html lang="en">']) {
  if (!template.includes(marker)) throw new Error(`[prerender] build/index.html is missing ${marker}`);
}

// preload the fonts the first screen renders with, so text doesn't paint in a fallback font and then jump
// (layout shift). Thai pages also need Mali's Thai subset. Files are hashed by Vite, so look them up.
const assets = fs.readdirSync(path.join(OUT, "assets"));
const PRELOAD = {
  en: ["mali-latin-400", "mali-latin-600", "mali-latin-700", "jetbrains-mono-latin-400"],
  th: ["mali-thai-400", "mali-thai-600", "mali-thai-700"],
};
const preloads = (lang) =>
  [...PRELOAD.en, ...(lang === "en" ? [] : PRELOAD[lang])]
    .map((name) => {
      const file = assets.find((f) => f.startsWith(`${name}-normal-`) && f.endsWith(".woff2"));
      if (!file) throw new Error(`[prerender] no font file for ${name} in build/assets`);
      return `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin>`;
    })
    .join("");

const page = (url, lang = "en") => {
  const { html, head } = render(url);
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace("<!--app-head-->", preloads(lang) + head)
    .replace("<!--app-html-->", html);
};

for (const { url, lang } of routes) {
  const file = url === "/" ? path.join(OUT, "index.html") : path.join(OUT, url, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(url, lang));
}
fs.writeFileSync(path.join(OUT, "404.html"), page("/404"));

// ---- sitemap.xml: only pages in their own language, each listing its translations
const canonical = (url) => `${SITE}${url === "/" ? "/" : `${url}/`}`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .filter((r) => r.original && !r.noindex)
  .map((r) => {
    const alts =
      r.langs.length > 1
        ? [...r.langs, "x-default"]
            .map(
              (l) =>
                `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${canonical(localizePath(r.path, l === "x-default" ? "en" : l))}"/>`,
            )
            .join("")
        : "";
    return `  <url>\n    <loc>${canonical(r.url)}</loc>${r.date ? `\n    <lastmod>${r.date}</lastmod>` : ""}${alts}\n  </url>`;
  })
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);

// ---- rss.xml (English) and th/rss.xml (Thai): newest first, full content, only posts written in that language
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const absolutize = (html) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${SITE}/`);
const FEEDS = {
  en: { file: "rss.xml", title: "WATKORN.ME", desc: "CTF writeups, security notes and tools by watkorn." },
  th: { file: "th/rss.xml", title: "WATKORN.ME (ภาษาไทย)", desc: "writeup CTF บันทึกสาย security และเครื่องมือโดย watkorn" },
};
for (const lang of LANGS) {
  const feed = FEEDS[lang];
  const items = [...blogs]
    .filter((b) => b.langs.includes(lang))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((b) => {
      const name = lang === "en" ? b.slug : `${b.slug}.${lang}`;
      const body = JSON.parse(fs.readFileSync(path.join(ROOT, "src/generated/blogs", `${name}.json`), "utf8")).html;
      const url = canonical(localizePath(`/blogs/${b.slug}`, lang));
      return `    <item>
      <title>${esc(b.text[lang].title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${b.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(b.text[lang].desc || "")}</description>
${(b.tags || []).map((t) => `      <category>${esc(t)}</category>`).join("\n")}
      <content:encoded><![CDATA[${absolutize(body).replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`;
    })
    .join("\n");
  const home = canonical(localizePath("/", lang));
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(feed.title)}</title>
    <link>${home}</link>
    <description>${esc(feed.desc)}</description>
    <language>${lang}</language>
    <atom:link href="${SITE}/${feed.file}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  fs.mkdirSync(path.dirname(path.join(OUT, feed.file)), { recursive: true });
  fs.writeFileSync(path.join(OUT, feed.file), rss);
}

// ---- .well-known/security.txt (RFC 9116): where to report a real vulnerability.
// Written on every build so "Expires" always sits ~6 months after the last deploy.
const expires = new Date(Date.now() + 182 * 24 * 60 * 60 * 1000);
expires.setUTCHours(0, 0, 0, 0);
const securityTxt = `# Found a real vulnerability on watkorn.me? Thank you. Please report it privately.
# The mini CTF on this site is meant to be played: flags are not vulnerabilities.
# Thoth (${SITE}/projects/thoth/) is out of scope for testing, but reports are welcome.
Contact: mailto:fkub0011@gmail.com
Expires: ${expires.toISOString()}
Preferred-Languages: en, th
Canonical: ${SITE}/.well-known/security.txt
Policy: https://github.com/watkorn/watkorn.me#security
`;
fs.mkdirSync(path.join(OUT, ".well-known"), { recursive: true });
fs.writeFileSync(path.join(OUT, ".well-known", "security.txt"), securityTxt);

fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(`[prerender] ${routes.length} pages (${LANGS.join(" + ")}) + 404.html, sitemap.xml, rss.xml, th/rss.xml, security.txt`);

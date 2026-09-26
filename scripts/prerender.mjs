// scripts/prerender.mjs
// หลัง vite build: render ทุกหน้าเป็นไฟล์ HTML ของตัวเอง (ดีต่อ SEO + ลิงก์พรีวิว)
// แล้วสร้าง 404.html, sitemap.xml และ rss.xml
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "build");
const SSR_DIR = path.join(ROOT, "build-ssr");
const SITE = "https://watkorn.me";

const { render, routes, blogs } = await import(pathToFileURL(path.join(SSR_DIR, "entry-server.js")).href);
const template = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
if (!template.includes("<!--app-html-->") || !template.includes("<!--app-head-->")) {
  throw new Error("[prerender] build/index.html is missing the <!--app-head--> / <!--app-html--> placeholders");
}

const page = (url) => {
  const { html, head } = render(url);
  return template.replace("<!--app-head-->", head).replace("<!--app-html-->", html);
};

for (const url of routes) {
  const file = url === "/" ? path.join(OUT, "index.html") : path.join(OUT, url, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(url));
}
fs.writeFileSync(path.join(OUT, "404.html"), page("/404"));

// ---- sitemap.xml
const canonical = (url) => `${SITE}${url === "/" ? "/" : `${url}/`}`;
const lastmod = Object.fromEntries(blogs.map((b) => [`/blogs/${b.slug}`, b.date]));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((u) => `  <url><loc>${canonical(u)}</loc>${lastmod[u] ? `<lastmod>${lastmod[u]}</lastmod>` : ""}</url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);

// ---- rss.xml (newest first, full content)
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const absolutize = (html) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${SITE}/`);
const items = [...blogs]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((b) => {
    const body = JSON.parse(fs.readFileSync(path.join(ROOT, "src/generated/blogs", `${b.slug}.json`), "utf8")).html;
    const url = canonical(`/blogs/${b.slug}`);
    return `    <item>
      <title>${esc(b.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${b.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(b.desc || "")}</description>
${(b.tags || []).map((t) => `      <category>${esc(t)}</category>`).join("\n")}
      <content:encoded><![CDATA[${absolutize(body).replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`;
  })
  .join("\n");
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WATKORN.ME</title>
    <link>${SITE}/</link>
    <description>CTF writeups, security notes and tools by watkorn.</description>
    <language>en</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(OUT, "rss.xml"), rss);

fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(`[prerender] ${routes.length} pages + 404.html, sitemap.xml, rss.xml`);

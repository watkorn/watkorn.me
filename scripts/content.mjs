// scripts/content.mjs
// แปลงไฟล์ Markdown ใน content/ เป็น JSON ใน src/generated/ ตอน build
// (ทำงานบนเครื่อง/CI เท่านั้น ไม่มีโค้ดฝั่ง server ตอนเว็บรันจริง)
//
//   node scripts/content.mjs          -> build ครั้งเดียว
//   node scripts/content.mjs --watch  -> build แล้วเฝ้าดูไฟล์ที่เปลี่ยน
//   --drafts                          -> รวมโพสต์ที่ตั้ง draft: true ด้วย
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "src", "generated");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---- headings: stable ids, a "#" link on each, and a table of contents (h2) per document
const ANCHOR_LABEL = { en: "Link to this section", th: "ลิงก์ไปหัวข้อนี้" };
const RESERVED_IDS = new Set(["main", "root", "home-title", "about-title"]); // ids the app already uses
let doc = { ids: new Set(), toc: [], lang: "en" }; // reset by renderDoc() before every document

const decodeEntities = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
const stripTags = (html) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// "Level 1: Warm-up (10 pts)" -> "level-1-warm-up-10-pts"; Thai letters and marks are kept as they are
function headingId(text) {
  const base =
    text
      .normalize("NFC")
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
      .trim()
      .replace(/[\s-]+/g, "-") || "section";
  let id = base;
  for (let n = 2; doc.ids.has(id) || RESERVED_IDS.has(id); n++) id = `${base}-${n}`;
  doc.ids.add(id);
  return id;
}

const escapeAttr = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
  {
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const text = stripTags(inner);
        const id = headingId(text);
        if (depth === 2) doc.toc.push({ id, text });
        const label = `${ANCHOR_LABEL[doc.lang]}: ${text}`;
        return `<h${depth} id="${escapeAttr(id)}">${inner}<a class="heading-anchor" href="#${escapeAttr(id)}" aria-label="${escapeAttr(label)}">#</a></h${depth}>\n`;
      },
      // task-list items: wrap checkbox + text in a <label> so the checkbox has an accessible name
      listitem(item) {
        if (!item.task) return false; // default rendering for normal list items
        const text = this.parser.parse(item.tokens, !!item.loose).replace(/^<input[^>]*>\s*/, "");
        const box = `<input type="checkbox" disabled${item.checked ? " checked" : ""}>`;
        return `<li class="task"><label>${box} ${text.trim()}</label></li>\n`;
      },
      // ลิงก์ภายนอกเปิดแท็บใหม่ + กัน tabnabbing
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//i.test(href);
        const attrs = [
          `href="${escapeAttr(href)}"`,
          title ? `title="${escapeAttr(title)}"` : "",
          external ? 'target="_blank" rel="noopener noreferrer"' : "",
        ].filter(Boolean);
        return `<a ${attrs.join(" ")}>${text}</a>`;
      },
      image({ href, title, text }) {
        const attrs = [
          `src="${escapeAttr(href)}"`,
          `alt="${escapeAttr(text)}"`,
          title ? `title="${escapeAttr(title)}"` : "",
          'loading="lazy"',
        ].filter(Boolean);
        return `<img ${attrs.join(" ")}>`;
      },
    },
  },
);

// render one Markdown document: HTML, its table of contents, and plain text for the search index
function renderDoc(content, lang) {
  doc = { ids: new Set(), toc: [], lang };
  const html = marked.parse(content);
  return { html, toc: doc.toc.length >= 3 ? doc.toc : [], plain: stripTags(html) };
}

const toISODate = (value, file) => {
  const d = value instanceof Date ? value : new Date(value);
  if (!value || Number.isNaN(d.getTime())) {
    throw new Error(`${file}: "date" ต้องอยู่ในรูปแบบ YYYY-MM-DD`);
  }
  return d.toISOString().slice(0, 10);
};

// Each post is content/<type>/<slug>.md (English) and/or <slug>.th.md (Thai).
// Shared fields (date, tags, category…) come from the English file when both exist.
const LANGS = ["en", "th"];
const FILE_RE = /^(.+?)(?:\.(th))?\.md$/;

// Thai has no spaces between words, so count words with Intl.Segmenter instead of splitting on spaces
const segmenters = Object.fromEntries(LANGS.map((l) => [l, new Intl.Segmenter(l, { granularity: "word" })]));
const countWords = (text, lang) => {
  let n = 0;
  for (const s of segmenters[lang].segment(text.replace(/```[\s\S]*?```/g, " "))) if (s.isWordLike) n += 1;
  return n;
};

function readCollection(type, { drafts }) {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  const bySlug = new Map();
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith(".md") || file.startsWith("_")) continue;
    const rel = `content/${type}/${file}`;
    const [, slug, lang = "en"] = file.match(FILE_RE);
    if (!SLUG_RE.test(slug)) {
      throw new Error(`${rel}: ชื่อไฟล์ต้องเป็น a-z, 0-9 และ - เท่านั้น (เช่น my-first-post.md หรือ my-first-post.th.md)`);
    }

    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    if (!data.title) throw new Error(`${rel}: ต้องมี "title" ใน frontmatter`);
    if (data.draft && !drafts) continue;

    const readingMinutes = Math.max(1, Math.round(countWords(content, lang) / 200));
    if (!bySlug.has(slug)) bySlug.set(slug, { slug, variants: {} });
    bySlug.get(slug).variants[lang] = { data, ...renderDoc(content, lang), rel, readingMinutes };
  }

  return [...bySlug.values()].map(({ slug, variants }) => {
    const langs = LANGS.filter((l) => variants[l]);
    // shared fields: English first, the translation fills any gaps
    const data = Object.assign({}, ...[...langs].reverse().map((l) => variants[l].data));
    const text = Object.fromEntries(
      langs.map((l) => [
        l,
        {
          title: String(variants[l].data.title),
          desc: variants[l].data.description ? String(variants[l].data.description) : "",
          readingMinutes: variants[l].readingMinutes,
          toc: variants[l].toc,
          // per-language screenshot captions/alt text (optional)
          ...(Array.isArray(variants[l].data.screenshots) ? { screenshots: variants[l].data.screenshots } : {}),
        },
      ]),
    );
    const html = Object.fromEntries(langs.map((l) => [l, variants[l].html]));
    const plain = Object.fromEntries(langs.map((l) => [l, variants[l].plain]));
    return { slug, data, langs, text, html, plain, rel: variants[langs[0]].rel };
  });
}

function buildBlogs(opts) {
  return readCollection("blogs", opts)
    .map(({ slug, data, langs, text, html, plain, rel }) => {
      const date = toISODate(data.date, rel);
      return {
        plain,
        meta: {
          slug,
          langs,
          text,
          date,
          year: Number(date.slice(0, 4)),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          // CTF writeup fields (optional)
          category: data.category ? String(data.category).toLowerCase() : null,
          difficulty: data.difficulty ? String(data.difficulty).toLowerCase() : null,
          event: data.event ? String(data.event) : null,
        },
        html,
      };
    })
    .sort((a, b) => a.meta.date.localeCompare(b.meta.date) || a.meta.slug.localeCompare(b.meta.slug));
}

function buildProjects(opts) {
  return readCollection("projects", opts)
    .map(({ slug, data, langs, text, html, plain, rel }) => {
      if (!data.category) throw new Error(`${rel}: ต้องมี "category" ใน frontmatter`);
      return {
        plain,
        meta: {
          slug,
          langs,
          text,
          category: String(data.category),
          order: Number.isFinite(data.order) ? data.order : 999,
          date: data.date ? toISODate(data.date, rel) : null,
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          github: data.github ? String(data.github) : null,
          screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
        },
        html,
      };
    })
    .sort((a, b) => a.meta.order - b.meta.order || a.meta.slug.localeCompare(b.meta.slug));
}

// <slug>.json = English body, <slug>.th.json = Thai body
function writeCollection(type, items) {
  const dir = path.join(OUT_DIR, type);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, "index.json"),
    JSON.stringify(
      items.map((i) => i.meta),
      null,
      2,
    ),
  );
  for (const { meta, html } of items) {
    for (const [lang, body] of Object.entries(html)) {
      const name = lang === "en" ? meta.slug : `${meta.slug}.${lang}`;
      fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify({ html: body }));
    }
  }
}

// search index per site language: every post and project, in that language when it's translated
// (otherwise the original), with headings and plain text. Loaded only when someone opens /search.
function writeSearchIndex(collections) {
  const dir = path.join(OUT_DIR, "search");
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const lang of LANGS) {
    const items = collections.flatMap(([type, items]) =>
      items.map(({ meta, plain }) => {
        const shown = meta.langs.includes(lang) ? lang : meta.langs[0];
        const t = meta.text[shown];
        return {
          type,
          slug: meta.slug,
          lang: shown,
          title: t.title,
          desc: t.desc,
          tags: meta.tags || [],
          category: meta.category || null,
          date: meta.date || null,
          headings: (t.toc || []).map((h) => h.text),
          text: plain[shown].slice(0, 20000),
        };
      }),
    );
    fs.writeFileSync(path.join(dir, `${lang}.json`), JSON.stringify(items));
  }
}

// drafts: true = แสดงโพสต์ draft ด้วย (ใช้ตอน dev เท่านั้น)
export function buildContent({ drafts = false } = {}) {
  const blogs = buildBlogs({ drafts });
  const projects = buildProjects({ drafts });
  writeCollection("blogs", blogs);
  writeCollection("projects", projects);
  writeSearchIndex([
    ["blog", blogs],
    ["project", projects],
  ]);
  console.log(`[content] ${blogs.length} blog(s), ${projects.length} project(s) -> src/generated/`);
}

export function watchContent(opts) {
  let timer;
  fs.watch(CONTENT_DIR, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        buildContent(opts);
      } catch (err) {
        console.error(`[content] ${err.message}`);
      }
    }, 150);
  });
  console.log("[content] watching content/ for changes…");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const opts = { drafts: process.argv.includes("--drafts") };
  try {
    buildContent(opts);
  } catch (err) {
    console.error(`[content] ${err.message}`);
    process.exit(1);
  }
  if (process.argv.includes("--watch")) watchContent(opts);
}

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
  }
);

const toISODate = (value, file) => {
  const d = value instanceof Date ? value : new Date(value);
  if (!value || Number.isNaN(d.getTime())) {
    throw new Error(`${file}: "date" ต้องอยู่ในรูปแบบ YYYY-MM-DD`);
  }
  return d.toISOString().slice(0, 10);
};

function readCollection(type, { drafts }) {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const rel = `content/${type}/${file}`;
      const slug = file.replace(/\.md$/, "");
      if (!SLUG_RE.test(slug)) {
        throw new Error(`${rel}: ชื่อไฟล์ต้องเป็น a-z, 0-9 และ - เท่านั้น (เช่น my-first-post.md)`);
      }

      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      if (!data.title) throw new Error(`${rel}: ต้องมี "title" ใน frontmatter`);
      if (data.draft && !drafts) return null;

      const words = content.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
      return { slug, data, html: marked.parse(content), rel, readingMinutes: Math.max(1, Math.round(words / 200)) };
    })
    .filter(Boolean);
}

function buildBlogs(opts) {
  return readCollection("blogs", opts)
    .map(({ slug, data, html, rel, readingMinutes }) => {
      const date = toISODate(data.date, rel);
      return {
        meta: {
          slug,
          title: String(data.title),
          desc: data.description ? String(data.description) : "",
          date,
          year: Number(date.slice(0, 4)),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          readingMinutes,
        },
        html,
      };
    })
    .sort((a, b) => a.meta.date.localeCompare(b.meta.date) || a.meta.slug.localeCompare(b.meta.slug));
}

function buildProjects(opts) {
  return readCollection("projects", opts)
    .map(({ slug, data, html, rel }) => {
      if (!data.category) throw new Error(`${rel}: ต้องมี "category" ใน frontmatter`);
      return {
        meta: {
          slug,
          title: String(data.title),
          desc: data.description ? String(data.description) : "",
          category: String(data.category),
          order: Number.isFinite(data.order) ? data.order : 999,
          date: data.date ? toISODate(data.date, rel) : null,
          github: data.github ? String(data.github) : null,
          screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
        },
        html,
      };
    })
    .sort((a, b) => a.meta.order - b.meta.order || a.meta.title.localeCompare(b.meta.title));
}

function writeCollection(type, items) {
  const dir = path.join(OUT_DIR, type);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(items.map((i) => i.meta), null, 2));
  for (const { meta, html } of items) {
    fs.writeFileSync(path.join(dir, `${meta.slug}.json`), JSON.stringify({ html }));
  }
}

// drafts: true = แสดงโพสต์ draft ด้วย (ใช้ตอน dev เท่านั้น)
export function buildContent({ drafts = false } = {}) {
  const blogs = buildBlogs({ drafts });
  const projects = buildProjects({ drafts });
  writeCollection("blogs", blogs);
  writeCollection("projects", projects);
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

// scripts/new-post.mjs
// สร้างไฟล์ blog ใหม่:  npm run new-post -- "My Post Title"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run new-post -- "My Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

if (!slug) {
  console.error("ชื่อเรื่องต้องมีตัวอักษรภาษาอังกฤษหรือตัวเลขอย่างน้อย 1 ตัว (ใช้ทำชื่อไฟล์/URL)");
  process.exit(1);
}

const file = path.join(ROOT, "content", "blogs", `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`มีไฟล์นี้อยู่แล้ว: content/blogs/${slug}.md`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
description: ""
date: ${today}
tags: []
draft: true
---

เขียนเนื้อหาตรงนี้ด้วย Markdown

## หัวข้อ

\`\`\`bash
nmap -sC -sV 10.10.10.10
\`\`\`
`
);

console.log(`Created content/blogs/${slug}.md (draft: true — ลบบรรทัดนี้เมื่อพร้อมเผยแพร่)`);

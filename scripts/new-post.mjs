// scripts/new-post.mjs
// สร้างไฟล์ blog ใหม่:  npm run new-post -- "My Post Title"
// แปลโพสต์ที่มีอยู่เป็นภาษาไทย:  npm run new-post -- --th my-post-title
import fs from "node:fs";
import matter from "gray-matter";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const writeup = args.includes("--writeup");
const thai = args.includes("--th");
const slugAt = args.indexOf("--slug");
const slugArg = slugAt >= 0 ? args[slugAt + 1] : null;
const title = args
  .filter((a, i) => !["--writeup", "--th", "--slug"].includes(a) && (slugAt < 0 || i !== slugAt + 1))
  .join(" ")
  .trim();

if (!title && !slugArg) {
  console.error('Usage: npm run new-post -- "My Post Title"                  (a normal post)');
  console.error('       npm run new-post -- --writeup "Challenge Name"        (a CTF writeup)');
  console.error("       npm run new-post -- --th my-post-title                (Thai translation of an existing post)");
  console.error('       npm run new-post -- --th --slug my-post "ชื่อภาษาไทย"   (a Thai-only post)');
  process.exit(1);
}

const slug = (slugArg || title)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

if (!slug) {
  console.error("ชื่อเรื่องต้องมีตัวอักษรภาษาอังกฤษหรือตัวเลขอย่างน้อย 1 ตัว (ใช้ทำชื่อไฟล์/URL)");
  console.error('ถ้าชื่อเป็นภาษาไทยล้วน ให้กำหนด URL เองด้วย --slug เช่น --slug my-post');
  process.exit(1);
}

const name = `${slug}${thai ? ".th" : ""}.md`;
const file = path.join(ROOT, "content", "blogs", name);
if (fs.existsSync(file)) {
  console.error(`มีไฟล์นี้อยู่แล้ว: content/blogs/${name}`);
  process.exit(1);
}

// --th + an English post with this slug = start the translation from a copy of the original
const original = path.join(ROOT, "content", "blogs", `${slug}.md`);
if (thai && fs.existsSync(original)) {
  const { data, content } = matter(fs.readFileSync(original, "utf8"));
  const translation = `---
title: ${JSON.stringify(`[แปล] ${data.title}`)}
description: ${JSON.stringify(data.description ? `[แปล] ${data.description}` : "")}
draft: true
---

<!-- แปลจาก content/blogs/${slug}.md: date, tags, category ฯลฯ ใช้ของต้นฉบับอัตโนมัติ ไม่ต้องใส่ซ้ำ -->
${content.startsWith("\n") ? "" : "\n"}${content}`;
  fs.writeFileSync(file, translation);
  console.log(`Created content/blogs/${name} (a copy of ${slug}.md to translate; draft: true — ลบบรรทัดนี้เมื่อแปลเสร็จ)`);
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const post = `---
title: ${JSON.stringify(title || slug)}
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
`;

const writeupPost = `---
title: ${JSON.stringify(title || slug)}
description: "One line: what the challenge was and the trick that cracked it"
date: ${today}
event: "Some CTF 2026"        # CTF name
category: web                 # web | pwn | crypto | forensics | rev | osint | misc
difficulty: easy              # easy | medium | hard | insane
tags: [ctf]
draft: true
---

## Challenge

> Paste the challenge description here. Note the points and how many teams solved it.

## Recon

What did you look at first? Files, ports, source, headers...

\`\`\`bash
file challenge.bin
strings -n 8 challenge.bin | head
\`\`\`

## The bug / the idea

The one insight that made it click.

## Exploit

\`\`\`python
# solve.py
\`\`\`

## Flag

\`\`\`
flag{...}
\`\`\`

## Lessons learned

- What you'd try first next time
- Tools or tricks worth remembering
`;

fs.writeFileSync(file, writeup ? writeupPost : post);

console.log(
  `Created content/blogs/${name}${writeup ? " (CTF writeup template)" : ""} (draft: true — ลบบรรทัดนี้เมื่อพร้อมเผยแพร่)`,
);

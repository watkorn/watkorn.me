// scripts/new-post.mjs
// สร้างไฟล์ blog ใหม่:  npm run new-post -- "My Post Title"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const writeup = args.includes("--writeup");
const title = args
  .filter((a) => a !== "--writeup")
  .join(" ")
  .trim();

if (!title) {
  console.error('Usage: npm run new-post -- "My Post Title"            (a normal post)');
  console.error('       npm run new-post -- --writeup "Challenge Name"  (a CTF writeup)');
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
const post = `---
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
`;

const writeupPost = `---
title: ${JSON.stringify(title)}
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
  `Created content/blogs/${slug}.md${writeup ? " (CTF writeup template)" : ""} (draft: true — ลบบรรทัดนี้เมื่อพร้อมเผยแพร่)`,
);

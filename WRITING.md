# คู่มือเขียนและอัปบล็อก

ทุกโพสต์คือไฟล์ Markdown หนึ่งไฟล์ในโฟลเดอร์ `content/blogs/` พอเข้า `main` แล้ว เว็บจะ build, test และ deploy เองภายใน 2–3 นาที

> `main` ถูกป้องกันด้วย Ruleset จึง **push เข้า `main` ตรงๆ ไม่ได้** ต้องส่งผ่าน Pull Request (PR) เสมอ CI ต้องผ่านก่อนถึงจะกด merge ได้ เป็นด่านกันเว็บพัง

มี 2 วิธี เลือกวิธีที่สะดวก:

- [วิธี A: เขียนบนหน้าเว็บ GitHub](#วิธี-a-เขียนบนหน้าเว็บ-github-ไม่ต้องติดตั้งอะไร) ไม่ต้องติดตั้งอะไร ใช้บนมือถือได้
- [วิธี B: เขียนบนเครื่องตัวเอง](#วิธี-b-เขียนบนเครื่องตัวเอง-ดูตัวอย่างก่อนอัปได้) ดูหน้าตาจริงก่อนอัปได้

---

## วิธี A: เขียนบนหน้าเว็บ GitHub (ไม่ต้องติดตั้งอะไร)

1. **เปิดโฟลเดอร์** https://github.com/watkorn/watkorn.me/tree/main/content/blogs
2. **สร้างไฟล์:** กด **Add file → Create new file**
   - ตั้งชื่อไฟล์เป็นภาษาอังกฤษตัวเล็ก ตัวเลข และ `-` เท่านั้น ลงท้ายด้วย `.md` เช่น `baby-rop.md`
   - ชื่อไฟล์จะกลายเป็น URL: `https://watkorn.me/blogs/baby-rop/`
3. **วางหัวไฟล์ (frontmatter)** จาก[แม่แบบด้านล่าง](#แม่แบบ-frontmatter) แล้วเขียนเนื้อหาต่อจากนั้น ลบบรรทัด `draft: true` ถ้าพร้อมเผยแพร่เลย
   - แท็บ **Preview** ใช้ดูหน้าตาคร่าวๆ ได้
4. **ส่งเป็น PR:** กด **Commit changes…** → เลือก **Create a new branch for this commit and start a pull request** (ตั้งชื่อ branch เช่น `post/baby-rop`) → **Propose changes** → **Create pull request**
5. **ใส่รูป (ถ้ามี) ใน branch เดียวกัน:**
   - เปิด `https://github.com/watkorn/watkorn.me/tree/post/baby-rop/public/images/blogs` (เปลี่ยน `post/baby-rop` เป็นชื่อ branch ของคุณ)
   - **Add file → Upload files** → ลากรูปมาวาง → เลือก **Commit directly to the `post/baby-rop` branch** → **Commit changes**
   - ในโพสต์อ้างถึงรูปแบบนี้: `![คำอธิบายรูป](/images/blogs/ชื่อรูป.png)`
6. **รอ CI:** ล่างสุดของหน้า PR จะขึ้น 🟡 กำลังรัน แล้วเปลี่ยนเป็น ✅ ภายใน 2–3 นาที
   - ถ้าขึ้น ❌ ดูหัวข้อ[แก้ปัญหา](#แก้ปัญหาที่เจอบ่อย) แก้ไฟล์ใน branch เดิมได้เลย (เปิดไฟล์ → ✏️ → **Commit directly to the branch**) CI จะรันใหม่เอง
7. **กด Merge pull request** เว็บจะ deploy เองใน 2–3 นาที และ branch จะถูกลบให้อัตโนมัติ

---

## วิธี B: เขียนบนเครื่องตัวเอง (ดูตัวอย่างก่อนอัปได้)

ต้องมี Node 20.19+ และ git ทำครั้งแรกครั้งเดียว:

```bash
git clone https://github.com/watkorn/watkorn.me.git
cd watkorn.me
npm install
```

ทุกครั้งที่เขียนโพสต์ใหม่:

```bash
# 1. เริ่มจาก main ล่าสุด แล้วแตก branch ใหม่
git checkout main
git pull
git checkout -b post/baby-rop

# 2. สร้างไฟล์จากแม่แบบ (writeup CTF) หรือไม่ใส่ --writeup สำหรับโพสต์ทั่วไป
npm run new-post -- --writeup "Baby ROP"
#    -> content/blogs/baby-rop.md (เป็น draft อยู่)

# 3. ดูตัวอย่างสด เปิด http://localhost:3000 (draft จะเห็นเฉพาะในเครื่อง)
npm start

# 4. เขียนเสร็จ: ลบบรรทัด draft: true แล้วเช็กว่า build ผ่าน
npm run build

# 5. ส่งขึ้น GitHub
git add content/blogs/baby-rop.md public/images/blogs/
git commit -m "Post: Baby ROP"
git push -u origin post/baby-rop
```

จากนั้นเปิด https://github.com/watkorn/watkorn.me จะมีแถบสีเหลือง **Compare & pull request** กดแล้ว **Create pull request** → รอ ✅ → **Merge** (เหมือนข้อ 6–7 ของวิธี A)

ถ้าอยากรันทดสอบแบบเดียวกับ CI ก่อนส่ง: `npx playwright install chromium` (ครั้งแรกครั้งเดียว) แล้ว `npm test`

---

## แม่แบบ frontmatter

ทุกไฟล์ต้องขึ้นต้นด้วยส่วนนี้ (ระหว่างเส้น `---`):

```markdown
---
title: Baby ROP
description: "สรุปหนึ่งบรรทัด ขึ้นในหน้ารายการและตอนแชร์ลิงก์"
date: 2026-10-13
event: "Some CTF 2026"   # ไม่บังคับ ใช้กับ writeup
category: pwn            # ไม่บังคับ: web | pwn | crypto | forensics | rev | osint | misc
difficulty: easy         # ไม่บังคับ: easy | medium | hard | insane
tags: [ctf, rop]
draft: true              # ลบบรรทัดนี้เมื่อพร้อมเผยแพร่
---

เนื้อหาเริ่มตรงนี้
```

| ช่อง | บังคับ? | หมายเหตุ |
|---|---|---|
| `title` | ✅ | ชื่อเรื่อง |
| `date` | ✅ | รูปแบบ `YYYY-MM-DD` เช่น `2026-10-13` (ค.ศ.) |
| `description` | แนะนำ | ใช้ในหน้ารายการ ผลค้นหา และรูปพรีวิวลิงก์ |
| `tags` | แนะนำ | ใช้กรองในหน้าบล็อก ตัวเล็กทั้งหมด เช่น `[ctf, web]` |
| `category`, `difficulty`, `event` | ไม่บังคับ | ขึ้นเป็นป้ายสี และทำให้โพสต์นับเป็น writeup |
| `draft: true` | — | มีบรรทัดนี้ = ไม่ขึ้นเว็บจริง (แต่ repo เป็น public คนยังอ่านไฟล์บน GitHub ได้) |

## เขียนเนื้อหา: ทริกที่ใช้บ่อย

- **หัวข้อ** ใช้ `##` (และ `###` สำหรับหัวข้อย่อย) ถ้ามีตั้งแต่ 3 หัวข้อ `##` ขึ้นไป จะมีสารบัญ "ในหน้านี้" ให้เอง และทุกหัวข้อจะมีลิงก์ `#` ไว้แชร์
- **โค้ด** ใส่ชื่อภาษาหลัง ``` เพื่อให้มีสี เช่น ```` ```bash ```` หรือ ```` ```python ```` ทุกกล่องโค้ดมีปุ่ม Copy ให้อัตโนมัติ
- **รูป** `![คำอธิบายรูป](/images/blogs/ชื่อรูป.png)` เขียนคำอธิบายทุกครั้ง (คนใช้ screen reader อ่านจากตรงนี้)
- **ซ่อนเฉลย / flag** ใช้ `<details>`:

  ```markdown
  <details>
  <summary>ดู flag</summary>

  `flag{...}`

  </details>
  ```

- **ลิงก์ภายในเว็บ** ขึ้นต้นด้วย `/` เช่น `[หน้าความสำเร็จ](/achievements)` (ฉบับไทยใช้ `/th/achievements`)
- **เช็กลิสต์** `- [ ] ยังไม่ทำ` / `- [x] ทำแล้ว`

## ฉบับภาษาไทย (ไม่บังคับ)

โพสต์ภาษาไทยคือไฟล์ชื่อเดียวกันแต่ลงท้าย `.th.md` วางคู่กัน:

```
content/blogs/baby-rop.md      -> https://watkorn.me/blogs/baby-rop/
content/blogs/baby-rop.th.md   -> https://watkorn.me/th/blogs/baby-rop/
```

- ไฟล์ `.th.md` ใส่แค่ `title` กับ `description` ภาษาไทยก็พอ วันที่ แท็ก หมวด ใช้ของต้นฉบับอัตโนมัติ
- บนเครื่อง: `npm run new-post -- --th baby-rop` จะก๊อปต้นฉบับมาให้แปลเลย
- ยังไม่แปลก็ได้ หน้าไทยจะแสดงต้นฉบับพร้อมบอกว่ายังไม่มีฉบับไทย
- จะเขียนภาษาไทยอย่างเดียวก็ได้: สร้างแค่ `baby-rop.th.md` (ชื่อไฟล์ยังต้องเป็นภาษาอังกฤษ)

## แก้หรือลบโพสต์เก่า

- **แก้:** เปิดไฟล์บน GitHub → ไอคอนดินสอ ✏️ → แก้ → **Commit changes…** → เลือก **Create a new branch… and start a pull request** → รอ ✅ → Merge
- **ลบ:** เปิดไฟล์ → เมนู ⋯ → **Delete file** → ส่งเป็น PR เหมือนกัน (ถ้ามี `.th.md` ลบคู่กันด้วย)
- **ห้ามเปลี่ยนชื่อไฟล์โพสต์ที่เผยแพร่แล้ว** เพราะ URL จะเปลี่ยน ลิงก์ที่คนแชร์ไว้จะเสีย

## เช็กว่าขึ้นเว็บแล้ว

1. หลังกด Merge ไปที่ https://github.com/watkorn/watkorn.me/actions จะมี **Deploy to GitHub Pages** กำลังรัน รอจนเป็น ✅
2. เปิด `https://watkorn.me/blogs/<ชื่อไฟล์>/`
3. ยังเห็นของเก่า? กด **Ctrl+F5** หรือ Cloudflare → Caching → **Purge Everything**
4. แชร์ลิงก์ใน LINE/Discord แล้วรูปพรีวิวยังเป็นของเก่า? รอสักพัก แอปพวกนี้จำพรีวิวไว้ระยะหนึ่ง

## แก้ปัญหาที่เจอบ่อย

ถ้า CI ขึ้น ❌ กด **Details** ข้าง `test` แล้วดูบรรทัดที่ขึ้นต้นด้วย `[content]`:

| ข้อความ | แก้ยังไง |
|---|---|
| `"date" ต้องอยู่ในรูปแบบ YYYY-MM-DD` | ใส่วันที่แบบ `2026-10-13` (ค.ศ. เดือนและวันมีเลข 0 นำหน้า) |
| `ชื่อไฟล์ต้องเป็น a-z, 0-9 และ - เท่านั้น` | เปลี่ยนชื่อไฟล์ เช่น `My Post.md` → `my-post.md` |
| `ต้องมี "title" ใน frontmatter` | เพิ่มบรรทัด `title:` และเช็กว่ามีเส้น `---` ครบทั้งบนและล่าง |
| โพสต์ไม่ขึ้นเว็บ แต่ CI ผ่าน | ยังมีบรรทัด `draft: true` อยู่ ลบออกแล้วส่ง PR ใหม่ |
| รูปไม่ขึ้น | เช็กว่าไฟล์อยู่ใน `public/images/blogs/` และ path ในโพสต์ขึ้นต้นด้วย `/images/blogs/` ตัวพิมพ์เล็กใหญ่ต้องตรงกัน |
| frontmatter พังเพราะมี `:` ในชื่อเรื่อง | ครอบด้วยเครื่องหมายคำพูด เช่น `title: "Writeup: Baby ROP"` |

ติดตรงไหนส่ง PR มาก่อนได้เลย หรือส่งไฟล์ Markdown มาให้ Claude ช่วยเกลา แปล และเปิด PR ให้

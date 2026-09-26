---
title: เว็บไซต์ของผม
description: "watkorn.me: พอร์ตโฟลิโอแบบ static ที่ปิดช่องโหว่จนได้ A+ และเป็น CTF จิ๋วไปในตัว สร้าง ป้องกัน และปล่อยขึ้นเว็บยังไง"
screenshots:
  - src: /screenshot_light.png
    alt: หน้าแรกในธีมสว่าง มีเยติพิกเซล คำท้า "find the flags." และ terminal จอ LCD
    label: ธีมสว่าง
  - src: /screenshot_dark.png
    alt: หน้าแรกในธีมมืด บอดี้เครื่องสีองุ่นกับ terminal ที่มีไฟ backlight
    label: ธีมมืด
---

เว็บนี้คือบ้านของ writeup CTF และโปรเจกต์ข้างเคียงของผม และตัวมันเองก็เป็นโจทย์ด้วย หน้าแรกคือ terminal ที่มี **flag ซ่อนอยู่ 8 อัน** ทั่วเว็บ ถ้าคุณเป็นสาย security วิธีรู้จักผมที่เร็วที่สุดคือลองเจาะเว็บผมดู

## เป้าหมาย

1. **เล่นก่อน อ่านทีหลัง จ้างงานเป็นอย่างสุดท้าย** terminal คือประตูหน้า ตามด้วย writeup แล้วค่อยเป็นผลงานกับช่องทางติดต่อ
2. **เขียนโพสต์ต้องไม่ต้องไปแตะโค้ด layout** writeup หนึ่งเรื่อง = ไฟล์ Markdown หนึ่งไฟล์กับ `git push` หนึ่งครั้ง
3. **ลดพื้นที่ให้โจมตีให้ใกล้ศูนย์ที่สุด** ไม่มีเซิร์ฟเวอร์ ไม่มีฐานข้อมูล ไม่มี script จากบุคคลที่สาม

## ทำงานยังไง

```
content/*.md  ─▶  scripts/content.mjs  ─▶  JSON  ─▶  Vite + React
                                                   │
                     prerender every route to HTML ◀┘  (+ sitemap, RSS, CSP)
                                                   │
          GitHub Actions: build → Playwright tests → publish to gh-pages
                                                   │
                  GitHub Pages  ◀──  Cloudflare (TLS, HSTS, security headers)
```

- **เนื้อหา:** โพสต์บล็อกและผลงานเป็น Markdown ที่มี frontmatter ตอน build [marked](https://marked.js.org/) กับ highlight.js จะแปลงเป็น HTML ให้ เลยไม่ต้องส่งตัว parse Markdown ไปที่เบราว์เซอร์ โพสต์ draft เห็นตอน dev แต่ไม่ขึ้น production
- **สองภาษา:** ทุกหน้ามีทั้งภาษาอังกฤษที่ `/` และภาษาไทยที่ `/th/` ฉบับแปลของโพสต์คือไฟล์ `ชื่อโพสต์.th.md` วางคู่กับต้นฉบับ ถ้ายังไม่ได้แปล หน้าภาษาไทยจะแสดงต้นฉบับพร้อมบอกไว้ และใส่ `hreflang` ให้ search engine รู้ว่าหน้าไหนคู่กัน
- **หน้าเว็บ:** React 19 + React Router 7 บน Vite ทุก route ถูก **prerender เป็นไฟล์ HTML ของตัวเอง** โพสต์เลยถูก index ได้ และลิงก์พรีวิวใน Discord หรือ LINE ก็ขึ้นชื่อเรื่องกับรูปจริง จากนั้น React ค่อยรับช่วงส่วนที่ต้อง interactive
- **การ deploy:** ทุกครั้งที่ push ขึ้น `main` จะ build เว็บแล้วรัน **Playwright smoke test ทั้งบนเดสก์ท็อปและมือถือ** ผ่านเมื่อไหร่ถึงจะ publish ไฟล์ static ไปที่ branch `gh-pages` test พังหนึ่งข้อ = เว็บจริงไม่เปลี่ยน

## ความปลอดภัย

เป็นเว็บของคนสาย security ก็ต้องรับมือได้หน่อย:

- **ได้ A+ บน [securityheaders.com](https://securityheaders.com/?q=watkorn.me&followRedirects=on)** Cloudflare ใส่ HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` และ COOP ที่ GitHub Pages ส่งเองไม่ได้
- **Content-Security-Policy แบบเข้มงวด** ทุกหน้า: `script-src 'self'` และ `style-src` ที่ไม่มี `'unsafe-inline'` คือไม่มีทั้ง inline script **และ** inline style และมี test ที่ทำให้ build ล้มถ้าหน้าไหนละเมิด CSP
- **ไม่มี source map บน production**
- **dependency ที่มีช่องโหว่เป็นศูนย์:** ย้ายจาก Create React App ไป Vite ทำให้ `npm audit` ลดจาก 62 รายการเหลือ 0 Dependabot คอยรักษาไว้ และ GitHub Action ทุกตัวถูก pin ไว้ที่ commit SHA
- **ไม่เคย render สิ่งที่ผู้เข้าชมพิมพ์เป็น HTML** Markdown ทั้งหมด render ตอน build จากไฟล์ใน repo

## CTF ข้างใน

terminal พูดภาษา shell ได้นิดหน่อย: `ls -la`, `cd`, `cat`, `open <post>`, `hint`, `submit <flag>` มีประวัติคำสั่งและเติมคำด้วย Tab มี 8 ด่านใน 2 ซีซัน (10 ถึง 80 แต้ม) ซ่อนไว้ในจุดที่ผู้เล่นควรหัดมอง flag ตรวจด้วย **SHA-256 hash อย่างเดียว** อ่าน JavaScript ไปก็ไม่ได้คำตอบ ความคืบหน้าอยู่ที่[หน้าความสำเร็จ](/th/achievements) เก็บไว้แค่ในเบราว์เซอร์ของคุณ

มี test ยืนยันว่าทุก flag หาเจอได้จริงบนเว็บที่ build แล้วและตรงกับ hash ผมจะได้ไม่เผลอปล่อยด่านที่แก้ไม่ได้ออกไป

## ดีไซน์: Handheld Quest

หน้าตาคือเครื่องเกมพกพา ตัวหน้าเว็บคือบอดี้พลาสติกของเครื่อง: เหลืองดอกแดนดิไลออนตอนกลางวัน สีองุ่นตอนกลางคืน เนื้อหาอยู่บน "จอ" ที่มีมุมโค้งใหญ่ด้านล่างขวาแบบเครื่องเกม terminal คือจอ LCD และทุกปุ่มเป็นปุ่มยางที่กดยุบลงไปจริง

มาสคอตคือ **เยติพิกเซลขนาด 32×32** ที่วาดด้วยโค้ด มี 8 เลเยอร์ที่เปลี่ยนสีได้ ท่าเดิน 2 เฟรม และ Logo Lab สำหรับ export ในพาเลตต์ไหนก็ได้ ทุกอย่างมาจาก design token ชุดเดียว ทั้งสองธีมเลยไปในทางเดียวกัน ใช้งานได้ตั้งแต่มือถือจอ 320 px ขึ้นไป ผมใช้ design skill อย่าง [Hallmark](https://github.com/Nutlope/hallmark) และ [Impeccable](https://github.com/pbakaus/impeccable) เพื่อหนีหน้าตา "พอร์ตโฟลิโอที่ AI ทำ" แบบเดิมๆ

## ตัวเลข

- Lighthouse (รันบนเครื่อง): **Performance 97 · Accessibility 100 · SEO 100**
- JavaScript หลัง gzip ประมาณ **82 KB** เนื้อหาแต่ละโพสต์โหลดเป็น chunk เล็กๆ ของตัวเอง
- เยติพิกเซล: sprite ทั้งสองเฟรมรวม **8 KB** ไอคอนทุกไฟล์ต่ำกว่า 10 KB

## สิ่งที่ได้เรียนรู้

- **prerender ชนะ SPA สำหรับเว็บเนื้อหา** URL แบบ hash มองไม่เห็นทั้งใน search engine และลิงก์พรีวิว
- **CSP แบบเข้มงวดคุ้มค่า** การตัด `'unsafe-inline'` ทำให้เจอ inline style สองจุดที่ซ่อนอยู่ใน HTML ที่ prerender ไว้ และตอนนี้มี test คอยกันไม่ให้มันกลับมา
- **ของสนุกก็ต้องมี test** ด่าน CTF ที่แก้ไม่ได้ถือเป็นบั๊ก

## Stack

React 19 · React Router 7 · Vite · Tailwind CSS 4 · marked · highlight.js · Playwright · Lighthouse CI · GitHub Actions · GitHub Pages · Cloudflare

โค้ดเปิดให้ดูบน GitHub (ลิงก์ด้านล่าง) เจออะไรก็บอกได้เลย หรือจะดีกว่านั้น หา flag ให้เจอก่อน

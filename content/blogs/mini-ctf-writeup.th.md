---
title: "Writeup: mini CTF ของ watkorn.me"
description: "เฉลยครบทั้ง 5 flag ที่ซ่อนอยู่ในเว็บนี้: dotfile, view-source, robots.txt และเยติที่มีความลับ สปอยล์แน่นอนอยู่แล้ว"
---

> **เตือนสปอยล์** โพสต์นี้เฉลยทุกด่านของ mini CTF ในเว็บนี้ ถ้ายังไม่ได้ลองเล่น ไปที่[หน้าแรก](/th/) พิมพ์ `ls` แล้วค่อยกลับมาตอนติด คำใบ้ดูฟรีได้ที่[หน้าความสำเร็จ](/th/achievements) ส่วนตัว flag พับซ่อนไว้ใต้แต่ละด่าน อ่านวิธีคิดได้โดยไม่เห็นคำตอบ

mini CTF มีทั้งหมด 5 ด่าน ด่านละ 10 ถึง 50 แต้ม (รวม 150) terminal ตรวจคำตอบด้วยคำสั่ง `submit <flag>` และมันรู้แค่ **SHA-256 hash** ของ flag เท่านั้น คำตอบจึงไม่ได้วางเป็น plain text อยู่ใน JavaScript ก็... ส่วนใหญ่อ่ะนะ ไปกันเลย

## ด่าน 1: วอร์มอัพ (10 แต้ม)

*"มีไฟล์วางทิ้งไว้ในโฟลเดอร์ home"*

ท่าแรกสุดคลาสสิกของทุก shell คือมองไปรอบๆ:

```bash
watkorn@me:~$ ls
flag.txt  README.md
watkorn@me:~$ cat flag.txt
```

จบ ด่านวอร์มอัพคือไฟล์ชื่อ `flag.txt` ตรงตัวเลย แถมยังมีทางลับอีกทาง: `echo` ข้อความที่มีคำว่า "flag" ก็พิมพ์ flag ออกมาเหมือนกัน

<details>
<summary>ดู flag</summary>

`my_w3b_is_c00ler_th4n_u_th1nk`

</details>

**บทเรียน:** สำรวจให้ครบก่อนจะทำอะไรเท่ๆ เสมอ `ls`, `cat`, `file`, `strings`

## ด่าน 2: ซ่อนไว้ต่อหน้าต่อตา (20 แต้ม)

*"ls แสดงไฟล์ แต่ ls -la แสดงทุกไฟล์"*

บน Linux ไฟล์ที่ขึ้นต้นด้วยจุดจะไม่โผล่ตอนสั่ง `ls` เฉยๆ ต้องเติม `-a` (all) และ `-l` (long):

```bash
watkorn@me:~$ ls -la
drwxr-xr-x 3 watkorn users 4096 Oct 8 2025 .
drwxr-xr-x 3 watkorn users 4096 Oct 8 2025 ..
drwx------ 2 watkorn users 4096 Oct 8 2025 .secret
-rw-r--r-- 1 watkorn users   67 Oct 8 2025 flag.txt
-rw-r--r-- 1 watkorn users  123 Oct 8 2025 README.md
watkorn@me:~$ cd .secret
watkorn@me:~/.secret$ cat note.b64
d2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9
```

นามสกุล `.b64` ฟ้องชัด: มีแต่ตัวอักษรกับตัวเลข และความยาวหารด้วย 4 ลงตัว ร้องตะโกนว่า **Base64** เอาไป decode ที่ไหนก็ได้ยกเว้น terminal ของเว็บนี้:

```bash
echo 'd2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9' | base64 -d
```

หรือใช้ [CyberChef](https://gchq.github.io/CyberChef/) กับ operation "From Base64"

<details>
<summary>ดู flag</summary>

`watkorn{d0tf1l3s_4r3_n0t_s3cr3ts}`

</details>

**บทเรียน:** Base64 คือ **encoding ไม่ใช่ encryption** ใครก็ย้อนกลับได้ ไม่ต้องมีกุญแจ และ dotfile ที่ "ซ่อน" อยู่ก็ซ่อนอะไรไม่ได้เลยจากคนที่พิมพ์ `-a` เป็น

## ด่าน 3: ดูซอร์สโค้ด (30 แต้ม)

*"หน้าที่เห็นไม่ใช่ทั้งหมดของหน้าเว็บ"*

สิ่งที่เบราว์เซอร์แสดงเป็นแค่ส่วนหนึ่งของสิ่งที่เซิร์ฟเวอร์ส่งมา เปิด HTML ดิบๆ ด้วย **Ctrl+U** (หรือ `view-source:https://watkorn.me/`) หรือดึงมาดูเลย:

```bash
curl -s https://watkorn.me/ | grep -i "note to self"
```

แถวๆ ต้น `<body>` มี HTML comment อยู่:

```html
<!-- note to self (level 3): jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}  ·  rot13, obviously -->
```

มันบอกวิธีเข้ารหัสมาให้ด้วยซ้ำ ROT13 เลื่อนตัวอักษรแต่ละตัวไป 13 ตำแหน่ง ทำซ้ำสองรอบก็กลับมาที่เดิม:

```bash
echo 'jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}' | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

ตัวเลขกับสัญลักษณ์ไม่ถูกแตะเลย `{`, `_` และตัวเลขแบบ leetspeak เลยรอดมาครบ

<details>
<summary>ดู flag</summary>

`watkorn{v13w_s0urc3_b3f0r3_y0u_h4ck}`

</details>

**บทเรียน:** comment หลุดขึ้น production บ่อยกว่าที่คิด ในโจทย์ web จริง (และ bug bounty จริง) ให้อ่าน source, JavaScript bundle และ HTML comment ก่อนเป็นอย่างแรก

## ด่าน 4: สำหรับหุ่นยนต์เท่านั้น (40 แต้ม)

*"crawler ที่มีมารยาทจะอ่านไฟล์หนึ่งก่อนเสมอ ลองทำตัวไม่มีมารยาทดู"*

ไฟล์นั้นคือ `/robots.txt` คำขอร้องแบบสุภาพถึง search engine ว่าอย่าเก็บหน้าไหนเข้า index:

```bash
curl -s https://watkorn.me/robots.txt
```

```
User-agent: *
Disallow: /y3t1-l41r/
```

"ช่วยอย่าไปดู /y3t1-l41r/ นะ" ก็คือคำเชิญดีๆ นี่เอง เข้าไปที่[ถ้ำของเยติ](/y3t1-l41r/) แล้วจะเจอกำแพง byte: `77 61 74 6b 6f 72 6e 7b …` นั่นคือ **hex** ตัวอักษรทุกคู่คือหนึ่ง byte และ `77 61 74` ก็คือ `wat` แปลงกลับได้แบบนี้:

```bash
echo '77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d' | xxd -r -p
```

ไม่มี `xxd`? ใช้ Python ได้ทุกที่ (หรือ "From Hex" ใน CyberChef ก็ได้):

```bash
python3 -c "print(bytes.fromhex('77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d').decode())"
```

<details>
<summary>ดู flag</summary>

`watkorn{r0b0ts_txt_1s_4_tr34sur3_m4p}`

</details>

**บทเรียน:** `robots.txt` **ไม่ใช่ access control** มันคือรายชื่อ path ที่มีคนอยากซ่อนพอดี เลยเป็นหนึ่งในไฟล์แรกๆ ที่ต้องเช็กในทุกโจทย์ web และทุกการทำ recon

## ด่าน 5: ความลับในพิกเซล (50 แต้ม)

*"เยติคือไฟล์ SVG ลองเปิดไฟล์นั้นแยกออกมา แล้วมองให้ลึกกว่าพิกเซล"*

เยติพิกเซลไม่ได้เป็นแท็กรูปภาพ มันวาดจาก SVG sprite ลองเปิด DevTools (**F12 → Elements**) แล้ว inspect ตัวเยติ จะเจอประมาณนี้:

```html
<use href="/assets/yeti-XXXXXXXX.svg#yeti"></use>
```

(ส่วนหลัง `yeti-` คือ content hash ของคุณอาจไม่ตรงกับนี้) เปิดไฟล์ SVG นั้นในแท็บใหม่แล้วดู source SVG ก็คือ XML ธรรมดา และข้างๆ ภาพวาดมี element `<metadata>` ที่เบราว์เซอร์ไม่เคยแสดงผล:

```xml
<metadata>yeti-says: d2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==</metadata>
```

`==` ที่ต่อท้ายคือ padding ของ Base64 อีกแล้ว:

```bash
echo 'd2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==' | base64 -d
```

สายบรรทัดคำสั่ง ไม่ต้องเปิด DevTools:

```bash
js=$(curl -s https://watkorn.me/ | grep -o '/assets/index-[^"]*\.js')
svg=$(curl -s "https://watkorn.me$js" | grep -o '/assets/yeti-[^"`]*\.svg' | head -1)
curl -s "https://watkorn.me$svg" | grep -o 'yeti-says: [^<]*'
```

<details>
<summary>ดู flag</summary>

`watkorn{p1x3ls_c4n_h1d3_st4ff_t00}`

</details>

**บทเรียน:** รูปภาพพกข้อมูลได้ SVG เป็นไฟล์ข้อความที่ใส่ metadata, comment หรือแม้แต่ script ได้ เว็บจริงจึงต้อง sanitise SVG ที่ผู้ใช้อัปโหลด และโจทย์ steganography ก็ชอบไฟล์รูปด้วยเหตุผลนี้

## ระบบตรวจทำงานยังไง (และข้อจำกัด)

- terminal เอาสิ่งที่คุณ `submit` ไป hash ด้วย SHA-256 ในเบราว์เซอร์ของคุณเอง (`crypto.subtle.digest`) แล้วเทียบกับ hash ทั้ง 5 ที่เก็บไว้ hash เปิดเผยได้ แต่ย้อนกลับเป็น flag ไม่ได้
- ความคืบหน้าเก็บไว้ใน `localStorage` ของเบราว์เซอร์คุณ ไม่มีอะไรถูกส่งไปเซิร์ฟเวอร์ เพราะไม่มีเซิร์ฟเวอร์ให้ส่ง
- ข้อจำกัดตรงๆ: flag ข้อ 1 และ 2 ต้องอยู่ใน JavaScript เพราะ terminal เป็นคนพิมพ์มันออกมา และทั้งเว็บเป็น [open source](https://github.com/watkorn/watkorn.me) การไปอ่าน repo เลยเป็นกลยุทธ์ที่ใช้ได้ แม้จะแอบขี้โกงนิดๆ สำหรับ CTF วอร์มอัพ นี่ถือเป็นฟีเจอร์

## mini CTF นี้สอนอะไร

| ด่าน | เทคนิค | ในโลกจริง |
|---|---|---|
| 1 | สำรวจก่อน | `ls`, `strings`, อ่านทุกไฟล์ที่ได้มา |
| 2 | ไฟล์ซ่อน + Base64 | dotfile, `.git/`, ค่า config ที่ถูก encode |
| 3 | view source + ROT13 | comment ที่หลุด, secret ใน JS bundle |
| 4 | robots.txt + hex | recon ที่ `robots.txt`, `sitemap.xml`, `.well-known/` |
| 5 | metadata ของไฟล์ | ข้อมูล EXIF, metadata ใน SVG/Office, steganography |

เจอครบทั้ง 5 แล้ว? แคปหน้า[ความสำเร็จ](/th/achievements)แล้วแท็กมาเลย รอบหน้าจะทำให้ยากกว่านี้

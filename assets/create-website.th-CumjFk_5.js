var e={html:`<p>เว็บนี้คือบ้านของ writeup CTF และโปรเจกต์ข้างเคียงของผม และตัวมันเองก็เป็นโจทย์ด้วย หน้าแรกคือ terminal ที่มี <strong>flag ซ่อนอยู่ 5 อัน</strong> ทั่วเว็บ ถ้าคุณเป็นสาย security วิธีรู้จักผมที่เร็วที่สุดคือลองเจาะเว็บผมดู</p>
<h2>เป้าหมาย</h2>
<ol>
<li><strong>เล่นก่อน อ่านทีหลัง จ้างงานเป็นอย่างสุดท้าย</strong> terminal คือประตูหน้า ตามด้วย writeup แล้วค่อยเป็นผลงานกับช่องทางติดต่อ</li>
<li><strong>เขียนโพสต์ต้องไม่ต้องไปแตะโค้ด layout</strong> writeup หนึ่งเรื่อง = ไฟล์ Markdown หนึ่งไฟล์กับ <code>git push</code> หนึ่งครั้ง</li>
<li><strong>ลดพื้นที่ให้โจมตีให้ใกล้ศูนย์ที่สุด</strong> ไม่มีเซิร์ฟเวอร์ ไม่มีฐานข้อมูล ไม่มี script จากบุคคลที่สาม</li>
</ol>
<h2>ทำงานยังไง</h2>
<pre><code class="hljs">content/*.md  ─▶  scripts/content.mjs  ─▶  JSON  ─▶  Vite + React
                                                   │
                     prerender every route to HTML ◀┘  (+ sitemap, RSS, CSP)
                                                   │
          GitHub Actions: build → Playwright tests → publish to gh-pages
                                                   │
                  GitHub Pages  ◀──  Cloudflare (TLS, HSTS, security headers)
</code></pre><ul>
<li><strong>เนื้อหา:</strong> โพสต์บล็อกและผลงานเป็น Markdown ที่มี frontmatter ตอน build <a href="https://marked.js.org/" target="_blank" rel="noopener noreferrer">marked</a> กับ highlight.js จะแปลงเป็น HTML ให้ เลยไม่ต้องส่งตัว parse Markdown ไปที่เบราว์เซอร์ โพสต์ draft เห็นตอน dev แต่ไม่ขึ้น production</li>
<li><strong>สองภาษา:</strong> ทุกหน้ามีทั้งภาษาอังกฤษที่ <code>/</code> และภาษาไทยที่ <code>/th/</code> ฉบับแปลของโพสต์คือไฟล์ <code>ชื่อโพสต์.th.md</code> วางคู่กับต้นฉบับ ถ้ายังไม่ได้แปล หน้าภาษาไทยจะแสดงต้นฉบับพร้อมบอกไว้ และใส่ <code>hreflang</code> ให้ search engine รู้ว่าหน้าไหนคู่กัน</li>
<li><strong>หน้าเว็บ:</strong> React 19 + React Router 7 บน Vite ทุก route ถูก <strong>prerender เป็นไฟล์ HTML ของตัวเอง</strong> โพสต์เลยถูก index ได้ และลิงก์พรีวิวใน Discord หรือ LINE ก็ขึ้นชื่อเรื่องกับรูปจริง จากนั้น React ค่อยรับช่วงส่วนที่ต้อง interactive</li>
<li><strong>การ deploy:</strong> ทุกครั้งที่ push ขึ้น <code>main</code> จะ build เว็บแล้วรัน <strong>Playwright smoke test ทั้งบนเดสก์ท็อปและมือถือ</strong> ผ่านเมื่อไหร่ถึงจะ publish ไฟล์ static ไปที่ branch <code>gh-pages</code> test พังหนึ่งข้อ = เว็บจริงไม่เปลี่ยน</li>
</ul>
<h2>ความปลอดภัย</h2>
<p>เป็นเว็บของคนสาย security ก็ต้องรับมือได้หน่อย:</p>
<ul>
<li><strong>ได้ A+ บน <a href="https://securityheaders.com/?q=watkorn.me&amp;followRedirects=on" target="_blank" rel="noopener noreferrer">securityheaders.com</a></strong> Cloudflare ใส่ HSTS, <code>X-Frame-Options</code>, <code>Referrer-Policy</code>, <code>Permissions-Policy</code> และ COOP ที่ GitHub Pages ส่งเองไม่ได้</li>
<li><strong>Content-Security-Policy แบบเข้มงวด</strong> ทุกหน้า: <code>script-src &#39;self&#39;</code> และ <code>style-src</code> ที่ไม่มี <code>&#39;unsafe-inline&#39;</code> คือไม่มีทั้ง inline script <strong>และ</strong> inline style และมี test ที่ทำให้ build ล้มถ้าหน้าไหนละเมิด CSP</li>
<li><strong>ไม่มี source map บน production</strong></li>
<li><strong>dependency ที่มีช่องโหว่เป็นศูนย์:</strong> ย้ายจาก Create React App ไป Vite ทำให้ <code>npm audit</code> ลดจาก 62 รายการเหลือ 0 Dependabot คอยรักษาไว้ และ GitHub Action ทุกตัวถูก pin ไว้ที่ commit SHA</li>
<li><strong>ไม่เคย render สิ่งที่ผู้เข้าชมพิมพ์เป็น HTML</strong> Markdown ทั้งหมด render ตอน build จากไฟล์ใน repo</li>
</ul>
<h2>CTF ข้างใน</h2>
<p>terminal พูดภาษา shell ได้นิดหน่อย: <code>ls -la</code>, <code>cd</code>, <code>cat</code>, <code>open &lt;post&gt;</code>, <code>hint</code>, <code>submit &lt;flag&gt;</code> มีประวัติคำสั่งและเติมคำด้วย Tab มี 5 ด่าน (10 ถึง 50 แต้ม) ซ่อนไว้ในจุดที่ผู้เล่นควรหัดมอง flag ตรวจด้วย <strong>SHA-256 hash อย่างเดียว</strong> อ่าน JavaScript ไปก็ไม่ได้คำตอบ ความคืบหน้าอยู่ที่<a href="/th/achievements">หน้าความสำเร็จ</a> เก็บไว้แค่ในเบราว์เซอร์ของคุณ</p>
<p>มี test ยืนยันว่าทุก flag หาเจอได้จริงบนเว็บที่ build แล้วและตรงกับ hash ผมจะได้ไม่เผลอปล่อยด่านที่แก้ไม่ได้ออกไป</p>
<h2>ดีไซน์: Handheld Quest</h2>
<p>หน้าตาคือเครื่องเกมพกพา ตัวหน้าเว็บคือบอดี้พลาสติกของเครื่อง: เหลืองดอกแดนดิไลออนตอนกลางวัน สีองุ่นตอนกลางคืน เนื้อหาอยู่บน &quot;จอ&quot; ที่มีมุมโค้งใหญ่ด้านล่างขวาแบบเครื่องเกม terminal คือจอ LCD และทุกปุ่มเป็นปุ่มยางที่กดยุบลงไปจริง</p>
<p>มาสคอตคือ <strong>เยติพิกเซลขนาด 32×32</strong> ที่วาดด้วยโค้ด มี 8 เลเยอร์ที่เปลี่ยนสีได้ ท่าเดิน 2 เฟรม และ Logo Lab สำหรับ export ในพาเลตต์ไหนก็ได้ ทุกอย่างมาจาก design token ชุดเดียว ทั้งสองธีมเลยไปในทางเดียวกัน ใช้งานได้ตั้งแต่มือถือจอ 320 px ขึ้นไป ผมใช้ design skill อย่าง <a href="https://github.com/Nutlope/hallmark" target="_blank" rel="noopener noreferrer">Hallmark</a> และ <a href="https://github.com/pbakaus/impeccable" target="_blank" rel="noopener noreferrer">Impeccable</a> เพื่อหนีหน้าตา &quot;พอร์ตโฟลิโอที่ AI ทำ&quot; แบบเดิมๆ</p>
<h2>ตัวเลข</h2>
<ul>
<li>Lighthouse (รันบนเครื่อง): <strong>Performance 97 · Accessibility 100 · SEO 100</strong></li>
<li>JavaScript หลัง gzip ประมาณ <strong>82 KB</strong> เนื้อหาแต่ละโพสต์โหลดเป็น chunk เล็กๆ ของตัวเอง</li>
<li>เยติพิกเซล: sprite ทั้งสองเฟรมรวม <strong>8 KB</strong> ไอคอนทุกไฟล์ต่ำกว่า 10 KB</li>
</ul>
<h2>สิ่งที่ได้เรียนรู้</h2>
<ul>
<li><strong>prerender ชนะ SPA สำหรับเว็บเนื้อหา</strong> URL แบบ hash มองไม่เห็นทั้งใน search engine และลิงก์พรีวิว</li>
<li><strong>CSP แบบเข้มงวดคุ้มค่า</strong> การตัด <code>&#39;unsafe-inline&#39;</code> ทำให้เจอ inline style สองจุดที่ซ่อนอยู่ใน HTML ที่ prerender ไว้ และตอนนี้มี test คอยกันไม่ให้มันกลับมา</li>
<li><strong>ของสนุกก็ต้องมี test</strong> ด่าน CTF ที่แก้ไม่ได้ถือเป็นบั๊ก</li>
</ul>
<h2>Stack</h2>
<p>React 19 · React Router 7 · Vite · Tailwind CSS 4 · marked · highlight.js · Playwright · Lighthouse CI · GitHub Actions · GitHub Pages · Cloudflare</p>
<p>โค้ดเปิดให้ดูบน GitHub (ลิงก์ด้านล่าง) เจออะไรก็บอกได้เลย หรือจะดีกว่านั้น หา flag ให้เจอก่อน</p>
`};export{e as default};
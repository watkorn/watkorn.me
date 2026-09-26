var e={html:`<blockquote>
<p><strong>เตือนสปอยล์</strong> โพสต์นี้เฉลยทุกด่านของ mini CTF ในเว็บนี้ ถ้ายังไม่ได้ลองเล่น ไปที่<a href="/th/">หน้าแรก</a> พิมพ์ <code>ls</code> แล้วค่อยกลับมาตอนติด คำใบ้ดูฟรีได้ที่<a href="/th/achievements">หน้าความสำเร็จ</a> ส่วนตัว flag พับซ่อนไว้ใต้แต่ละด่าน อ่านวิธีคิดได้โดยไม่เห็นคำตอบ โพสต์นี้เฉลยแค่<strong>ซีซัน 1</strong> (ด่าน 1–5) ซีซัน 2 (ด่าน 6–8) ยังเปิดเล่นอยู่ เลยยังไม่มีเฉลยตรงนี้</p>
</blockquote>
<p>ซีซัน 1 มี 5 ด่าน ด่านละ 10 ถึง 50 แต้ม (รวม 150 จากทั้งหมด 360) terminal ตรวจคำตอบด้วยคำสั่ง <code>submit &lt;flag&gt;</code> และมันรู้แค่ <strong>SHA-256 hash</strong> ของ flag เท่านั้น คำตอบจึงไม่ได้วางเป็น plain text อยู่ใน JavaScript ก็... ส่วนใหญ่อ่ะนะ ไปกันเลย</p>
<h2 id="ด่าน-1-วอร์มอัพ-10-แต้ม">ด่าน 1: วอร์มอัพ (10 แต้ม)<a class="heading-anchor" href="#ด่าน-1-วอร์มอัพ-10-แต้ม" aria-label="ลิงก์ไปหัวข้อนี้: ด่าน 1: วอร์มอัพ (10 แต้ม)">#</a></h2>
<p><em>&quot;มีไฟล์วางทิ้งไว้ในโฟลเดอร์ home&quot;</em></p>
<p>ท่าแรกสุดคลาสสิกของทุก shell คือมองไปรอบๆ:</p>
<pre><code class="hljs language-bash">watkorn@me:~$ <span class="hljs-built_in">ls</span>
flag.txt  README.md
watkorn@me:~$ <span class="hljs-built_in">cat</span> flag.txt
</code></pre><p>จบ ด่านวอร์มอัพคือไฟล์ชื่อ <code>flag.txt</code> ตรงตัวเลย แถมยังมีทางลับอีกทาง: <code>echo</code> ข้อความที่มีคำว่า &quot;flag&quot; ก็พิมพ์ flag ออกมาเหมือนกัน</p>
<details>
<summary>ดู flag</summary><p><code>my_w3b_is_c00ler_th4n_u_th1nk</code></p>
</details><p><strong>บทเรียน:</strong> สำรวจให้ครบก่อนจะทำอะไรเท่ๆ เสมอ <code>ls</code>, <code>cat</code>, <code>file</code>, <code>strings</code></p>
<h2 id="ด่าน-2-ซ่อนไว้ต่อหน้าต่อตา-20-แต้ม">ด่าน 2: ซ่อนไว้ต่อหน้าต่อตา (20 แต้ม)<a class="heading-anchor" href="#ด่าน-2-ซ่อนไว้ต่อหน้าต่อตา-20-แต้ม" aria-label="ลิงก์ไปหัวข้อนี้: ด่าน 2: ซ่อนไว้ต่อหน้าต่อตา (20 แต้ม)">#</a></h2>
<p><em>&quot;ls แสดงไฟล์ แต่ ls -la แสดงทุกไฟล์&quot;</em></p>
<p>บน Linux ไฟล์ที่ขึ้นต้นด้วยจุดจะไม่โผล่ตอนสั่ง <code>ls</code> เฉยๆ ต้องเติม <code>-a</code> (all) และ <code>-l</code> (long):</p>
<pre><code class="hljs language-bash">watkorn@me:~$ <span class="hljs-built_in">ls</span> -la
drwxr-xr-x 3 watkorn <span class="hljs-built_in">users</span> 4096 Oct 8 2025 .
drwxr-xr-x 3 watkorn <span class="hljs-built_in">users</span> 4096 Oct 8 2025 ..
drwx------ 2 watkorn <span class="hljs-built_in">users</span> 4096 Oct 8 2025 .secret
-rw-r--r-- 1 watkorn <span class="hljs-built_in">users</span>   67 Oct 8 2025 flag.txt
-rw-r--r-- 1 watkorn <span class="hljs-built_in">users</span>  123 Oct 8 2025 README.md
watkorn@me:~$ <span class="hljs-built_in">cd</span> .secret
watkorn@me:~/.secret$ <span class="hljs-built_in">cat</span> note.b64
d2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9
</code></pre><p>นามสกุล <code>.b64</code> ฟ้องชัด: มีแต่ตัวอักษรกับตัวเลข และความยาวหารด้วย 4 ลงตัว ร้องตะโกนว่า <strong>Base64</strong> เอาไป decode ที่ไหนก็ได้ยกเว้น terminal ของเว็บนี้:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;d2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9&#x27;</span> | <span class="hljs-built_in">base64</span> -d
</code></pre><p>หรือใช้ <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener noreferrer">CyberChef</a> กับ operation &quot;From Base64&quot;</p>
<details>
<summary>ดู flag</summary><p><code>watkorn{d0tf1l3s_4r3_n0t_s3cr3ts}</code></p>
</details><p><strong>บทเรียน:</strong> Base64 คือ <strong>encoding ไม่ใช่ encryption</strong> ใครก็ย้อนกลับได้ ไม่ต้องมีกุญแจ และ dotfile ที่ &quot;ซ่อน&quot; อยู่ก็ซ่อนอะไรไม่ได้เลยจากคนที่พิมพ์ <code>-a</code> เป็น</p>
<h2 id="ด่าน-3-ดูซอร์สโค้ด-30-แต้ม">ด่าน 3: ดูซอร์สโค้ด (30 แต้ม)<a class="heading-anchor" href="#ด่าน-3-ดูซอร์สโค้ด-30-แต้ม" aria-label="ลิงก์ไปหัวข้อนี้: ด่าน 3: ดูซอร์สโค้ด (30 แต้ม)">#</a></h2>
<p><em>&quot;หน้าที่เห็นไม่ใช่ทั้งหมดของหน้าเว็บ&quot;</em></p>
<p>สิ่งที่เบราว์เซอร์แสดงเป็นแค่ส่วนหนึ่งของสิ่งที่เซิร์ฟเวอร์ส่งมา เปิด HTML ดิบๆ ด้วย <strong>Ctrl+U</strong> (หรือ <code>view-source:https://watkorn.me/</code>) หรือดึงมาดูเลย:</p>
<pre><code class="hljs language-bash">curl -s https://watkorn.me/ | grep -i <span class="hljs-string">&quot;note to self&quot;</span>
</code></pre><p>แถวๆ ต้น <code>&lt;body&gt;</code> มี HTML comment อยู่:</p>
<pre><code class="hljs language-html"><span class="hljs-comment">&lt;!-- note to self (level 3): jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}  ·  rot13, obviously --&gt;</span>
</code></pre><p>มันบอกวิธีเข้ารหัสมาให้ด้วยซ้ำ ROT13 เลื่อนตัวอักษรแต่ละตัวไป 13 ตำแหน่ง ทำซ้ำสองรอบก็กลับมาที่เดิม:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}&#x27;</span> | <span class="hljs-built_in">tr</span> <span class="hljs-string">&#x27;A-Za-z&#x27;</span> <span class="hljs-string">&#x27;N-ZA-Mn-za-m&#x27;</span>
</code></pre><p>ตัวเลขกับสัญลักษณ์ไม่ถูกแตะเลย <code>{</code>, <code>_</code> และตัวเลขแบบ leetspeak เลยรอดมาครบ</p>
<details>
<summary>ดู flag</summary><p><code>watkorn{v13w_s0urc3_b3f0r3_y0u_h4ck}</code></p>
</details><p><strong>บทเรียน:</strong> comment หลุดขึ้น production บ่อยกว่าที่คิด ในโจทย์ web จริง (และ bug bounty จริง) ให้อ่าน source, JavaScript bundle และ HTML comment ก่อนเป็นอย่างแรก</p>
<h2 id="ด่าน-4-สำหรับหุ่นยนต์เท่านั้น-40-แต้ม">ด่าน 4: สำหรับหุ่นยนต์เท่านั้น (40 แต้ม)<a class="heading-anchor" href="#ด่าน-4-สำหรับหุ่นยนต์เท่านั้น-40-แต้ม" aria-label="ลิงก์ไปหัวข้อนี้: ด่าน 4: สำหรับหุ่นยนต์เท่านั้น (40 แต้ม)">#</a></h2>
<p><em>&quot;crawler ที่มีมารยาทจะอ่านไฟล์หนึ่งก่อนเสมอ ลองทำตัวไม่มีมารยาทดู&quot;</em></p>
<p>ไฟล์นั้นคือ <code>/robots.txt</code> คำขอร้องแบบสุภาพถึง search engine ว่าอย่าเก็บหน้าไหนเข้า index:</p>
<pre><code class="hljs language-bash">curl -s https://watkorn.me/robots.txt
</code></pre><pre><code class="hljs">User-agent: *
Disallow: /y3t1-l41r/
</code></pre><p>&quot;ช่วยอย่าไปดู /y3t1-l41r/ นะ&quot; ก็คือคำเชิญดีๆ นี่เอง เข้าไปที่<a href="/y3t1-l41r/">ถ้ำของเยติ</a> แล้วจะเจอกำแพง byte: <code>77 61 74 6b 6f 72 6e 7b …</code> นั่นคือ <strong>hex</strong> ตัวอักษรทุกคู่คือหนึ่ง byte และ <code>77 61 74</code> ก็คือ <code>wat</code> แปลงกลับได้แบบนี้:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d&#x27;</span> | xxd -r -p
</code></pre><p>ไม่มี <code>xxd</code>? ใช้ Python ได้ทุกที่ (หรือ &quot;From Hex&quot; ใน CyberChef ก็ได้):</p>
<pre><code class="hljs language-bash">python3 -c <span class="hljs-string">&quot;print(bytes.fromhex(&#x27;77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d&#x27;).decode())&quot;</span>
</code></pre><details>
<summary>ดู flag</summary><p><code>watkorn{r0b0ts_txt_1s_4_tr34sur3_m4p}</code></p>
</details><p><strong>บทเรียน:</strong> <code>robots.txt</code> <strong>ไม่ใช่ access control</strong> มันคือรายชื่อ path ที่มีคนอยากซ่อนพอดี เลยเป็นหนึ่งในไฟล์แรกๆ ที่ต้องเช็กในทุกโจทย์ web และทุกการทำ recon</p>
<h2 id="ด่าน-5-ความลับในพิกเซล-50-แต้ม">ด่าน 5: ความลับในพิกเซล (50 แต้ม)<a class="heading-anchor" href="#ด่าน-5-ความลับในพิกเซล-50-แต้ม" aria-label="ลิงก์ไปหัวข้อนี้: ด่าน 5: ความลับในพิกเซล (50 แต้ม)">#</a></h2>
<p><em>&quot;เยติคือไฟล์ SVG ลองเปิดไฟล์นั้นแยกออกมา แล้วมองให้ลึกกว่าพิกเซล&quot;</em></p>
<p>เยติพิกเซลไม่ได้เป็นแท็กรูปภาพ มันวาดจาก SVG sprite ลองเปิด DevTools (<strong>F12 → Elements</strong>) แล้ว inspect ตัวเยติ จะเจอประมาณนี้:</p>
<pre><code class="hljs language-html"><span class="hljs-tag">&lt;<span class="hljs-name">use</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;/assets/yeti-XXXXXXXX.svg#yeti&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">use</span>&gt;</span>
</code></pre><p>(ส่วนหลัง <code>yeti-</code> คือ content hash ของคุณอาจไม่ตรงกับนี้) เปิดไฟล์ SVG นั้นในแท็บใหม่แล้วดู source SVG ก็คือ XML ธรรมดา และข้างๆ ภาพวาดมี element <code>&lt;metadata&gt;</code> ที่เบราว์เซอร์ไม่เคยแสดงผล:</p>
<pre><code class="hljs language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">metadata</span>&gt;</span>yeti-says: d2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==<span class="hljs-tag">&lt;/<span class="hljs-name">metadata</span>&gt;</span>
</code></pre><p><code>==</code> ที่ต่อท้ายคือ padding ของ Base64 อีกแล้ว:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;d2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==&#x27;</span> | <span class="hljs-built_in">base64</span> -d
</code></pre><p>สายบรรทัดคำสั่ง ไม่ต้องเปิด DevTools:</p>
<pre><code class="hljs language-bash">js=$(curl -s https://watkorn.me/ | grep -o <span class="hljs-string">&#x27;/assets/index-[^&quot;]*\\.js&#x27;</span>)
svg=$(curl -s <span class="hljs-string">&quot;https://watkorn.me<span class="hljs-variable">$js</span>&quot;</span> | grep -o <span class="hljs-string">&#x27;/assets/yeti-[^&quot;\`]*\\.svg&#x27;</span> | <span class="hljs-built_in">head</span> -1)
curl -s <span class="hljs-string">&quot;https://watkorn.me<span class="hljs-variable">$svg</span>&quot;</span> | grep -o <span class="hljs-string">&#x27;yeti-says: [^&lt;]*&#x27;</span>
</code></pre><details>
<summary>ดู flag</summary><p><code>watkorn{p1x3ls_c4n_h1d3_st4ff_t00}</code></p>
</details><p><strong>บทเรียน:</strong> รูปภาพพกข้อมูลได้ SVG เป็นไฟล์ข้อความที่ใส่ metadata, comment หรือแม้แต่ script ได้ เว็บจริงจึงต้อง sanitise SVG ที่ผู้ใช้อัปโหลด และโจทย์ steganography ก็ชอบไฟล์รูปด้วยเหตุผลนี้</p>
<h2 id="ระบบตรวจทำงานยังไง-และข้อจำกัด">ระบบตรวจทำงานยังไง (และข้อจำกัด)<a class="heading-anchor" href="#ระบบตรวจทำงานยังไง-และข้อจำกัด" aria-label="ลิงก์ไปหัวข้อนี้: ระบบตรวจทำงานยังไง (และข้อจำกัด)">#</a></h2>
<ul>
<li>terminal เอาสิ่งที่คุณ <code>submit</code> ไป hash ด้วย SHA-256 ในเบราว์เซอร์ของคุณเอง (<code>crypto.subtle.digest</code>) แล้วเทียบกับ hash ที่เก็บไว้ hash เปิดเผยได้ แต่ย้อนกลับเป็น flag ไม่ได้</li>
<li>ความคืบหน้าเก็บไว้ใน <code>localStorage</code> ของเบราว์เซอร์คุณ ไม่มีอะไรถูกส่งไปเซิร์ฟเวอร์ เพราะไม่มีเซิร์ฟเวอร์ให้ส่ง</li>
<li>ข้อจำกัดตรงๆ: flag ข้อ 1 และ 2 ต้องอยู่ใน JavaScript เพราะ terminal เป็นคนพิมพ์มันออกมา และทั้งเว็บเป็น <a href="https://github.com/watkorn/watkorn.me" target="_blank" rel="noopener noreferrer">open source</a> การไปอ่าน repo เลยเป็นกลยุทธ์ที่ใช้ได้ แม้จะแอบขี้โกงนิดๆ สำหรับ CTF วอร์มอัพ นี่ถือเป็นฟีเจอร์</li>
</ul>
<h2 id="mini-ctf-นี้สอนอะไร">mini CTF นี้สอนอะไร<a class="heading-anchor" href="#mini-ctf-นี้สอนอะไร" aria-label="ลิงก์ไปหัวข้อนี้: mini CTF นี้สอนอะไร">#</a></h2>
<table>
<thead>
<tr>
<th>ด่าน</th>
<th>เทคนิค</th>
<th>ในโลกจริง</th>
</tr>
</thead>
<tbody><tr>
<td>1</td>
<td>สำรวจก่อน</td>
<td><code>ls</code>, <code>strings</code>, อ่านทุกไฟล์ที่ได้มา</td>
</tr>
<tr>
<td>2</td>
<td>ไฟล์ซ่อน + Base64</td>
<td>dotfile, <code>.git/</code>, ค่า config ที่ถูก encode</td>
</tr>
<tr>
<td>3</td>
<td>view source + ROT13</td>
<td>comment ที่หลุด, secret ใน JS bundle</td>
</tr>
<tr>
<td>4</td>
<td>robots.txt + hex</td>
<td>recon ที่ <code>robots.txt</code>, <code>sitemap.xml</code>, <code>.well-known/</code></td>
</tr>
<tr>
<td>5</td>
<td>metadata ของไฟล์</td>
<td>ข้อมูล EXIF, metadata ใน SVG/Office, steganography</td>
</tr>
</tbody></table>
<p>เจอครบทั้ง 5 แล้ว? ซีซัน 2 รออยู่ เป็นด่านที่ยากขึ้น 3 ด่าน เกี่ยวกับ cookie ตู้เซฟ และรูปภาพ คำใบ้อยู่ที่<a href="/th/achievements">หน้าความสำเร็จ</a></p>
`};export{e as default};
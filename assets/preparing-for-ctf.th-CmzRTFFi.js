var e={html:`<p>การแข่ง Capture The Flag (CTF) คือวิธีเรียน security ที่สนุกที่สุดแล้ว ผู้จัดจะซ่อนข้อความหน้าตาแบบ <code>flag{...}</code> ไว้หลังเว็บแอปพังๆ ไบนารีแปลกๆ หรือไฟล์ PCAP ที่ดูมีพิรุธ หน้าที่ของเราคือรื้อมันให้พัง (แบบถูกกฎหมาย) จนกว่า flag จะหล่นออกมา ช่วงแรกจะแพ้บ่อยมาก และนั่นแหละคือประเด็น</p>
<p>นี่คือไกด์ที่ผมอยากให้มีคนยื่นให้ก่อนลงแข่งครั้งแรก</p>
<p><img src="/images/blogs/ctftime.png" alt="CTFtime เว็บสำหรับหา CTF ที่กำลังจะจัด" loading="lazy"></p>
<h2>ก่อนอื่น CTF นี้เป็นแบบไหน?</h2>
<ul>
<li><strong>Jeopardy</strong> กระดานโจทย์แบ่งตามหมวดและคะแนน จะแก้ข้อไหนก่อนก็ได้ CTF ราว 90% เป็นแบบนี้ และเป็นจุดที่ควรเริ่ม</li>
<li><strong>Attack–Defense</strong> ทุกทีมได้ service ที่มีช่องโหว่ชุดเดียวกัน ต้อง patch ของตัวเองแล้วไปเจาะของทีมอื่น วุ่นวายแต่มันส์มาก ยังไม่ใช่ของสัปดาห์แรก</li>
<li><strong>King of the Hill</strong> ยึดเครื่องให้ได้แล้วรักษาไว้ให้นานที่สุด ลองเล่นใน TryHackMe ได้เมื่อเริ่มคล่องแล้ว</li>
</ul>
<p>หางานแข่งได้ที่ <a href="https://ctftime.org/" target="_blank" rel="noopener noreferrer">CTFtime</a> มองหางานที่ติดป้าย <em>beginner</em> หรือมีค่า &quot;weight&quot; ต่ำๆ</p>
<h2>เลือกสายก่อน (แล้วค่อยขยาย)</h2>
<p>ไม่มีใครเก่งทุกอย่าง เริ่มจากสักหนึ่งหรือสองหมวด แล้วค่อยขยายออกไป</p>
<table>
<thead>
<tr>
<th>หมวด</th>
<th>คืออะไร</th>
<th>ควรเรียนอะไรก่อน</th>
</tr>
</thead>
<tbody><tr>
<td><strong>web</strong></td>
<td>เจาะเว็บแอป</td>
<td>HTTP, cookie, SQLi, XSS, SSTI, IDOR, อ่าน JS</td>
</tr>
<tr>
<td><strong>pwn</strong></td>
<td>เจาะไบนารีจนได้ shell</td>
<td>ภาษา C, โครงสร้าง stack, buffer overflow, ROP, <code>checksec</code></td>
</tr>
<tr>
<td><strong>rev</strong></td>
<td>แกะว่าโปรแกรมทำอะไร</td>
<td>พื้นฐาน x86-64, Ghidra, <code>strace</code>/<code>ltrace</code>, การ patch</td>
</tr>
<tr>
<td><strong>crypto</strong></td>
<td>เจาะการเข้ารหัสที่ทำพลาด</td>
<td>XOR, จุดพลาดของ RSA, padding, ความต่างระหว่าง encoding กับ encryption</td>
</tr>
<tr>
<td><strong>forensics</strong></td>
<td>ขุดไฟล์ หน่วยความจำ และทราฟฟิก</td>
<td>รูปแบบไฟล์, Wireshark, Volatility, steganography</td>
</tr>
<tr>
<td><strong>misc / OSINT</strong></td>
<td>ที่เหลือทั้งหมด</td>
<td>ทักษะ Linux, เขียนสคริปต์, ทักษะการค้นหา</td>
</tr>
</tbody></table>
<p>ถ้าไม่รู้จะเริ่มตรงไหน: <strong>web</strong> หรือ <strong>forensics</strong> ได้ผลเร็ว ไม่ต้องรู้ assembly ก่อน</p>
<h2>เซ็ตเครื่องมือ</h2>
<p>ใช้ Linux VM (Kali, Parrot หรือ Ubuntu ธรรมดา) จะรวมทุกอย่างไว้ที่เดียวและไม่ทำให้เครื่องหลักรก เครื่องมือหลัก:</p>
<ul>
<li><strong>ใช้ทุกหมวด:</strong> Python 3, <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener noreferrer">CyberChef</a>, <code>file</code>, <code>strings</code>, text editor ดีๆ สักตัว</li>
<li><strong>Web:</strong> Burp Suite Community, DevTools ของเบราว์เซอร์, <code>ffuf</code>, <code>curl</code></li>
<li><strong>Pwn / rev:</strong> <code>pwntools</code>, GDB + <a href="https://github.com/pwndbg/pwndbg" target="_blank" rel="noopener noreferrer">pwndbg</a> หรือ GEF, Ghidra, <code>checksec</code></li>
<li><strong>Forensics:</strong> Wireshark, <code>binwalk</code>, <code>exiftool</code>, Volatility 3</li>
<li><strong>Crypto / แคร็กรหัส:</strong> <code>hashcat</code>, John the Ripper, SageMath หรือ Python เปล่าๆ</li>
</ul>
<pre><code class="hljs language-bash"><span class="hljs-built_in">sudo</span> apt install -y python3-pip gdb binwalk exiftool wireshark john hashcat
pip install pwntools
git <span class="hljs-built_in">clone</span> https://github.com/pwndbg/pwndbg &amp;&amp; <span class="hljs-built_in">cd</span> pwndbg &amp;&amp; ./setup.sh
</code></pre><h2>ซ้อมก่อนถึงวันแข่ง</h2>
<ul>
<li><a href="https://picoctf.org/" target="_blank" rel="noopener noreferrer">picoCTF</a>: ที่ที่ดีที่สุดสำหรับเริ่มต้น โจทย์มีตั้งแต่ง่ายๆ ไปจนถึงยากของจริง</li>
<li><a href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener noreferrer">OverTheWire: Bandit</a>: พื้นฐาน Linux ทีละด่าน</li>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener noreferrer">TryHackMe</a>: ห้องแบบมีไกด์และเส้นทางการเรียน</li>
<li><a href="https://www.hackthebox.com/" target="_blank" rel="noopener noreferrer">Hack The Box</a>: เครื่องที่สมจริง และมีส่วน &quot;Challenges&quot; สไตล์ CTF</li>
<li><a href="https://pwn.college/" target="_blank" rel="noopener noreferrer">pwn.college</a>: คอร์สมหาวิทยาลัยฟรีสำหรับสาย pwn และ rev</li>
<li><a href="https://cryptohack.org/" target="_blank" rel="noopener noreferrer">CryptoHack</a>: เรียน crypto ผ่านปริศนา</li>
</ul>
<p>ทำทีละนิดทุกวันดีกว่าอัดทีเดียวทั้งสุดสัปดาห์ แก้โจทย์ง่ายได้สิบข้อ ดีกว่าโจทย์ยากข้อเดียวที่ถอดใจกลางทาง</p>
<h2>10 นาทีแรกของทุกโจทย์</h2>
<p>ก่อนจะทำอะไรเท่ๆ ให้รันของน่าเบื่อก่อน มันแก้โจทย์ได้มากกว่าที่คิด</p>
<pre><code class="hljs language-bash">file chall                      <span class="hljs-comment"># ตกลงไฟล์นี้คืออะไรกันแน่?</span>
strings -n 8 chall | less       <span class="hljs-comment"># ข้อความที่อ่านออก บางทีก็คือ flag เลย</span>
exiftool image.png              <span class="hljs-comment"># metadata</span>
binwalk -e firmware.bin         <span class="hljs-comment"># ไฟล์ที่ซ่อนอยู่ในไฟล์</span>
checksec --file=./chall         <span class="hljs-comment"># ไบนารีนี้เปิดระบบป้องกันอะไรไว้บ้าง?</span>
</code></pre><p>โจทย์ web: อ่าน source ของหน้า เปิด DevTools ดู <code>/robots.txt</code> เช็ก cookie และส่องทุก request ใน Burp</p>
<h2>ระหว่างแข่ง</h2>
<ul>
<li><strong>อ่านโจทย์ทุกข้อก่อน</strong> เรียงตามจำนวนคนที่แก้ได้ ข้อที่คนแก้ได้เยอะที่สุดมักจะง่ายที่สุด</li>
<li><strong>จับเวลา</strong> ถ้า 45–60 นาทีแล้วยังไม่คืบ ให้เปลี่ยนข้อแล้วค่อยกลับมาทีหลัง</li>
<li><strong>จดทุกอย่าง</strong> ลองอะไรไปแล้ว อะไรไม่ได้ผล และทุกความแปลกที่สังเกตเห็น ตัวเราในอนาคตจะขอบคุณ</li>
<li><strong>อ่านกติกา</strong> ห้ามโจมตีโครงสร้างระบบของงาน ห้าม brute-force การส่ง flag ห้ามแชร์ flag</li>
<li><strong>นอนกับกินข้าว</strong> จริงจังนะ สมองที่ล้าหาบั๊ก off-by-one ไม่เจอหรอก</li>
</ul>
<h2>เล่นเป็นทีม</h2>
<ul>
<li>หนึ่ง channel หรือ thread ต่อหนึ่งโจทย์ โพสต์ว่าลองอะไรไปแล้วบ้าง</li>
<li>&quot;จอง&quot; โจทย์ก่อนลงมือ จะได้ไม่มีสองคนทำเรื่องเดียวกันเงียบๆ</li>
<li>รวมโน้ตไว้ที่เดียว (Obsidian, HedgeDoc หรือ Notion) อย่าให้อะไรอยู่แค่ในหัวใครคนเดียว</li>
<li>จับคู่กัน: คนเก่ง rev คู่กับคนเก่ง pwn คือคอมโบที่ดีมาก</li>
</ul>
<h2>หลังแข่งจบ (ส่วนที่ทุกคนชอบข้าม)</h2>
<p>การเรียนรู้จริงๆ เกิดขึ้นตรงนี้:</p>
<ol>
<li><strong>อ่าน writeup ของทีมอื่น</strong> สำหรับข้อที่เราแก้ไม่ได้ CTFtime จะรวมลิงก์ไว้ในหน้าของแต่ละงาน</li>
<li><strong>เขียน writeup ของตัวเอง</strong> ต่อให้เป็นข้อง่ายก็เขียน การอธิบายวิธีแก้คือสิ่งที่ทำให้มันติดหัว (บนเว็บนี้ใช้คำสั่ง <code>npm run new-post -- --writeup &quot;Challenge name&quot;</code>)</li>
<li><strong>เปลี่ยนทริกที่ใช้ซ้ำๆ ให้เป็น cheat sheet</strong> ทั้ง payload, one-liner และ snippet Python</li>
</ol>
<h2>เช็กลิสต์สั้นๆ</h2>
<ul>
<li class="task"><label><input type="checkbox" disabled> เลือกหมวดที่จะโฟกัสแล้ว 1–2 หมวด</label></li>
<li class="task"><label><input type="checkbox" disabled> มี VM ที่ลงเครื่องมือหลักครบ</label></li>
<li class="task"><label><input type="checkbox" disabled> แก้โจทย์ picoCTF หรือ TryHackMe ได้แล้ว 10 ข้อขึ้นไป</label></li>
<li class="task"><label><input type="checkbox" disabled> เจองาน CTF สำหรับมือใหม่บน CTFtime ที่กำลังจะจัด</label></li>
<li class="task"><label><input type="checkbox" disabled> เตรียมแอปจดโน้ตกับช่องคุยของทีมไว้แล้ว</label></li>
<li class="task"><label><input type="checkbox" disabled> ตั้งใจว่าจะเขียน writeup อย่างน้อยหนึ่งเรื่องหลังแข่ง</label></li>
</ul>
<p>อยากวอร์มอัพตอนนี้เลย? <a href="/th/">terminal ในหน้าแรก</a> มี flag ซ่อนอยู่ทั่วเว็บนี้ 5 อัน เช็กความคืบหน้าได้ที่<a href="/th/achievements">หน้าความสำเร็จ</a> ขอให้โชคดี และสนุกกับการรื้อของให้พังนะ</p>
`};export{e as default};
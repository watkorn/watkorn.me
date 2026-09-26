var e={html:`<p>Capture The Flag (CTF) competitions are the most fun way to learn security. Someone hides a string like <code>flag{...}</code> behind a broken web app, a weird binary or a suspicious PCAP, and you break things (legally) until it falls out. You&#39;ll fail a lot at first. That&#39;s the whole point.</p>
<p>This is the guide I wish I&#39;d had before my first one.</p>
<p><img src="/images/blogs/ctftime.png" alt="CTFtime, where you find upcoming CTFs" loading="lazy"></p>
<h2>First, what kind of CTF is it?</h2>
<ul>
<li><strong>Jeopardy.</strong> A board of challenges by category and points. Solve any in any order. This is 90% of CTFs and where you should start.</li>
<li><strong>Attack–Defense.</strong> Every team gets the same vulnerable services. Patch yours, exploit everyone else&#39;s. Chaotic, amazing, not for week one.</li>
<li><strong>King of the Hill.</strong> Take over a box and hold it. Great on TryHackMe once you&#39;re comfortable.</li>
</ul>
<p>Find events on <a href="https://ctftime.org/" target="_blank" rel="noopener noreferrer">CTFtime</a>. Look for ones tagged <em>beginner</em>, or with low &quot;weight&quot;.</p>
<h2>Pick a lane (then another)</h2>
<p>Nobody is good at everything. Start with one or two categories, then branch out.</p>
<table>
<thead>
<tr>
<th>Category</th>
<th>What it is</th>
<th>Learn first</th>
</tr>
</thead>
<tbody><tr>
<td><strong>web</strong></td>
<td>Break web apps</td>
<td>HTTP, cookies, SQLi, XSS, SSTI, IDOR, reading JS</td>
</tr>
<tr>
<td><strong>pwn</strong></td>
<td>Exploit binaries for a shell</td>
<td>C, stack layout, buffer overflows, ROP, <code>checksec</code></td>
</tr>
<tr>
<td><strong>rev</strong></td>
<td>Figure out what a program does</td>
<td>x86-64 basics, Ghidra, <code>strace</code>/<code>ltrace</code>, patching</td>
</tr>
<tr>
<td><strong>crypto</strong></td>
<td>Break bad cryptography</td>
<td>XOR, RSA mistakes, padding, encodings vs encryption</td>
</tr>
<tr>
<td><strong>forensics</strong></td>
<td>Dig through files, memory, traffic</td>
<td>file formats, Wireshark, Volatility, steganography</td>
</tr>
<tr>
<td><strong>misc / OSINT</strong></td>
<td>Everything else</td>
<td>Linux-fu, scripting, search skills</td>
</tr>
</tbody></table>
<p>If you don&#39;t know where to start: <strong>web</strong> or <strong>forensics</strong>. You get quick wins without needing assembly first.</p>
<h2>Set up your toolkit</h2>
<p>A Linux VM (Kali, Parrot or plain Ubuntu) keeps everything in one place and your host clean. Core tools:</p>
<ul>
<li><strong>Everywhere:</strong> Python 3, <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener noreferrer">CyberChef</a>, <code>file</code>, <code>strings</code>, a good text editor</li>
<li><strong>Web:</strong> Burp Suite Community, browser DevTools, <code>ffuf</code>, <code>curl</code></li>
<li><strong>Pwn / rev:</strong> <code>pwntools</code>, GDB + <a href="https://github.com/pwndbg/pwndbg" target="_blank" rel="noopener noreferrer">pwndbg</a> or GEF, Ghidra, <code>checksec</code></li>
<li><strong>Forensics:</strong> Wireshark, <code>binwalk</code>, <code>exiftool</code>, Volatility 3</li>
<li><strong>Crypto / cracking:</strong> <code>hashcat</code>, John the Ripper, SageMath or plain Python</li>
</ul>
<pre><code class="hljs language-bash"><span class="hljs-built_in">sudo</span> apt install -y python3-pip gdb binwalk exiftool wireshark john hashcat
pip install pwntools
git <span class="hljs-built_in">clone</span> https://github.com/pwndbg/pwndbg &amp;&amp; <span class="hljs-built_in">cd</span> pwndbg &amp;&amp; ./setup.sh
</code></pre><h2>Practise before the weekend</h2>
<ul>
<li><a href="https://picoctf.org/" target="_blank" rel="noopener noreferrer">picoCTF</a>: the best place to start. Challenges go from gentle to genuinely hard.</li>
<li><a href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener noreferrer">OverTheWire: Bandit</a>: Linux basics, one level at a time.</li>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener noreferrer">TryHackMe</a>: guided rooms and learning paths.</li>
<li><a href="https://www.hackthebox.com/" target="_blank" rel="noopener noreferrer">Hack The Box</a>: realistic machines, plus a &quot;Challenges&quot; section in CTF style.</li>
<li><a href="https://pwn.college/" target="_blank" rel="noopener noreferrer">pwn.college</a>: the free university course for pwn and rev.</li>
<li><a href="https://cryptohack.org/" target="_blank" rel="noopener noreferrer">CryptoHack</a>: crypto, taught through puzzles.</li>
</ul>
<p>Aim for something small every day rather than one huge weekend. Ten solved easy challenges beat one hard one you gave up on.</p>
<h2>The first 10 minutes of any challenge</h2>
<p>Before anything clever, run the boring stuff. It solves more challenges than you&#39;d think.</p>
<pre><code class="hljs language-bash">file chall                      <span class="hljs-comment"># what is this, really?</span>
strings -n 8 chall | less       <span class="hljs-comment"># readable text, sometimes the flag itself</span>
exiftool image.png              <span class="hljs-comment"># metadata</span>
binwalk -e firmware.bin         <span class="hljs-comment"># files hidden inside files</span>
checksec --file=./chall         <span class="hljs-comment"># which protections does this binary have?</span>
</code></pre><p>For web challenges: read the page source, open DevTools, check <code>/robots.txt</code>, look at cookies, and watch every request in Burp.</p>
<h2>During the CTF</h2>
<ul>
<li><strong>Read every challenge first.</strong> Sort by number of solves; the most-solved ones are usually the easiest.</li>
<li><strong>Timebox.</strong> If you&#39;ve made no progress in 45–60 minutes, switch challenges and come back later.</li>
<li><strong>Write everything down.</strong> What you tried, what failed, and every weird thing you noticed. Future-you will thank you.</li>
<li><strong>Read the rules.</strong> Don&#39;t attack the infrastructure, don&#39;t brute-force the flag submission, don&#39;t share flags.</li>
<li><strong>Sleep and eat.</strong> Seriously. Tired brains don&#39;t find off-by-one bugs.</li>
</ul>
<h2>Play with a team</h2>
<ul>
<li>One channel or thread per challenge. Post what you&#39;ve tried.</li>
<li>&quot;Claim&quot; a challenge so two people don&#39;t silently do the same thing.</li>
<li>Share notes in one place (Obsidian, HedgeDoc or Notion) so nothing lives only in your head.</li>
<li>Pair up: someone strong in rev plus someone strong in pwn is a very good combo.</li>
</ul>
<h2>After the CTF (the part everyone skips)</h2>
<p>This is where most of the learning actually happens:</p>
<ol>
<li><strong>Read other teams&#39; writeups</strong> for the challenges you didn&#39;t solve. CTFtime links them on each event page.</li>
<li><strong>Write your own writeups</strong>, even for easy ones. Explaining a solve is how it sticks. (On this site, it&#39;s <code>npm run new-post -- --writeup &quot;Challenge name&quot;</code>.)</li>
<li><strong>Turn repeated tricks into cheat sheets.</strong> Payloads, one-liners, Python snippets.</li>
</ol>
<h2>Quick checklist</h2>
<ul>
<li><input disabled="" type="checkbox"> Picked 1–2 categories to focus on</li>
<li><input disabled="" type="checkbox"> VM with the core tools installed</li>
<li><input disabled="" type="checkbox"> Solved 10+ picoCTF or TryHackMe challenges</li>
<li><input disabled="" type="checkbox"> Found an upcoming beginner CTF on CTFtime</li>
<li><input disabled="" type="checkbox"> Notes app and team channel ready</li>
<li><input disabled="" type="checkbox"> Plan to write at least one writeup afterwards</li>
</ul>
<p>Want a warm-up right now? The <a href="/">terminal on the home page</a> has five flags hidden around this site. Check your progress on the <a href="/achievements">achievements page</a>. Good luck, and have fun breaking things.</p>
`};export{e as default};
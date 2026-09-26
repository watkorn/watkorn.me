var e={html:`<blockquote>
<p><strong>Spoiler alert.</strong> This post solves every level of the mini CTF on this site. If you haven&#39;t tried it yet, go to the <a href="/">home page</a>, type <code>ls</code>, and come back when you&#39;re stuck. Hints are free on the <a href="/achievements">achievements page</a>. The flags themselves are folded away below each level, so you can read the method without seeing the answer.</p>
</blockquote>
<p>The mini CTF has five levels, worth 10 to 50 points (150 in total). The terminal checks your answers with <code>submit &lt;flag&gt;</code>, and it only knows the <strong>SHA-256 hashes</strong> of the flags, so the answers aren&#39;t sitting in the JavaScript in plain text. Well, mostly. Let&#39;s go.</p>
<h2>Level 1: Warm-up (10 pts)</h2>
<p><em>&quot;Some files are just lying around in the home folder.&quot;</em></p>
<p>The classic first move in any shell is to look around:</p>
<pre><code class="hljs language-bash">watkorn@me:~$ <span class="hljs-built_in">ls</span>
flag.txt  README.md
watkorn@me:~$ <span class="hljs-built_in">cat</span> flag.txt
</code></pre><p>That&#39;s it. The warm-up is literally a file called <code>flag.txt</code>. There&#39;s also a sneaky second path: <code>echo</code> with the word &quot;flag&quot; in it prints the flag too.</p>
<details>
<summary>Show flag</summary><p><code>my_w3b_is_c00ler_th4n_u_th1nk</code></p>
</details><p><strong>Lesson:</strong> always enumerate before you get clever. <code>ls</code>, <code>cat</code>, <code>file</code>, <code>strings</code>.</p>
<h2>Level 2: Hidden in plain sight (20 pts)</h2>
<p><em>&quot;ls shows files. ls -la shows all of them.&quot;</em></p>
<p>On Linux, files starting with a dot are hidden from a plain <code>ls</code>. Add <code>-a</code> (all) and <code>-l</code> (long):</p>
<pre><code class="hljs language-bash">watkorn@me:~$ <span class="hljs-built_in">ls</span> -la
drwxr-xr-x 3 watkorn <span class="hljs-built_in">users</span> 4096 Oct 8 2025 .
drwxr-xr-x 3 watkorn <span class="hljs-built_in">users</span> 4096 Oct 8 2025 ..
drwx------ 2 watkorn <span class="hljs-built_in">users</span> 4096 Oct 8 2025 .secret
-rw-r--r-- 1 watkorn <span class="hljs-built_in">users</span>   67 Oct 8 2025 flag.txt
-rw-r--r-- 1 watkorn <span class="hljs-built_in">users</span>  123 Oct 8 2025 README.md
watkorn@me:~$ <span class="hljs-built_in">cd</span> .secret
watkorn@me:~/.secret$ <span class="hljs-built_in">cat</span> note.b64
d2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9
</code></pre><p>The <code>.b64</code> extension gives it away: letters, digits and a length that&#39;s a multiple of 4 all scream <strong>Base64</strong>. Decode it anywhere except the site&#39;s terminal:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;d2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9&#x27;</span> | <span class="hljs-built_in">base64</span> -d
</code></pre><p>Or use <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener noreferrer">CyberChef</a> with the &quot;From Base64&quot; operation.</p>
<details>
<summary>Show flag</summary><p><code>watkorn{d0tf1l3s_4r3_n0t_s3cr3ts}</code></p>
</details><p><strong>Lesson:</strong> Base64 is <strong>encoding, not encryption</strong>. Anyone can reverse it, no key needed. And &quot;hidden&quot; dotfiles hide nothing from someone who types <code>-a</code>.</p>
<h2>Level 3: View source (30 pts)</h2>
<p><em>&quot;The page you see isn&#39;t the whole page.&quot;</em></p>
<p>What the browser renders is only part of what the server sends. Open the raw HTML with <strong>Ctrl+U</strong> (or <code>view-source:https://watkorn.me/</code>), or fetch it:</p>
<pre><code class="hljs language-bash">curl -s https://watkorn.me/ | grep -i <span class="hljs-string">&quot;note to self&quot;</span>
</code></pre><p>Near the top of <code>&lt;body&gt;</code> there&#39;s an HTML comment:</p>
<pre><code class="hljs language-html"><span class="hljs-comment">&lt;!-- note to self (level 3): jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}  ·  rot13, obviously --&gt;</span>
</code></pre><p>It even tells you the cipher. ROT13 shifts every letter 13 places, and applying it twice gets you back where you started:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}&#x27;</span> | <span class="hljs-built_in">tr</span> <span class="hljs-string">&#x27;A-Za-z&#x27;</span> <span class="hljs-string">&#x27;N-ZA-Mn-za-m&#x27;</span>
</code></pre><p>Digits and symbols are left alone, which is why <code>{</code>, <code>_</code> and the leetspeak numbers survive untouched.</p>
<details>
<summary>Show flag</summary><p><code>watkorn{v13w_s0urc3_b3f0r3_y0u_h4ck}</code></p>
</details><p><strong>Lesson:</strong> comments ship to production more often than you&#39;d think. On real web challenges (and real bug bounties), read the source, the JavaScript bundles and the HTML comments first.</p>
<h2>Level 4: Robots only (40 pts)</h2>
<p><em>&quot;Every well-behaved crawler reads one file before anything else. Be badly behaved.&quot;</em></p>
<p>That file is <code>/robots.txt</code>, a polite request to search engines about what not to index:</p>
<pre><code class="hljs language-bash">curl -s https://watkorn.me/robots.txt
</code></pre><pre><code class="hljs">User-agent: *
Disallow: /y3t1-l41r/
</code></pre><p>&quot;Please don&#39;t look at /y3t1-l41r/&quot; is basically an invitation. Visit <a href="/y3t1-l41r/">the yeti&#39;s lair</a> and you&#39;ll find a wall of bytes: <code>77 61 74 6b 6f 72 6e 7b …</code>. That&#39;s <strong>hex</strong>: every pair of characters is one byte, and <code>77 61 74</code> is <code>wat</code>. Convert it back:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d&#x27;</span> | xxd -r -p
</code></pre><p>No <code>xxd</code>? Python works anywhere (and CyberChef&#39;s &quot;From Hex&quot; does too):</p>
<pre><code class="hljs language-bash">python3 -c <span class="hljs-string">&quot;print(bytes.fromhex(&#x27;77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d&#x27;).decode())&quot;</span>
</code></pre><details>
<summary>Show flag</summary><p><code>watkorn{r0b0ts_txt_1s_4_tr34sur3_m4p}</code></p>
</details><p><strong>Lesson:</strong> <code>robots.txt</code> is <strong>not access control</strong>. It lists exactly the paths someone wanted to hide, which makes it one of the first files to check in any web challenge or recon.</p>
<h2>Level 5: Pixel secrets (50 pts)</h2>
<p><em>&quot;The yeti is an SVG. Open the file on its own and look past the pixels.&quot;</em></p>
<p>The pixel yeti isn&#39;t an image tag; it&#39;s drawn from an SVG sprite. In DevTools (<strong>F12 → Elements</strong>), inspect the yeti and you&#39;ll find something like:</p>
<pre><code class="hljs language-html"><span class="hljs-tag">&lt;<span class="hljs-name">use</span> <span class="hljs-attr">href</span>=<span class="hljs-string">&quot;/assets/yeti-XXXXXXXX.svg#yeti&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">use</span>&gt;</span>
</code></pre><p>(the part after <code>yeti-</code> is a content hash, so yours may differ). Open that SVG file directly in a new tab and view its source. SVG is just XML, and next to the drawing there&#39;s a <code>&lt;metadata&gt;</code> element the browser never renders:</p>
<pre><code class="hljs language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">metadata</span>&gt;</span>yeti-says: d2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==<span class="hljs-tag">&lt;/<span class="hljs-name">metadata</span>&gt;</span>
</code></pre><p>The <code>==</code> padding at the end is a Base64 tell, again:</p>
<pre><code class="hljs language-bash"><span class="hljs-built_in">echo</span> <span class="hljs-string">&#x27;d2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==&#x27;</span> | <span class="hljs-built_in">base64</span> -d
</code></pre><p>Command-line route, no DevTools needed:</p>
<pre><code class="hljs language-bash">js=$(curl -s https://watkorn.me/ | grep -o <span class="hljs-string">&#x27;/assets/index-[^&quot;]*\\.js&#x27;</span>)
svg=$(curl -s <span class="hljs-string">&quot;https://watkorn.me<span class="hljs-variable">$js</span>&quot;</span> | grep -o <span class="hljs-string">&#x27;/assets/yeti-[^&quot;\`]*\\.svg&#x27;</span> | <span class="hljs-built_in">head</span> -1)
curl -s <span class="hljs-string">&quot;https://watkorn.me<span class="hljs-variable">$svg</span>&quot;</span> | grep -o <span class="hljs-string">&#x27;yeti-says: [^&lt;]*&#x27;</span>
</code></pre><details>
<summary>Show flag</summary><p><code>watkorn{p1x3ls_c4n_h1d3_st4ff_t00}</code></p>
</details><p><strong>Lesson:</strong> images can carry data. SVGs are text files that can hold metadata, comments and even scripts. That&#39;s why real sites sanitise user-uploaded SVGs, and why steganography challenges love image files.</p>
<h2>How the checking works (and its limits)</h2>
<ul>
<li>The terminal hashes whatever you <code>submit</code> with SHA-256 in your browser (<code>crypto.subtle.digest</code>) and compares it against the five stored hashes. The hashes are public, but a hash can&#39;t be reversed back into the flag.</li>
<li>Your progress is stored in your browser&#39;s <code>localStorage</code>. Nothing is sent to a server, because there isn&#39;t one.</li>
<li>Honest limits: flags 1 and 2 have to live in the JavaScript, because the terminal prints them. And the whole site is <a href="https://github.com/watkorn/watkorn.me" target="_blank" rel="noopener noreferrer">open source</a>, so reading the repo is a valid, if slightly cheeky, strategy. For a warm-up CTF, that&#39;s a feature.</li>
</ul>
<h2>What this mini CTF teaches</h2>
<table>
<thead>
<tr>
<th>Level</th>
<th>Technique</th>
<th>Real-world version</th>
</tr>
</thead>
<tbody><tr>
<td>1</td>
<td>Enumerate first</td>
<td><code>ls</code>, <code>strings</code>, reading every file you&#39;re given</td>
</tr>
<tr>
<td>2</td>
<td>Hidden files + Base64</td>
<td>dotfiles, <code>.git/</code>, encoded config values</td>
</tr>
<tr>
<td>3</td>
<td>View source + ROT13</td>
<td>leaked comments, secrets in JS bundles</td>
</tr>
<tr>
<td>4</td>
<td>robots.txt + hex</td>
<td>recon on <code>robots.txt</code>, <code>sitemap.xml</code>, <code>.well-known/</code></td>
</tr>
<tr>
<td>5</td>
<td>File metadata</td>
<td>EXIF data, SVG/Office metadata, steganography</td>
</tr>
</tbody></table>
<p>Got all five? Screenshot your <a href="/achievements">achievements</a> and tag me. Next time I&#39;ll make them harder.</p>
`};export{e as default};
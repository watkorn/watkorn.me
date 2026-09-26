var e={html:`<p>This site is my home for CTF writeups and side projects, and a challenge in its own right. The home page is a terminal with <strong>eight flags</strong> hidden around the site. If you&#39;re a security person, the fastest way to get to know me is to try to break my website.</p>
<h2 id="goals">Goals<a class="heading-anchor" href="#goals" aria-label="Link to this section: Goals">#</a></h2>
<ol>
<li><strong>Play first, read second, hire third.</strong> The terminal is the front door. Writeups come next, then projects and contact links.</li>
<li><strong>Writing a post should never mean touching layout code.</strong> A writeup is a Markdown file and a <code>git push</code>.</li>
<li><strong>Keep the attack surface close to zero.</strong> No server, no database, no third-party scripts.</li>
</ol>
<h2 id="how-it-works">How it works<a class="heading-anchor" href="#how-it-works" aria-label="Link to this section: How it works">#</a></h2>
<pre><code class="hljs">content/*.md  ─▶  scripts/content.mjs  ─▶  JSON  ─▶  Vite + React
                                                   │
                     prerender every route to HTML ◀┘  (+ sitemap, RSS, CSP)
                                                   │
          GitHub Actions: build → Playwright tests → publish to gh-pages
                                                   │
                  GitHub Pages  ◀──  Cloudflare (TLS, HSTS, security headers)
</code></pre><ul>
<li><strong>Content:</strong> blog posts and projects are Markdown with frontmatter. At build time, <a href="https://marked.js.org/" target="_blank" rel="noopener noreferrer">marked</a> and highlight.js turn them into HTML, so no Markdown parser ships to the browser. Drafts are visible in dev and excluded from production.</li>
<li><strong>Two languages:</strong> every page exists in English at <code>/</code> and in Thai at <code>/th/</code>. A translation is a <code>post-name.th.md</code> file next to the original. Until a post is translated, the Thai page shows the original with a note, and <code>hreflang</code> links tell search engines which pages belong together.</li>
<li><strong>Pages:</strong> React 19 + React Router 7 on Vite. Every route is <strong>prerendered to its own HTML file</strong>, so posts are indexable and link previews in Discord or LINE show a real title and image. React then takes over for the interactive bits.</li>
<li><strong>Deploys:</strong> every push to <code>main</code> builds the site and runs <strong>Playwright smoke tests on desktop and mobile</strong>. Only if they pass does it publish the static files to the <code>gh-pages</code> branch. A failing test means the live site doesn&#39;t change.</li>
</ul>
<h2 id="security">Security<a class="heading-anchor" href="#security" aria-label="Link to this section: Security">#</a></h2>
<p>Being a security person&#39;s website, it had better hold up:</p>
<ul>
<li><strong>A+ on <a href="https://securityheaders.com/?q=watkorn.me&amp;followRedirects=on" target="_blank" rel="noopener noreferrer">securityheaders.com</a>.</strong> Cloudflare adds HSTS, <code>X-Frame-Options</code>, <code>Referrer-Policy</code>, <code>Permissions-Policy</code> and COOP, which GitHub Pages can&#39;t send.</li>
<li><strong>A strict Content-Security-Policy</strong> on every page: <code>script-src &#39;self&#39;</code> and <code>style-src</code> without <code>&#39;unsafe-inline&#39;</code>. So no inline scripts <strong>or</strong> inline styles, and a test fails the build if any page triggers a CSP violation.</li>
<li><strong>No source maps in production.</strong></li>
<li><strong>Zero known vulnerable dependencies:</strong> moving from Create React App to Vite took <code>npm audit</code> from 62 findings to 0. Dependabot keeps it that way, and every GitHub Action is pinned to a commit SHA.</li>
<li><strong>Visitor input is never rendered as HTML.</strong> All Markdown is rendered at build time from files in the repo.</li>
</ul>
<h2 id="the-ctf-inside">The CTF inside<a class="heading-anchor" href="#the-ctf-inside" aria-label="Link to this section: The CTF inside">#</a></h2>
<p>The terminal speaks a little shell: <code>ls -la</code>, <code>cd</code>, <code>cat</code>, <code>open &lt;post&gt;</code>, <code>hint</code>, <code>submit &lt;flag&gt;</code>, with history and Tab completion. Eight levels in two seasons (10 to 80 points) are hidden in places a player should learn to look. Flags are checked by <strong>SHA-256 hash only</strong>, so reading the JavaScript doesn&#39;t hand over the answers. Progress lives on the <a href="/achievements">achievements page</a>, stored only in your browser.</p>
<p>A test proves every flag is reachable on the built site and matches its hash, so I can&#39;t accidentally ship an unsolvable level.</p>
<h2 id="design-handheld-quest">Design: Handheld Quest<a class="heading-anchor" href="#design-handheld-quest" aria-label="Link to this section: Design: Handheld Quest">#</a></h2>
<p>The look is a pocket game console. The page is the console&#39;s plastic shell: dandelion yellow by day, grape at night. Content sits on &quot;screens&quot; with the handheld&#39;s big bottom-right curve, the terminal is an LCD, and every button is a rubber key that physically presses down.</p>
<p>The mascot is a <strong>32×32 pixel yeti</strong> drawn in code. It has 8 recolourable layers, a 2-frame walk cycle, and a Logo Lab for exporting it in any palette. Everything comes from one set of design tokens, so both themes stay consistent. The site works from 320 px phones up. I used the <a href="https://github.com/Nutlope/hallmark" target="_blank" rel="noopener noreferrer">Hallmark</a> and <a href="https://github.com/pbakaus/impeccable" target="_blank" rel="noopener noreferrer">Impeccable</a> design skills to avoid the generic &quot;AI portfolio&quot; look.</p>
<h2 id="numbers">Numbers<a class="heading-anchor" href="#numbers" aria-label="Link to this section: Numbers">#</a></h2>
<ul>
<li>Lighthouse (local): <strong>Performance 97 · Accessibility 100 · SEO 100</strong></li>
<li>About <strong>82 KB</strong> of gzipped JavaScript; each post&#39;s content loads as its own small chunk</li>
<li>Pixel yeti: <strong>8 KB</strong> for both frames of the sprite; every icon is under 10 KB</li>
</ul>
<h2 id="what-i-learned">What I learned<a class="heading-anchor" href="#what-i-learned" aria-label="Link to this section: What I learned">#</a></h2>
<ul>
<li><strong>Prerendering beats a SPA for a content site.</strong> Hash URLs were invisible to search engines and link previews.</li>
<li><strong>A strict CSP pays for itself.</strong> Dropping <code>&#39;unsafe-inline&#39;</code> surfaced two inline styles hiding in the prerendered HTML, and now a test keeps them from coming back.</li>
<li><strong>Tests for the fun stuff matter too.</strong> An unsolvable CTF level is a bug.</li>
</ul>
<h2 id="stack">Stack<a class="heading-anchor" href="#stack" aria-label="Link to this section: Stack">#</a></h2>
<p>React 19 · React Router 7 · Vite · Tailwind CSS 4 · marked · highlight.js · Playwright · Lighthouse CI · GitHub Actions · GitHub Pages · Cloudflare</p>
<p>The source is open on GitHub (link below). Found something? Tell me, or better yet, find the flags first.</p>
`};export{e as default};
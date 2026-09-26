var e={html:`<p>Thoth is a case-management web app plus an investigation toolbox for investigators in Thailand. Case files, Thai legal documents and the analysis of phone records, bank statements and provider logs live in one place. It&#39;s in production, and most of the heavy analysis runs in the browser, so raw evidence files don&#39;t have to leave the officer&#39;s machine.</p>
<blockquote>
<p><strong>Out of scope.</strong> Thoth handles real cases, so it is <strong>not</strong> part of this site&#39;s CTF. Please don&#39;t test it. If you think you&#39;ve spotted a problem, report it privately instead: the contact is in <a href="/.well-known/security.txt">security.txt</a>.</p>
</blockquote>
<h2>Goals</h2>
<ul>
<li>One place for a case: the file, the people, the documents and the evidence analysis.</li>
<li>Keep evidence files on the client wherever possible.</li>
<li>Security that holds up in real use, not just on paper.</li>
<li>Usable on a phone inside LINE, because that&#39;s where officers actually are.</li>
</ul>
<h2>Features</h2>
<ul>
<li>Case files with Thai document generation (.docx) and request letters to providers</li>
<li>Phone record (CDR) analysis with charts, cell-tower positions and i2 (.anx) export</li>
<li>Bank statement analysis with an editable money-trail graph and i2 export</li>
<li>Provider log tools: IP to provider/ASN lookup and request sheets</li>
<li>Save analysis results into a case: bank accounts, transfers, person profiles</li>
<li>LINE (LIFF) sign-in and mobile-friendly flows</li>
</ul>
<h2>Security</h2>
<p>Only the principles here. The details stay off the internet on purpose.</p>
<ul>
<li><strong>MFA on every account</strong>, with extra verification before anyone is given admin rights.</li>
<li><strong>Least privilege everywhere:</strong> the app gets only the database rights it needs, and the audit trail can&#39;t be rewritten by the app.</li>
<li><strong>Strict input validation, rate limits and security headers</strong> (HSTS, a Content-Security-Policy, nosniff and friends).</li>
<li><strong>Isolated deployment and encrypted backups</strong>, with a release process that backs up first and can roll back in one step.</li>
<li><strong>Safe exports:</strong> spreadsheet formula injection is neutralised in every CSV, XLSX and i2 file.</li>
<li><strong>A security review before every release.</strong> A finding blocks the release until it&#39;s fixed.</li>
</ul>
<h2>Design</h2>
<p>A Thai-first interface with a written design system, light and dark themes, and layouts checked at 375 px and inside the LINE in-app browser. Accessibility checks with axe run as part of the end-to-end tests.</p>
<h2>Numbers</h2>
<p>Measured on 26 September 2026:</p>
<ul>
<li>About <strong>3,200 unit tests</strong> passing (1,956 backend, 1,238 frontend)</li>
<li><strong>412 Playwright end-to-end tests</strong> across desktop, 375 px mobile and LINE profiles</li>
<li>axe: <strong>0 serious or critical issues</strong> across about 55 routes and the key dialogs</li>
</ul>
<h2>What I learned</h2>
<ul>
<li><strong>Fix permissions from inside the thing that owns them.</strong> One recursive permission change on the host took the database offline for hours.</li>
<li><strong>A deploy script can&#39;t upgrade itself.</strong> The copy on the server is the old one until the new release is checked out, so the first upgrade has to run the new release&#39;s own script.</li>
<li><strong>Isolate at the account boundary, not on the code.</strong> Tightening file modes on the source broke the build in surprising ways; a separate account did the job cleanly.</li>
</ul>
<h2>Stack</h2>
<p>Next.js · TypeScript · Bun · Elysia · PostgreSQL · Playwright · axe</p>
<h2>What&#39;s next</h2>
<ul>
<li>Faster analysis for very large bank statements (tens of thousands of rows)</li>
<li>Self-hosted map tiles</li>
<li>A phone-first &quot;work mode&quot; for the analysis tools</li>
</ul>
<p>The source isn&#39;t public.</p>
`};export{e as default};
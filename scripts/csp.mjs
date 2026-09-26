// scripts/csp.mjs
// ใส่ Content-Security-Policy ลงในทุกไฟล์ .html ใน build/ หลัง build
// (ใส่เฉพาะ production เพราะ dev server ต้องใช้ eval/websocket)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "build");
const htmlFiles = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? htmlFiles(path.join(dir, e.name)) : e.name.endsWith(".html") ? [path.join(dir, e.name)] : [],
    );

const policy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}"/>`;
let count = 0;
for (const file of htmlFiles(OUT)) {
  const html = fs.readFileSync(file, "utf8");
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  // วางต่อจาก <meta charset> เพื่อให้ charset ยังอยู่บรรทัดแรก ๆ
  const out = /<meta charset="[^"]*"\s*\/?>/i.test(html)
    ? html.replace(/(<meta charset="[^"]*"\s*\/?>)/i, `$1${meta}`)
    : html.replace("<head>", `<head>${meta}`);
  fs.writeFileSync(file, out);
  count++;
}
console.log(`[csp] added Content-Security-Policy to ${count} HTML files`);

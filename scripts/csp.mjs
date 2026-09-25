// scripts/csp.mjs
// ใส่ Content-Security-Policy ลงใน build/index.html หลัง build
// (ใส่เฉพาะ production เพราะ dev server ต้องใช้ eval/websocket)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(ROOT, "build", "index.html");

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
const html = fs.readFileSync(file, "utf8");
if (!html.includes('http-equiv="Content-Security-Policy"')) {
  // วางต่อจาก <meta charset> เพื่อให้ charset ยังอยู่บรรทัดแรก ๆ
  const out = /<meta charset="[^"]*"\/?>/i.test(html)
    ? html.replace(/(<meta charset="[^"]*"\/?>)/i, `$1${meta}`)
    : html.replace("<head>", `<head>${meta}`);
  fs.writeFileSync(file, out);
}
console.log("[csp] added Content-Security-Policy to build/index.html");

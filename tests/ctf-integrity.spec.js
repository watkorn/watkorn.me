// Every flag must be findable on the built site and match its hash in src/ctf/ctf.js.
// (If you change a flag, update both its hiding place and the hash.)
import { test, expect } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";
import zlib from "node:zlib";

const hashes = [...fs.readFileSync("src/ctf/ctf.js", "utf8").matchAll(/hash: "([0-9a-f]{64})"/g)].map((m) => m[1]);
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const rot13 = (s) =>
  s.replace(/[a-z]/gi, (c) =>
    String.fromCharCode(((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26) + (c <= "Z" ? 65 : 97)),
  );

// just enough PNG to read 8-bit RGB/RGBA pixels (IHDR + IDAT + the five row filters)
function pngPixels(buf) {
  let pos = 8;
  let width, height, channels;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      channels = { 2: 3, 6: 4 }[data[9]];
      if (data[8] !== 8 || !channels) throw new Error("expected an 8-bit RGB(A) PNG");
    } else if (type === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= channels ? out[y * stride + x - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= channels && y > 0 ? out[(y - 1) * stride + x - channels] : 0;
      const p = a + b - c;
      const paeth = Math.abs(p - a) <= Math.abs(p - b) && Math.abs(p - a) <= Math.abs(p - c) ? a : Math.abs(p - b) <= Math.abs(p - c) ? b : c;
      out[y * stride + x] = (v + [0, a, b, (a + b) >> 1, paeth][filter]) & 255;
    }
  }
  return { out, channels };
}

test("all 8 flags are reachable and match their hashes", async ({ request, page }) => {
  test.skip(test.info().project.name !== "desktop", "site-level check, run once");
  expect(hashes).toHaveLength(8);
  const found = [];

  // 1: in the bundle, shown by `cat flag.txt`
  const html = await (await request.get("/")).text();
  const js = await (await request.get(html.match(/src="(\/assets\/index-[^"]+\.js)"/)[1])).text();
  found.push(js.match(/["'`](my_w3b_[a-z0-9_]+)["'`]/)[1]);
  // 2: base64 note in ~/.secret
  found.push(Buffer.from(js.match(/["'`](d2F0a29yb[A-Za-z0-9+/=]+)["'`]/)[1], "base64").toString());
  // 3: rot13 comment in the page source
  found.push(rot13(html.match(/note to self \(level 3\): (\S+)/)[1]));
  // 4: robots.txt -> lair -> hex
  const robots = await (await request.get("/robots.txt")).text();
  const lair = await (await request.get(robots.match(/Disallow: (\S+)/)[1])).text();
  found.push(Buffer.from(lair.match(/<code[^>]*>([0-9a-f ]+)<\/code>/)[1].replace(/ /g, ""), "hex").toString());
  // 5: base64 in the yeti sprite's <metadata>
  const svg = await (await request.get(js.match(/["'`](\/assets\/yeti-[^"'`]+\.svg)["'`]/)[1])).text();
  found.push(Buffer.from(svg.match(/yeti-says: (\S+)</)[1], "base64").toString());

  // 6: forge the session cookie (role=admin; nobody checks the signature), then read /root/flag.txt
  await page.goto("/");
  const input = page.locator("#terminal-input");
  await expect(input).toBeVisible({ timeout: 10_000 });
  const cookie = (await page.context().cookies()).find((c) => c.name === "yeti_session");
  const [head, body, sig] = cookie.value.split(".");
  const claims = { ...JSON.parse(Buffer.from(body, "base64url").toString()), role: "admin" };
  await page.context().addCookies([{ ...cookie, value: `${head}.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.${sig}` }]);
  await input.fill("sudo cat /root/flag.txt");
  await input.press("Enter");
  await expect(page.locator(".terminal__out").last()).toContainText("watkorn{");
  found.push((await page.locator(".terminal__out").last().innerText()).trim());

  // 7: a hex blob in the bundle, XORed with one byte; flags start with "watkorn{"
  const xored = [...js.matchAll(/["'`]([0-9a-f]{16,})["'`]/g)]
    .map((m) => Buffer.from(m[1], "hex"))
    .map((b) => Buffer.from(b.map((x) => x ^ b[0] ^ "w".charCodeAt(0))).toString())
    .find((s) => s.startsWith("watkorn{") && s.endsWith("}"));
  found.push(xored);

  // 8: least significant bits of R, G, B in a blog image, read row by row (zsteg's b1,rgb,lsb,xy)
  const { out, channels } = pngPixels(Buffer.from(await (await request.get("/images/blogs/ctftime.png")).body()));
  const bits = [];
  for (let i = 0; i < out.length; i++) if (i % channels < 3) bits.push(out[i] & 1);
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const byte = bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0);
    if (byte === 0) break;
    bytes.push(byte);
  }
  found.push(Buffer.from(bytes).toString());

  expect(found.map(sha)).toEqual(hashes);
});

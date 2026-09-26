// Every flag must be findable on the built site and match its hash in src/ctf/ctf.js.
// (If you change a flag, update both its hiding place and the hash.)
import { test, expect } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";

const hashes = [...fs.readFileSync("src/ctf/ctf.js", "utf8").matchAll(/hash: "([0-9a-f]{64})"/g)].map((m) => m[1]);
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const rot13 = (s) =>
  s.replace(/[a-z]/gi, (c) =>
    String.fromCharCode(((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26) + (c <= "Z" ? 65 : 97)),
  );

test("all 5 flags are reachable and match their hashes", async ({ request }) => {
  test.skip(test.info().project.name !== "desktop", "site-level check, run once");
  expect(hashes).toHaveLength(5);
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
  found.push(Buffer.from(lair.match(/<code>([0-9a-f ]+)<\/code>/)[1].replace(/ /g, ""), "hex").toString());
  // 5: base64 in the yeti sprite's <metadata>
  const svg = await (await request.get(js.match(/["'`](\/assets\/yeti-[^"'`]+\.svg)["'`]/)[1])).text();
  found.push(Buffer.from(svg.match(/yeti-says: (\S+)</)[1], "base64").toString());

  expect(found.map(sha)).toEqual(hashes);
});

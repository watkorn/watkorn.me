// src/ctf/ctf.js — the mini CTF behind the home terminal.
// Only SHA-256 hashes of the flags live here, so reading this file doesn't give answers away.
// Each flag is hidden somewhere else on the site (see the hints).

export const LEVELS = [
  {
    id: "warmup",
    title: "Warm-up",
    points: 10,
    hint: "Some files are just lying around in the home folder. Try ls, then cat.",
    hash: "1c01c10b2e3b6c1bc2a335ed29c59a46d3818436708a892547c2200870ff2270",
    th: { title: "วอร์มอัพ", hint: "มีไฟล์วางทิ้งไว้ในโฟลเดอร์ home ลอง ls แล้วตามด้วย cat" },
  },
  {
    id: "dotfiles",
    title: "Hidden in plain sight",
    points: 20,
    hint: "ls shows files. ls -la shows *all* of them. What you find there is encoded, not encrypted.",
    hash: "a267f4e21c7b39aaefa1ab36028941fcf1a5f13b622cb512f483e97ed6b2cb68",
    th: { title: "ซ่อนไว้ต่อหน้าต่อตา", hint: "ls แสดงไฟล์ แต่ ls -la แสดง *ทุก* ไฟล์ ของที่เจอข้างในแค่ถูก encode ไม่ได้ถูกเข้ารหัส" },
  },
  {
    id: "source",
    title: "View source",
    points: 30,
    hint: "The page you see isn't the whole page. Try Ctrl+U, and remember Caesar liked 13.",
    hash: "797cc6c79dfa98277823485f8facc331e6f5499161c78baa46d5b2436bf9db0a",
    th: { title: "ดูซอร์สโค้ด", hint: "หน้าที่เห็นไม่ใช่ทั้งหมดของหน้าเว็บ ลองกด Ctrl+U แล้วอย่าลืมว่าซีซาร์ชอบเลข 13" },
  },
  {
    id: "robots",
    title: "Robots only",
    points: 40,
    hint: "Every well-behaved crawler reads one file before anything else. Be badly behaved.",
    hash: "849359e47615d5e19e3ec791bb049056079bc09ae5a549d3b9833397ff05ca70",
    th: { title: "สำหรับหุ่นยนต์เท่านั้น", hint: "crawler ที่มีมารยาทจะอ่านไฟล์หนึ่งก่อนเสมอ ลองทำตัวไม่มีมารยาทดู" },
  },
  {
    id: "sprite",
    title: "Pixel secrets",
    points: 50,
    hint: "The yeti is an SVG. Open the file on its own and look past the pixels.",
    hash: "38dd2dbba7c2c1aebf5e37d8f7c390cfd56a0ba704bf2ca5f645fc470696d0c7",
    th: { title: "ความลับในพิกเซล", hint: "เยติคือไฟล์ SVG ลองเปิดไฟล์นั้นแยกออกมา แล้วมองให้ลึกกว่าพิกเซล" },
  },
];

// title + hint in the reader's language (English is the default)
export const levelText = (level, lang) => (lang === "th" && level.th) || level;

export const TOTAL_POINTS = LEVELS.reduce((sum, l) => sum + l.points, 0);
const KEY = "watkorn:ctf";

export function loadSolved() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((id) => LEVELS.some((l) => l.id === id)) : [];
  } catch {
    return [];
  }
}

export function saveSolved(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // storage blocked (private mode): progress just isn't remembered
  }
}

export function resetSolved() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Returns the matching level, or null. Whitespace around the flag is ignored.
export async function checkFlag(flag) {
  if (!globalThis.crypto?.subtle) return null;
  const h = await sha256(flag.trim());
  return LEVELS.find((l) => l.hash === h) || null;
}

export const score = (solved) => LEVELS.filter((l) => solved.includes(l.id)).reduce((s, l) => s + l.points, 0);

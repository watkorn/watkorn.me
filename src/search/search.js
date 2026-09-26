// src/search/search.js — tiny client-side search over the build-time index (src/generated/search/<lang>.json).
// Substring matching, so Thai (no spaces between words) works without a word segmenter.
// Every word in the query must appear somewhere; title and tag hits rank above body-text hits.

const indexes = import.meta.glob("../generated/search/*.json", { import: "default" });
const cache = {};

export function loadIndex(lang) {
  const load = indexes[`../generated/search/${lang}.json`];
  if (!load) return Promise.reject(new Error(`no search index for ${lang}`));
  cache[lang] ??= load().then((items) =>
    items.map((item) => ({
      item,
      title: norm(item.title),
      tags: norm([...item.tags, item.category || ""].join(" ")),
      headings: norm(item.headings.join(" ")),
      desc: norm(item.desc),
      text: norm(item.text),
    })),
  );
  return cache[lang];
}

const norm = (s) => String(s || "").normalize("NFC").toLowerCase();
export const terms = (query) => norm(query).split(/\s+/).filter(Boolean).slice(0, 8);

const count = (hay, needle) => {
  let n = 0;
  for (let i = hay.indexOf(needle); i !== -1 && n < 10; i = hay.indexOf(needle, i + needle.length)) n++;
  return n;
};

// a ~160-character window of the body around the first match, cut at spaces where possible
function snippet(entry, words) {
  const { item } = entry;
  if (words.some((w) => entry.desc.includes(w))) return item.desc;
  const at = Math.min(...words.map((w) => entry.text.indexOf(w)).filter((i) => i >= 0));
  if (!Number.isFinite(at)) return item.desc;
  let start = Math.max(0, at - 60);
  let end = Math.min(item.text.length, at + 100);
  const space = item.text.lastIndexOf(" ", start + 12);
  if (start > 0 && space > start - 20) start = space + 1;
  const endSpace = item.text.indexOf(" ", end - 12);
  if (endSpace !== -1 && endSpace < end + 20) end = endSpace;
  return `${start > 0 ? "… " : ""}${item.text.slice(start, end).trim()}${end < item.text.length ? " …" : ""}`;
}

export function search(entries, query) {
  const words = terms(query);
  if (!words.length) return [];
  const results = [];
  for (const entry of entries) {
    let score = 0;
    let all = true;
    for (const w of words) {
      let hit = 0;
      if (entry.title.includes(w)) hit += 10;
      if (entry.tags.includes(w)) hit += 6;
      if (entry.headings.includes(w)) hit += 4;
      if (entry.desc.includes(w)) hit += 3;
      const n = count(entry.text, w);
      if (n) hit += 1 + n * 0.2;
      if (!hit) {
        all = false;
        break;
      }
      score += hit;
    }
    if (all) results.push({ ...entry.item, score, snippet: snippet(entry, words) });
  }
  return results.sort((a, b) => b.score - a.score || (b.date || "").localeCompare(a.date || ""));
}

// split text into plain strings and { mark } pieces for the words, for highlighting without innerHTML
export function highlight(text, query) {
  const words = terms(query).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length || !text) return [text];
  const re = new RegExp(`(${words.join("|")})`, "giu");
  return text.split(re).map((part, i) => (i % 2 ? { mark: part } : part));
}

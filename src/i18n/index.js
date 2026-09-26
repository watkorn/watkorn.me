// src/i18n/index.js — English lives at /…, Thai at /th/…
// The language comes from the URL only, so every page has one stable address per language
// (prerendered, indexable, shareable) and the server never has to guess.
import { useLocation } from "react-router-dom";
import { strings } from "./strings";

export const LANGS = ["en", "th"];
export const DEFAULT_LANG = "en";
export const LANG_NAMES = { en: "English", th: "ไทย" };
export const LANG_SHORT = { en: "EN", th: "ไทย" };
export const LOCALES = { en: "en-GB", th: "th-TH" };
export const OG_LOCALES = { en: "en_US", th: "th_TH" };
const PREF_KEY = "lang";

export const langFromPath = (pathname = "/") => (/^\/th(\/|$)/.test(pathname) ? "th" : "en");

// "/th/blogs/x" -> "/blogs/x", "/th" -> "/"
export const stripLang = (pathname = "/") => pathname.replace(/^\/th(?=\/|$)/, "") || "/";

// ("/blogs", "th") -> "/th/blogs", ("/", "th") -> "/th"
export const localizePath = (path, lang) => {
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
};

// "Hello {name}" + { name: "x" } -> "Hello x"
const fill = (text, vars) => (vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : text);

export function translate(lang, key, vars) {
  const text = strings[lang]?.[key] ?? strings[DEFAULT_LANG][key];
  if (text == null) return key;
  return typeof text === "function" ? text(vars || {}) : fill(text, vars);
}

export function formatDate(iso, lang, month = "short") {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(LOCALES[lang], { day: "numeric", month, year: "numeric" });
}

// just the number: 2026 in English, 2569 (Buddhist era, as Thai dates use) in Thai
export const formatYear = (year, lang) =>
  new Intl.DateTimeFormat(LOCALES[lang], { year: "numeric", timeZone: "UTC" })
    .formatToParts(new Date(Date.UTC(year, 6, 1)))
    .find((p) => p.type === "year").value;

export function saveLangPref(lang) {
  try {
    localStorage.setItem(PREF_KEY, lang);
  } catch {
    // storage blocked: the switch still works, it just isn't remembered
  }
}

export function useLang() {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return {
    lang,
    t: (key, vars) => translate(lang, key, vars),
    to: (path) => localizePath(path, lang),
    date: (iso, month) => formatDate(iso, lang, month),
    year: (y) => formatYear(y, lang),
  };
}

// src/data/localize.js
// Content metadata carries every language's title/description under `text`.
// localize() flattens it for one language, falling back to the other one when a post isn't translated yet.
export function localize(item, lang) {
  const shown = item.text[lang] ? lang : item.langs[0];
  return { ...item, ...item.text[shown], lang: shown, translated: shown === lang };
}

export const localizeAll = (items, lang) => items.map((i) => localize(i, lang));

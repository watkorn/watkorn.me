// src/i18n/rich.js — put React elements into a translated string:
// rich("Start with {ls}.", { ls: <kbd>ls</kbd> }) -> ["Start with ", <kbd>ls</kbd>, "."]
// (elements need a key; plain text stays plain text, never HTML)
export function rich(text, nodes) {
  return text.split(/(\{\w+\})/).map((part) => {
    const m = part.match(/^\{(\w+)\}$/);
    return m && m[1] in nodes ? nodes[m[1]] : part;
  });
}

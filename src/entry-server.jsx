// src/entry-server.jsx — ใช้ตอน build เท่านั้น: render แต่ละ URL เป็น HTML (prerender)
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { PreloadedContent } from "./content-context";
import { blogs } from "./data/blogs";
import { projects } from "./data/projects";
import { LANGS, localizePath } from "./i18n";

const bodies = import.meta.glob(["./generated/*/*.json", "!./generated/*/index.json"], {
  eager: true,
  import: "default",
});
const preloaded = {};
for (const [path, mod] of Object.entries(bodies)) {
  const m = path.match(/generated\/(\w+)s\/([^/]+)\.json$/);
  if (m && m[2] !== "index") preloaded[`${m[1]}/${m[2]}`] = mod.html;
}

// every page once per language. `langs` = languages the page really exists in
// (an untranslated post still gets a page on the other site, pointing its canonical at the original)
const pages = [
  { path: "/", langs: LANGS },
  { path: "/blogs", langs: LANGS },
  { path: "/projects", langs: LANGS },
  { path: "/achievements", langs: LANGS },
  ...blogs.map((b) => ({ path: `/blogs/${b.slug}`, langs: b.langs, date: b.date })),
  ...projects.map((p) => ({ path: `/projects/${p.slug}`, langs: p.langs })),
];
export const routes = LANGS.flatMap((lang) =>
  pages.map((page) => ({ ...page, lang, url: localizePath(page.path, lang), original: page.langs.includes(lang) })),
);
export { blogs, projects, LANGS, localizePath };

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <PreloadedContent.Provider value={preloaded}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </PreloadedContent.Provider>
    </HelmetProvider>,
  );
  const { helmet } = helmetContext;
  const head = helmet ? [helmet.title, helmet.meta, helmet.link].map((h) => h.toString()).join("") : "";
  return { html, head };
}

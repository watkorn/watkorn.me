// src/components/PageWrapper.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_LANG, LANGS, OG_LOCALES, localizePath, useLang } from "../i18n";

export const SITE_URL = "https://watkorn.me";

// "/th/blogs" -> "https://watkorn.me/th/blogs/" (the trailing-slash form GitHub Pages serves)
export const absoluteUrl = (path) => `${SITE_URL}${path === "/" ? "/" : `${path}/`}`;

// path = route without the language prefix and without a trailing slash ("/blogs/x").
// langs = languages this page really exists in: hreflang links point only at those, and when
// this page shows a fallback (e.g. an English post on the Thai site) the canonical points at the original.
export default function PageWrapper({
  title,
  description,
  path,
  langs = LANGS,
  type = "website",
  published,
  children,
  className = "",
}) {
  const { lang, t } = useLang();
  const fullTitle = title ? `${title} · WATKORN.ME` : t("meta.homeTitle");
  const desc = description || t("meta.desc");
  const canonicalLang = langs.includes(lang) ? lang : langs[0];
  const url = path != null ? absoluteUrl(localizePath(path, canonicalLang)) : null;
  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content={type} />
        <meta property="og:locale" content={OG_LOCALES[lang]} />
        {url && <meta property="og:url" content={url} />}
        {url && <link rel="canonical" href={url} />}
        {path != null &&
          langs.length > 1 &&
          [...langs, "x-default"].map((l) => (
            <link
              key={l}
              rel="alternate"
              hrefLang={l}
              href={absoluteUrl(localizePath(path, l === "x-default" ? DEFAULT_LANG : l))}
            />
          ))}
        {lang !== DEFAULT_LANG && (
          <link rel="alternate" type="application/rss+xml" title={t("meta.rss")} href={`/${lang}/rss.xml`} />
        )}
        {published && <meta property="article:published_time" content={published} />}
      </Helmet>
      <div className={`page ${className}`}>{children}</div>
    </>
  );
}

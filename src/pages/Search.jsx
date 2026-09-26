// src/pages/Search.jsx — /search?q=… : every post and project, searched in the browser (no server)
import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";
import Icon from "../components/Icon";
import { highlight, loadIndex, search } from "../search/search";
import { blogs } from "../data/blogs";
import { projects } from "../data/projects";
import { LANG_NAMES, useLang } from "../i18n";

// suggestions for an empty box: the tags and categories people can actually find
const SUGGESTIONS = [
  ...new Set([...blogs, ...projects].flatMap((i) => [i.category, ...(i.tags || [])]).filter(Boolean)),
]
  .map((s) => s.toLowerCase())
  .filter((s, i, all) => all.indexOf(s) === i)
  .slice(0, 8);

function Marked({ text, query }) {
  return highlight(text, query).map((part, i) => (typeof part === "string" ? part : <mark key={i}>{part.mark}</mark>));
}

export default function Search() {
  const { lang, t, to, date } = useLang();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    let live = true;
    setEntries(null);
    loadIndex(lang)
      .then((e) => live && setEntries(e))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [lang]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const setQuery = (q) => setParams(q ? { q } : {}, { replace: true });
  const results = entries && query.trim() ? search(entries, query) : [];

  return (
    <PageWrapper title={t("search.title")} path="/search" description={t("search.desc")}>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <header className="page-head">
        <h1 className="page-head__title">{t("search.title")}</h1>
        <p className="page-head__lede">{t("search.lede")}</p>
      </header>

      <form className="search-box" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search-input" className="sr-only">
          {t("search.label")}
        </label>
        <Icon name="search" size={20} className="search-box__icon" />
        <input
          id="search-input"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
        />
      </form>

      <p className="search-status" aria-live="polite">
        {error
          ? t("search.error")
          : !entries
            ? t("search.loading")
            : query.trim()
              ? results.length
                ? t("search.count", { n: results.length })
                : t("search.none", { q: query.trim() })
              : t("search.shortcut")}
      </p>

      {!query.trim() && (
        <nav className="filter-row filter-row--flat" aria-label={t("search.try")}>
          <span className="filter-row__label">{t("search.try")}</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="chip-filter" onClick={() => setQuery(s)}>
              {s}
            </button>
          ))}
        </nav>
      )}

      {results.length > 0 && (
        <div className="screen">
          <ul className="quest-list" role="list">
            {results.map((r) => (
              <li key={`${r.type}/${r.slug}`}>
                <Link to={to(`/${r.type}s/${r.slug}`)} className="quest">
                  <span className="quest__cursor" aria-hidden="true">
                    <Icon name="pointer" size={16} />
                  </span>
                  <span className="quest__body">
                    <span className="quest__title" lang={r.lang === lang ? undefined : r.lang}>
                      <Marked text={r.title} query={query} />
                    </span>
                    {r.snippet && (
                      <span className="quest__desc" lang={r.lang === lang ? undefined : r.lang}>
                        <Marked text={r.snippet} query={query} />
                      </span>
                    )}
                    <span className="quest__meta">
                      <span className="badge badge--kind">{t(`kind.${r.type}`)}</span>
                      {r.lang !== lang && (
                        <span className="badge badge--lang" lang={r.lang}>
                          {LANG_NAMES[r.lang]}
                        </span>
                      )}
                      {r.category && <span className="badge">{r.category}</span>}
                      {r.date && <time dateTime={r.date}>{date(r.date)}</time>}
                      {r.tags.map((tag) => (
                        <span key={tag} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="quest__go" aria-hidden="true">
                    <Icon name="arrow-right" size={20} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageWrapper>
  );
}

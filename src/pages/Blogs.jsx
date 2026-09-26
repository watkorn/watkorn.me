// src/pages/Blogs.jsx
import React from "react";
import PageWrapper from "../components/PageWrapper";
import GroupedIndex from "../components/GroupedIndex";
import TagFilter, { filtersFor, matchesFilter, useActiveFilter } from "../components/TagFilter";
import { blogs } from "../data/blogs";
import { localizeAll } from "../data/localize";
import { useLang } from "../i18n";

// CTF categories (web, pwn…) and tags
const FILTERS = filtersFor(blogs, { withCategories: true });

function groupByYear(list, formatYear) {
  const years = [...new Set(list.map((b) => b.year))].sort((a, b) => b - a);
  // newest post first inside each year
  return years.map((y) => ({
    key: String(y),
    label: formatYear(y),
    unit: "post",
    items: list.filter((b) => b.year === y).sort((a, b) => b.date.localeCompare(a.date)),
  }));
}

export default function Blogs() {
  const { lang, t, year } = useLang();
  const [active, pick] = useActiveFilter(FILTERS.all);
  const groups = groupByYear(
    localizeAll(blogs, lang).filter((b) => matchesFilter(b, active)),
    year,
  );

  return (
    <PageWrapper path="/blogs" title={t("blogs.title")} description={t("blogs.desc")}>
      <header className="page-head">
        <h1 className="page-head__title">{t("blogs.title")}</h1>
        <p className="page-head__lede">{t("blogs.lede")}</p>
      </header>

      <TagFilter filters={FILTERS} active={active} onPick={pick} label={t("blogs.filter")} />

      <GroupedIndex
        groups={groups}
        basePath="/blogs"
        idPrefix="year"
        emptyText={active ? t("blogs.emptyTag", { tag: active }) : t("blogs.empty")}
      />
    </PageWrapper>
  );
}

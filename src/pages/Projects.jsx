// src/pages/Projects.jsx
import React from "react";
import PageWrapper from "../components/PageWrapper";
import GroupedIndex from "../components/GroupedIndex";
import TagFilter, { filtersFor, matchesFilter, useActiveFilter } from "../components/TagFilter";
import { groupByCategory, projects } from "../data/projects";
import { localizeAll } from "../data/localize";
import { useLang } from "../i18n";

// projects are already grouped by category, so the chips are tags only
const FILTERS = filtersFor(projects);

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function Projects() {
  const { lang, t } = useLang();
  const [active, pick] = useActiveFilter(FILTERS.all);
  const list = localizeAll(projects, lang).filter((p) => matchesFilter(p, active));
  const groups = groupByCategory(list).map(({ category, data }) => ({
    key: slugify(category),
    label: category,
    unit: "project",
    items: data,
  }));

  return (
    <PageWrapper path="/projects" title={t("projects.title")} description={t("projects.desc")}>
      <header className="page-head">
        <h1 className="page-head__title">{t("projects.title")}</h1>
        <p className="page-head__lede">{t("projects.lede")}</p>
      </header>

      <TagFilter filters={FILTERS} active={active} onPick={pick} label={t("projects.filter")} />

      <GroupedIndex
        groups={groups}
        basePath="/projects"
        idPrefix="category"
        emptyText={active ? t("blogs.emptyTag", { tag: active }) : t("projects.empty")}
      />
    </PageWrapper>
  );
}

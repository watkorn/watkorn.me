// src/pages/Projects.jsx
import React from "react";
import PageWrapper from "../components/PageWrapper";
import GroupedIndex from "../components/GroupedIndex";
import { groupByCategory, projects } from "../data/projects";
import { localizeAll } from "../data/localize";
import { useLang } from "../i18n";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function Projects() {
  const { lang, t } = useLang();
  const groups = groupByCategory(localizeAll(projects, lang)).map(({ category, data }) => ({
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
      <GroupedIndex groups={groups} basePath="/projects" idPrefix="category" emptyText={t("projects.empty")} />
    </PageWrapper>
  );
}

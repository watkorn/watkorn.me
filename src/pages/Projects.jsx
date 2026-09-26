// src/pages/Projects.jsx
import React from "react";
import PageWrapper from "../components/PageWrapper";
import GroupedIndex from "../components/GroupedIndex";
import { sortedCategories } from "../data/projects";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const groups = sortedCategories.map(({ category, data }) => ({
  key: slugify(category),
  label: category,
  unit: "project",
  items: data,
}));

export default function Projects() {
  return (
    <PageWrapper path={"/projects"} title="Projects" description="Tools and side projects by watkorn.">
      <header className="page-head">
        <h1 className="page-head__title">Projects</h1>
        <p className="page-head__lede">Tools I built to try things out. Some useful, all fun.</p>
      </header>
      <GroupedIndex
        groups={groups}
        basePath="/projects"
        idPrefix="category"
        emptyText="Inventory empty. Projects coming soon."
      />
    </PageWrapper>
  );
}

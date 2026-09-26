// src/pages/Blogs.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import GroupedIndex from "../components/GroupedIndex";
import { blogs } from "../data/blogs";

// every filter value: CTF categories first, then tags
const categories = [...new Set(blogs.map((b) => b.category).filter(Boolean))].sort();
const tags = [...new Set(blogs.flatMap((b) => b.tags || []))].filter((t) => !categories.includes(t)).sort();
const FILTERS = [...categories, ...tags];

const matches = (b, f) => !f || b.category === f || (b.tags || []).includes(f);

function groupByYear(list) {
  const years = [...new Set(list.map((b) => b.year))].sort((a, b) => b - a);
  // newest post first inside each year
  return years.map((y) => ({
    key: String(y),
    label: String(y),
    unit: "post",
    items: list.filter((b) => b.year === y).sort((a, b) => b.date.localeCompare(a.date)),
  }));
}

export default function Blogs() {
  const [params, setParams] = useSearchParams();
  const active = FILTERS.includes(params.get("tag")) ? params.get("tag") : null;
  const groups = groupByYear(blogs.filter((b) => matches(b, active)));

  const pick = (f) => setParams(f ? { tag: f } : {}, { replace: true });

  return (
    <PageWrapper path="/blogs" title="Blogs" description="CTF writeups, notes, and things I broke on purpose.">
      <header className="page-head">
        <h1 className="page-head__title">Blogs</h1>
        <p className="page-head__lede">Writeups, notes, and things I broke on purpose. Spoilers inside, obviously.</p>
      </header>

      {FILTERS.length > 0 && (
        <nav className="filter-row" aria-label="Filter posts">
          <button type="button" className="chip-filter" aria-pressed={!active} onClick={() => pick(null)}>
            All
          </button>
          {FILTERS.map((f) => (
            <button key={f} type="button" className="chip-filter" aria-pressed={active === f} onClick={() => pick(f)}>
              {categories.includes(f) ? f : `#${f}`}
            </button>
          ))}
        </nav>
      )}

      <GroupedIndex
        groups={groups}
        basePath="/blogs"
        idPrefix="year"
        emptyText={active ? `Nothing tagged "${active}" yet.` : "No posts yet. The first writeup is loading…"}
      />
    </PageWrapper>
  );
}

// src/components/TagFilter.jsx — filter chips for an index page, kept in the URL (?tag=…) so a filter can be shared
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "../i18n";

// every filter value: categories first (shown bare), then tags (shown as #tag)
export function filtersFor(items, { withCategories = false } = {}) {
  const categories = withCategories ? [...new Set(items.map((i) => i.category).filter(Boolean))].sort() : [];
  const tags = [...new Set(items.flatMap((i) => i.tags || []))].filter((t) => !categories.includes(t)).sort();
  return { categories, all: [...categories, ...tags] };
}

export const matchesFilter = (item, f) => !f || item.category === f || (item.tags || []).includes(f);

export function useActiveFilter(all) {
  const [params, setParams] = useSearchParams();
  const active = all.includes(params.get("tag")) ? params.get("tag") : null;
  const pick = (f) => setParams(f ? { tag: f } : {}, { replace: true });
  return [active, pick];
}

export default function TagFilter({ filters, active, onPick, label }) {
  const { t } = useLang();
  if (filters.all.length === 0) return null;
  return (
    <nav className="filter-row" aria-label={label}>
      <button type="button" className="chip-filter" aria-pressed={!active} onClick={() => onPick(null)}>
        {t("blogs.all")}
      </button>
      {filters.all.map((f) => (
        <button key={f} type="button" className="chip-filter" aria-pressed={active === f} onClick={() => onPick(f)}>
          {filters.categories.includes(f) ? f : `#${f}`}
        </button>
      ))}
    </nav>
  );
}

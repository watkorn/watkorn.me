// src/components/GroupedIndex.jsx
// หน้า index ที่จัดกลุ่ม (blogs ตามปี / projects ตามหมวด) + ปุ่มกระโดดไปกลุ่ม + Load more
import React, { useState } from "react";
import QuestList from "./QuestList";

const ITEMS_PER_LOAD = 5;

export default function GroupedIndex({ groups, basePath, idPrefix, emptyText }) {
  const [visible, setVisible] = useState({});

  if (groups.length === 0) {
    return (
      <div className="screen">
        <p className="empty">{emptyText}</p>
      </div>
    );
  }

  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      {groups.length > 1 && (
        <nav className="jump-row" aria-label="Jump to section">
          {groups.map((g) => (
            <button key={g.key} type="button" className="key key--sm" onClick={() => jump(`${idPrefix}-${g.key}`)}>
              {g.label}
            </button>
          ))}
        </nav>
      )}

      {groups.map((g) => {
        const shown = visible[g.key] ?? ITEMS_PER_LOAD;
        return (
          <section key={g.key} id={`${idPrefix}-${g.key}`} className="group" aria-labelledby={`${idPrefix}-${g.key}-h`}>
            <h2 id={`${idPrefix}-${g.key}-h`} className="group__title">
              {g.label}
              <span className="group__count">
                {g.items.length} {g.items.length === 1 ? g.unit : `${g.unit}s`}
              </span>
            </h2>
            <div className="screen">
              <QuestList items={g.items.slice(0, shown)} basePath={basePath} />
              {shown < g.items.length && (
                <div className="group__more">
                  <button
                    type="button"
                    className="key"
                    onClick={() => setVisible((v) => ({ ...v, [g.key]: shown + ITEMS_PER_LOAD }))}
                  >
                    Load {Math.min(ITEMS_PER_LOAD, g.items.length - shown)} more
                  </button>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

// src/components/QuestList.jsx
// รายการแบบเมนูเลือกเซฟในเกม: ลูกศรชี้ข้างรายการที่ hover/focus อยู่
import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function QuestList({ items, basePath }) {
  return (
    <ul className="quest-list" role="list">
      {items.map((item) => (
        <li key={item.slug}>
          <Link to={`${basePath}/${item.slug}`} className="quest">
            <span className="quest__cursor" aria-hidden="true">
              <Icon name="pointer" size={16} />
            </span>
            <span className="quest__body">
              <span className="quest__title">{item.title}</span>
              {item.desc && <span className="quest__desc">{item.desc}</span>}
              <span className="quest__meta">
                {item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}
                {item.readingMinutes ? <span>{item.readingMinutes} min read</span> : null}
                {item.tags?.map((t) => (
                  <span key={t} className="tag">
                    #{t}
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
  );
}

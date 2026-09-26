// src/components/QuestList.jsx
// รายการแบบเมนูเลือกเซฟในเกม: ลูกศรชี้ข้างรายการที่ hover/focus อยู่
import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { LANG_NAMES, useLang } from "../i18n";

// items are already localized (src/data/localize.js); an untranslated one gets a language badge
export default function QuestList({ items, basePath }) {
  const { t, to, date } = useLang();
  return (
    <ul className="quest-list" role="list">
      {items.map((item) => (
        <li key={item.slug}>
          <Link to={to(`${basePath}/${item.slug}`)} className="quest">
            <span className="quest__cursor" aria-hidden="true">
              <Icon name="pointer" size={16} />
            </span>
            <span className="quest__body">
              <span className="quest__title" lang={item.translated === false ? item.lang : undefined}>
                {item.title}
              </span>
              {item.desc && (
                <span className="quest__desc" lang={item.translated === false ? item.lang : undefined}>
                  {item.desc}
                </span>
              )}
              <span className="quest__meta">
                {item.translated === false && (
                  <span className="badge badge--lang" lang={item.lang}>
                    {LANG_NAMES[item.lang]}
                  </span>
                )}
                {item.event && <span>{item.event}</span>}
                {item.category && <span className="badge">{item.category}</span>}
                {item.difficulty && <span className={`badge badge--${item.difficulty}`}>{item.difficulty}</span>}
                {item.date && <time dateTime={item.date}>{date(item.date)}</time>}
                {item.readingMinutes ? <span>{t("list.minRead", { n: item.readingMinutes })}</span> : null}
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

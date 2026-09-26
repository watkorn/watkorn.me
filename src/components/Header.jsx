import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import Yeti from "./Yeti";
import Icon from "./Icon";
import { stripLang, useLang } from "../i18n";

const menuItems = [
  { key: "nav.home", path: "/", className: "pill-nav__item--home" },
  { key: "nav.blogs", path: "/blogs" },
  { key: "nav.projects", path: "/projects" },
];

// เมนูเป็นปุ่ม Start/Select: ปุ่มเม็ดยาว + ป้ายชื่อด้านล่าง ใช้ได้ทั้งจอใหญ่และมือถือ (ไม่ต้องมีเมนูซ่อน)
export default function Header() {
  const { t, to } = useLang();
  // compare without the /th prefix, so "/th/" counts as Home and "/th/blogs/x" as Blogs
  const current = stripLang(useLocation().pathname).replace(/(.)\/$/, "$1");
  const isActive = (path) => (path === "/" ? current === "/" : current === path || current.startsWith(`${path}/`));
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        {t("nav.skip")}
      </a>
      <div className="site-header__inner">
        <Link to={to("/")} className="brand" aria-label={t("brand.home")}>
          <Yeti bg="circle" />
          <span className="brand__word">WATKORN.ME</span>
        </Link>

        <nav className="pill-nav" aria-label={t("nav.main")}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={to(item.path)}
                aria-current={active ? "page" : undefined}
                className={["pill-nav__item", item.className, active && "is-active"].filter(Boolean).join(" ")}
              >
                <span className="pill-nav__pill" aria-hidden="true" />
                <span className="pill-nav__label">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        <Link to={to("/search")} className="header-search" aria-label={t("search.label")} title={`${t("search.label")} (/)`}>
          <Icon name="search" size={22} />
        </Link>
        <LangSwitch />
        <ThemeToggle />
      </div>
    </header>
  );
}

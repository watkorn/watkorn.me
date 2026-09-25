import React from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logoLight from "../assets/profile-light.png";
import logoDark from "../assets/profile-dark.png";
import { useTheme } from "../theme";

const menuItems = [
  { label: "Home", to: "/", end: true },
  { label: "Blogs", to: "/blogs" },
  { label: "Projects", to: "/projects" },
];

// เมนูเป็นปุ่ม Start/Select: ปุ่มเม็ดยาว + ป้ายชื่อด้านล่าง ใช้ได้ทั้งจอใหญ่และมือถือ (ไม่ต้องมีเมนูซ่อน)
export default function Header() {
  const { theme } = useTheme();

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="WATKORN.ME home">
          <img src={theme === "dark" ? logoDark : logoLight} alt="" width="40" height="40" />
          <span className="brand__word">WATKORN.ME</span>
        </Link>

        <nav className="pill-nav" aria-label="Main">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `pill-nav__item${isActive ? " is-active" : ""}`}
            >
              <span className="pill-nav__pill" aria-hidden="true" />
              <span className="pill-nav__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

import React from "react";
import { useTheme } from "../theme";
import { useLang } from "../i18n";

// สวิตช์สไลด์แบบเครื่องเกมพกพา: ร่องลึก + ปุ่มเลื่อนมีร่อง + ตัวพิมพ์ light / dark
// (ตัวพิมพ์อยู่นอกปุ่ม เพื่อให้ชื่อที่ screen reader อ่าน = "Dark mode" / "โหมดมืด" ตรงกับปุ่ม)
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const dark = theme === "dark";

  return (
    <div className="power-switch">
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label={t("theme.dark")}
        title={dark ? t("theme.toLight") : t("theme.toDark")}
        className="power-switch__button"
        onClick={toggleTheme}
      >
        <span className="power-switch__track" aria-hidden="true">
          <span className="power-switch__slider" />
        </span>
      </button>
      <span className="power-switch__legend" aria-hidden="true" onClick={toggleTheme}>
        <span className={dark ? "" : "is-on"}>{t("theme.light")}</span>
        <span className={dark ? "is-on" : ""}>{t("theme.darkShort")}</span>
      </span>
    </div>
  );
}

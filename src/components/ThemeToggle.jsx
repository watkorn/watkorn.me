import React from "react";
import { useTheme } from "../theme";

// สวิตช์สไลด์แบบเครื่องเกมพกพา: ร่องลึก + ปุ่มเลื่อนมีร่อง + ตัวพิมพ์ light / dark
// (ตัวพิมพ์อยู่นอกปุ่ม เพื่อให้ชื่อที่ screen reader อ่าน = "Dark mode" ตรงกับปุ่ม)
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="power-switch">
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Dark mode"
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="power-switch__button"
        onClick={toggleTheme}
      >
        <span className="power-switch__track" aria-hidden="true">
          <span className="power-switch__slider" />
        </span>
      </button>
      <span className="power-switch__legend" aria-hidden="true" onClick={toggleTheme}>
        <span className={dark ? "" : "is-on"}>light</span>
        <span className={dark ? "is-on" : ""}>dark</span>
      </span>
    </div>
  );
}

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// ธีมเริ่มต้นถูกตั้งไว้แล้วโดย public/theme-init.js (localStorage หรือค่าของระบบ)
const initialTheme = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // private mode / storage blocked: ธีมยังเปลี่ยนได้ แค่ไม่ถูกจำ
    }
    setTheme(next);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

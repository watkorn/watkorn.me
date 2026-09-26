/** @type {import('tailwindcss').Config} */
// สี/ฟอนต์ทั้งหมดอยู่ใน src/styles/tokens.css (CSS variables) — Tailwind ใช้แค่ reset + typography plugin
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

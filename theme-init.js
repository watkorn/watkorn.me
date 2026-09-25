// ตั้งธีมก่อน React โหลด เพื่อไม่ให้หน้าเว็บกระพริบสีผิด
// (ไฟล์แยก ไม่ใช่ inline script เพื่อให้ผ่าน CSP script-src 'self')
(function () {
  var theme;
  try {
    theme = localStorage.getItem("theme");
  } catch (e) {}
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (theme === "dark") document.documentElement.classList.add("dark");
})();

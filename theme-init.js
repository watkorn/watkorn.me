// ตั้งธีมก่อน React โหลด เพื่อไม่ให้หน้าเว็บกระพริบสีผิด
// (ไฟล์แยก ไม่ใช่ inline script เพื่อให้ผ่าน CSP script-src 'self')
(function () {
  var theme, lang;
  try {
    theme = localStorage.getItem("theme");
    lang = localStorage.getItem("lang");
  } catch (e) {}
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (theme === "dark") document.documentElement.classList.add("dark");

  // ภาษา: เปิด watkorn.me/ ตรงๆ แล้วเคยเลือกภาษาไทยไว้ (หรือยังไม่เคยเลือกแต่เบราว์เซอร์ตั้งเป็นไทย) -> ไป /th/
  // เฉพาะหน้าแรกเท่านั้น ลิงก์ที่คนอื่นแชร์มาจะเปิดตามภาษาในลิงก์เสมอ
  if (location.pathname === "/" && !location.hash) {
    var prefersThai = /^th\b/i.test((navigator.languages && navigator.languages[0]) || navigator.language || "");
    if (lang === "th" || (!lang && prefersThai)) location.replace("/th/" + location.search);
  }
})();

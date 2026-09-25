/**
 * Scroll ไปยัง element ด้วย id
 * @param {string} id - id ของ element
 */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Format วันที่ให้อ่านง่าย
 * @param {string|Date} date
 * @returns {string} เช่น "7 ตุลาคม 2025"
 */
export function formatDate(date) {
  const d = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return d.toLocaleDateString("th-TH", options);
}

/**
 * Sort object ตามปีจากมากไปน้อย
 * @param {Object} obj - เช่น blogsData
 * @returns {Array} [{ year, data }]
 */
export function sortByYearDesc(obj) {
  return Object.keys(obj)
    .sort((a, b) => b - a)
    .map((year) => ({ year, data: obj[year] }));
}

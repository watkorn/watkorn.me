// src/data/projects.js
// ข้อมูลมาจาก content/projects/*.md (สร้างโดย scripts/content.mjs ตอน build), เรียงตาม order
import projects from "../generated/projects/index.json";

// จัดกลุ่มตาม category (เรียงตาม order ใน frontmatter)
export const groupByCategory = (list) =>
  list.reduce((acc, p) => {
    const categoryEntry = acc.find((c) => c.category === p.category);
    if (categoryEntry) {
      categoryEntry.data.push(p);
    } else {
      acc.push({ category: p.category, data: [p] });
    }
    return acc;
  }, []);

export { projects };

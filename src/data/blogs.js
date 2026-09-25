// src/data/blogs.js
// ข้อมูลมาจาก content/blogs/*.md (สร้างโดย scripts/content.mjs ตอน build)
import blogs from "../generated/blogs/index.json";

// จัดกลุ่มตามปี (ปีใหม่สุดก่อน)
export const sortedYears = blogs
  .reduce((acc, blog) => {
    const yearEntry = acc.find((y) => y.year === blog.year);
    if (yearEntry) {
      yearEntry.data.push(blog);
    } else {
      acc.push({ year: blog.year, data: [blog] });
    }
    return acc;
  }, [])
  .sort((a, b) => b.year - a.year);

export { blogs };

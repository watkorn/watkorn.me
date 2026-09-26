// src/data/blogs.js
// ข้อมูลมาจาก content/blogs/*.md (สร้างโดย scripts/content.mjs ตอน build), เรียงจากเก่าไปใหม่
// ใช้ localize(blog, lang) / localizeAll(blogs, lang) เพื่อได้ title/desc ตามภาษา
import blogs from "../generated/blogs/index.json";

export { blogs };

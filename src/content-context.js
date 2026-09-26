// src/content-context.js
// เนื้อหาโพสต์ที่ "มีอยู่แล้ว" ตอน render ครั้งแรก:
// - ตอน prerender (build) = HTML ของทุกโพสต์จาก src/generated
// - ในเบราว์เซอร์ = HTML ที่ prerender ไว้ในหน้า (อ่านจาก DOM ก่อน React render) → ไม่มีหน้า loading กระพริบ
import { createContext } from "react";

export const PreloadedContent = createContext({});

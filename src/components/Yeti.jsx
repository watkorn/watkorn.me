// src/components/Yeti.jsx
// โลโก้เยติแบบพิกเซล 32×32 (sprite 2 เฟรม) เปลี่ยนสีได้ทุกชั้นผ่าน CSS variables (--yeti-*)
//   palette: ไม่ใส่ = ตามธีมเว็บ (light/dark) · "snow" | "dandelion" | "night" | "lcd" | "berry" | "ink"
//   bg:      "none" (ไม่มีพื้นหลัง) | "circle" | "screen" (มุมล่างขวาโค้งแบบเครื่องเกม) | "square"
//   walk:    true = สลับเฟรมเดินวนไปเรื่อย ๆ (ปิดเองเมื่อผู้ใช้ตั้ง reduce motion)
// แก้หน้าตาตัวละคร: brand/yeti_sprite.py แล้วรัน `python3 brand/build.py`
import React from "react";
import yetiUrl from "../assets/yeti.svg";

const SHAPES = {
  circle: <circle cx="50" cy="50" r="50" className="yeti__bg" />,
  screen: (
    <path
      className="yeti__bg"
      d="M10 0H90A10 10 0 0 1 100 10V70A30 30 0 0 1 70 100H10A10 10 0 0 1 0 90V10A10 10 0 0 1 10 0Z"
    />
  ),
  square: <rect width="100" height="100" rx="22" className="yeti__bg" />,
};
const INSET = { none: 0, circle: 14, screen: 8, square: 10 };

export default function Yeti({ palette, bg = "none", walk = false, size, title, className = "", ...rest }) {
  const inset = INSET[bg] ?? 0;
  const inner = 100 - inset * 2;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`yeti${palette ? ` yeti--${palette}` : ""}${walk ? " is-walking" : ""} ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      {SHAPES[bg]}
      <svg x={inset} y={inset} width={inner} height={inner} viewBox="0 0 32 32" shapeRendering="crispEdges">
        <use className="yeti__f1" href={`${yetiUrl}#yeti`} />
        <use className="yeti__f2" href={`${yetiUrl}#yeti-step`} />
      </svg>
    </svg>
  );
}

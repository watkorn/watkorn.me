// src/components/Yeti.jsx
// โลโก้เยติแบบเวกเตอร์ เปลี่ยนสีได้ทุกชั้นผ่าน CSS variables (--yeti-*)
//   palette: ไม่ใส่ = ตามธีมเว็บ (light/dark) · "snow" | "dandelion" | "night" | "lcd" | "berry" | "ink"
//   bg:      "none" (ไม่มีพื้นหลัง) | "circle" | "screen" (มุมล่างขวาโค้งแบบเครื่องเกม) | "square"
//   crop:    "full" (ทั้งตัว) | "head" (เฉพาะหัว เหมาะกับไอคอนเล็ก)
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
const INSET = { none: 0, circle: 12, screen: 6, square: 8 };
// พื้นที่ของสัญลักษณ์ #yeti (436×436) ที่จะแสดง
const CROP = { full: [0, 0, 436], head: [120, 20, 200] };

export default function Yeti({ palette, bg = "none", crop = "full", size, title, className = "", ...rest }) {
  const inset = INSET[bg] ?? 0;
  const inner = 100 - inset * 2;
  const [cx, cy, cs] = CROP[crop] ?? CROP.full;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`yeti${palette ? ` yeti--${palette}` : ""} ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      {SHAPES[bg]}
      <svg x={inset} y={inset} width={inner} height={inner} viewBox={`${cx} ${cy} ${cs} ${cs}`} overflow="hidden">
        <use href={`${yetiUrl}#yeti`} width="436" height="436" />
      </svg>
    </svg>
  );
}

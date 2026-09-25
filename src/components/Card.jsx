import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ id, slug, title, desc, type }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "blog") {
      navigate(`/blogs/${slug}`);  // ใช้ slug จาก props
    } else if (type === "project") {
      navigate(`/projects/${slug}`);
    }
  };

  return (
    <div onClick={handleClick} className="card">
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>

  );
}

// src/pages/BlogDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { blogs } from "../data/blogs";
import DetailTemplate from "../components/DetailTemplate";

export default function BlogDetail() {
  const { slug } = useParams();
  return <DetailTemplate meta={blogs.find((b) => b.slug === slug)} type="blog" allMeta={blogs} />;
}

// src/pages/BlogDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { blogs as blogsMeta } from "../data/blogs";
import DetailTemplate from "../components/DetailTemplate";

export default function BlogDetail() {
  const { slug } = useParams();
  const meta = blogsMeta.find((b) => b.slug === slug);

  return <DetailTemplate meta={meta} type="blog" allMeta={blogsMeta} />;
}

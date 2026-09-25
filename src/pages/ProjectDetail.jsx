// src/pages/ProjectDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { projects as projectsMeta } from "../data/projects";
import DetailTemplate from "../components/DetailTemplate";

export default function ProjectDetail() {
  const { slug } = useParams();
  const meta = projectsMeta.find((p) => p.slug === slug);

  return <DetailTemplate meta={meta} type="project" allMeta={projectsMeta} />;
}

// src/pages/ProjectDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { projects } from "../data/projects";
import DetailTemplate from "../components/DetailTemplate";

export default function ProjectDetail() {
  const { slug } = useParams();
  return <DetailTemplate meta={projects.find((p) => p.slug === slug)} type="project" allMeta={projects} />;
}

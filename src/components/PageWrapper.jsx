// src/components/PageWrapper.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function PageWrapper({ title, description, children, className = "" }) {
  const fullTitle = title && title !== "WATKORN.ME" ? `${title} · WATKORN.ME` : "WATKORN.ME";
  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className={`page ${className}`}>{children}</div>
    </>
  );
}

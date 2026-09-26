// src/components/PageWrapper.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://watkorn.me";
const DEFAULT_DESC =
  "Watcharakorn Khambung (watkorn): CTF writeups, security tools, and a terminal with five flags hidden in it.";

// path = route without trailing slash; canonical URLs use the trailing-slash form GitHub Pages serves
export default function PageWrapper({
  title,
  description,
  path,
  type = "website",
  published,
  children,
  className = "",
}) {
  const fullTitle = title && title !== "WATKORN.ME" ? `${title} · WATKORN.ME` : "WATKORN.ME · find the flags";
  const desc = description || DEFAULT_DESC;
  const url = path != null ? `${SITE_URL}${path === "/" ? "/" : `${path}/`}` : null;
  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content={type} />
        {url && <meta property="og:url" content={url} />}
        {url && <link rel="canonical" href={url} />}
        {published && <meta property="article:published_time" content={published} />}
      </Helmet>
      <div className={`page ${className}`}>{children}</div>
    </>
  );
}

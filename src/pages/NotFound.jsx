// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";
import { useLang } from "../i18n";

export default function NotFound() {
  const { t, to } = useLang();
  return (
    <PageWrapper title={t("nf.title")} className="page--narrow">
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="bezel">
        <div className="lcd lcd--center">
          <p className="lcd__big">GAME OVER</p>
          <p>{t("nf.text")}</p>
        </div>
      </div>
      <div className="button-row">
        <Link to={to("/")} className="key key--a">
          {t("nf.home")}
        </Link>
        <Link to={to("/blogs")} className="key">
          {t("nf.blogs")}
        </Link>
      </div>
    </PageWrapper>
  );
}

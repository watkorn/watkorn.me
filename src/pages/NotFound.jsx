// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper title="404" className="page--narrow">
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="bezel">
        <div className="lcd lcd--center">
          <p className="lcd__big">GAME OVER</p>
          <p>404: this page is not in the cartridge.</p>
        </div>
      </div>
      <div className="button-row">
        <Link to="/" className="key key--a">
          Continue from Home
        </Link>
        <Link to="/blogs" className="key">
          Read the blogs
        </Link>
      </div>
    </PageWrapper>
  );
}

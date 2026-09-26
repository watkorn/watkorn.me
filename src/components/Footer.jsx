import React from "react";
import { useLang } from "../i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <p className="site-footer__quote">
        <span className="led" aria-hidden="true" />
        {t("footer.quote")}
      </p>
      <p className="site-footer__copy">
        &copy; {new Date().getFullYear()} Watcharakorn Khambung. {t("footer.copy")}
      </p>
    </footer>
  );
}

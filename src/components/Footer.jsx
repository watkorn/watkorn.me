import React from "react";

const quote = "Flags don’t hide. You just haven’t looked hard enough.";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__quote">
        <span className="led" aria-hidden="true" />
        {quote}
      </p>
      <p className="site-footer__copy">
        &copy; {new Date().getFullYear()} Watcharakorn Khambung. Built static, served from GitHub Pages.
      </p>
    </footer>
  );
}

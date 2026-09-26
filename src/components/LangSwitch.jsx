// src/components/LangSwitch.jsx — EN ⇄ ไทย
// A plain link to the same page in the other language (so it works without JS and crawlers can follow it).
// The choice is remembered so that opening watkorn.me/ later lands on the same language (public/theme-init.js).
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { LANG_SHORT, LANG_NAMES, localizePath, saveLangPref, stripLang, translate, useLang } from "../i18n";

export default function LangSwitch() {
  const { lang } = useLang();
  const { pathname, search } = useLocation();
  const target = lang === "th" ? "en" : "th";
  const to = `${localizePath(stripLang(pathname), target)}${search}`;

  return (
    <Link
      to={to}
      className="lang-switch"
      hrefLang={target}
      lang={target}
      title={translate(target, "lang.readIn")}
      onClick={() => saveLangPref(target)}
    >
      <Icon name="globe" size={20} className="lang-switch__icon" />
      <span className="lang-switch__label">{LANG_SHORT[target]}</span>
      {LANG_SHORT[target] !== LANG_NAMES[target] && <span className="sr-only"> ({LANG_NAMES[target]})</span>}
    </Link>
  );
}

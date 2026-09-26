// src/pages/Achievements.jsx — progress for the terminal mini-CTF (stored only in this browser)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { rich } from "../i18n/rich";
import Yeti from "../components/Yeti";
import { LEVELS, TOTAL_POINTS, checkFlag, levelText, loadSolved, resetSolved, saveSolved, score } from "../ctf/ctf";
import { useLang } from "../i18n";

export default function Achievements() {
  const { lang, t, to } = useLang();
  const [solved, setSolved] = useState([]);
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState(null); // { kind: "ok" | "err" | "info", text }
  const [armReset, setArmReset] = useState(false);

  useEffect(() => setSolved(loadSolved()), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;
    const level = await checkFlag(flag);
    if (!level) setStatus({ kind: "err", text: t("ach.nope") });
    else if (solved.includes(level.id))
      setStatus({ kind: "info", text: t("ach.already", { title: levelText(level, lang).title }) });
    else {
      const next = [...solved, level.id];
      setSolved(next);
      saveSolved(next);
      setStatus({ kind: "ok", text: t("ach.correct", { title: levelText(level, lang).title, points: level.points }) });
      setFlag("");
    }
  };

  const onReset = () => {
    if (!armReset) {
      setArmReset(true);
      return;
    }
    resetSolved();
    setSolved([]);
    setArmReset(false);
    setStatus({ kind: "info", text: t("ach.wiped") });
  };

  const done = solved.length === LEVELS.length;

  return (
    <PageWrapper title={t("ach.title")} path="/achievements" description={t("ach.desc")}>
      <header className="page-head ach-head">
        <div>
          <h1 className="page-head__title">{t("ach.title")}</h1>
          <p className="page-head__lede">{rich(t("ach.lede"), { submit: <kbd key="k">submit</kbd> })}</p>
        </div>
        <Yeti bg="circle" walk={done} className="ach-head__yeti" />
      </header>

      <p className="ach-score" aria-live="polite">
        <strong>{t("pts", { n: `${score(solved)}/${TOTAL_POINTS}` })}</strong> ·{" "}
        {t("ach.score", { found: solved.length, total: LEVELS.length })} {done && `· ${t("ach.legend")}`}
      </p>

      <form className="ach-submit" onSubmit={onSubmit}>
        <label htmlFor="flag-input" className="ach-submit__label">
          {t("ach.submitLabel")}
        </label>
        <div className="ach-submit__row">
          <input
            id="flag-input"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="watkorn{…}"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit" className="key key--a">
            {t("ach.submit")}
          </button>
        </div>
        {status && (
          <p className={`ach-status ach-status--${status.kind}`} role="status">
            {status.text}
          </p>
        )}
      </form>

      <div className="screen ach-list-screen">
        <ol className="ach-list">
          {LEVELS.map((l, i) => {
            const got = solved.includes(l.id);
            const text = levelText(l, lang);
            return (
              <li key={l.id} className={`ach${got ? " is-solved" : ""}`}>
                <span className="ach__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="ach__body">
                  <h2 className="ach__title">
                    {text.title} <span className="ach__pts">{t("pts", { n: l.points })}</span>
                  </h2>
                  <p className="ach__state">
                    {got ? t("ach.solved") : t("ach.locked")}
                    {l.season === 2 && ` · ${t("ach.season2")}`}
                  </p>
                  {!got && (
                    <details className="ach__hint">
                      <summary>{t("ach.hint")}</summary>
                      <p>{text.hint}</p>
                    </details>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="button-row">
        <Link to={to("/")} className="key key--b">
          {t("ach.back")}
        </Link>
        <button type="button" className="key key--sm" onClick={onReset} onBlur={() => setArmReset(false)}>
          {armReset ? t("ach.resetArm") : t("ach.reset")}
        </button>
      </div>
      <p className="ach-note">
        {rich(t("ach.note"), {
          link: (
            <Link key="w" to={to("/blogs/mini-ctf-writeup")}>
              {t("ach.writeup")}
            </Link>
          ),
        })}
      </p>
    </PageWrapper>
  );
}

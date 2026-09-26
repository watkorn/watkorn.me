// src/pages/Achievements.jsx — progress for the terminal mini-CTF (stored only in this browser)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Yeti from "../components/Yeti";
import { LEVELS, TOTAL_POINTS, checkFlag, loadSolved, resetSolved, saveSolved, score } from "../ctf/ctf";

export default function Achievements() {
  const [solved, setSolved] = useState([]);
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState(null); // { kind: "ok" | "err" | "info", text }
  const [armReset, setArmReset] = useState(false);

  useEffect(() => setSolved(loadSolved()), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;
    const level = await checkFlag(flag);
    if (!level) setStatus({ kind: "err", text: "Nope, not a flag. Yet." });
    else if (solved.includes(level.id)) setStatus({ kind: "info", text: `Already solved: ${level.title}.` });
    else {
      const next = [...solved, level.id];
      setSolved(next);
      saveSolved(next);
      setStatus({ kind: "ok", text: `Correct! ${level.title}, +${level.points} pts. Nice.` });
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
    setStatus({ kind: "info", text: "Progress wiped. Fresh start." });
  };

  const done = solved.length === LEVELS.length;

  return (
    <PageWrapper
      title="Achievements"
      path="/achievements"
      description="Five flags are hidden around watkorn.me. How many can you find?"
    >
      <header className="page-head ach-head">
        <div>
          <h1 className="page-head__title">Achievements</h1>
          <p className="page-head__lede">
            Five flags are hiding around this site. Found one? Submit it here, or in the terminal with{" "}
            <kbd>submit</kbd>.
          </p>
        </div>
        <Yeti bg="circle" walk={done} className="ach-head__yeti" />
      </header>

      <p className="ach-score" aria-live="polite">
        <strong>
          {score(solved)}/{TOTAL_POINTS} pts
        </strong>{" "}
        · {solved.length} of {LEVELS.length} flags {done && "· all five. legend."}
      </p>

      <form className="ach-submit" onSubmit={onSubmit}>
        <label htmlFor="flag-input" className="ach-submit__label">
          Submit a flag
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
            Submit
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
            return (
              <li key={l.id} className={`ach${got ? " is-solved" : ""}`}>
                <span className="ach__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="ach__body">
                  <h2 className="ach__title">
                    {l.title} <span className="ach__pts">{l.points} pts</span>
                  </h2>
                  <p className="ach__state">{got ? "Solved" : "Locked"}</p>
                  {!got && (
                    <details className="ach__hint">
                      <summary>Show hint</summary>
                      <p>{l.hint}</p>
                    </details>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="button-row">
        <Link to="/" className="key key--b">
          Back to the terminal
        </Link>
        <button type="button" className="key key--sm" onClick={onReset} onBlur={() => setArmReset(false)}>
          {armReset ? "Tap again to reset" : "Reset progress"}
        </button>
      </div>
      <p className="ach-note">Your progress lives only in this browser. Nothing gets sent anywhere.</p>
    </PageWrapper>
  );
}

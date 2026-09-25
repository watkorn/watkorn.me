// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme";
import PageWrapper from "../components/PageWrapper";
import Icon from "../components/Icon";
import logoDark from "../assets/profile-dark.png";
import logoLight from "../assets/profile-light.png";
import github from "../assets/githubL.png";
import linkedin from "../assets/linkedinL.png";
import tryhackme from "../assets/tryhackmeL.png";

// คำสั่งที่ Tab เติมให้ได้ (ไม่รวมคำใบ้ flag)
const COMPLETIONS = [
  "whoami",
  "pwd",
  "ls",
  "ls -la",
  "cat README.md",
  "date",
  "echo ",
  "help",
  "clear",
  "projects",
  "blogs",
];
// ปุ่มลัดสำหรับมือถือ (พิมพ์บนจอเล็กลำบาก)
const QUICK = ["help", "whoami", "ls -la", "cat README.md", "clear"];

const socials = [
  { href: "https://linkedin.com/in/watkorn", label: "LinkedIn", icon: linkedin },
  { href: "https://github.com/watkorn", label: "GitHub", icon: github },
  { href: "https://tryhackme.com/p/watkorn", label: "TryHackMe", icon: tryhackme },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function Home() {
  const { theme } = useTheme();

  // typing animation for initial whoami
  const [typedCommand, setTypedCommand] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showFinalPrompt, setShowFinalPrompt] = useState(false);

  // history: array of { command: string, output: string | string[] }
  const [history, setHistory] = useState([]); // start empty -> show typewriter
  const [currentInput, setCurrentInput] = useState("");
  const [achievement, setAchievement] = useState(false);
  const [toastHeld, setToastHeld] = useState(false); // hover/focus = ไม่ปิดเอง
  const [win, setWin] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const commandLog = useRef([]); // สำหรับปุ่ม ↑ / ↓
  const commandCursor = useRef(-1);
  const achievedRef = useRef(false);

  const indexRef = useRef(0);
  const fullCommand = "whoami";
  const FLAG = "my_w3b_is_c00ler_th4n_u_th1nk";

  const focusInput = () => {
    // มือถือ: อย่าเด้งคีย์บอร์ดเองตอนเปิดหน้า ให้ผู้ใช้แตะเอง
    if (window.matchMedia?.("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  };

  // Typewriter for initial whoami on mount
  useEffect(() => {
    const finish = () => {
      setShowResult(true);
      setHistory([{ command: "whoami", output: "Watcharakorn Khambung" }]);
      setShowFinalPrompt(true);
    };
    if (prefersReducedMotion()) {
      finish();
      return undefined;
    }

    const timers = [];
    const total = fullCommand.length;
    const interval = setInterval(() => {
      const i = indexRef.current;
      if (i < total) {
        setTypedCommand((s) => s + fullCommand[i]);
        indexRef.current = i + 1;
      } else {
        clearInterval(interval);
        timers.push(
          setTimeout(() => {
            setShowResult(true);
            setHistory([{ command: "whoami", output: "Watcharakorn Khambung" }]);
          }, 350),
        );
        timers.push(setTimeout(() => setShowFinalPrompt(true), 800));
      }
    }, 260);

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, []); // run once

  useEffect(() => {
    if (showFinalPrompt) focusInput();
  }, [showFinalPrompt]);

  // auto-scroll whenever history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showFinalPrompt]);

  // ซ่อน achievement เองหลังแสดงสักพัก (ยกเว้นตอนผู้ใช้ชี้/โฟกัสอยู่)
  useEffect(() => {
    if (!achievement || toastHeld) return undefined;
    const t = setTimeout(() => setAchievement(false), 9000);
    return () => clearTimeout(t);
  }, [achievement, toastHeld]);

  useEffect(() => {
    if (!win) return undefined;
    const t = setTimeout(() => setWin(false), 900);
    return () => clearTimeout(t);
  }, [win]);

  // evaluate command
  const evaluate = (raw) => {
    const input = raw.trim();
    if (!input) return "";

    // echo handling
    const echoMatch = input.match(/^echo\s+(.+)$/i);
    if (echoMatch) {
      const echoText = echoMatch[1];
      if (/flag/i.test(echoText)) return FLAG;
      return echoText;
    }

    // typo "car flag.txt"
    if (/^car\s+flag\.txt$/i.test(input)) return "Did you mean: cat flag.txt ?";

    // cat flag
    if (/^cat\s+flag\.txt$/i.test(input)) return FLAG;

    // cat README.md
    if (/^cat\s+README\.md$/i.test(input)) {
      return `Hi, I'm Watcharakorn Khambung!
This is my portfolio site. I build tools, write CTF writeups, and explore cybersecurity.`;
    }

    // simple commands
    const lc = input.toLowerCase();
    if (lc === "whoami") return "Watcharakorn Khambung";
    if (lc === "pwd") return "/home/watkorn";
    if (lc === "ls") return "flag.txt  README.md";
    if (lc === "ls -la") {
      return [
        "drwxr-xr-x 2 watkorn users 4096 Oct 8 2025 .",
        "drwxr-xr-x 2 watkorn users 4096 Oct 8 2025 ..",
        "-rw-r--r-- 1 watkorn users   67 Oct 8 2025 flag.txt",
        "-rw-r--r-- 1 watkorn users  123 Oct 8 2025 README.md",
      ];
    }
    if (lc === "date") return new Date().toString();
    if (lc === "help")
      return "Available commands: whoami, pwd, ls, ls -la, cat README.md, cat flag.txt, date, echo, help, clear, projects, blogs";
    if (lc === "projects") return "Cybersecurity-Tools  CTF-Challenges  Web-Apps";
    if (lc === "blogs") return "CTF-Writeups  Security-Tips  Tutorials";

    // composite simple "&&" support
    if (input.includes("&&")) {
      const parts = input.split("&&").map((p) => p.trim());
      const outs = parts.map((p) => {
        const r = evaluate(p);
        return Array.isArray(r) ? r.join("\n") : r;
      });
      return outs.join("\n");
    }

    return `Command not found: ${input}`;
  };

  const runCommand = (cmdText) => {
    if (!cmdText.trim()) return;

    commandLog.current = [...commandLog.current, cmdText].slice(-50);
    commandCursor.current = -1;

    // special: clear -> keep only whoami (first line)
    if (cmdText.trim().toLowerCase() === "clear") {
      setHistory([{ command: "whoami", output: "Watcharakorn Khambung" }]);
      setCurrentInput("");
      setTypedCommand("");
      setShowResult(true);
      setShowFinalPrompt(true);
      return;
    }

    const result = evaluate(cmdText);
    setHistory((h) => [...h, { command: cmdText, output: result }]);
    setCurrentInput("");

    const text = Array.isArray(result) ? result.join("\n") : result;
    if (text.includes(FLAG) && !achievedRef.current) {
      achievedRef.current = true;
      setWin(true);
      setAchievement(true);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(currentInput);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const log = commandLog.current;
      if (log.length === 0) return;
      e.preventDefault();
      let c = commandCursor.current;
      if (e.key === "ArrowUp") c = c === -1 ? log.length - 1 : Math.max(0, c - 1);
      else c = c === -1 ? -1 : c + 1 >= log.length ? -1 : c + 1;
      commandCursor.current = c;
      setCurrentInput(c === -1 ? "" : log[c]);
    } else if (e.key === "Tab") {
      const value = currentInput.toLowerCase();
      if (!value) return;
      const match = COMPLETIONS.find((c) => c.toLowerCase().startsWith(value) && c.toLowerCase() !== value);
      if (match) {
        e.preventDefault();
        setCurrentInput(match);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      runCommand("clear");
    }
  };

  const avatar = theme === "dark" ? logoDark : logoLight;

  return (
    <PageWrapper title="WATKORN.ME" className="page--home">
      <section className="console-hero" aria-labelledby="home-title">
        <div className="player">
          <img src={avatar} alt="watkorn's mascot" className="player__avatar" width="176" height="176" />
          <h1 id="home-title" className="player__title">
            find the flag.
          </h1>
          <p className="player__dare">
            It's in here somewhere. Type <kbd>help</kbd> if you're stuck. No spoilers from me.
          </p>
          <ul className="socials" role="list">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="key key--sm">
                  <img src={s.icon} alt="" width="18" height="18" className="socials__icon" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="console-col">
          <div className="bezel bezel--console">
            <div className="bezel__strip">
              <span className="led" aria-hidden="true" />
              <span>power</span>
              <span className="bezel__label">watkorn@me · ctf edition</span>
            </div>

            {/* แตะตรงไหนของจอก็ได้เพื่อพิมพ์ (คีย์บอร์ดใช้ input ได้ตรง ๆ อยู่แล้ว) */}
            <div className={`lcd terminal${win ? " is-win" : ""}`} onClick={() => inputRef.current?.focus()}>
              <div ref={scrollRef} className="terminal__scroll" aria-live="polite">
                {history.length === 0 ? (
                  <div className="terminal__entry">
                    <div className="terminal__line">
                      <span className="terminal__prompt">watkorn@me:~$</span>
                      <span>{typedCommand}</span>
                      <span className="terminal__caret" aria-hidden="true" />
                    </div>
                    <div className="terminal__out" style={{ opacity: showResult ? 1 : 0 }}>
                      Watcharakorn Khambung
                    </div>
                  </div>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="terminal__entry">
                      <div className="terminal__line">
                        {/* only show prompt text for the very top whoami line to match requirement */}
                        <span className="terminal__prompt">{i === 0 ? "watkorn@me:~$" : ""}</span>
                        <span>{h.command}</span>
                      </div>
                      <div className="terminal__out">{Array.isArray(h.output) ? h.output.join("\n") : h.output}</div>
                    </div>
                  ))
                )}

                {showFinalPrompt && (
                  <div className="terminal__line terminal__line--input">
                    <label htmlFor="terminal-input" className="terminal__prompt">
                      watkorn@me:~$
                    </label>
                    <input
                      id="terminal-input"
                      ref={inputRef}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      className="terminal__input"
                      placeholder="try: help"
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="send"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="quick" aria-label="Quick commands">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="key key--xs"
                  disabled={!showFinalPrompt}
                  onClick={() => runCommand(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="bezel__hint">
              <kbd>↑</kbd>
              <kbd>↓</kbd> history · <kbd>Tab</kbd> complete · <kbd>Ctrl</kbd>+<kbd>L</kbd> clear
            </p>
          </div>

          <nav className="ab-row" aria-label="Continue">
            <Link to="/blogs" className="key key--a key--lg">
              <span className="key__badge">A</span>
              Read the blogs
            </Link>
            <Link to="/projects" className="key key--b key--lg">
              <span className="key__badge">B</span>
              See the projects
            </Link>
          </nav>
        </div>
      </section>

      <section className="dialog" aria-labelledby="about-title">
        <img src={avatar} alt="" className="dialog__face" width="72" height="72" />
        <div className="dialog__body">
          <h2 id="about-title" className="dialog__name">
            watkorn
          </h2>
          <p>I love working on cybersecurity projects just for fun and to challenge myself.</p>
          <p>I build tools and code to try things out, learn new stuff, and solve problems I run into.</p>
          <p>It's all about experimenting, testing, and improving my skills while having fun.</p>
        </div>
        <span className="dialog__next" aria-hidden="true">
          <Icon name="caret" size={18} />
        </span>
      </section>

      <div
        className={`achievement${achievement ? " is-shown" : ""}`}
        role="status"
        aria-live="polite"
        onMouseEnter={() => setToastHeld(true)}
        onMouseLeave={() => setToastHeld(false)}
        onFocus={() => setToastHeld(true)}
        onBlur={() => setToastHeld(false)}
      >
        {achievement && (
          <>
            <span className="achievement__icon">
              <Icon name="trophy" size={24} />
            </span>
            <span className="achievement__text">
              <strong>Achievement unlocked</strong>
              <span className="achievement__sub">Flag hunter: you found it. Now see how others do it.</span>
              <Link to="/blogs" className="key key--a key--sm achievement__cta">
                <span className="key__badge key__badge--sm">A</span>
                Read the writeups
              </Link>
            </span>
            <button
              type="button"
              className="achievement__close"
              onClick={() => setAchievement(false)}
              aria-label="Dismiss"
            >
              <Icon name="close" size={16} />
            </button>
          </>
        )}
      </div>
    </PageWrapper>
  );
}

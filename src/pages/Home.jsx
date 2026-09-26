// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Icon from "../components/Icon";
import Yeti from "../components/Yeti";
import github from "../assets/githubL.png";
import linkedin from "../assets/linkedinL.png";
import tryhackme from "../assets/tryhackmeL.png";
import { blogs } from "../data/blogs";
import { projects } from "../data/projects";
import { LEVELS, TOTAL_POINTS, checkFlag, levelText, loadSolved, saveSolved, score } from "../ctf/ctf";
import { ensureSession, readRootFlag, readSession, VAULT_XOR } from "../ctf/season2";
import { useLang } from "../i18n";
import { rich } from "../i18n/rich";

// คำสั่งที่ Tab เติมให้ได้ (ไม่รวมคำใบ้ flag)
const COMPLETIONS = [
  "whoami",
  "id",
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
  "cd ",
  "cd ..",
  "ls blogs",
  "ls projects",
  "open ",
  "submit ",
  "hint",
  "achievements",
];
// ปุ่มลัดสำหรับมือถือ (พิมพ์บนจอเล็กลำบาก)
const QUICK = ["help", "ls -la", "hint", "achievements", "clear"];
// level 2 lives in ~/.secret/note.b64 (base64, on purpose)
const SECRET_NOTE = "d2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9";

const socials = [
  { href: "https://linkedin.com/in/watkorn", label: "LinkedIn", icon: linkedin },
  { href: "https://github.com/watkorn", label: "GitHub", icon: github },
  { href: "https://tryhackme.com/p/watkorn", label: "TryHackMe", icon: tryhackme },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function Home() {
  const navigate = useNavigate();
  const { lang, t, to } = useLang();
  const title = (level) => levelText(level, lang).title;
  const [cwd, setCwd] = useState("~");
  const [solved, setSolved] = useState([]);
  useEffect(() => {
    setSolved(loadSolved());
    ensureSession(); // level 6 cookie
  }, []);
  const prompt = `watkorn@me:${cwd}$`;

  // typing animation for initial whoami
  const [typedCommand, setTypedCommand] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showFinalPrompt, setShowFinalPrompt] = useState(false);

  // history: array of { command: string, output: string | string[] }
  const [history, setHistory] = useState([]); // start empty -> show typewriter
  const [currentInput, setCurrentInput] = useState("");
  const [achievement, setAchievement] = useState(null); // { title, points } of the level just solved
  const [toastHeld, setToastHeld] = useState(false); // hover/focus = ไม่ปิดเอง
  const [win, setWin] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const commandLog = useRef([]); // สำหรับปุ่ม ↑ / ↓
  const commandCursor = useRef(-1);

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

  // new shell commands (cd, open, hint, achievements, the .secret folder…); null = fall back to evaluate()
  const shell = (input) => {
    const lc = input.toLowerCase();
    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ");
    const c = cmd.toLowerCase();

    if (c === "cd") {
      const target = arg.replace(/\/+$/, "");
      if (!target || target === "~" || target === "/home/watkorn" || (target === ".." && cwd !== "~")) {
        setCwd("~");
        return "";
      }
      if (target === ".secret" || target === "~/.secret" || target === "/home/watkorn/.secret") {
        setCwd("~/.secret");
        return "";
      }
      if (["blogs", "projects", "achievements"].includes(target.replace(/^\//, ""))) {
        const path = to(`/${target.replace(/^\//, "")}`);
        setTimeout(() => navigate(path), 350);
        return t("term.opening", { to: path });
      }
      return `cd: no such file or directory: ${arg}`;
    }
    if (c === "open") {
      const post = blogs.find((b) => b.slug === arg) || projects.find((p) => p.slug === arg);
      if (!arg) return "usage: open <name>   (try: ls blogs)";
      if (!post) return `open: ${arg}: not found (try: ls blogs, ls projects)`;
      const path = to(`/${blogs.includes(post) ? "blogs" : "projects"}/${post.slug}`);
      setTimeout(() => navigate(path), 350);
      return t("term.opening", { to: path });
    }
    // level 6: who you are comes from the session cookie (whose signature nobody checks)
    if (lc === "id" || lc.startsWith("sudo") || /^ls\s+\/root\/?$/.test(lc) || lc === "cd /root") {
      const session = readSession();
      if (!session) return "id: can't read your session cookie (delete yeti_session and reload for a fresh one)";
      const root = session.role === "admin";
      const name = root ? "root" : session.user;
      if (lc === "id") return root ? "uid=0(root) gid=0(root) groups=0(root)" : `uid=1000(${name}) gid=1000(${name}) groups=1000(${name})`;
      if (lc.startsWith("sudo") && !root) return `${session.user} is not in the sudoers file. This incident will be reported.`;
      if (lc === "sudo" || lc === "sudo -l") return "(ALL : ALL) ALL";
      const rest = lc.replace(/^sudo\s+/, "");
      if (/^ls\s+\/root\/?$/.test(rest)) return root ? "flag.txt" : "ls: cannot open directory '/root': Permission denied";
      if (rest === "cd /root") return root ? "cd: nice try. just cat it." : "cd: permission denied: /root";
      if (rest === "whoami") return "root";
      return shell(input.replace(/^sudo\s+/i, "")) ?? evaluate(input.replace(/^sudo\s+/i, ""));
    }
    if (lc === "ls blogs")
      return blogs.length
        ? [...blogs]
            .reverse()
            .map((b) => b.slug)
            .join("\n")
        : "(empty)";
    if (lc === "ls projects") return projects.length ? projects.map((p) => p.slug).join("\n") : "(empty)";
    if (c === "hint") {
      const n = parseInt(arg, 10);
      const level = n ? LEVELS[n - 1] : LEVELS.find((l) => !solved.includes(l.id));
      if (!level) return n ? t("term.noLevel", { n, total: LEVELS.length }) : t("term.noHints");
      const text = levelText(level, lang);
      return t("term.level", { n: LEVELS.indexOf(level) + 1, title: text.title, hint: text.hint });
    }
    if (c === "achievements" || c === "score") {
      return [
        // points before the title, so the columns line up in any language
        ...LEVELS.map(
          (l, i) =>
            `[${solved.includes(l.id) ? "x" : " "}] ${i + 1}. ${t("pts", { n: String(l.points).padStart(2) })}  ${title(l)}`,
        ),
        t("term.score", { score: score(solved), total: TOTAL_POINTS }),
      ];
    }
    if (lc === "help") return t("term.help");
    if (cwd === "~/.secret") {
      if (lc === "ls") return "note.b64  vault.xor";
      if (lc === "ls -la")
        return [
          "drwx------ 2 watkorn users 4096 Oct 8 2025 .",
          "drwxr-xr-x 3 watkorn users 4096 Oct 8 2025 ..",
          "-rw------- 1 watkorn users   45 Oct 8 2025 note.b64",
          "-rw------- 1 watkorn users   78 Sep 26 2026 vault.xor",
        ];
      if (/^cat\s+vault\.xor$/i.test(input)) return VAULT_XOR; // level 7
      if (/^file\s+vault\.xor$/i.test(input)) return "vault.xor: ASCII text (hex), 39 bytes of XORed data";
      if (lc === "pwd") return "/home/watkorn/.secret";
      if (/^cat\s+note\.b64$/i.test(input)) return SECRET_NOTE;
      if (/^cat\s+/i.test(input)) return `cat: ${arg}: No such file or directory`;
    }
    if (lc === "ls -la") {
      return [
        "drwxr-xr-x 3 watkorn users 4096 Oct 8 2025 .",
        "drwxr-xr-x 3 watkorn users 4096 Oct 8 2025 ..",
        "drwx------ 2 watkorn users 4096 Oct 8 2025 .secret",
        "-rw-r--r-- 1 watkorn users   67 Oct 8 2025 flag.txt",
        "-rw-r--r-- 1 watkorn users  123 Oct 8 2025 README.md",
      ];
    }
    return null;
  };

  const unlock = (level) => {
    if (solved.includes(level.id)) return false;
    const next = [...solved, level.id];
    setSolved(next);
    saveSolved(next);
    setWin(true);
    setAchievement({ level, count: next.length });
    return true;
  };

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
    if (/^car\s+flag\.txt$/i.test(input)) return t("term.didYouMean");

    // cat flag
    if (/^cat\s+flag\.txt$/i.test(input)) return FLAG;

    // cat README.md
    if (/^cat\s+README\.md$/i.test(input)) return t("term.readme");

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
    if (lc === "projects") return `${projects.map((p) => p.slug).join("  ")}\n${t("term.open")}`;
    if (lc === "blogs") return `${[...blogs].reverse().map((b) => b.slug).join("  ")}\n${t("term.open")}`;

    // composite simple "&&" support
    if (input.includes("&&")) {
      const parts = input.split("&&").map((p) => p.trim());
      const outs = parts.map((p) => {
        const r = evaluate(p);
        return Array.isArray(r) ? r.join("\n") : r;
      });
      return outs.join("\n");
    }

    return t("term.notFound", { cmd: input.split(/\s+/)[0] });
  };

  const runCommand = (cmdText) => {
    if (!cmdText.trim()) return;
    const entryPrompt = prompt;

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

    // submit <flag>: checked by SHA-256 hash (async)
    const submit = cmdText.trim().match(/^submit(?:\s+(.+))?$/i);
    if (submit) {
      setCurrentInput("");
      if (!submit[1]) {
        setHistory((h) => [...h, { prompt: entryPrompt, command: cmdText, output: "usage: submit <flag>" }]);
        return;
      }
      const id = Date.now();
      setHistory((h) => [...h, { id, prompt: entryPrompt, command: cmdText, output: t("term.checking") }]);
      checkFlag(submit[1]).then((level) => {
        let out;
        if (!level) out = t("term.nope");
        else if (solved.includes(level.id)) out = t("term.already", { title: title(level) });
        else {
          unlock(level);
          const s2 = score([...solved, level.id]);
          out = t("term.correct", { title: title(level), points: level.points, score: s2, total: TOTAL_POINTS });
        }
        setHistory((h) => h.map((e) => (e.id === id ? { ...e, output: out } : e)));
      });
      return;
    }

    // level 6: /root/flag.txt is decrypted in the browser, and only for role=admin
    if (/^(?:sudo\s+)?cat\s+\/root\/flag\.txt$/i.test(cmdText.trim())) {
      setCurrentInput("");
      const session = readSession();
      const viaSudo = /^sudo\s/i.test(cmdText.trim());
      const id = Date.now();
      const deny =
        session?.role === "admin"
          ? null
          : viaSudo && session
            ? `${session.user} is not in the sudoers file. This incident will be reported.`
            : "cat: /root/flag.txt: Permission denied";
      setHistory((h) => [...h, { id, prompt: entryPrompt, command: cmdText, output: deny ?? t("term.checking") }]);
      if (!deny) {
        readRootFlag(session)
          .catch(() => null)
          .then((flag) => {
            const out = flag ?? "cat: /root/flag.txt: Input/output error";
            setHistory((h) => h.map((e) => (e.id === id ? { ...e, output: out } : e)));
          });
      }
      return;
    }

    const custom = shell(cmdText.trim());
    const result = custom ?? evaluate(cmdText);
    setHistory((h) => [...h, { prompt: entryPrompt, command: cmdText, output: result }]);
    setCurrentInput("");

    const text = Array.isArray(result) ? result.join("\n") : result;
    if (text.includes(FLAG)) unlock(LEVELS[0]); // level 1: the warm-up flag
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

  return (
    <PageWrapper path="/" className="page--home">
      <section className="console-hero" aria-labelledby="home-title">
        <div className="player">
          <Yeti bg="screen" walk={Boolean(achievement)} className="player__avatar" title={t("home.yeti")} />
          <h1 id="home-title" className="player__title">
            {t("home.title")}
          </h1>
          <p className="player__dare">{rich(t("home.dare"), { ls: <kbd key="ls">ls</kbd>, hint: <kbd key="hint">hint</kbd> })}</p>
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
              <span>{t("home.power")}</span>
              <span className="bezel__label">{t("home.edition")}</span>
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
                    <div className={`terminal__out${showResult ? "" : " is-pending"}`}>
                      Watcharakorn Khambung
                    </div>
                  </div>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="terminal__entry">
                      <div className="terminal__line">
                        <span className="terminal__prompt">{h.prompt || "watkorn@me:~$"}</span>
                        <span>{h.command}</span>
                      </div>
                      <div className="terminal__out">{Array.isArray(h.output) ? h.output.join("\n") : h.output}</div>
                    </div>
                  ))
                )}

                {showFinalPrompt && (
                  <div className="terminal__line terminal__line--input">
                    <label htmlFor="terminal-input" className="terminal__prompt">
                      {prompt}
                    </label>
                    <input
                      id="terminal-input"
                      ref={inputRef}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      className="terminal__input"
                      placeholder={t("home.placeholder")}
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

            <div className="quick" role="group" aria-label={t("home.quick")}>
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
              {rich(t("home.keys"), {
                up: <kbd key="u">↑</kbd>,
                down: <kbd key="d">↓</kbd>,
                tab: <kbd key="t">Tab</kbd>,
                ctrl: <kbd key="c">Ctrl</kbd>,
                l: <kbd key="l">L</kbd>,
              })}
            </p>
          </div>

          <nav className="ab-row" aria-label={t("home.continue")}>
            <Link to={to("/blogs")} className="key key--a key--lg">
              <span className="key__badge">A</span>
              {t("home.a")}
            </Link>
            <Link to={to("/projects")} className="key key--b key--lg">
              <span className="key__badge">B</span>
              {t("home.b")}
            </Link>
          </nav>
        </div>
      </section>

      <section className="dialog" aria-labelledby="about-title">
        <Yeti bg="circle" className="dialog__face" />
        <div className="dialog__body">
          <h2 id="about-title" className="dialog__name">
            watkorn
          </h2>
          <p>{t("home.about1")}</p>
          <p>{t("home.about2")}</p>
          <p>{t("home.about3")}</p>
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
              <strong>{t("toast.title")}</strong>
              <span className="achievement__sub">
                {t("toast.sub", {
                  title: title(achievement.level),
                  points: achievement.level.points,
                  count: achievement.count,
                  total: LEVELS.length,
                })}
              </span>
              <Link to={to("/achievements")} className="key key--a key--sm achievement__cta">
                <span className="key__badge key__badge--sm">A</span>
                {t("toast.next")}
              </Link>
            </span>
            <button
              type="button"
              className="achievement__close"
              onClick={() => setAchievement(null)}
              aria-label={t("toast.dismiss")}
            >
              <Icon name="close" size={16} />
            </button>
          </>
        )}
      </div>
    </PageWrapper>
  );
}

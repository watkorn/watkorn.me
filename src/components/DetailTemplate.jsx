// src/components/DetailTemplate.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PreloadedContent } from "../content-context";
import PageWrapper from "./PageWrapper";
import Icon from "./Icon";
import "highlight.js/styles/github-dark.css";

// รองรับรูปที่อ้างอิงแบบ /xxx.png จากโฟลเดอร์ public/
const withPublicUrl = (src) =>
  src?.startsWith("/") && !src.startsWith("//") ? `${import.meta.env.BASE_URL.replace(/\/$/, "")}${src}` : src;

// เนื้อหาแต่ละโพสต์แยกเป็น chunk ของตัวเอง (โหลดเมื่อเปิดหน้านั้น)
const loaders = import.meta.glob(["../generated/*/*.json", "!../generated/*/index.json"], { import: "default" });
const loadBody = (type, slug) => {
  const load = loaders[`../generated/${type}s/${slug}.json`];
  return load ? load() : Promise.reject(new Error(`No content for ${type}/${slug}`));
};

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// ใส่ปุ่ม Copy ให้ทุก code block ในบทความ
function useCopyButtons(ref, html) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !html) return;
    const cleanups = [];
    root.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;
      const code = pre.querySelector("code");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      let timer;
      const onClick = async () => {
        try {
          await navigator.clipboard.writeText((code || pre).innerText);
          btn.textContent = "Copied";
        } catch {
          btn.textContent = "Press Ctrl+C";
        }
        clearTimeout(timer);
        timer = setTimeout(() => (btn.textContent = "Copy"), 1600);
      };
      btn.addEventListener("click", onClick);
      pre.appendChild(btn);
      cleanups.push(() => {
        clearTimeout(timer);
        btn.removeEventListener("click", onClick);
        btn.remove();
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [ref, html]);
}

// แถบความคืบหน้าการอ่าน (ด้านบนจอ)
function ReadingProgress({ targetRef }) {
  const barRef = useRef(null);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = null;
      const el = targetRef.current;
      const bar = barRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetRef]);
  return (
    <div className="read-progress" aria-hidden="true">
      <div ref={barRef} className="read-progress__bar" />
    </div>
  );
}

export default function DetailTemplate({ meta, type, allMeta }) {
  const preloaded = useContext(PreloadedContent);
  const key = meta ? `${type}/${meta.slug}` : null;
  const initial = key && preloaded[key] != null ? { html: preloaded[key] } : null;
  const [content, setContent] = useState(initial);
  const [loading, setLoading] = useState(Boolean(meta) && !initial);
  const [error, setError] = useState(null);
  const articleRef = useRef(null);
  const screenRef = useRef(null);

  const listPath = type === "blog" ? "/blogs" : "/projects";
  const listLabel = type === "blog" ? "Blogs" : "Projects";

  useEffect(() => {
    if (!meta) return;
    if (preloaded[`${type}/${meta.slug}`] != null) {
      setContent({ html: preloaded[`${type}/${meta.slug}`] });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    loadBody(type, meta.slug)
      .then((data) => setContent(data))
      .catch((err) => {
        console.error("Failed to load content:", err);
        setError("Couldn't load this page. Check your connection and refresh.");
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, [meta, type, preloaded]);

  useCopyButtons(articleRef, content?.html);

  if (!meta) {
    return (
      <PageWrapper title="Not found" className="page--narrow">
        <div className="bezel">
          <div className="lcd lcd--center">
            <p className="lcd__big">GAME OVER</p>
            <p>This {type} doesn't exist (yet).</p>
          </div>
        </div>
        <div className="button-row">
          <Link to={listPath} className="key key--a">
            Back to {listLabel}
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Older / newer ตามลำดับที่ scripts/content.mjs เรียงไว้ (เก่า → ใหม่ สำหรับ blog)
  const index = allMeta.findIndex((s) => s.slug === meta.slug);
  const prevMeta = allMeta[index - 1];
  const nextMeta = allMeta[index + 1];
  const prevLabel = type === "blog" ? "Older" : "Previous";
  const nextLabel = type === "blog" ? "Newer" : "Next";

  return (
    <PageWrapper
      title={meta.title}
      description={meta.desc}
      path={`${listPath}/${meta.slug}`}
      type="article"
      published={meta.date}
      className="page--read"
    >
      {type === "blog" && <ReadingProgress targetRef={screenRef} />}

      <Link to={listPath} className="key key--sm back-link">
        <Icon name="arrow-left" size={16} />
        {listLabel}
      </Link>

      <article className="bezel bezel--read" ref={screenRef} aria-busy={loading}>
        <div className="screen screen--read">
          <header className="post-head">
            <h1 className="post-head__title">{meta.title}</h1>
            {meta.desc && <p className="post-head__desc">{meta.desc}</p>}
            <p className="post-head__meta">
              {meta.event && <span>{meta.event}</span>}
              {meta.category && type === "blog" && <span className="badge">{meta.category}</span>}
              {meta.difficulty && <span className={`badge badge--${meta.difficulty}`}>{meta.difficulty}</span>}
              {meta.date && <time dateTime={meta.date}>{formatDate(meta.date)}</time>}
              {meta.readingMinutes ? <span>{meta.readingMinutes} min read</span> : null}
              {meta.category && <span>{meta.category}</span>}
              {meta.tags?.map((t) => (
                <span key={t} className="tag">
                  #{t}
                </span>
              ))}
            </p>
          </header>

          {meta.screenshots?.length > 0 && (
            <div className="shots">
              {meta.screenshots.map((shot, i) => (
                <figure key={i} className="shot">
                  <img src={withPublicUrl(shot.src)} alt={shot.alt || ""} loading="lazy" />
                  {shot.label && <figcaption>{shot.label}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {loading ? (
            <div className="skeleton" aria-label="Loading">
              <span />
              <span />
              <span />
            </div>
          ) : error ? (
            <p className="error-text" role="alert">
              {error}
            </p>
          ) : content?.html ? (
            <div
              ref={articleRef}
              data-content-key={key}
              className="markdown prose md:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          ) : (
            <p>{meta.desc || "Nothing here yet."}</p>
          )}

          {meta.github && (
            <p className="post-foot">
              <a href={meta.github} target="_blank" rel="noopener noreferrer" className="key key--sm">
                Source on GitHub
                <Icon name="external" size={16} />
              </a>
            </p>
          )}
        </div>
      </article>

      {(prevMeta || nextMeta) && (
        <nav className="pager" aria-label={`More ${listLabel.toLowerCase()}`}>
          {prevMeta ? (
            <Link to={`${listPath}/${prevMeta.slug}`} className="pager__link">
              <span className="pager__dir">
                <Icon name="arrow-left" size={16} /> {prevLabel}
              </span>
              <span className="pager__title">{prevMeta.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextMeta && (
            <Link to={`${listPath}/${nextMeta.slug}`} className="pager__link pager__link--next">
              <span className="pager__dir">
                {nextLabel} <Icon name="arrow-right" size={16} />
              </span>
              <span className="pager__title">{nextMeta.title}</span>
            </Link>
          )}
        </nav>
      )}
    </PageWrapper>
  );
}

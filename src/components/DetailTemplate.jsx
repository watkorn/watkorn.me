// src/components/DetailTemplate.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PreloadedContent } from "../content-context";
import PageWrapper from "./PageWrapper";
import Icon from "./Icon";
import { localize } from "../data/localize";
import { useLang } from "../i18n";
import "highlight.js/styles/github-dark.css";

// รองรับรูปที่อ้างอิงแบบ /xxx.png จากโฟลเดอร์ public/
const withPublicUrl = (src) =>
  src?.startsWith("/") && !src.startsWith("//") ? `${import.meta.env.BASE_URL.replace(/\/$/, "")}${src}` : src;

// เนื้อหาแต่ละโพสต์แยกเป็น chunk ของตัวเอง (โหลดเมื่อเปิดหน้านั้น)
// key = "blog/<slug>" (English) or "blog/<slug>.th" (Thai)
const loaders = import.meta.glob(["../generated/*/*.json", "!../generated/*/index.json"], { import: "default" });
const loadBody = (key) => {
  const [type, name] = key.split("/");
  const load = loaders[`../generated/${type}s/${name}.json`];
  return load ? load() : Promise.reject(new Error(`No content for ${key}`));
};

// ใส่ปุ่ม Copy ให้ทุก code block ในบทความ
function useCopyButtons(ref, html, t) {
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
      btn.textContent = t("copy");
      btn.setAttribute("aria-label", t("copy.label"));
      let timer;
      const onClick = async () => {
        try {
          await navigator.clipboard.writeText((code || pre).innerText);
          btn.textContent = t("copy.done");
        } catch {
          btn.textContent = t("copy.fail");
        }
        clearTimeout(timer);
        timer = setTimeout(() => (btn.textContent = t("copy")), 1600);
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
  }, [ref, html]); // t is fresh on every render; html changes whenever the page (or its language) does
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

export default function DetailTemplate({ meta: rawMeta, type, allMeta }) {
  const { lang, t, to, date } = useLang();
  const preloaded = useContext(PreloadedContent);
  const meta = rawMeta ? localize(rawMeta, lang) : null;
  const key = meta ? `${type}/${meta.slug}${meta.lang === "en" ? "" : `.${meta.lang}`}` : null;
  const initial = key && preloaded[key] != null ? { html: preloaded[key] } : null;
  const [content, setContent] = useState(initial);
  const [loading, setLoading] = useState(Boolean(meta) && !initial);
  const [error, setError] = useState(null);
  const articleRef = useRef(null);
  const screenRef = useRef(null);

  const listPath = type === "blog" ? "/blogs" : "/projects";
  const listLabel = type === "blog" ? t("blogs.title") : t("projects.title");

  useEffect(() => {
    if (!key) return undefined;
    if (preloaded[key] != null) {
      setContent({ html: preloaded[key] });
      setLoading(false);
      return undefined;
    }
    let live = true;
    setLoading(true);
    setError(null);
    loadBody(key)
      .then((data) => live && setContent(data))
      .catch((err) => {
        console.error("Failed to load content:", err);
        if (!live) return;
        setError(t("post.loadError"));
        setContent(null);
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [key, preloaded]);

  useCopyButtons(articleRef, content?.html, t);

  if (!meta) {
    return (
      <PageWrapper title={t("post.missingTitle")} className="page--narrow">
        <div className="bezel">
          <div className="lcd lcd--center">
            <p className="lcd__big">GAME OVER</p>
            <p>{t(`post.missing.${type}`)}</p>
          </div>
        </div>
        <div className="button-row">
          <Link to={to(listPath)} className="key key--a">
            {t("post.back", { list: listLabel })}
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Older / newer ตามลำดับที่ scripts/content.mjs เรียงไว้ (เก่า → ใหม่ สำหรับ blog)
  const index = allMeta.findIndex((s) => s.slug === meta.slug);
  const prevMeta = allMeta[index - 1] && localize(allMeta[index - 1], lang);
  const nextMeta = allMeta[index + 1] && localize(allMeta[index + 1], lang);
  const prevLabel = type === "blog" ? t("post.older") : t("post.prev");
  const nextLabel = type === "blog" ? t("post.newer") : t("post.next");

  return (
    <PageWrapper
      title={meta.title}
      description={meta.desc}
      path={`${listPath}/${meta.slug}`}
      langs={meta.langs}
      image={`/og/${meta.lang === "en" ? "" : `${meta.lang}/`}${type}s/${meta.slug}.png`}
      type="article"
      published={meta.date}
      className="page--read"
    >
      {type === "blog" && <ReadingProgress targetRef={screenRef} />}

      <Link to={to(listPath)} className="key key--sm back-link">
        <Icon name="arrow-left" size={16} />
        {listLabel}
      </Link>

      <article className="bezel bezel--read" ref={screenRef} aria-busy={loading}>
        <div className="screen screen--read" lang={meta.translated ? undefined : meta.lang}>
          {!meta.translated && (
            <p className="post-fallback" lang={lang}>
              <Icon name="globe" size={18} />
              {t("post.fallback")}
            </p>
          )}
          <header className="post-head">
            <h1 className="post-head__title">{meta.title}</h1>
            {meta.desc && <p className="post-head__desc">{meta.desc}</p>}
            <p className="post-head__meta" lang={meta.translated ? undefined : lang}>
              {meta.event && <span>{meta.event}</span>}
              {meta.category && type === "blog" && <span className="badge">{meta.category}</span>}
              {meta.difficulty && <span className={`badge badge--${meta.difficulty}`}>{meta.difficulty}</span>}
              {meta.date && <time dateTime={meta.date}>{date(meta.date, "long")}</time>}
              {meta.readingMinutes ? <span>{t("list.minRead", { n: meta.readingMinutes })}</span> : null}
              {meta.category && <span>{meta.category}</span>}
              {meta.tags?.map((tag) => (
                <Link key={tag} to={`${to(listPath)}?tag=${encodeURIComponent(tag)}`} className="tag tag--link">
                  #{tag}
                </Link>
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
            <div className="skeleton" aria-label={t("post.loading")}>
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
            <p>{meta.desc || t("post.empty")}</p>
          )}

          {meta.github && (
            <p className="post-foot">
              <a href={meta.github} target="_blank" rel="noopener noreferrer" className="key key--sm">
                {t("post.source")}
                <Icon name="external" size={16} />
              </a>
            </p>
          )}
        </div>
      </article>

      {(prevMeta || nextMeta) && (
        <nav className="pager" aria-label={t("post.more", { list: listLabel })}>
          {prevMeta ? (
            <Link to={to(`${listPath}/${prevMeta.slug}`)} className="pager__link">
              <span className="pager__dir">
                <Icon name="arrow-left" size={16} /> {prevLabel}
              </span>
              <span className="pager__title" lang={prevMeta.translated ? undefined : prevMeta.lang}>
                {prevMeta.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextMeta && (
            <Link to={to(`${listPath}/${nextMeta.slug}`)} className="pager__link pager__link--next">
              <span className="pager__dir">
                {nextLabel} <Icon name="arrow-right" size={16} />
              </span>
              <span className="pager__title" lang={nextMeta.translated ? undefined : nextMeta.lang}>
                {nextMeta.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </PageWrapper>
  );
}

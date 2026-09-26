// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Achievements from "./pages/Achievements";
import Search from "./pages/Search";
import { ThemeProvider } from "./theme";
import { LANGS, langFromPath, localizePath } from "./i18n";

// เปลี่ยนหน้าแล้วเลื่อนกลับบนสุด (หรือไปที่หัวข้อใน #hash) + ตั้ง <html lang> ตามภาษาของ URL
function ResetScrollOnNavigate() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.documentElement.lang = langFromPath(pathname);
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname]); // only on page change: in-page #links scroll by themselves
  return null;
}

// "/" anywhere (outside a text field) opens search, like GitHub and most docs sites
function SearchShortcut() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      const el = e.target;
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      e.preventDefault();
      navigate(localizePath("/search", langFromPath(pathname)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, pathname]);
  return null;
}

// every page exists once per language: /blogs and /th/blogs
const pages = [
  ["/", <Home />],
  ["/blogs", <Blogs />],
  ["/blogs/:slug", <BlogDetail />],
  ["/projects", <Projects />],
  ["/projects/:slug", <ProjectDetail />],
  ["/achievements", <Achievements />],
  ["/search", <Search />],
];

function App() {
  return (
    <ThemeProvider>
      <ResetScrollOnNavigate />
      <SearchShortcut />
      <div className="app">
        <Header />
        <main id="main" className="app__main" tabIndex={-1}>
          <Routes>
            {LANGS.flatMap((lang) =>
              pages.map(([path, element]) => (
                <Route key={`${lang}${path}`} path={localizePath(path, lang)} element={element} />
              )),
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ScrollToTop />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

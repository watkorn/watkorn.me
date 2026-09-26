// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import { ThemeProvider } from "./theme";
import { LANGS, langFromPath, localizePath } from "./i18n";

// เปลี่ยนหน้าแล้วเลื่อนกลับบนสุด + ตั้ง <html lang> ตามภาษาของ URL
function ResetScrollOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.lang = langFromPath(pathname);
  }, [pathname]);
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
];

function App() {
  return (
    <ThemeProvider>
      <ResetScrollOnNavigate />
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

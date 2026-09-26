import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { PreloadedContent } from "./content-context";
import "./styles/globals.css";

// ลิงก์เก่าแบบ /#/blogs/x → /blogs/x
if (window.location.hash.startsWith("#/")) {
  window.history.replaceState(null, "", window.location.hash.slice(1));
}

// เก็บ HTML ของโพสต์ที่ prerender ไว้ ก่อนที่ React จะ render ทับ
const preloaded = {};
const pre = document.querySelector("[data-content-key]");
if (pre) preloaded[pre.dataset.contentKey] = pre.innerHTML;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <PreloadedContent.Provider value={preloaded}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PreloadedContent.Provider>
    </HelmetProvider>
  </React.StrictMode>,
);

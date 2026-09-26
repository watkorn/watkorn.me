import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "build",
    sourcemap: false, // ไม่ปล่อย source map ออกไปกับเว็บจริง
    // never inline as data: URIs:
    // - SVGs: the yeti sprite is referenced with <use href="…#yeti">, which does not work from a data: URI
    // - fonts: the CSP is font-src 'self', so a data: font would be blocked
    assetsInlineLimit: (file) => (/\.(svg|woff2?)$/.test(file) ? false : undefined),
  },
  // react-helmet-async ships CommonJS; bundle it into the SSR build used for prerendering
  ssr: { noExternal: ["react-helmet-async"] },
  server: { port: 3000 },
});

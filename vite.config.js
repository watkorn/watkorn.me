import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "build",
    sourcemap: false, // ไม่ปล่อย source map ออกไปกับเว็บจริง
    // keep SVGs as files: the yeti sprite is referenced with <use href="…#yeti">,
    // which does not work from a data: URI
    assetsInlineLimit: (file) => (file.endsWith(".svg") ? false : undefined),
  },
  // react-helmet-async ships CommonJS; bundle it into the SSR build used for prerendering
  ssr: { noExternal: ["react-helmet-async"] },
  server: { port: 3000 },
});

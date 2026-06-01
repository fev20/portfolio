// vite.config.pages.ts — GitHub Pages 전용 빌드 설정
// base를 '/'로 설정 (커스텀 도메인 사용 시) 또는 '/repo-name/'으로 변경
// GitHub Pages에서 username.github.io/repo-name 형태로 배포할 경우:
//   base: '/your-repo-name/'

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "/",   // ← GitHub Pages 커스텀 도메인 사용 시 "/"
               // ← username.github.io/portfolio 형태라면 "/portfolio/"로 변경
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  envDir: path.resolve(import.meta.dirname),
});

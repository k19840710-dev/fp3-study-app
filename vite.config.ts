import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages（プロジェクトページ）で配信するため、リポジトリ名をベースパスにする。
  base: '/fp3-study-app/',
  plugins: [react(), tailwindcss()],
});

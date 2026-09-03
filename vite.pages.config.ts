import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/lierda-edge-cloud-ai/',
  root: 'github-pages',
  publicDir: resolve(projectRoot, 'public'),
  build: {
    outDir: resolve(projectRoot, 'dist-pages'),
    emptyOutDir: true,
  },
  css: { postcss: { plugins: [tailwindcss()] } },
  resolve: { alias: { '@': projectRoot } },
  plugins: [react()],
});

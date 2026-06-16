import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'copy-public-assets',
      closeBundle() {
        const source = path.resolve(__dirname, 'public/assets');
        const target = path.resolve(__dirname, 'dist/assets');

        if (existsSync(source)) {
          cpSync(source, target, { recursive: true });
        }
      }
    }
  ],
  build: {
    chunkSizeWarningLimit: 1600
  }
});

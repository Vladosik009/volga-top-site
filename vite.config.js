import { defineConfig } from 'vite';
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Копирует обычные JS-скрипты и фото участников в dist/, чтобы сайт открывался
// и через сервер (npm run dev / GitHub Pages / Docker), и двойным кликом по index.html (file://)
function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const distSrcData = resolve('dist/src/data');
      mkdirSync(distSrcData, { recursive: true });
      copyFileSync(resolve('src/data/team.js'), resolve('dist/src/data/team.js'));
      copyFileSync(resolve('src/main.js'), resolve('dist/src/main.js'));

      const publicImages = resolve('public/images');
      if (existsSync(publicImages)) {
        cpSync(publicImages, resolve('dist/public/images'), { recursive: true });
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyStaticAssets()],
});

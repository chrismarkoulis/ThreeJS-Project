import { defineConfig } from 'vite';

export default defineConfig({
  base: 'https://chrismarkoulis.github.io/ThreeJS-Project',
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'], // Include image formats
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      input: {
        main: './index.html' // Entry point
      }
    }
  }
});

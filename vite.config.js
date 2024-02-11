import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Set the base URL to root
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

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ThreeJS-Project/',
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.ico',
    '**/*.json',
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 0,
    manifest: true,
    rollupOptions: {
      input: {
        main: './index.html' // Entry point
      },
      output: {
        manualChunks: undefined, // Disable manual chunk splitting
      },
    }
  }
});

// vitest.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    mockReset: true,
    /*setupFiles: ['resources/js/tests/vitest.setup.js'],*/
    setupFiles: ['resources/js/setupTests.js'],
    hookTimeout: 20000, // 20 seconds
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
      '@tests': path.resolve(__dirname, 'resources/js/tests'), // optional
    },
  },  
});

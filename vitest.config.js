// vitest.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
      '@tests': path.resolve(__dirname, 'resources/js/tests'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    mockReset: true,
    setupFiles: ['resources/js/setupTests.ts'],
    hookTimeout: 20000, // 20 seconds
  },
});
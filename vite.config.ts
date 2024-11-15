import react from '@vitejs/plugin-react';
import loadVersion from 'vite-plugin-package-version';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), loadVersion()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    // this is only applicable when npm-linking the utah-design-package
    dedupe: ['firebase', '@arcgis/core'],
  },
});

import react from '@vitejs/plugin-react';
import loadVersion from 'vite-plugin-package-version';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), loadVersion()],
  test: {
    environment: 'happy-dom',
    setupFiles: './vitest.setup.js',
  },
  resolve: {
    // this is only applicable when npm-linking the utah-design-package
    dedupe: ['firebase', '@arcgis/core'],
    // work around for this issue: https://github.com/adobe/react-spectrum/issues/6694
    alias: [
      {
        find: 'use-sync-external-store/shim/index.js',
        replacement: 'react',
      },
    ],
  },
});

import react from '@vitejs/plugin-react';
import loadVersion from 'vite-plugin-package-version';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), loadVersion()],
  test: {
    server: {
      deps: {
        // this package does not export esm that uses imports with the file extension, this is a workaround
        // to instruct vitest to bundle the package similar to the app
        // https://stackoverflow.com/questions/77126321/how-to-get-vitest-working-with-require-of-es-module
        inline: ['@ugrc/utah-design-system'],
      },
    },
  },
});

/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // test configuration
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul', // or 'istanbul'
    },
    setupFiles: './src/test.setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
});

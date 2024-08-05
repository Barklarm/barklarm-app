import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './.vitest/setup.ts',
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});

/// <reference types='vitest/globals' />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    threads: false,
    coverage: {
      enabled: true,
      // https://github.com/bcoe/c8#checking-for-full-source-coverage-using---all
      // all: true,
      lines: 99,
      functions: 99,
      branches: 99,
      statements: 99,
    },
    environment: 'jsdom',
    globals: true,
  },
  build: {
    sourcemap: true,
  },
});

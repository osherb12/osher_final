import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 120000,
    hookTimeout: 120000,
    // Run all test files sequentially in a single worker to avoid
    // mongodb-memory-server download race conditions
    maxWorkers: 1,
    minWorkers: 1,
  },
});

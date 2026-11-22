import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    env: {
      DATABASE_URL: 'postgresql://mock:mock@localhost:5432/mock?schema=public',
      BETTER_AUTH_SECRET: 'archtier-vitest-secret-32-chars-long-minimum',
      BETTER_AUTH_URL: 'http://localhost:3000',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

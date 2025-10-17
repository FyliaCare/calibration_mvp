import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
        'public/app.js', // Legacy file
        'public/styles.css' // Legacy file
      ],
      include: [
        'public/js/**/*.js',
        'src/**/*.ts'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    },
    
    testTimeout: 10000,
    hookTimeout: 10000
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@utils': resolve(__dirname, './public/js/utils'),
      '@features': resolve(__dirname, './public/js/features'),
      '@core': resolve(__dirname, './public/js/core')
    }
  }
});

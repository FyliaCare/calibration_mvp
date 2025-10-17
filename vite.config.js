import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  base: '/',
  
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        login: resolve(__dirname, 'public/login.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        
        // Manual chunks for better code splitting
        manualChunks: {
          'vendor': ['jspdf'],
          'utils': [
            resolve(__dirname, 'public/js/utils/date-formatters.js'),
            resolve(__dirname, 'public/js/utils/number-formatters.js'),
            resolve(__dirname, 'public/js/utils/validators.js'),
            resolve(__dirname, 'public/js/utils/dom-helpers.js'),
            resolve(__dirname, 'public/js/utils/storage.js')
          ],
          'features': [
            resolve(__dirname, 'public/js/features/certificates/pdf-generator.js'),
            resolve(__dirname, 'public/js/features/certificates/form-handler.js'),
            resolve(__dirname, 'public/js/features/worksheets/worksheet-manager.js'),
            resolve(__dirname, 'public/js/features/dashboard/dashboard-manager.js')
          ]
        }
      }
    },
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      }
    },
    
    chunkSizeWarningLimit: 1000
  },
  
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    cors: true,
    
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  preview: {
    port: 4173,
    strictPort: false,
    open: true
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@utils': resolve(__dirname, './public/js/utils'),
      '@features': resolve(__dirname, './public/js/features'),
      '@core': resolve(__dirname, './public/js/core')
    }
  },
  
  optimizeDeps: {
    include: ['jspdf']
  }
});

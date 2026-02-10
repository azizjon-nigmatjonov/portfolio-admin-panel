/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      fs: {
        strict: false,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth'],
            router: ['react-router-dom'],
            ui: ['@tanstack/react-query', 'zustand'],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'zustand',
        'firebase/app',
        'firebase/auth',
        '@tanstack/react-table',
        'lucide-react',
      ],
      force: true,
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    test: {
      coverage: {
        provider: 'v8',
        include: ['src/**'],
        exclude: ['src/**/*.stories.*', 'src/test/**', 'src/**/*.d.ts'],
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
            environment: 'jsdom',
            setupFiles: ['src/test/setup.ts'],
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(__dirname, '.storybook'),
            }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: 'chromium' }],
            },
            setupFiles: ['.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
  }
})

import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = {
    '/api/ai/word-meaning': {
      target: env.N8N_BASE_URL || 'http://localhost:5678',
      changeOrigin: true,
      rewrite: () => '/webhook/word-meaning',
      timeout: 45000,
      proxyTimeout: 45000,
    },
  }
  return {
  server: { proxy },
  preview: { proxy },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  }
})

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function resolveApiProxyTarget(env) {
  const raw = env.API_PROXY_TARGET || env.api_proxy_target || process.env.API_PROXY_TARGET || 'http://127.0.0.1:18080'
  return String(raw).trim().replace(/\/$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')

  return {
    plugins: [vue(), tailwindcss()],
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      modulePreload: { polyfill: false }
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      watch: { usePolling: true },
      proxy: {
        '/v1': {
          target: resolveApiProxyTarget(env),
          changeOrigin: true
        }
      }
    }
  }
})

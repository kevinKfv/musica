import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,       // escucha en 0.0.0.0 (necesario para Docker)
    port: 5173,
    watch: {
      usePolling: true, // hot-reload en Docker/Windows
    },
    proxy: {
      // Proxy a API backend (localhost:8080 por defecto en host, backend:8080 en Docker)
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
      // WebSocket de chat
      '/ws': {
        target: process.env.VITE_WS_PROXY_TARGET || 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  define: {
    global: 'window',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})


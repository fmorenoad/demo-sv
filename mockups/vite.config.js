import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Mockups Survías — React + Vite
// Dos entradas: la demo navegable (index.html) y la landing de estilo editorial (landing/index.html).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'landing/index.html'),
        landing2: resolve(__dirname, 'landing2/index.html'),
      },
    },
  },
})

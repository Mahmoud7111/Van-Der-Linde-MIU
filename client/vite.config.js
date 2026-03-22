import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/

const __dirname = path.dirname(fileURLToPath(import.meta.url)) // this is needed to get the correct __dirname in ES modules
// __dirname is the directory name of the current module, which is needed to resolve paths correctly in Vite when using ES modules.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {

        target: 'http://localhost:5000',

        changeOrigin: true,

      },

    },
  },
})
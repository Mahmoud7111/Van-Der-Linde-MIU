/**
 * Vite configuration for the Van Der Linde frontend.
 *
 * What this file is:
 * The central build and dev-server configuration for Vite.
 *
 * What it does:
 * - Enables React support through the official Vite React plugin.
 * - Configures the `@` alias to point at `./src` so imports stay clean and consistent.
 * - Proxies `/api` requests to the backend server in development to avoid CORS issues.
 *
 * Where it is used:
 * Loaded automatically by Vite when running `npm run dev`, `npm run build`, and `npm run preview`.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Recreate __dirname for ESM config files so path.resolve works reliably in Vite.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Treat 3D binary model files as static assets so they are not parsed as JS modules.
  assetsInclude: ['**/*.glb'],
  plugins: [
    // Enables React 18 JSX transform and fast refresh support during development.
    react(),
  ],
  resolve: {
    alias: {
      // Maps `@/` to `<project-root>/src` so every internal import can use the same absolute base.
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // For local development only:
      // Any request that starts with `/api` is forwarded to the backend server at port 5000.
      // Example: `/api/watches` -> `http://localhost:5000/api/watches`
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

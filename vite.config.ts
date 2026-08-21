import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const certDir = path.resolve(__dirname, '.certs')
const keyPath = path.join(certDir, 'eskuwela-dev.key')
const certPath = path.join(certDir, 'eskuwela-dev.crt')
const useHttps = fs.existsSync(keyPath) && fs.existsSync(certPath)

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  server: {
    host: "127.0.0.1",
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".localhost",
      ".eskuwela.dev",
      ".eskuwela.ph",
    ],
    https: useHttps
      ? {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
      : undefined,
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})

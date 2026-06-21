import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Served from https://<user>.github.io/deutsch-lernen/ in production, so the
// build needs that base path; dev/test stay at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/deutsch-lernen/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
}))

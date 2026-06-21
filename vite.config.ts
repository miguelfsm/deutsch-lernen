import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
// Served from https://<user>.github.io/deutsch-lernen/ in production, so the
// build needs that base path; dev/test stay at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/deutsch-lernen/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Deutsch Lernen',
        short_name: 'Deutsch',
        description:
          'Personal German-learning tools: verbs, nouns, adjectives and phrases.',
        lang: 'de',
        theme_color: '#1c1917',
        background_color: '#faf9f7',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
}))

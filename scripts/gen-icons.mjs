// Regenerate the PWA raster icons from public/icon.svg.
// Run with: node scripts/gen-icons.mjs
import fs from 'node:fs'
import sharp from 'sharp'

const svg = fs.readFileSync('public/icon.svg')
const out = [
  ['public/pwa-192x192.png', 192],
  ['public/pwa-512x512.png', 512],
  ['public/maskable-512x512.png', 512],
  ['public/apple-touch-icon-180x180.png', 180],
]
for (const [file, size] of out) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(file)
  console.log('wrote', file)
}

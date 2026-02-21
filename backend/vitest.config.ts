import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  // Paksa root ke folder backend agar vite tidak pickup
  // postcss.config.js / tailwind.config.ts dari root project
  root: path.resolve(__dirname),
  css: { postcss: {} },
  test: {
    include: ['src/**/*.{test,spec}.ts'],
    passWithNoTests: true,
  },
})

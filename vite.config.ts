import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

const gitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
})()
const buildDate = new Date().toISOString().slice(0, 16).replace('T', ' ')

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(`${gitHash} (${buildDate} UTC)`),
  },
  server: {
    allowedHosts: true
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Finance PWA',
        short_name: 'Finance',
        description: 'A Progressive Web App for finance management with offline support',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        prefer_related_applications: false,
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshot1.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow'
          },
          {
            src: '/screenshot2.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ],
        categories: ['finance', 'productivity']
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,webp}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)$/,
            handler: 'StaleWhileRevalidate', // Serve cached, update in background
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
})

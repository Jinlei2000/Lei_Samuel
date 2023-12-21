import presetAttributify from '@unocss/preset-attributify'
import presetUno from '@unocss/preset-uno'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [presetUno(), presetAttributify()],
      content: {
        pipeline: {
          include: [
            './index.html',
            './src/**/*.{vue,js,ts,jsx,tsx}',
            './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}',
          ],
        },
      },
    }),
    VitePWA({
      manifest: {
        name: 'Tuinbouw',
        short_name: 'TB',
        theme_color: '#f2f2f2',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

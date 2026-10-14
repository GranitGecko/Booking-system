import { defineConfig } from '@lovable.dev/vite-tanstack-config'

export default defineConfig({
  vite: {
    base: '/Booking-system/',
  },
  nitro: false,
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
      routes: ['/', '/booking'],
    },
  },
})
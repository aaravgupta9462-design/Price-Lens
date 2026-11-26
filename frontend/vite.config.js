import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces (IPv4 127.0.0.1, IPv6 ::1, and LAN IP)
    port: 5173,
  },
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: process.env.VITE_BASE_PATH || "/",
  // server: {
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       target: 'https://react-ventura-connect-backend.vercel.app',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     }
  //   }
  // }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Permite acesso externo (necessário para Docker)
    watch: {
      usePolling: true, // Necessário para hot reload no Docker
    },
  },
})


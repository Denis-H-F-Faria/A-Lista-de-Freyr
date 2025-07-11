import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['5173-igz6wxkrf0sjt0ccygotx-668e078a.manusvm.computer']
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // add a proxy to the server to avoid CORS issues
    // to the api routes
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    }, 
  },
  plugins: [react()],
})

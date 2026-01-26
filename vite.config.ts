import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // No Google Cloud, a aplicação geralmente roda na raiz. 
  // Se estiver usando GitHub Pages, mude de volta para '/nome-do-repo/'
  base: '/', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      }
    }
  },
  server: {
    historyApiFallback: true
  }
})
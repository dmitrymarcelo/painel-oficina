import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Este valor deve ser exatamente o nome do seu repositório no GitHub
  base: '/painel-oficina/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Garante que o build não dependa de arquivos externos não processados
    rollupOptions: {
      input: {
        main: './index.html',
      }
    }
  }
})
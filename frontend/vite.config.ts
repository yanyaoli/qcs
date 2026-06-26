import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT) || 5173

  return {
    plugins: [vue(), tailwindcss()],
    base: '/',
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      cors: true,
    },
    build: {
      assetsDir: 'assets',
    },
  }
})

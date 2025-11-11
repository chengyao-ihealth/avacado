import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 如果部署到 GitHub Pages，修改 base 为 '/repository-name/'
// 如果部署到自定义域名或根目录，base 设置为 '/'
// 可以通过环境变量 VITE_BASE_PATH 来设置，默认值为 '/avacado/'
export default defineConfig(({ mode }) => {
  // 开发环境使用 '/'，生产环境使用 '/avacado/'
  const base = mode === 'development' ? '/' : '/avacado/'
  
  return {
    plugins: [react()],
    base: base,
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    }
  }
})


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader(), tailwindcss()],
  base: './', // 设置基础路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    // host: '0.0.0.0', // 允许外部访问
    open: true, // 自动打开浏览器
    port: 5173, // 设置端口号
  },
})

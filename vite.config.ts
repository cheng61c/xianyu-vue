import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'
// import { visualizer } from 'rollup-plugin-visualizer'
// import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss(),
    // visualizer({ open: true }), // 构建后自动打开分析页面
    // compression({
    //   algorithm: 'gzip', // 或 'brotliCompress'
    //   threshold: 10240, // 对大于 10KB 的文件压缩
    // }),
  ],
  base: './', // 设置基础路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    open: true, // 自动打开浏览器
    port: 5173, // 设置端口号
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        dead_code: true, // 移除未使用的代码
        unused: true, // 删除未使用的变量/函数
        arguments: true, // 优化函数参数
        booleans_as_integers: true, // 将布尔值转为 0/1
        drop_console: true, // 移除所有 console.log
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.info'], // 移除特定函数（如 console.info）
        passes: 2, // 压缩次数
      },
      mangle: {
        toplevel: true, // 混淆顶层作用域
        properties: {
          regex: /^_/, // 只混淆以下划线开头的属性
        },
      },
      format: {
        comments: false, // 移除注释
      },
    },
    chunkSizeWarningLimit: 2000, // 设置 chunk 大小警告限制
  },
})

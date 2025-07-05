import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'
// import { visualizer } from 'rollup-plugin-visualizer'
// import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __INTLIFY_PROD_DEVTOOLS__: false, // 禁用生产环境 devtools
    __VUE_I18N_FULL_INSTALL__: false, // 禁用完整安装
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_PROD_DEVTOOLS__: false,
  },
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
        keep_fnames: true, // 保留函数名
        keep_classnames: true, // 保留类名
        drop_console: true, // 移除所有 console.log
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.info'], // 移除特定函数（如 console.info）
      },
      format: {
        comments: false, // 移除注释
      },
    },
    chunkSizeWarningLimit: 2000, // 设置 chunk 大小警告限制
    rollupOptions: {
      output: {
        manualChunks: {
          zh: ['./src/lang/zh.json'],
          en: ['./src/lang/en.json'],
        },
      },
    },
  },
})

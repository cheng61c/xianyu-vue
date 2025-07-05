// tailwind.config.ts
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui/src/plugins/themes'), // 只保留主题插件
  ],
  daisyui: {
    themes: ['light', 'dark'],
  },
}

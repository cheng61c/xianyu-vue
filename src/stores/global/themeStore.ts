import type { Theme } from '@/types/Theme'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeList: [] as Theme[],
    colors: {
      primary: '#3b82f6',
      primaryHover: '#93c5fd',
      primaryPress: '#2563eb',
      background: '#f8fcff',
    },
    /** 主题模式 */
    darkTheme: false,
  }),
  persist: true,
})

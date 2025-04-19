import type { Theme } from '@/types/Theme'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeList: [] as Theme[],
  }),
  persist: true,
})

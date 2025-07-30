import type { FengYunBang } from '@/types/FengYunBang'
import { defineStore } from 'pinia'

export const useFengYunBangStore = defineStore('fengyunbang', {
  state: () => ({
    list: [] as FengYunBang[],
  }),
  persist: true,
})

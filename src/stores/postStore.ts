import type { Plate } from '@/types/Plate'
import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    /** 板块缓存 */
    plate: [] as Plate[],
  }),
  persist: true,
})

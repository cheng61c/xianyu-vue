import type { Plate } from '@/types/Plate'
import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    /** 板块缓存 */
    plate: {} as Record<string, Plate[]>,
    /** 搜索历史 */
    searchHistory: [] as string[],
    /** 草稿 */
    drafts: {} as Record<string, any>,
  }),
  persist: true,
})

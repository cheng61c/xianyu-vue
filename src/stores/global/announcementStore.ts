import { defineStore } from 'pinia'

export const useAnnouncementStore = defineStore('announcement', {
  state: () => ({
    /** 弹窗公告 */
    popUps: [] as number[],
    /** 横幅公告 */
    banners: [] as number[],
  }),
  persist: true,
})

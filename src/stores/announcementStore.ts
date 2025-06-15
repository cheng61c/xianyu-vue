import { defineStore } from 'pinia'

export const useAnnouncementStore = defineStore('announcement', {
  state: () => ({
    popUps: [] as number[],
    banners: [] as number[],
  }),
  persist: true,
})

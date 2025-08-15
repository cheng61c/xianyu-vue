import { defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    drawers: [] as Array<{
      close: () => void
      id?: string
    }>,
  }),
  persist: true,
})

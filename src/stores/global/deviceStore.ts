import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    /** 1 移动端 2 桌面端 */
    device: 1,
  }),
  persist: true,
})

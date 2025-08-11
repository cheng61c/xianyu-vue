import { defineStore } from 'pinia'

export const useAdminPageStore = defineStore('admin_page', {
  state: () => ({
    registerCount: 0,
    loginCount: 0,
  }),
  persist: true,
})

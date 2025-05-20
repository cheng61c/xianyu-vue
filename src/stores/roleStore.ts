import type { role } from '@/types'
import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({
    list: [] as role[],
  }),
  persist: true,
})

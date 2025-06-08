import type { Role } from '@/types/Role'
import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({
    list: [] as Role[],
  }),
  persist: true,
})

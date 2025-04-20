import { defineStore } from 'pinia'
import type { UserType } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {} as UserType,
    account: '',
    password: '',
  }),
  persist: true,
})

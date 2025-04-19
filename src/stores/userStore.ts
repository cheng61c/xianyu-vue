// stores/userStore.js
import type { UserType } from '@/types'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    /** 用户令牌 */
    token: '',
    /** 用户信息 */
    user: {} as UserType,
    /** 是否登录 */
    islogin: false,
  }),
})

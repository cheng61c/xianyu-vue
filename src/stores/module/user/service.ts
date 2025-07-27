import { userApi } from '@/apis'
import { useUserStore } from './userStore'
import { formatLink } from '@/utils/format'
import { formatImageSrcsInHtml } from '@/utils/regex'
import type { UserType } from '@/types'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userStore = useUserStore()

export const login = async () => {
  userApi
    .login({
      account: userStore.account,
      password: userStore.password,
    })
    .then((res) => {
      if (res.data.code === 200) {
        userStore.token = res.data.data.token
        const data = res.data.data
        data.headImg = formatLink(data.headImg)
        data.signature = formatImageSrcsInHtml(data.signature)
        userStore.userInfo = data.user
        userStore.isLogin = true
      }
    })
    .catch((_error) => {
      userStore.userInfo = {} as UserType
      userStore.token = ''
      userStore.isLogin = false
    })
}

export const logout = (t: any, close?: () => {}) => {
  userStore.isLogin = false
  // 这里可以调用登出接口
  userApi
    .logout()
    .then(() => {
      // 清除用户信息
      userStore.token = ''
      userStore.userInfo = {} as UserType
      userStore.autoLogin = false
      toast.success(t('t.deng-chu-cheng-gong'))
      if (close) {
        close()
      }
    })
    .catch(() => {
      toast.error(t('t.deng-chu-shi-bai'))
    })
}

export const getInfo = async () => {
  userApi
    .getCurrentUser()
    .then((res) => {
      if (res.data.code === 200) {
        const data = res.data.data as UserType
        data.headImg = formatLink(data.headImg)
        data.signature = formatImageSrcsInHtml(data.signature)
        userStore.userInfo = data
        userStore.isLogin = true
      }
    })
    .catch((_error) => {
      userStore.userInfo = {} as UserType
      userStore.token = ''
      userStore.isLogin = false
    })
}

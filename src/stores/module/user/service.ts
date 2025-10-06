import { commentApi, postApi, serverApi, uploadApi, userApi } from '@/apis'
import { useUserStore } from './userStore'
import { formatLink } from '@/utils/format'
import { formatImageSrcsInHtml } from '@/utils/regex'
import type { UserType } from '@/types'
import { useToast } from 'vue-toastification'
import type { Role } from '@/types/Role'

const toast = useToast()
const userStore = useUserStore()

/** 登录 */
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
        data.roles = data.user.roles.sort((a: Role, b: Role) => a.id - b.id)
        userStore.userInfo = data.user
        userStore.isLogin = true
      }
    })
    .catch((error) => {
      console.error('登陆错误', error)

      userStore.userInfo = {} as UserType
      userStore.token = ''
      userStore.isLogin = false
    })
}

/** 退出登录 */
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

/** 强制退出登录 */
export const forceLogout = () => {
  userApi
    .updateUserKey()
    .then((res) => {
      if (res.data.code === 200) {
        toast.success('操作成功')
        userStore.logout()
      }
    })
    .catch((error) => {
      console.error('Error forcing logout:', error)
      toast.error('操作失败' + error.msg)
    })
}

export const updateUserVerifyCode = (code: string) => {
  userApi
    .updateUserVerifyCode(code)
    .then((res) => {
      if (res.data.code === 200) {
        toast.success('操作成功')
      }
    })
    .catch((error) => {
      console.error('Error forcing logout:', error)
      toast.error('操作失败' + error.msg)
    })
}

/** 获取用户账号信息 */
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

export const getUserPanel = async (userId: number) => {
  const user =
    userId === userStore.userInfo.id
      ? await userApi.getCurrentUser()
      : await userApi.getUser(userId)
  const posts =
    userId === userStore.userInfo.id
      ? await userApi.getUserPosts({ userId, type: 1 })
      : await postApi.getPostList({ creatorId: userId, type: 1 })
  const resources =
    userId === userStore.userInfo.id
      ? await userApi.getUserPosts({ userId, type: 1 })
      : await postApi.getPostList({ creatorId: userId, type: 2 })
  const files = await uploadApi.getFilesList({
    types: '1,2,3,4,5,7',
    page: 1,
    limit: 999,
  })
  const servers = await serverApi.getCurrentUserServer({
    creatorId: userStore.userInfo.id,
    page: 1,
    limit: 999,
  })
  const comments = await commentApi.getCommentList({
    uid: userStore.userInfo.id,
    page: 1,
    limit: 999,
  })

  return {
    user: user.data.data,
    posts: posts.data.data,
    resources: resources.data.data,
    files: files.data.data,
    servers: servers.data.data,
    comments: comments.data.data,
  }
}

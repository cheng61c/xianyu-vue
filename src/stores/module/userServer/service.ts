import { useToast } from 'vue-toastification'
import { useUserStore } from '../user/userStore'
import { useUserServerStore } from './userServerStore'
import { serverApi } from '@/apis'
import { formatTime } from '@/utils/format'

const userStore = useUserStore()
const userServerStore = useUserServerStore()
const toast = useToast()

export const getPosts = () => {
  if (!userStore.isLogin) {
    return
  }
  userServerStore.resLoding = true
  serverApi
    .getCurrentUserServer({
      creatorId: userStore.userInfo.id,
      page: userServerStore.pagination.page,
      limit: userServerStore.pagination.limit,
    })
    .then((response) => {
      userServerStore.posts = response.data.data.list.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
        return item
      })
      userServerStore.pagination = {
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
      }
      userServerStore.resLoding = false
    })
    .catch((error) => {
      console.error('Error fetching posts:', error)
      userServerStore.resLoding = false
    })
}

export const unpublishItem = (postIndex: number, t: any) => {
  const item = userServerStore.posts[postIndex]
  if (!item) {
    toast.error(t('t.tie-zi-bu-cun-zai'))
    return
  }
  serverApi
    .updateServer({
      id: item.id,
      visible: item.visible == 1 ? 0 : 1,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

export const deleteItem = (postIndex: number) => {
  userServerStore.modal.isDeletePost = true
  userServerStore.currentPostIndex = postIndex
}

export const deletePost = (t: any) => {
  const item = userServerStore.posts[userServerStore.currentPostIndex]
  if (!item) {
    toast.error(t('t.tie-zi-bu-cun-zai'))
    return
  }
  serverApi
    .deleteServer(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts()
        toast.success(t('t.shan-chu-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
  userServerStore.modal.isDeletePost = false
}

export const toPage = (page: number) => {
  userServerStore.pagination.page = page
  getPosts()
}

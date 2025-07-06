import { defineStore } from 'pinia'
import type { ServerPostType } from '@/types/ServerPost'
import { useUserStore } from './userStore'

import { serverApi } from '@/apis'
import { formatTime } from '@/hook/format'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()
export const useUserServerStore = defineStore('userServer', {
  state: () => ({
    /** 分页信息 */
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    /** 资源加载中 */
    resLoding: false,
    /** 帖子列表 */
    posts: [] as ServerPostType[],
    /** 当前所选帖子索引 */
    currentPostIndex: -1,
    /** 模态框 */
    modal: {
      isDeletePost: false, // 是否显示删除帖子模态框
    },
  }),
  actions: {
    async getPosts() {
      if (!userStore.isLogin) {
        return
      }
      this.resLoding = true
      serverApi
        .getCurrentUserServer({
          creatorId: userStore.userInfo.id,
          page: this.pagination.page,
          limit: this.pagination.limit,
        })
        .then((response) => {
          this.posts = response.data.data.list.map((item: any) => {
            item.createdAt = formatTime(item.createdAt)
            return item
          })
          this.pagination = {
            page: response.data.data.page,
            limit: response.data.data.limit,
            total: response.data.data.total,
          }
          this.resLoding = false
        })
        .catch((error) => {
          console.error('Error fetching posts:', error)
          this.resLoding = false
        })
    },

    async unpublishItem(postIndex: number) {
      const item = this.posts[postIndex]
      if (!item) {
        toast.error('帖子不存在')
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
            this.getPosts()
            toast.success('操作成功')
          }
        })
        .catch((error) => {
          toast.error('请求失败: ' + error.msg)
        })
    },

    deleteItem(postIndex: number) {
      this.modal.isDeletePost = true
      this.currentPostIndex = postIndex
    },

    async deletePost() {
      const item = this.posts[this.currentPostIndex]
      if (!item) {
        toast.error('帖子不存在')
        return
      }
      serverApi
        .deleteServer(item.id)
        .then((response) => {
          if (response.data.code === 200) {
            // 刷新帖子列表
            this.getPosts()
            toast.success('删除成功')
          }
        })
        .catch((error) => {
          toast.error('请求失败: ' + error.msg)
        })
      this.modal.isDeletePost = false
    },

    toPage(page: number) {
      this.pagination.page = page
      this.getPosts()
    },
  },
})

import { downloadApi, postApi, userApi } from '@/apis'
import { useUserResourceStore } from './userResourceStore'
import { formatLink, formatTimeOrAgo, htmlToText } from '@/utils/format'
import { extractImageSrcs } from '@/utils/regex'

import { useToast } from 'vue-toastification'
import { useUserStore } from '../user/userStore'

const toast = useToast()
const resStore = useUserResourceStore()
const userStore = useUserStore()

export const searchUserResource = async (
  t: any,
  key: string,
  click = true,
  fileTypes?: string
) => {
  if (click) {
    resStore.pagination.page = 1
  }

  resStore.loading = true
  resStore.searchText = key.trim()
  resStore.isSearch = true

  const query: any = {
    userId: userStore.userInfo.id,
    type: 2,
    page: resStore.pagination.page,
    limit: resStore.pagination.limit,
  }

  if (resStore.searchText !== '') {
    query.key = resStore.searchText
  }

  if (fileTypes && fileTypes != '0') {
    query.fileTypes = fileTypes
  }

  try {
    const response = await userApi.getUserPosts(query)
    if (response.data.code !== 200) {
      toast.error(t('t.sou-suo-shi-bai') + response.data.message)
      return false
    }
    resStore.posts = response.data.data.list.map((item: any) => {
      const imgs = extractImageSrcs(item.content)
      item.cover = imgs.length > 0 ? imgs[0] : ''
      item.createdAt = formatTimeOrAgo(item.createdAt, t)
      item.content = htmlToText(item.content)
      return item
    })
    resStore.pagination = {
      page: response.data.data.page,
      limit: response.data.data.limit,
      total: response.data.data.total,
      count: response.data.data.count,
    }
    resStore.loading = false
  } catch (error) {
    toast.error(t('t.sou-suo-shi-bai') + error)
    resStore.loading = false
    return false
  }
}

export const deletePackage = (t: any) => {
  const item = resStore.packageList[resStore.currenPkgId]
  if (!item) {
    toast.error(t('t.ban-ben-bu-cun-zai'))
    return
  }
  postApi
    .deleteVersion(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新版本列表
        getPackageList(t)
        toast.success(t('t.shan-chu-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
  resStore.isDeletePkg = false
}

export const getPackageList = (t: any) => {
  postApi
    .getPostDocumentList({
      id: resStore.currenPostId,
    })
    .then((response) => {
      resStore.packageList = response.data.data.map((item: any) => {
        item.createdAt = formatTimeOrAgo(item.createdAt, t)
        return item
      })
    })
    .catch((error) => {
      console.error('Error fetching package list:', error)
    })
}

export const downloadFile = (url: string, vid: number) => {
  if (!url) return
  let fileName = url.split('/').pop()
  if (!fileName) return
  fileName = fileName.replace(/(preview|download)\?filename=/, '')
  downloadApi.downloadFile(fileName, vid)
}

export const deletePost = (t: any) => {
  const item = resStore.posts[resStore.currenPostId]
  if (!item) {
    toast.error(t('t.tie-zi-bu-cun-zai'))
    return
  }
  postApi
    .deletePost(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPosts(t)
        toast.success(t('t.shan-chu-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
  resStore.isDeletePost = false
}

export const getPosts = (t: any) => {
  if (!userStore.isLogin) {
    return
  }
  if (resStore.isSearch) {
    searchUserResource(t, resStore.searchText, false)
    return
  }
  resStore.loading = true
  userApi
    .getUserPosts({
      userId: userStore.userInfo.id,
      type: 2,
      page: resStore.pagination.page,
      limit: resStore.pagination.limit,
    })
    .then((response) => {
      resStore.posts = response.data.data.list.map((item: any) => {
        const imgs = extractImageSrcs(item.content)
        item.cover = imgs.length > 0 ? formatLink(imgs[0]) : ''
        item.createdAt = formatTimeOrAgo(item.createdAt, t)
        item.content = htmlToText(item.content)
        return item
      })
      resStore.pagination = {
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
        count: response.data.data.count,
      }
      resStore.loading = false
    })
    .catch((error) => {
      toast.error(t('t.jia-zai-shi-bai') + error.msg)
    })
}

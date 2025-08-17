import { useToast } from 'vue-toastification'
import { plateApi, postApi, reportApi } from '@/apis'
import { useConfigStore } from '@/stores/global/configStore'
import { usePostStore } from '@/stores/module/post/postStore'
import type { Api } from '@/types'
import type { Plate } from '@/types/Plate'
import { formatNumber, formatTime, lightHtml } from '@/utils/format'
import { extractImageSrcs, formatImageSrcsInHtml } from '@/utils/regex'
import type { PostListQueryDto } from '@/types/PostListQueryDto'
import type { Post } from '@/types/Post'
import type { RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-vue-next'

import { generateTocFromHtml } from '@/utils/toc'
import { useUserStore } from '../user/userStore'

const toast = useToast()
const configStore = useConfigStore()
const postStore = usePostStore()
const userStore = useUserStore()

/** 获取板块列表 */
export const getPlate = async (t: any) => {
  const typeId =
    configStore.menuItems.find(
      (item) => item.pathName === postStore.currentPlate.currentRouteName
    )?.type || 1
  plateApi
    .getPlateList()
    .then((res: Api) => {
      const data = res.data
      if (data.code !== 200) {
        return toast.error(t('t.huo-qu-ban-kuai-shi-bai'))
      }
      const plates = data.data as Plate[]

      postStore.plate[postStore.currentPlate.currentRouteName] = plates.filter(
        (plate) => plate.type === typeId
      )
    })
    .catch((error) => {
      toast.error(t('t.huo-qu-ban-kuai-shi-bai'))
      console.error('获取板块失败:', error)
    })
}

/** 点击切换板块 */
export const handleCardClick = (
  plateId: number,
  route: RouteLocationNormalizedLoadedGeneric,
  router: Router
) => {
  router.push({ name: route.name, params: { plateId } })
  postStore.currentPlate.activation = plateId
}

/** 跳转分页 */
export const toPage = (
  page: number,
  route: RouteLocationNormalizedLoadedGeneric
) => {
  postStore.postPage.page = page
  getPost(postStore.plateId, route)
}

/** 获取帖子 */
export const getPost = async (
  pid: number,
  route: RouteLocationNormalizedLoadedGeneric
) => {
  console.log('pid', pid)
  if (
    postStore.isSearch &&
    postStore.searchText &&
    postStore.searchText.trim()
  ) {
    search(postStore.searchText, false, '0', route)
    return
  }
  const query: PostListQueryDto = {
    type: route.name == 'postList' ? 1 : 2,
  }
  console.log('pid', pid)

  if (pid !== 0) {
    query.plateId = pid
  }
  query.page = postStore.postPage.page
  query.limit = postStore.postPage.limit
  postApi.getPostList(query).then((response: Api) => {
    const res = response.data
    if (res.code === 200) {
      postStore.post = res.data.list.map((item: Post) => {
        // 处理图片链接
        item.images = extractImageSrcs(item.content)
        item.content = formatImageSrcsInHtml(item.content)
        item.createdAt = formatTime(item.createdAt)
        item.updatedAt = formatTime(item.updatedAt)
        item.likeCount = formatNumber(item.likeCount)
        item.commentCount = formatNumber(item.commentCount)
        item.views = formatNumber(item.views)
        return item
      })
      postStore.postPage.page = res.data.page
      postStore.postPage.total = res.data.total
      postStore.postPage.limit = res.data.limit
    }
  })
}
/** 搜索帖子 */
export const search = (
  key: string,
  click = true,
  fileTypes = '0',
  route: RouteLocationNormalizedLoadedGeneric
) => {
  if (click) {
    postStore.postPage.page = 1
  }
  postStore.searchText = key.trim()
  postStore.isSearch = true
  const query: PostListQueryDto = {
    type: route.name == 'postList' ? 1 : 2,
  }
  if (postStore.plateId && postStore.plateId !== 0) {
    query.plateId = postStore.plateId
  }

  if (fileTypes && fileTypes != '0' && fileTypes.length > 0) {
    query.fileTypes = fileTypes
  }
  query.title = postStore.searchText
  query.page = postStore.postPage.page
  query.limit = postStore.postPage.limit
  postApi.getPostList(query).then((response: Api) => {
    const res = response.data
    if (res.code === 200) {
      postStore.post = res.data.list.map((item: Post) => {
        // 处理图片链接
        item.images = extractImageSrcs(item.content)
        item.createdAt = formatTime(item.createdAt)
        item.updatedAt = formatTime(item.updatedAt)
        return item
      })
      postStore.postPage.page = res.data.page
      postStore.postPage.total = res.data.total
      postStore.postPage.limit = res.data.limit
    }
  })
}
/** 获取帖子详情 */
export const getPostDetails = async (postId: number) => {
  postStore.postData = null // 清理数据
  postStore.tocList = [] // 清理目录列表
  postStore.errorPage = false // 重置错误页面标志
  return postApi
    .getPostDetail(postId)
    .then((response: Api) => {
      const data = response.data.data as Post
      data.content = lightHtml(formatImageSrcsInHtml(data.content))
      data.createdAt = formatTime(data.createdAt)
      data.updatedAt = formatTime(data.updatedAt)
      data.commentCount = formatNumber(data.commentCount)
      data.likeCount = formatNumber(data.likeCount)
      data.badCount = formatNumber(data.badCount)
      data.postVersions = data.postVersions.map((item) => ({
        ...item,
        content: lightHtml(formatImageSrcsInHtml(item.content)),
        createdAt: formatTime(item.createdAt),
      }))
      const tocList = generateTocFromHtml(data.content)
      postStore.tocList = tocList
      postStore.postData = data
      postStore.errorPage = false // 重置错误页面标志
      return {
        post: data,
        toc: tocList,
      }
    })
    .catch((error) => {
      console.error('Error fetching post details:', error)
      toast.error(error.msg)
      postStore.errorPage = true
      return {
        post: null,
        toc: [],
      }
    })
}
/** 获取文件标签 */
export const getFileTypeOptions = (t: any) => {
  return [
    { value: 0, label: t('b.quan-bu') },
    { value: 1, label: t('b.cun-dang') },
    { value: 2, label: t('b.jia-ju') },
    { value: 3, label: t('b.cai-zhi') },
    { value: 4, label: t('b.pi-fu') },
    { value: 5, label: t('b.mo-zu') },
    { value: 7, label: t('b.qi-ta') },
  ]
}
/** 获取排序选项 */
export const getSortOptions = (t: any) => {
  return [
    { value: 1, label: t('b.shi-jian-jiang-xu'), icon: ArrowDownWideNarrow },
    { value: 2, label: t('b.shi-jian-sheng-xu'), icon: ArrowUpNarrowWide },
    { value: 3, label: t('b.dian-zan-jiang-xu'), icon: ArrowDownWideNarrow },
    { value: 4, label: t('b.dian-zan-sheng-xu'), icon: ArrowUpNarrowWide },
  ]
}

/** 删除帖子 */
export const deletePost = (
  t: any,
  postId: number,
  disabled: number,
  close?: () => void
) => {
  postApi
    .deletePostAsAdmin({
      id: postId,
      disabled: disabled,
    })
    .then((response) => {
      if (response.data.code === 200) {
        if (close) {
          close()
        }
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

/** 下架帖子 */
export const downPost = (
  t: any,
  postId: number,
  visible: number,
  close?: () => void
) => {
  postApi
    .updatePost({
      id: postId,
      visible: visible,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        if (close) {
          close()
        }
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

/** 置顶 */
export const setTop = (
  t: any,
  postId: number,
  top: number,
  close?: () => void
) => {
  postApi
    .updatePostAsAdmin({
      id: postId,
      top: top,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        if (close) {
          close()
        }
        toast.success(t('t.cao-zuo-cheng-gong'))
      }
    })
    .catch((error) => {
      toast.error(t('t.qing-qiu-shi-bai') + error.msg)
    })
}

/** 举报 */
export const reportPost = (
  t: any,
  targetType: number,
  targetId: number,
  reason: string,
  close?: () => void
) => {
  reportApi
    .createReport({
      targetType: targetType,
      targetId: targetId,
      reason: reason,
    })
    .then((response) => {
      if (response.data.code === 200) {
        if (close) {
          close()
        }
        toast.success(t('t.ju-bao-yi-ti-jiao-wo-men-hui-jin-kuai-chu-li'))
      }
    })
    .catch((error) => {
      toast.error(t('t.ju-bao-shi-bai') + error.msg)
    })
}

/** 帖子点赞 */
export const likePost = (t: any, postId: number, close?: () => void) => {
  if (!userStore.isLogin) {
    toast.error(t('t.qing-xian-deng-lu'))
    return
  }
  postApi
    .postLike(postId)
    .then(() => {
      if (close) close()
      toast.success(t('t.cao-zuo-cheng-gong'))
    })
    .catch((error) => {
      console.error('Error liking post:', error)
    })
}

/** 帖子点踩 */
export const badPost = (t: any, postId: number, close?: () => void) => {
  if (!userStore.isLogin) {
    toast.error(t('t.qing-xian-deng-lu'))
    return
  }
  postApi
    .postBad(postId)
    .then(() => {
      if (close) close()
      toast.success(t('t.cao-zuo-cheng-gong'))
    })
    .catch((error) => {
      console.error('Error liking post:', error)
    })
}

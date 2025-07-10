import { useToast } from 'vue-toastification'
import { plateApi, postApi } from '@/apis'
import { useConfigStore } from '@/stores/global/configStore'
import { usePostStore } from '@/stores/module/post/postStore'
import type { Api } from '@/types'
import type { Plate } from '@/types/Plate'
import { formatTime } from '@/utils/format'
import { extractImageSrcs, formatImageSrcsInHtml } from '@/utils/regex'
import type { PostListQueryDto } from '@/types/PostListQueryDto'
import type { Post } from '@/types/Post'
import type { RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router'

const toast = useToast()
const configStore = useConfigStore()
const postStore = usePostStore()

/** 获取板块列表 */
export const getPlate = async () => {
  const typeId =
    configStore.menuItems.find(
      (item) => item.pathName === postStore.currentPlate.currentRouteName
    )?.type || 1
  plateApi
    .getPlateList()
    .then((res: Api) => {
      const data = res.data
      if (data.code !== 200) {
        return toast.error('获取板块失败')
      }
      const plates = data.data as Plate[]

      postStore.plate[postStore.currentPlate.currentRouteName] = plates.filter(
        (plate) => plate.type === typeId
      )
    })
    .catch((error) => {
      toast.error('获取板块失败: ' + error.message)
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
export const getPost = (
  pid: number,
  route: RouteLocationNormalizedLoadedGeneric
) => {
  if (postStore.isSearch) {
    search(postStore.searchText, false, '0', route)
    return
  }
  const query: PostListQueryDto = {
    type: route.name == 'postList' ? 1 : 2,
  }
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

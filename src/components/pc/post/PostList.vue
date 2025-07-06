<template>
  <div class="w-full h-full flex flex-1 flex-col pb-4">
    <ScSearch
      key="user-post-search"
      placeholder="搜索帖子标题"
      @search="search"
      v-model="searchText"
      :searchType="route.name == 'postList' ? 1 : 2"
      class="m-1 mb-3" />

    <div v-if="posts.length" class="flex flex-col flex-grow">
      <ul
        class="flex-grow overflow-y-auto no-scrollbar p-1 flex flex-col gap-4">
        <li v-for="post in posts" :key="post.id">
          <ItemCard :post="post" />
        </li>
      </ul>
      <div class="flex-shrink-0 mt-2">
        <Pagination
          :current-page="postPage.page"
          :total-items="postPage.total"
          :page-size="postPage.limit"
          @page-change="toPage" />
      </div>
    </div>

    <EmptyState
      v-else
      class="w-full px-auto"
      action="前往发帖"
      :actionIcon="SquareArrowOutUpRight"
      @action-click="$router.push({ name: 'publish' })" />
  </div>
</template>

<script setup lang="ts">
import { postApi } from '@/apis'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from './ItemCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Post } from '@/types/Post'
import type { Api } from '@/types'
import type { PostListQueryDto } from '@/types/PostListQueryDto'
import { SquareArrowOutUpRight } from 'lucide-vue-next'
import { useConfigStore } from '@/stores/global/configStore'
import ScSearch from '@/components/pc/user/ScSearch.vue'
import { extractImageSrcs, formatImageSrcsInHtml } from '@/hook/regex'
import { formatTime } from '@/hook/format'

const route = useRoute()
const plateId = ref<string>(route.params.plateId as string)
const posts = ref<Post[]>([])
const limit = 10 // 每页显示的帖子数量
const postPage = ref({
  page: 1,
  total: 0,
  limit: limit,
})
const configStore = useConfigStore()

const searchText = ref<string>('')
const isSearch = ref<boolean>(false)

const toPage = (page: number) => {
  postPage.value.page = page
  getPost(+plateId.value)
}

const getPost = (pid: number) => {
  console.log('获取帖子列表，当前板块ID:', pid, '当前页:', postPage.value.page)

  if (isSearch.value) {
    search(searchText.value, false)
    return
  }
  const query: PostListQueryDto = {
    type: route.name == 'postList' ? 1 : 2,
  }
  if (pid !== 0) {
    query.plateId = pid
  }
  query.page = postPage.value.page
  query.limit = postPage.value.limit
  postApi.getPostList(query).then((response: Api) => {
    const res = response.data
    if (res.code === 200) {
      console.log('请求成功', res.data.list)

      posts.value = res.data.list.map((item: Post) => {
        // 处理图片链接
        item.images = extractImageSrcs(item.content)
        item.content = formatImageSrcsInHtml(item.content)
        item.createdAt = formatTime(item.createdAt)
        item.updatedAt = formatTime(item.updatedAt)
        return item
      })
      postPage.value.page = res.data.page
      postPage.value.total = res.data.total
      postPage.value.limit = res.data.limit
    }
  })
}

const search = (key: string, click = true, fileTypes?: string) => {
  console.log('搜索帖子，关键词:', key, '点击:', click, '文件类型:', fileTypes)

  // if (key.trim() === '') {
  //   isSearch.value = false
  //   postPage.value = {
  //     page: 1,
  //     limit: limit,
  //     total: 0,
  //   }
  //   getPost(+plateId.value)
  //   return
  // }
  if (click) {
    postPage.value.page = 1
  }
  searchText.value = key.trim()
  isSearch.value = true
  const query: PostListQueryDto = {
    type: route.name == 'postList' ? 1 : 2,
  }
  if (plateId.value && plateId.value !== '0') {
    query.plateId = +plateId.value
  }

  if (fileTypes && fileTypes != '0' && fileTypes.length > 0) {
    query.fileTypes = fileTypes
  }
  query.title = searchText.value
  query.page = postPage.value.page
  query.limit = postPage.value.limit
  postApi.getPostList(query).then((response: Api) => {
    const res = response.data
    if (res.code === 200) {
      console.log('请求成功', res.data.list)

      posts.value = res.data.list.map((item: Post) => {
        // 处理图片链接
        item.images = extractImageSrcs(item.content)
        console.log(item.createdAt, item.updatedAt)

        item.createdAt = formatTime(item.createdAt)
        item.updatedAt = formatTime(item.updatedAt)
        return item
      })
      postPage.value.page = res.data.page
      postPage.value.total = res.data.total
      postPage.value.limit = res.data.limit
    }
  })
}

watch(
  () => route.params,
  (newPlate) => {
    if (newPlate.plateId && configStore.currentPlate.pathName === route.name) {
      plateId.value = newPlate.plateId as string
      postPage.value.page = 1
      postPage.value.limit = limit
      postPage.value.total = 0
      posts.value = []
      getPost(+newPlate.plateId)
    }
  }
)
onMounted(() => {
  getPost(+route.params.plateId)
})
</script>

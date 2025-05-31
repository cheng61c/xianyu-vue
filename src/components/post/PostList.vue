<template>
  <div v-if="posts.length" class="w-full">
    <ul
      class="flex flex-col gap-4 overflow-y-auto no-scrollbar p-1 h-[calc(100vh-8rem)]">
      <li v-for="post in posts" :key="post.id">
        <ItemCard :post="post" />
      </li>
    </ul>
    <Pagination
      :current-page="postPage.page"
      :total-items="postPage.total"
      :page-size="postPage.limit"
      @page-change="toPage" />
  </div>

  <EmptyState
    v-else
    class="w-xl px-1"
    action="前往发帖"
    :actionIcon="SquareArrowOutUpRight"
    @action-click="$router.push({ name: 'publish' })" />
</template>

<script setup lang="ts">
import { getPostList } from '@/apis/post'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from './ItemCard.vue'
import Pagination from '../Pagination.vue'
import EmptyState from '../EmptyState.vue'
import type { Post } from '@/types/Post'
import type { Api } from '@/types'
import type { PostListQueryDto } from '@/types/PostListQueryDto'
import { SquareArrowOutUpRight } from 'lucide-vue-next'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const plateId = ref<string>(route.params.plateId as string)
const posts = ref<Post[]>([])
const postPage = ref({
  page: 1,
  total: 0,
  limit: 3,
})
const configStore = useConfigStore()

const toPage = (page: number) => {
  postPage.value.page = page
  getPost(+plateId.value)
}

const getPost = (pid: number) => {
  const query: PostListQueryDto = {
    type: route.name == 'postList' ? 1 : 2,
  }
  if (pid !== 0) {
    query.plateId = pid
  }
  query.page = postPage.value.page
  query.limit = postPage.value.limit
  getPostList(query).then((response: Api) => {
    const res = response.data
    if (res.code === 200) {
      console.log('请求成功', res.data.list)

      posts.value = res.data.list
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
      postPage.value.limit = 3
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

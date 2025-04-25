<template>
  <ul
    v-if="posts.length"
    class="flex flex-col gap-4 overflow-y-auto w-xl no-scrollbar px-1"
  >
    <li v-for="post in posts" :key="post.id">
      <ItemCard @click="handleCardClick(post.id)" :post="post" />
    </li>
    <Pagination
      :current-page="postPage.page"
      :total-items="postPage.total"
      :page-size="postPage.limit"
    />
  </ul>
  <EmptyState
    v-else
    class="w-xl px-1"
    action="前往发帖"
    :actionIcon="SquareArrowOutUpRight"
    actionVariant
  />
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

const route = useRoute()
const plateId = ref<string>(route.params.plateId as string)
const posts = ref<Post[]>([])
const postPage = ref({
  page: 1,
  total: 10,
  limit: 2,
})

const handleCardClick = (postId: number) => {
  console.log(`Post clicked: ${postId}`)
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
  getPostList(query).then((response) => {
    const res = response.data as Api
    if (res.code === 200) {
      posts.value = res.data.list
      postPage.value.page = res.data.page
      postPage.value.total = res.data.total
      postPage.value.limit = res.data.limit
    }
  })
}

watch(
  () => route.params.plateId,
  (newPlateId) => {
    if (newPlateId) {
      plateId.value = newPlateId as string
      getPost(+newPlateId)
    }
  }
)
onMounted(() => {
  getPost(+route.params.plateId)
})
</script>

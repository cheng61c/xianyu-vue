<template>
  <ul class="flex flex-col gap-4">
    <li v-for="post in posts" :key="post.id">
      <ItemCard @click="handleCardClick(post.id)" :post="post" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getPostList } from '@/apis/post'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from './ItemCard.vue'
import type { Post } from '@/types/Post'
import type { Api } from '@/types'
import type { PostListQueryDto } from '@/types/PostListQueryDto'

const route = useRoute()
const plateId = ref<string>(route.params.plateId as string)
const posts = ref<Post[]>([])
const postPage = ref({
  page: 1,
  total: 1,
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

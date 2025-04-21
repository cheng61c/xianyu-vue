<template>
  <ul class="flex flex-col gap-4">
    <li v-for="post in posts" :key="post.id">
      <Card @click="handleCardClick(post.id)">
        <div class="flex gap-2 text-background-content">
          <div>{{ post.title }}</div>
          <div>{{ post.content }}</div>
        </div>
      </Card>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getPostList } from '@/apis/post'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Card from '../Card.vue'
import type { Post } from '@/types/Post'
import type { Api } from '@/types'

const route = useRoute()
const plateId = ref<string>(route.params.plateId as string)
const posts = ref<Post[]>([])

const handleCardClick = (postId: number) => {
  console.log(`Post clicked: ${postId}`)
}

watch(
  () => route.params.plateId,
  (newPlateId) => {
    if (newPlateId) {
      plateId.value = newPlateId as string
      getPostList({ plateId: +plateId.value }).then((response) => {
        const res = response.data as Api
        if (res.code === 200) {
          posts.value = res.data.list
        }
      })
    }
  }
)
onMounted(() => {
  getPostList({ plateId: +plateId.value }).then((response) => {
    const res = response.data as Api
    if (res.code === 200) {
      posts.value = res.data.list
    }
  })
})
</script>

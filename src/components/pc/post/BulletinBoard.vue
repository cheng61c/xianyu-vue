<template>
  <div
    class="flex flex-col gap-4 h-full overflow-y-auto px-1 pt-1 min-w-xs no-scrollbar">
    <Creation />
    <Card>
      <h2 class="card-title px-1.5"></h2>
      <div v-for="post in posts">
        <div
          v-if="post.top == 1"
          @click="handleClick(post)"
          class="flex gap-2 items-center px-1.5 py-1 hover:bg-gray/50 rounded-md cursor-pointer transition-all">
          <div class="px-2 py-0.5 rounded-md bg-warning text-sm">置顶</div>
          <div class="font-bold">{{ post.title }}</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import { useRouter } from 'vue-router'

import Creation from './Creation.vue'
import type { Post } from '@/types/Post'
import { onMounted, ref } from 'vue'
import { postApi } from '@/apis'
import { formatTime } from '@/hook/format'

const router = useRouter()

const handleClick = (post: { id: any }) => {
  router.push({
    name: 'postDetails',
    params: { postId: post.id },
  })
}

const posts = ref<Post[]>([])

const getPost = () => {
  postApi.getPostListTop().then((res) => {
    if (res.data.code === 200) {
      posts.value = res.data.data.list.map((item: any) => {
        item.createdAt = formatTime(item.createdAt)
        item.updatedAt = formatTime(item.updatedAt)
        return item
      })
    }
  })
}

onMounted(() => {
  getPost()
})
</script>

<style scoped>
/* Add your styles here */
</style>

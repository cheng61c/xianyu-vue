<template>
  <div
    v-if="loadError"
    class="flex flex-col items-center justify-center h-full">
    <EmptyState
      title="加载失败"
      description="请刷新页面或点击下方返回"
      action="返回"
      :actionIcon="Undo2"
      @action-click="$router.back()" />
  </div>

  <template v-if="!loading">
    <CreatePost
      v-if="createType === 'publish'"
      :isEdit="postData !== null"
      :post="postData" />
    <CreateResource
      v-if="createType === 'publishResource'"
      :isEdit="postData !== null"
      :post="postData" />
  </template>
</template>

<script setup lang="ts">
import { postApi } from '@/apis'
import { onMounted, ref } from 'vue'
import { Undo2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import CreatePost from './CreatePost.vue'
import CreateResource from './CreateResource.vue'
import type { Post } from '@/types/Post'

const route = useRoute()
const createType = ref('')
const loadError = ref(false)
const currentPostId = ref<number>(0)
const loading = ref(true)
const postData = ref<Post | null>(null)

onMounted(async () => {
  const postId = route.params.postId
  if (postId) {
    currentPostId.value = +postId
    const res = await postApi.getPostDetail(+postId)
    if (res.data.code === 200) {
      postData.value = res.data.data as Post
      loading.value = false
    } else {
      loadError.value = true
      loading.value = false
      console.error('帖子加载失败:', res.data.message)
    }
  }
  createType.value = route.name as string
  loading.value = false
})
</script>

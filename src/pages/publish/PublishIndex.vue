<template>
  <div
    v-if="loadError"
    class="flex flex-col items-center justify-center h-full"
  >
    <EmptyState
      title="加载失败"
      description="请刷新页面或点击下方返回"
      action="返回"
      :actionIcon="Undo2"
      @action-click="$emit('goBack')"
    />
  </div>

  <CreatePost v-if="createType === '文章'" />
  <CreateResource v-if="createType === '资源'" />
</template>

<script setup lang="ts">
import { post } from '@/apis'
import type { Api } from '@/types'
import { onMounted, ref } from 'vue'
import { Undo2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import { useToast } from 'vue-toastification'
import EmptyState from '@/components/EmptyState.vue'
import CreatePost from './CreatePost.vue'
import CreateResource from './CreateResource.vue'

const toast = useToast()
const postStore = usePostStore()
const route = useRoute()
const createType = ref('')
const loadError = ref(false)

onMounted(() => {
  const postId = route.params.postId
  if (postId) {
    // 携带帖子id为编辑帖子，获取帖子信息
    post
      .getPostDetail(+postId)
      .then((response: Api) => {
        const res = response.data
        if (res.code === 200) {
          postStore.drafts[+postId] = res.data
          createType.value = res.data.type === 1 ? '文章' : '资源'
        } else {
          toast.error('获取帖子详情失败')
          loadError.value = true
        }
      })
      .catch((error) => {
        toast.error(error.msg)
        loadError.value = true
      })
  } else {
    if (route.name === 'publish') {
      createType.value = '文章'
    } else if (route.name === 'publishResource') {
      createType.value = '资源'
    } else {
      createType.value = '未知类型'
      toast.error('路由错误')
      loadError.value = true
    }
  }
})
</script>

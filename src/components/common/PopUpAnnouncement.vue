<template>
  <ScModal v-model="show">
    <Card class="w-2xl h-[36rem] flex flex-col">
      <div class="text-2xl">{{ postData?.title }}</div>
      <div class="flex-1 overflow-auto">
        <div v-html="postData?.content" class="tiptap w-full h-full p-4"></div>
      </div>
      <div class="flex gap-4">
        <ScButton class="flex-1" @click="toAnnouncement" Border>
          查看详情
        </ScButton>
        <ScButton
          class="flex-1 text-success"
          @click="offAnnouncement(postData?.id)"
          Border>
          已阅
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { postApi } from '@/apis'
import ScModal from './ScModal.vue'
import { onMounted, ref } from 'vue'
import type { Post } from '@/types/Post'
import ScButton from './ScButton.vue'
import { useRouter } from 'vue-router'
import Card from './Card.vue'
import { useAnnouncementStore } from '@/stores/announcementStore'

const announcementStore = useAnnouncementStore()
const router = useRouter()
const show = ref(false)

const postData = ref<Post | null>(null)

const toAnnouncement = () => {
  show.value = false
  router.push({
    name: 'postDetails',
    params: {
      postId: postData.value?.id,
    },
  })
}

const getAnnouncement = (postList: Post[]): Post | null => {
  const popUpIds = new Set(announcementStore.popUps)
  const diffPost = postList.find((post) => !popUpIds.has(post.id))
  return diffPost ?? null
}

const offAnnouncement = (id?: number) => {
  if (id) {
    announcementStore.popUps.push(id)
    announcementStore.popUps = Array.from(new Set(announcementStore.popUps)) // 去重
  }
  show.value = false
}

onMounted(() => {
  postApi
    .getPostList({
      top: 3,
    })
    .then((res) => {
      postData.value = getAnnouncement(res.data.data.list)
      if (postData.value) {
        show.value = true
      }
    })
})
</script>

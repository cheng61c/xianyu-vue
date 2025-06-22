<template>
  <Card v-if="!userStore.isLogin" class="stats max-w-5xl min-w-4xl w-full">
    <div class="text-center text-gray-content">
      您还未登录，请先登录后再进行操作。
    </div>
  </Card>

  <Card
    v-else
    v-for="(file, index) in files"
    :key="index"
    class="stats max-w-5xl min-w-4xl w-full">
    <div class="flex justify-between items-center">
      <!-- 标题 -->
      <div class="flex items-center gap-2 flex-[2] max-w-md">
        <span class="w-full break-words pr-4">{{ file.filename }}</span>
      </div>
      <div class="flex-1">发布时间: {{ file.createdAt }}</div>
      <div class="flex-1">文件大小: {{ file.size }}</div>

      <div class="flex gap-2 items-center flex-wrap">
        <!-- <ScButton
          class="text-sm text-error px-4 border border-gray hover:border-active"
          :icon="Trash2"
          :iconSize="16"
          @click="">
          删除
        </ScButton> -->
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { uploadApi } from '@/apis'
import { formatFileSize, formatTime } from '@/hook/format'
// import { Trash2 } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import type { FileType } from '@/types/Upload'
import { onMounted, ref } from 'vue'
// import ScButton from '@/components/ScButton.vue'
const userStore = useUserStore()

const files = ref<FileType[]>([])

const getFiles = () => {
  if (!userStore.isLogin) {
    return
  }
  uploadApi.getFilesList().then((response) => {
    files.value = response.data.data.map((item: FileType) => {
      item.createdAt = formatTime(item.createdAt)
      item.size = formatFileSize(item.size)
      return item
    })
  })
}

onMounted(() => {
  getFiles()
})
</script>

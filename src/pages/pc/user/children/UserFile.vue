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
        <ScButton
          class="text-sm text-error px-4 border border-gray hover:border-active"
          :icon="Download"
          :iconSize="16"
          @click="downloadFile(file.url)">
          下载
        </ScButton>
      </div>
    </div>
  </Card>
  <Pagination
    v-if="userStore.isLogin"
    :current-page="pagenation.page"
    :total-items="pagenation.total"
    :page-size="pagenation.limit"
    @page-change="toPage"
    class="w-full max-w-5xl" />
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import { downloadApi, uploadApi } from '@/apis'
import { formatFileSize, formatTime } from '@/hook/format'
import { Download } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import type { FileType } from '@/types/Upload'
import { onMounted, ref } from 'vue'
import ScButton from '@/components/common/ScButton.vue'
import Pagination from '@/components/common/Pagination.vue'
const userStore = useUserStore()

const files = ref<FileType[]>([])
const pagenation = ref({
  page: 1,
  limit: 10,
  total: 0,
})

const toPage = (page: number) => {
  pagenation.value.page = page
  getFiles()
}

const getFiles = () => {
  if (!userStore.isLogin) {
    return
  }
  uploadApi
    .getFilesList({
      types: '1,2,3,4,5,7',
      page: pagenation.value.page,
      limit: pagenation.value.limit,
    })
    .then((response) => {
      files.value = response.data.data.list.map((item: FileType) => {
        item.createdAt = formatTime(item.createdAt)
        item.size = formatFileSize(item.size)
        return item
      })
      pagenation.value = {
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.total,
      }
    })
}

const downloadFile = (url: string) => {
  if (!url) return
  let fileName = url.split('/').pop()
  if (!fileName) return
  fileName = fileName.replace(/(\/upload\/)?(preview)(\?|\/)(filename=)?/, '')
  downloadApi.downloadFileByUrl(fileName)
}

onMounted(() => {
  getFiles()
})
</script>

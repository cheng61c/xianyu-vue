<template>
  <Card v-if="!userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="text-center text-gray-content">
      {{
        $t('d.nin-huan-wei-deng-lu-qing-xian-deng-lu-hou-zai-jin-hang-cao-zuo')
      }}
    </div>
  </Card>

  <Card
    v-else
    v-for="(file, index) in files"
    :key="index"
    class="stats max-w-6xl min-w-4xl w-full">
    <div class="flex justify-between items-center">
      <!-- 标题 -->
      <div class="flex items-center gap-2 flex-[2] max-w-md">
        <span class="w-full break-words pr-4">{{ file.filename }}</span>
      </div>
      <div class="flex-1">
        {{ $t('t.fa-bu-shi-jiaother') }} <span>{{ file.createdAt }}</span>
      </div>
      <div class="flex-1">
        {{ $t('other.wen-jian-da-xiao') }} <span>{{ file.size }}</span>
      </div>

      <div class="flex gap-2 items-center flex-wrap">
        <ScButton
          class="text-sm text-error px-4 border border-gray hover:border-active"
          :icon="Download"
          :iconSize="16"
          @click="downloadFile(file.url)">
          {{ $t('b.xia-zai') }}
        </ScButton>
      </div>
    </div>
  </Card>
  <Pagination
    v-if="userStore.isLogin && pagenation.total > 0"
    :current-page="pagenation.page"
    :total-items="pagenation.total"
    :page-size="pagenation.limit"
    @page-change="toPage"
    class="w-full max-w-5xl" />

  <EmptyState
    v-if="files.length === 0 && userStore.isLogin"
    :title="$t('t.zan-wu-wen-jian')"
    description="这里毛都没有哦~"
    iconSize="64"
    iconColor="#ccc"
    :icon="Package"
    class="mt-8" />
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import { downloadApi, uploadApi } from '@/apis'
import { formatFileSize, formatTime } from '@/utils/format'
import { Download, Package } from 'lucide-vue-next'
import { useUserStore } from '@/stores/module/user/userStore'
import type { FileType } from '@/types/Upload'
import { onMounted, ref } from 'vue'
import ScButton from '@/components/common/ScButton.vue'
import Pagination from '@/components/common/Pagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
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

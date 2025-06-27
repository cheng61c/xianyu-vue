<template>
  <Card v-if="versios && versios.length > 0">
    <h3 class="text-lg font-bold mb-2">发布版</h3>

    <div>
      <div
        class="flex gap-x-2"
        v-for="(item, vIndex) in versios"
        :key="item.id">
        <div class="flex flex-col items-center w-4">
          <div
            class="h-1/3 w-1 flex-1"
            :class="{
              'bg-gray': vIndex != 0,
            }"></div>
          <div
            class="bg-secondary h-4 w-4 rounded-full tooltip tooltip-left z-2"
            :data-tip="item.createdAt"></div>
          <div
            class="h-1/3 w-1 flex-1"
            :class="{
              'bg-gray': vIndex != versios.length - 1,
            }"></div>
        </div>

        <!-- 内容 -->
        <div
          @click="handleModalChange(item)"
          class="flex gap-1 items-center py-2 col-start-2 row-start-1 row-span-3">
          <ScTag v-if="vIndex == 0" size="sm" :bgColor="'#41B883'">
            最新
          </ScTag>
          <ScTag size="sm">
            {{ item.version }}
          </ScTag>
          {{ item.title }}
        </div>
      </div>
    </div>
  </Card>

  <ScModal v-model="showModal">
    <Card class="gap-4 w-4xl h-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          {{ currenPostVersion?.version }} {{ currenPostVersion?.title }}
        </h3>
        <ScButton
          class="text-sm"
          @click="showModal = false"
          :icon="Minimize2"
          iconSize="22"
          noBg
          noPd>
        </ScButton>
      </div>
      <div v-if="currenPostVersion">
        <!-- 文章主体 -->
        <div class="tiptap" v-html="currenPostVersion.content"></div>
        <!-- 文件列表 -->
        <Card class="mt-6">
          <div class="text-lg font-bold">文件下载</div>
          <!-- 表头 -->
          <div
            class="flex font-semibold py-2 px-4 border-b border-gray-content">
            <div class="flex-[1.2]">文件名</div>
            <div class="flex-1">文件大小</div>
            <div class="flex-1">发布时间</div>
            <div class="flex-1"></div>
          </div>

          <!-- 表格行 -->
          <div
            class="w-full py-2 px-4 border-b border-gray-content"
            v-for="(file, index) in currenPostVersion.files"
            :key="index">
            <div class="flex items-center mb-2">
              <div class="flex-[1.2]">{{ file.filename }}</div>
              <div class="flex-1">{{ formatFileSize(file.size) }}</div>
              <div class="flex-1">{{ file.createdAt }}</div>
              <div class="flex-1 flex gap-2 justify-end flex-wrap">
                <ScButton
                  class="text-sm text-error px-4 border hover:border-active"
                  :icon="Download"
                  :iconSize="16"
                  @click="downloadFile(file.url, currenPostVersion.id)">
                  下载
                </ScButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div v-else>
        <EmptyState />
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps, ref, watch } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/common/Card.vue'
import ScTag from '@/components/common/ScTag.vue'
import ScModal from '@/components/common/ScModal.vue'
import type { DocumentVersion } from '@/types/DocumentVersion'
import EmptyState from '@/components/common/EmptyState.vue'
import ScButton from '@/components/common/ScButton.vue'
import { Download, Minimize2 } from 'lucide-vue-next'
import { formatFileSize, formatTime } from '@/hook/format'
import { downloadApi } from '@/apis'

const props = defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})

const showModal = ref(false)
const currenPostVersion = ref<DocumentVersion | null>(null)
const versios = ref<DocumentVersion[]>([])

const handleModalChange = (item: DocumentVersion) => {
  currenPostVersion.value = item
  showModal.value = !showModal.value
}

const downloadFile = (url: string, vid: number) => {
  if (!url) return
  let fileName = url.split('/').pop()
  if (!fileName) return
  fileName = fileName.replace(/(preview|download)\?filename=/, '')
  downloadApi.downloadFile(fileName, vid)
}

watch(
  () => props.postData,
  (newVal) => {
    if (newVal) {
      versios.value = newVal.postVersions.map((version) => ({
        ...version,
        createdAt: formatTime(version.createdAt),
        files: version.files.map((file) => ({
          ...file,
          createdAt: formatTime(file.createdAt),
        })),
      }))
    }
  },
  { immediate: true }
)
</script>

<template>
  <Card v-if="versios && versios.length > 0" class="mb-4" :id="id">
    <h3 class="text-lg font-bold mb-2">{{ $t('d.zi-yuan-xia-zai') }}</h3>

    <div class="w-full">
      <div
        class="flex gap-x-2 w-full hover:bg-active/15 px-4 rounded-md cursor-pointer"
        v-for="(item, vIndex) in versios"
        :key="item.id"
        @click="handleModalChange(item)">
        <div class="flex flex-col items-center w-4">
          <div
            class="h-1/3 w-1 flex-1"
            :class="{
              'bg-active/30': vIndex != 0,
            }"></div>
          <div
            class="bg-active h-4 w-4 rounded-full tooltip tooltip-left z-2"
            :data-tip="item.createdAt"></div>
          <div
            class="h-1/3 w-1 flex-1"
            :class="{
              'bg-active/30': vIndex != versios.length - 1,
            }"></div>
        </div>

        <!-- 内容 -->
        <div
          class="flex gap-1 items-center py-2 col-start-2 row-start-1 row-span-3">
          <ScTag v-if="vIndex == 0" size="sm" status="success">
            {{ $t('b.zui-xin') }}
          </ScTag>
          <ScTag size="sm" status="info">
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
          {{ currenPostVersion?.title }}
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
          <div class="text-lg font-bold">{{ $t('d.wen-jian-xia-zai') }}</div>
          <!-- 表头 -->
          <div
            class="flex font-semibold py-2 px-4 border-b border-gray-content">
            <div class="flex-[2]">{{ $t('d.wen-jian-ming') }}</div>
            <div class="flex-1">{{ $t('d.wen-jian-da-xiao') }}</div>
            <div class="flex-1">{{ $t('b.fa-bu-shi-jian') }}</div>
            <div class="flex-1"></div>
          </div>

          <!-- 表格行 -->
          <div
            class="w-full py-2 px-4 border-b border-gray-content"
            v-for="(file, index) in currenPostVersion.files"
            :key="index">
            <div class="flex items-center mb-2">
              <div class="flex-[2] break-words whitespace-pre-line">
                {{ file.filename }}
              </div>
              <div class="flex-1">{{ formatFileSize(file.size) }}</div>
              <div class="flex-1">{{ file.createdAt }}</div>
              <div class="flex-1 flex gap-2 justify-end flex-wrap">
                <ScButton
                  class="text-sm text-error px-4 border hover:border-active"
                  :icon="Download"
                  :iconSize="16"
                  @click="downloadFile(file.url, currenPostVersion.id)">
                  {{ $t('b.xia-zai') }}
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
import { formatFileSize, formatTimeOrAgo } from '@/utils/format'
import { downloadApi } from '@/apis'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
  id: {
    type: String,
    required: false,
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
        createdAt: formatTimeOrAgo(version.createdAt, t),
        files: version.files.map((file) => ({
          ...file,
          createdAt: formatTimeOrAgo(file.createdAt, t),
        })),
      }))
    }
  },
  { immediate: true }
)
</script>

<template>
  <Card v-if="versios && versios.length > 0">
    <h3 class="text-lg font-bold mb-2">{{ $t('d.zi-yuan-xia-zai') }}</h3>

    <div>
      <div
        class="flex gap-x-2"
        v-for="(item, vIndex) in versios"
        :key="item.id">
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
          @click="handleModalChange(item)"
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
    <Card class="w-[95vw] max-h-[95dvh] overflow-y-auto">
      <div class="flex justify-end sticky top-2 h-0">
        <ScButton
          class="text-sm text-right"
          @click="showModal = false"
          :icon="Minimize2"
          iconSize="22"
          noBg
          noPd>
        </ScButton>
      </div>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          {{ currenPostVersion?.title }}
        </h3>
      </div>

      <div v-if="currenPostVersion">
        <!-- 文章主体 -->
        <div class="tiptap mb-4" v-html="currenPostVersion.content"></div>
        <!-- 文件列表 -->
        <div class="text-lg font-bold pt-2 border-t border-gray">
          {{ $t('d.wen-jian-xia-zai') }}
        </div>

        <!-- 表格行 -->
        <div
          class="w-full py-2 px-4 border-b border-gray"
          v-for="(file, index) in currenPostVersion.files"
          :key="index">
          <div class="flex items-center my-1 w-full">
            <div class="flex-[2]">
              <div class="break-words whitespace-pre-wrap text-wrap">
                {{ file.filename }}
              </div>
              <div class="text-xs space-x-1">
                <span>{{ formatFileSize(file.size) }}</span>
                <span>/</span>
                <span>{{ file.createdAt }}</span>
              </div>
            </div>

            <div class="w-10 justify-end flex-wrap">
              <ScButton
                class="text-sm text-error px-4 border hover:border-active"
                :icon="Download"
                :iconSize="16"
                @click="downloadFile(file.url, currenPostVersion.id)">
              </ScButton>
            </div>
          </div>
        </div>
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
import { formatFileSize, formatTime } from '@/utils/format'
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

<template>
  <div ref="uploadCardRef">
    <Card class="p-6">
      <div class="text-gray-500 mx-auto flex items-center justify-center gap-2">
        {{ $t('b.tuo-dong') }}
        <ScTag size="sm" status="info">{{ fileTypeLabel }}</ScTag>
        {{ $t('b.dao-xu-xian-kuang-huo-dian-ji-shang-chuan') }}
      </div>

      <div
        class="border-2 border-dashed border-gray rounded-xltext-center cursor-pointer hover:border-blue-400 transition"
        :class="{
          'p-10': deviceStore.device == 2,
          'p-2': deviceStore.device == 1,
        }"
        @dragover.prevent
        @drop.prevent="handleDrop"
        @click="triggerFileInput">
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileChange" />
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="relative px-6 h-28 rounded-lg border border-gray overflow-hidden shadow-sm flex items-center justify-center cursor-pointer"
            @click.stop>
            <ScButton
              :icon="iconMap[props.typeid as keyof typeof iconMap]"
              :iconSize="36"
              noBg
              noPd />
            <div class="text-center px-2">{{ file.name }}</div>
            <button
              @click.stop="removeFile(index)"
              class="absolute top-1 right-1 w-8 h-8 bg-white/70 hover:bg-white text-red-500 rounded-full p-1 shadow cursor-pointe"
              :title="$t('b.shan-chu')">
              <X />
            </button>
          </div>
          <div
            class="relative h-28 rounded-lg border border-gray overflow-hidden shadow-sm flex items-center justify-center cursor-pointer">
            <Plus :size="36" />
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount, computed } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import Card from './Card.vue'
import ScButton from './ScButton.vue'
import ScTag from './ScTag.vue'
import { uploadApi } from '@/apis'
import { iconMap, useTypeLabelMap } from '@/utils/fileType'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/global/deviceStore'
const { t } = useI18n()
const typeLabelMap = useTypeLabelMap()

const props = defineProps({
  typeid: {
    type: Number,
    default: 0,
  },
  loadFiles: {
    type: Array as () => { name: string; id: number; size: number }[],
    default: () => [],
  },
})
const emit = defineEmits<{
  (e: 'uploaded', ids: number[]): void
}>()

const deviceStore = useDeviceStore()

const uploadedFiles = ref<{ name: string; id: number; size: number }[]>([])

const fileInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const uploading = ref(false)
const files = ref<{ file: File }[]>([])
const toast = useToast()

const fileTypeLabel = computed(
  () =>
    typeLabelMap[props.typeid as keyof typeof typeLabelMap] || t('nav.wen-jian')
)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFiles = (selectedFiles: File[]) => {
  for (const file of selectedFiles) {
    toast.info(
      t('t.zheng-zai-shang-chuan-filetypelabelvalue', [fileTypeLabel.value])
    )
    uploading.value = true
    uploadApi
      .uploadFile(file, props.typeid)
      .then((res) => {
        if (res.data.code === 200) {
          files.value.push({ file })
          toast.success(
            t('t.filetypelabelvalue-shang-chuan-cheng-gong', [
              fileTypeLabel.value,
            ])
          )
        }
        uploading.value = false
        console.log(res.data.data)

        uploadedFiles.value.push({
          name: file.name,
          id: res.data.data.id,
          size: file.size,
        })
        uploaded()
      })
      .catch((error) => {
        toast.error(
          t(
            't.filetypelabelvalue-shang-chuan-shi-bai-qing-shang-chuan-dui-ying-ge-shi-de-wen-jian',
            [fileTypeLabel.value]
          ) + error.msg
        )
        uploading.value = false
      })
  }
  // 去重
  files.value = files.value.filter(
    (fileObj, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.file.name === fileObj.file.name && t.file.size === fileObj.file.size
      )
  )
}

const uploaded = () => {
  // 去重uploadedFiles
  // 去重
  const ids = uploadedFiles.value.filter(
    (fileObj, index, self) =>
      index ===
      self.findIndex((t) => t.name === fileObj.name && t.size === fileObj.size)
  )
  console.log('去重后的文件ID:', ids)

  emit(
    'uploaded',
    ids.map((file) => file.id)
  )
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  uploadedFiles.value.splice(index, 1)
  fileInput.value!.value = ''
}

const closePopup = () => {
  isOpen.value = false
}

const uploadCardRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (
    uploadCardRef.value &&
    !uploadCardRef.value.contains(event.target as Node)
  ) {
    closePopup()
  }
}
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePopup()
  }
}

onBeforeUnmount(() => {
  fileInput.value = null
  files.value = []
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscKey)
})

onMounted(() => {
  uploadedFiles.value = props.loadFiles || []
  nextTick(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)
  })
})
</script>

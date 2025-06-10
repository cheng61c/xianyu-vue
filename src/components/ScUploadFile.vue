<template>
  <div ref="uploadCardRef">
    <Card class="p-6">
      <div class="text-gray-500 mx-auto flex items-center justify-center gap-2">
        拖动
        <ScTag size="sm">{{ fileTypeLabel }}</ScTag>
        到虚线框，或点击 + 上传
      </div>

      <div
        class="border-2 border-dashed border-gray rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 transition"
        @dragover.prevent
        @drop.prevent="handleDrop"
        @click="triggerFileInput">
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileChange" />
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="relative px-6 h-28 rounded-lg border border-gray overflow-hidden shadow-sm flex items-center justify-center cursor-pointer"
            @click.stop>
            <ScButton
              :icon="iconMap[props.typeid as keyof typeof iconMap]"
              :iconSize="36"
              noBg
              noPd />
            <div class="text-center px-2">{{ file.file.name }}</div>
            <button
              @click.stop="removeFile(index)"
              class="absolute top-1 right-1 w-8 h-8 bg-white/70 hover:bg-white text-red-500 rounded-full p-1 shadow cursor-pointe"
              title="删除">
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
import { iconMap, typeLabelMap } from '@/hook/fileType'

const props = defineProps({
  typeid: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits<{
  (e: 'uploaded', ids: number[]): void
}>()

const uploadedFiles = ref<{ file: File; name: string; id: number }[]>([])

const fileInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const uploading = ref(false)
const files = ref<{ file: File }[]>([])
const toast = useToast()

const fileTypeLabel = computed(
  () => typeLabelMap[props.typeid as keyof typeof typeLabelMap] || '文件'
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
    toast.info(`正在上传${fileTypeLabel.value}...`)
    uploading.value = true
    uploadApi
      .uploadFile(file, props.typeid)
      .then((res) => {
        if (res.data.code === 200) {
          files.value.push({ file })
          toast.success(`${fileTypeLabel.value}上传成功`)
        }
        uploading.value = false
        console.log(res.data.data)

        uploadedFiles.value.push({
          file,
          name: file.name,
          id: res.data.data.id,
        })
        uploaded()
      })
      .catch((error) => {
        toast.error(`${fileTypeLabel.value}上传失败: ` + error.msg)
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
      self.findIndex(
        (t) =>
          t.file.name === fileObj.file.name && t.file.size === fileObj.file.size
      )
  )
  console.log('去重后的文件ID:', ids)

  emit(
    'uploaded',
    ids.map((file) => file.id)
  )
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
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
  nextTick(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)
  })
})
</script>

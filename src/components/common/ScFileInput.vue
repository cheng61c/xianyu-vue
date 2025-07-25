<template>
  <div class="file-input-container">
    <!-- 隐藏的原生文件输入 -->
    <input
      type="file"
      :id="inputId"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange"
      ref="fileInput" />

    <!-- 自定义外观 -->
    <label
      :for="inputId"
      class="custom-file-label"
      :class="{
        'border-blue-500': isDragging,
        'border-red-500': error,
        'cursor-not-allowed': disabled,
      }"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop">
      <div
        class="flex flex-col items-center justify-center gap-2 p-4 text-center">
        <slot name="icon">
          <UploadIcon class="w-8 h-8 text-gray-400" />
        </slot>

        <p class="text-sm text-gray-600">
          <span v-if="!selectedFiles.length">{{ placeholderText }}</span>
          <span v-else class="font-medium">
            {{
              $t('d.selectedfileslength-ge-wen-jian-yi-xuan-ze', [
                selectedFiles.length,
              ])
            }}
          </span>
        </p>

        <p class="text-xs text-gray-500">
          {{ helperTextComputed }}
        </p>
      </div>
    </label>

    <!-- 文件预览 (可选) -->
    <div
      v-if="showPreview && selectedFiles.length"
      class="mt-3 grid grid-cols-3 gap-2">
      <div
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="relative group">
        <!-- <div
          v-if="file.type.startsWith('image/')"
          class="overflow-hidden rounded-md">
          <img
            :src="getObjectURL(file)"
            :alt="file.name"
            class="w-full h-20 object-cover" />
        </div> -->
        <!-- <div
          v-else
          class="flex items-center justify-center h-20 bg-gray-100 rounded-md"></div> -->
        <button
          type="button"
          @click="removeFile(index)"
          class="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></button>
        <p class="mt-1 text-xs text-gray-600 truncate">{{ file.name }}</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import { UploadIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

interface Props {
  modelValue?: File | File[] | null
  accept?: string
  multiple?: boolean
  placeholder?: string
  helperText?: string
  error?: string
  disabled?: boolean
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*',
  multiple: false,
  placeholder: '',
  helperText: '',
  showPreview: true,
  disabled: false,
})

const placeholderText = computed(() =>
  props.placeholder
    ? props.placeholder
    : t('d.tuo-fang-wen-jian-dao-zhe-li-huo-dian-ji-xuan-ze')
)
const helperTextComputed = computed(() =>
  props.helperText ? props.helperText : t('d.zhi-chi-jpg-png-pdf-deng-ge-shi')
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | File[] | null): void
}>()

const inputId = `file-input-${Math.random().toString(36).substring(2, 9)}`
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const selectedFiles = ref<File[]>([])

// 生成随机ID用于label关联
const getObjectURL = (file: File) => {
  return URL.createObjectURL(file)
}

// 清理对象URL
onUnmounted(() => {
  selectedFiles.value.forEach((file) => {
    URL.revokeObjectURL(getObjectURL(file))
  })
})

// 处理文件选择变化
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    processFiles(Array.from(target.files))
  }
}

// 处理拖放
const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (props.disabled) return

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

// 处理选择的文件
const processFiles = (files: File[]) => {
  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...files]
    emit('update:modelValue', selectedFiles.value)
  } else {
    selectedFiles.value = [files[0]]
    emit('update:modelValue', files[0])
  }
}

// 移除文件
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  if (fileInput.value) {
    fileInput.value.value = ''
  }

  if (props.multiple) {
    emit(
      'update:modelValue',
      selectedFiles.value.length ? [...selectedFiles.value] : null
    )
  } else {
    emit('update:modelValue', null)
  }
}

// 清空选择
const clearFiles = () => {
  selectedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', null)
}

// 暴露方法给父组件
defineExpose({
  clearFiles,
})
</script>

<template>
  <ScButton
    :shadow="false"
    size="small"
    @click.stop="togglePopup()"
    :activation="isOpen"
    hoverable
    class="relative">
    <ImageIcon />
  </ScButton>
  <div
    v-if="isOpen"
    class="absolute z-50 w-xl top-[110%] translate-x-[-50%]"
    ref="ImageUploadCard">
    <Card class="p-6">
      <!-- 蚂蚁线框 -->
      <div class="text-gray-500 mx-auto">拖动图片到虚线框，或点击 + 上传</div>
      <div class="text-gray-500 mb-2 mx-auto">
        将此处的图片拖拽至页面中添加图片
      </div>
      <div
        class="border-2 border-dashed border-gray rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 transition"
        @dragover.prevent
        @drop.prevent="handleDrop"
        @click="triggerFileInput">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileChange" />
        <!-- 图片预览列表 -->
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(img, index) in images"
            :key="index"
            class="relative w-28 h-28 rounded-lg border border-gray overflow-hidden shadow-sm flex items-center justify-center cursor-pointer"
            @click.stop>
            <ScImage
              :src="img.preview"
              alt="预览图"
              class="w-28 h-28 object-cover" />
            <!-- 删除按钮 -->
            <button
              @click.stop="removeImage(index)"
              class="absolute top-1 right-1 w-8 h-8 bg-white/70 hover:bg-white text-red-500 rounded-full p-1 shadow"
              title="删除图片">
              <X />
            </button>
          </div>
          <div
            class="relative w-28 h-28 rounded-lg border border-gray overflow-hidden shadow-sm flex items-center justify-center cursor-pointer">
            <Plus :size="36" />
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Card from '../Card.vue'
import { Plus, X, ImageIcon } from 'lucide-vue-next'
import ScButton from '../ScButton.vue'
import { uploadApi } from '@/apis'
import { formatLink } from '@/hook/format'
import { useToast } from 'vue-toastification'
import ScImage from '../ScImage.vue'
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const uploading = ref(false)

// 保存所有图片对象（包含文件本体和预览链接）
const images = ref<{ file: File; preview: string }[]>([])

// 触发文件选择器
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理选择图片
const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 处理拖拽图片
const handleDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 添加图片到列表
const handleFiles = (files: File[]) => {
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      toast.info('正在上传图片，请稍等...')
      uploading.value = true
      uploadApi.uploadFile(file, 6).then((res) => {
        if (res.data.code === 200) {
          images.value.push({
            file,
            preview: formatLink(res.data.data.url),
          })
        }
        uploading.value = false
        toast.success('图片上传成功')
      })

      images.value = images.value.filter(
        (img, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.file.name === img.file.name && t.file.size === img.file.size
          )
      ) // 去重
    }
  }
}

// 移除图片
const removeImage = (index: number) => {
  URL.revokeObjectURL(images.value[index].preview) // 释放 URL
  images.value.splice(index, 1)
  fileInput.value!.value = ''
}

const togglePopup = () => {
  isOpen.value = !isOpen.value
}

const closePopup = () => {
  isOpen.value = false
}

const ImageUploadCard = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (
    ImageUploadCard.value &&
    !ImageUploadCard.value.contains(event.target as Node)
  ) {
    closePopup()
  }
}
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePopup()
  }
}

// 监听组件销毁事件，释放预览链接
onBeforeUnmount(() => {
  images.value.forEach((img) => {
    URL.revokeObjectURL(img.preview)
  })

  fileInput.value = null
  images.value = []
  document.removeEventListener('click', handleClickOutside)
})

onMounted(() => {
  nextTick(() => {
    document.addEventListener('click', handleClickOutside)
    // 监听键盘esc键，关闭弹窗

    document.addEventListener('keydown', handleEscKey)
  })
})
</script>

<template>
  <div class="comment-input">
    <textarea
      v-model="commentContent"
      placeholder="写下你的评论..."
      class="w-full p-3 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-active focus:border-transparent"></textarea>

    <div class="flex justify-between items-center">
      <!-- 上传图片按钮 -->
      <div>
        <ScButton
          :icon="ImagePlus"
          :icon-size="18"
          Border
          @click="triggerFileInput" />
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileChange" />
      </div>

      <!-- 提交按钮 -->
      <ScButton @click="submitComment" activation class="hover:bg-active/60">
        提交评论
      </ScButton>
    </div>

    <!-- 图片展示区 -->
    <div class="flex flex-wrap gap-3">
      <template v-for="(img, index) in imageList" :key="index">
        <div
          class="relative w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
          <img
            v-if="!img.loading"
            :src="img.url"
            alt="uploaded"
            class="w-full h-full object-cover" />
          <div v-else class="skeleton w-full h-full bg-gray-200"></div>

          <button
            class="absolute top-0 right-0 text-active-content bg-gray/60 rounded-bl px-1 hover:bg-error/80 hover:cursor-pointer"
            @click="removeImage(index)">
            <X :size="16" />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { ImagePlus, X } from 'lucide-vue-next'
import { uploadApi } from '@/apis'
import { formatLink } from '@/hook/format'

const toast = useToast()

const props = defineProps({
  commentId: {
    type: Number,
    required: false,
  },
  toCommentId: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits(['submit'])

const commentContent = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// 图片列表，包括 loading 状态和 URL
const imageList = ref<{ url: string; loading: boolean }[]>([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  const fileArray = Array.from(files)
  for (const file of fileArray) {
    // 添加占位图（骨架屏）
    const placeholder = { url: '', loading: true }
    imageList.value.push(placeholder)
    const index = imageList.value.length - 1

    try {
      const res = await uploadApi.uploadFile(file, 6)
      const imageUrl = formatLink(res.data.data.url)
      imageList.value[index] = { url: imageUrl, loading: false }
    } catch (error) {
      toast.error(`图片上传失败: ${file.name}`)
      imageList.value.splice(index, 1)
    }
  }

  // 清空 input 的值，否则无法上传同一张图两次
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeImage = (index: number) => {
  imageList.value.splice(index, 1)
}

const submitComment = () => {
  if (commentContent.value.trim() === '') {
    toast.error('评论内容不能为空')
    return
  }

  const image = imageList.value
    .filter((img) => !img.loading)
    .map((img) => img.url)

  emit(
    'submit',
    commentContent.value,
    image,
    props.commentId,
    props.toCommentId
  )
  commentContent.value = ''
  imageList.value = []
}
</script>

<style scoped>
.comment-input img {
  display: block;
}
</style>

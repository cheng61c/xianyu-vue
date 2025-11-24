<template>
  <div class="w-full">
    <!-- 图片展示区 -->
    <div class="flex flex-wrap gap-3">
      <template v-for="(img, index) in imageList" :key="index">
        <div
          class="relative w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
          <img
            v-if="!img.loading"
            :src="img.viewUrl || img.url"
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
    <div
      class="comment-input flex items-end gap-2 w-full px-4 pb-4 pt-1 bg-background">
      <!-- 上传图片按钮 -->
      <div v-if="noImg === false">
        <ScButton
          :icon="ImagePlus"
          :icon-size="24"
          class="text-sm mb-3 text-gray-content hover:text-active/80"
          noPd
          :disabled="!userStore.isLogin"
          @click="triggerFileInput" />
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileChange" />
      </div>
      <div v-else class="w-2"></div>

      <!-- <textarea
      v-model="commentContent"
      :placeholder="placeholder"
      class="px-3 border flex-1 border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-active focus:border-transparent"></textarea> -->
      <ScInput
        v-model="commentContent"
        :placeholder="
          userStore.isLogin
            ? $t('t.qing-xie-xia-ni-de-ping-lun')
            : $t('t.qing-deng-lu-hou-ping-lun')
        "
        :maxlength="500"
        class="flex-1 h-full max-h-[10rem]"
        :maxHeight="120"
        :rows="1"
        disabled
        multiline />

      <!-- 提交按钮 -->
      <ScButton
        @click="submitComment"
        activation
        :disabled="!userStore.isLogin"
        class="hover:bg-active/60 py-2 mb-1.5">
        {{ computedSubmitText }}
      </ScButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { ImagePlus, X } from 'lucide-vue-next'
import { uploadApi } from '@/apis'
import { formatLink } from '@/utils/format'
import ScInput from '@/components/common/ScInput.vue'
import { useUserStore } from '@/stores/module/user/userStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()
const userStore = useUserStore()
const loading = ref(false)

const props = defineProps({
  commentId: {
    type: Number,
    required: false,
  },
  toCommentId: {
    type: Number,
    required: false,
  },
  submitText: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  noImg: {
    type: Boolean,
    default: false,
  },
})

const computedSubmitText = computed(() => {
  if (props.submitText == '') {
    return t('b.fa-song')
  }
  return props.submitText
})

const emit = defineEmits(['submit'])

const commentContent = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// 图片列表，包括 loading 状态和 URL
const imageList = ref<{ url: string; viewUrl: string; loading: boolean }[]>([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return
  toast.info(t('d.zheng-zai-shang-chuan-tu-pian'))
  loading.value = true
  const fileArray = Array.from(files)
  // 存储所有上传操作的Promise
  const uploadPromises: Promise<void>[] = []

  for (const file of fileArray) {
    // 添加占位图（骨架屏）
    const placeholder = { url: '', viewUrl: '', loading: true }
    imageList.value.push(placeholder)
    const index = imageList.value.length - 1

    // 创建每个文件的上传Promise并加入数组
    const uploadPromise = (async () => {
      try {
        const res = await uploadApi.uploadFileChunked(file, 6)
        const imageUrl = formatLink(res.data.data.url)
        imageList.value[index] = {
          url: imageUrl,
          viewUrl: res.data.data.viewUrl,
          loading: false,
        }
      } catch (error) {
        toast.error(t('t.tu-pian-shang-chuan-shi-bai-filename', [file.name]))
        imageList.value.splice(index, 1)
      }
    })()

    uploadPromises.push(uploadPromise)
  }

  // 等待所有文件上传完成（无论成功失败）
  await Promise.allSettled(uploadPromises)
  // 所有操作结束后关闭loading
  loading.value = false
  // 清空input值，允许重复上传同一张图
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeImage = (index: number) => {
  imageList.value.splice(index, 1)
}

const clearContent = () => {
  commentContent.value = ''
  imageList.value = []
}

const submitComment = () => {
  if (commentContent.value.trim() === '') {
    toast.error(t('t.ping-lun-nei-rong-bu-neng-wei-kong'))
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
    props.toCommentId,
    clearContent
  )
}
</script>

<style scoped>
.comment-input img {
  display: block;
}
</style>

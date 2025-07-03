<template>
  <Card
    v-if="userStore.isLogin"
    class="stats max-w-6xl min-w-4xl w-full items-center"
    noCol>
    <Avatar
      :src="formatLink(userStore.userInfo.headImg) || ''"
      :alt="userStore.userInfo.nickname"
      :size="64"
      @click="updateHerdImg" />
    <div>
      <div>{{ userStore.userInfo.nickname }}</div>
      <div class="flex items-center flex-wrap gap-2">
        <ScRole :user="userInfo" isAll size="sm"></ScRole>
      </div>
      <div class="text-sm text-background-content">
        上次登录时间 {{ formatTime(userStore.userInfo.lastLoginTime) }}
      </div>
    </div>
  </Card>
  <ScModal v-model="updateHerdImgModal">
    <Card class="w-4xl">
      <div class="text-lg font-bold mb-4">更新头像</div>

      <div class="flex gap-4 justify-between">
        <!-- 裁剪器 -->
        <template v-if="imageUrl">
          <Cropper
            ref="cropperRef"
            class="cropper mb-4"
            :minWidth="240"
            :minHeight="240"
            :background="'#fff'"
            :src="imageUrl"
            autoZoom
            :stencil-props="{ aspectRatio: 1, width: 240, height: 240 }"
            @change="onCropChange" />
        </template>
        <template v-else>
          <div
            class="flex w-full items-center justify-center text-gray-content">
            请上传图片文件进行裁剪
          </div>
        </template>

        <div>
          <ScFileInput
            accept="image/*"
            @change="onFileChange"
            placeholder="选择图片文件"
            class="mb-4" />

          <div class="mb-4">
            <label class="block mb-2">
              背景填充色 (用于给透明背景填充颜色) :
            </label>
            <div class="flex gap-1">
              <input
                type="color"
                v-model="previewBgColor"
                class="w-10 h-10 cursor-pointer" />
              <ScButton @click="clearColor"> 清除 </ScButton>
            </div>
          </div>

          <!-- 裁剪预览图 -->
          <div v-if="croppedUrl" class="mb-4">
            <div class="mb-2">预览 (实际效果背景默认灰色):</div>
            <Avatar :src="croppedUrl" alt="预览" :size="128" />
          </div>
        </div>
      </div>

      <!-- 上传裁剪区域 -->

      <ScButton @click="updateHerdImg" Border :disabled="loading">
        <span>提交更改</span>
        <span class="ml-2" v-if="loading">正在上传图片</span>
        <template #endIcon v-if="loading">
          <span class="loading loading-spinner loading-sm"></span>
        </template>
      </ScButton>
      <ScButton @click="updateHerdImgModal = false" Border>关闭</ScButton>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { formatLink } from '@/hook/format'
import { formatTime } from '@/hook/format'
import { useUserStore } from '@/stores/userStore'
import { uploadApi, userApi } from '@/apis'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import Avatar from '@/components/common/Avatar.vue'
import ScRole from '@/components/common/ScRole.vue'
import ScFileInput from '@/components/common/ScFileInput.vue'
import ScButton from '@/components/common/ScButton.vue'
import ScModal from '@/components/common/ScModal.vue'
import Card from '@/components/common/Card.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userStore = useUserStore()
const userInfo = ref(userStore.userInfo)
const updateHerdImgModal = ref(false)
const loading = ref(false) // 上传状态
const previewBgColor = ref('#00000000')
const cropperRef = ref<any>(null)
const emit = defineEmits(['updateUserInfo'])

const clearColor = () => {
  previewBgColor.value = '#00000000'
}

// 图片裁剪相关
const imageUrl = ref<string | null>(null)
const croppedUrl = ref<string | null>(null)

// 提取预览逻辑到单独的函数
const updatePreview = (canvas: HTMLCanvasElement) => {
  const previewCanvas = document.createElement('canvas')
  previewCanvas.width = canvas.width
  previewCanvas.height = canvas.height
  const ctx = previewCanvas.getContext('2d')!

  // 填充背景色
  ctx.fillStyle = previewBgColor.value
  ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height)

  // 绘制裁剪图
  ctx.drawImage(canvas, 0, 0)

  // 更新预览
  previewCanvas.toBlob((blob) => {
    if (blob) {
      croppedUrl.value = URL.createObjectURL(blob)
    }
  }, 'image/png')
}

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imageUrl.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 每次裁剪变化时
const onCropChange = ({ canvas }: { canvas: HTMLCanvasElement }) => {
  if (!canvas) return

  // 1. 创建一个新的 Canvas，用于合成背景
  const previewCanvas = document.createElement('canvas')
  previewCanvas.width = canvas.width
  previewCanvas.height = canvas.height
  const ctx = previewCanvas.getContext('2d')!

  // 2. 先填充背景色
  ctx.fillStyle = previewBgColor.value
  ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height)

  // 3. 再绘制裁剪后的图片（保持透明部分）
  ctx.drawImage(canvas, 0, 0)

  // 4. 转换为 Blob 并更新预览
  previewCanvas.toBlob((blob) => {
    if (blob) {
      croppedUrl.value = URL.createObjectURL(blob)
    }
  }, 'image/png')
}

const updateHerdImg = async () => {
  if (!userStore.isLogin) {
    return
  }
  if (!updateHerdImgModal.value) {
    updateHerdImgModal.value = true
    return
  }
  if (!cropperRef.value) return

  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })

  if (blob) {
    const fileName = `avatar_${userInfo.value.account}_${Date.now()}.png`
    const file = new File([blob], fileName, {
      type: 'image/png',
    })
    console.log('上传文件:', file)
    loading.value = true // 开始上传时设置加载状态
    uploadApi
      .uploadFile(file, 6)
      .then((res) => {
        if (res.data.code === 200) {
          const avatarUrl = res.data.data.url
          userApi
            .updateUser({ headImg: avatarUrl })
            .then((response) => {
              if (response.data.code === 200) {
                toast.success('头像更新成功')
                userStore.userInfo.headImg = avatarUrl
                emit('updateUserInfo') // 刷新用户信息
                updateHerdImgModal.value = false // 关闭模态框
                loading.value = false
              }
            })
            .catch((error) => {
              console.error('Error updating avatar:', error)
              toast.error('头像更新失败: ' + error.msg)
              loading.value = false // 上传失败时重置加载状态
            })
        }
      })
      .catch((error) => {
        console.error('Error uploading avatar:', error)
        toast.error('头像上传失败: ' + error.msg)
        loading.value = false // 上传失败时重置加载状态
      })
  } else {
    toast.error('裁剪后的图片为空')
  }
}

watch(previewBgColor, () => {
  if (cropperRef.value) {
    const { canvas } = cropperRef.value.getResult()
    if (canvas) {
      updatePreview(canvas) // 调用更新预览的函数
    }
  }
})
</script>

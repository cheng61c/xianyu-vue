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
        <ScTag
          v-for="(tag, index) in userStore.userInfo.roles"
          :key="index"
          color="#fff"
          :bgColor="tag.color"
          size="sm">
          {{ tag.name }}
        </ScTag>
      </div>
      <div class="text-sm text-background-content">
        上次登录时间 {{ formatTime(userStore.userInfo.lastLoginTime) }}
      </div>
    </div>
  </Card>

  <Card v-if="userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="mb-4 text-xl font-bold">基础信息</div>
    <div class="flex gap-4 items-center">
      邮箱: {{ userInfo.email ?? 'null' }}
    </div>
    <div class="flex gap-4 items-center">
      账号: {{ userInfo.account ?? 'null' }}
    </div>
    <div class="flex gap-4 items-center">
      <span>昵称</span>
      <ScInput
        v-model="userInfo.nickname"
        class="w-1/3"
        type="text"
        placeholder="请输入昵称" />
    </div>

    <div class="flex gap-4 items-center">
      <ScButton @click="updateInfo" Border>提交更改</ScButton>
    </div>
  </Card>

  <Card
    v-if="userStore.isLogin"
    class="stats max-w-6xl min-w-4xl w-full overflow-x-hidden">
    <div class="mb-4 text-xl font-bold">主页编辑</div>

    <div class="flex gap-4">
      <ScCollapse>
        <template #header>
          <span class="text-active">点击编辑主页</span>
        </template>
        <TipTap v-model="userInfo.signature" />
      </ScCollapse>
    </div>

    <div class="flex gap-4 items-center">
      <ScButton @click="updateInfo" Border>提交更改</ScButton>
    </div>
  </Card>

  <Card v-if="userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="mb-4 text-xl font-bold">重置密码</div>
    <div class="flex gap-4 items-center">
      <span>新密码</span>
      <ScInput
        v-model="resetPassword.newPassword"
        class="w-1/3"
        type="password"
        placeholder="请输入新密码" />
    </div>

    <div class="flex gap-4 items-center">
      <span>确认密码</span>
      <ScInput
        v-model="resetPassword.confirmPassword"
        class="w-1/3"
        type="password"
        placeholder="请再次输入新密码" />
    </div>

    <div class="flex gap-4 items-center">
      <span>邮箱验证码</span>
      <ScInput
        v-model="resetPassword.captcha"
        class="w-1/3"
        placeholder="请输入验证码" />
      <ScButton
        :disabled="isSendCode"
        @click="getCaptcha(userStore.userInfo.email)"
        Border
        class="py-2">
        {{ sendCodeText }}
      </ScButton>
    </div>

    <div class="flex gap-4 items-center">
      <ScButton @click="updatePassword" Border class="py-2"> 提交 </ScButton>
    </div>
  </Card>

  <Card v-if="!userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="text-center text-gray-content">
      您还未登录，请先登录后再进行操作。
    </div>
  </Card>

  <ScModal v-model="updateHerdImgModal">
    <Card class="w-3xl">
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
            <label class="block text-sm mb-2">
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
            <div class="text-sm mb-2">预览 (预览背景默认灰色):</div>
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
import ScButton from '@/components/ScButton.vue'
import Avatar from '@/components/Avatar.vue'
import ScTag from '@/components/ScTag.vue'
import Card from '@/components/Card.vue'
import TipTap from '@/components/tiptap/TipTap.vue'
import ScCollapse from '@/components/ScCollapse.vue'
import ScFileInput from '@/components/ScFileInput.vue'

import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import { uploadApi, userApi } from '@/apis'
import type { UserType } from '@/types/user'

import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { formatLink, formatTime } from '@/hook/format'
import ScInput from '@/components/ScInput.vue'
import { useToast } from 'vue-toastification'
import ScModal from '@/components/ScModal.vue'

const toast = useToast()
const userStore = useUserStore()
const userInfo = ref<UserType>(userStore.userInfo)
const resetPassword = ref({
  newPassword: '',
  confirmPassword: '',
  captcha: '',
})
const isSendCode = ref(false)
const sendCodeText = ref('获取验证码')
const updateHerdImgModal = ref(false)
const previewBgColor = ref('#00000000')

// 图片裁剪相关
const imageUrl = ref<string | null>(null)
const croppedUrl = ref<string | null>(null)
const cropperRef = ref<any>(null)
const loading = ref(false) // 上传状态

const clearColor = () => {
  previewBgColor.value = '#00000000'
}

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

// 计时x秒
const countdown = (duration: number) => {
  let timer: ReturnType<typeof setInterval>
  let timeLeft = duration

  const updateText = () => {
    if (timeLeft > 0) {
      sendCodeText.value = `${timeLeft}秒后重发`
      timeLeft--
    } else {
      clearInterval(timer)
      sendCodeText.value = '获取验证码'
      isSendCode.value = false
    }
  }

  timer = setInterval(updateText, 1000)
}

const getCaptcha = (email: string) => {
  isSendCode.value = true
  countdown(30)
  userApi
    .sendCode({ email })
    .then((res) => {
      if (res.data.code === 200) {
        toast.success('验证码已发送到您的邮箱')
      } else {
        toast.error('获取验证码失败: ' + res.data.msg)
      }
    })
    .catch((error) => {
      // 处理获取验证码错误
      toast.error(error.msg)
    })
}

const getCurrentUserInfo = () => {
  userApi
    .getCurrentUser()
    .then((response) => {
      userStore.userInfo = response.data.data as UserType
      console.log(response.data.data)
    })
    .catch((error) => {
      console.error('Error fetching user data:', error)
    })
}

const updatePassword = () => {
  if (resetPassword.value.newPassword !== resetPassword.value.confirmPassword) {
    toast.error('两次输入的密码不一致')
    return
  }
  userApi
    .updatePassword({
      password: resetPassword.value.newPassword,
      email: userStore.userInfo.email,
      captcha: resetPassword.value.captcha,
    })
    .then((response) => {
      if (response.data.code === 200) {
        toast.success('密码更新成功')
        resetPassword.value.newPassword = ''
        resetPassword.value.confirmPassword = ''
        resetPassword.value.captcha = ''
        getCurrentUserInfo() // 刷新用户信息
      } else {
        toast.error('密码更新失败: ' + response.data.msg)
      }
    })
    .catch((error) => {
      console.error('Error updating password:', error)
      toast.error('密码更新失败: ' + error.msg)
    })
}

const updateInfo = () => {
  userApi
    .updateUser({
      nickname: userInfo.value.nickname,
      signature: userInfo.value.signature,
    })
    .then((response) => {
      if (response.data.code === 200) {
        toast.success('信息更新成功')
        userStore.userInfo.nickname = userInfo.value.nickname
        userStore.userInfo.signature = userInfo.value.signature
        getCurrentUserInfo() // 刷新用户信息
      } else {
        toast.error('信息更新失败: ' + response.data.msg)
      }
    })
    .catch((error) => {
      console.error('Error updating user info:', error)
      toast.error('信息更新失败: ' + error.msg)
    })
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
    const fileName = `avatar-${userInfo.value.account}-${Date.now()}.png`
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
                getCurrentUserInfo() // 刷新用户信息
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

onMounted(() => {
  getCurrentUserInfo()
})

watch(previewBgColor, () => {
  if (cropperRef.value) {
    const { canvas } = cropperRef.value.getResult()
    if (canvas) {
      updatePreview(canvas) // 调用更新预览的函数
    }
  }
})
</script>

<style scoped>
.cropper {
  width: 60%;
  height: 100%;
  max-height: 60vh;
}
</style>

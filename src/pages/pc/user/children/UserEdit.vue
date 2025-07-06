<template>
  <UserHeader @updateUserInfo="getCurrentUserInfo" />

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

    <div class="">
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
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'

import Card from '@/components/common/Card.vue'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import ScCollapse from '@/components/common/ScCollapse.vue'
import { userApi } from '@/apis'
import type { UserType } from '@/types/user'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user/userStore'

import ScInput from '@/components/common/ScInput.vue'
import { useToast } from 'vue-toastification'
import UserHeader from '@/components/pc/user/UserHeader.vue'
import { formatLink } from '@/hook/format'
import { formatImageSrcsInHtml } from '@/hook/regex'

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
    .then((res) => {
      const data = res.data.data as UserType
      data.headImg = formatLink(data.headImg)
      data.signature = formatImageSrcsInHtml(data.signature)
      userStore.userInfo = data
      console.log(res.data.data)
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

onMounted(() => {
  getCurrentUserInfo()
})
</script>

<style scoped>
.cropper {
  width: 60%;
  height: 100%;
  max-height: 60vh;
}
</style>

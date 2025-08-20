<template>
  <Card v-if="userStore.isLogin" class="w-full">
    <div class="mb-4 text-xl font-bold">{{ $t('f.zhong-zhi-mi-ma') }}</div>
    <div class="flex gap-4 iems-center">
      <span>{{ $t('f.xin-mi-ma') }}</span>
      <ScInput
        v-model="resetPassword.newPassword"
        type="password"
        :placeholder="$t('f.qing-shu-ru-xin-mi-ma')" />
    </div>

    <div class="flex gap-4 items-center">
      <span>{{ $t('f.que-ren-mi-ma') }}</span>
      <ScInput
        v-model="resetPassword.confirmPassword"
        type="password"
        :placeholder="$t('f.qing-zai-ci-shu-ru-xin-mi-ma')" />
    </div>

    <div class="flex gap-4 items-center">
      <span>{{ $t('f.you-xiang-yan-zheng-ma') }}</span>
      <ScInput
        v-model="resetPassword.captcha"
        :placeholder="$t('f.qing-shu-ru-yan-zheng-ma')" />
      <ScButton
        :disabled="isSendCode"
        @click="getCaptcha(userStore.userInfo.email)"
        Border
        class="py-2">
        {{ sendCodeText }}
      </ScButton>
    </div>

    <div class="flex gap-4 items-center">
      <ScButton @click="updatePassword" Border class="py-2">
        {{ $t('b.ti-jiao') }}
      </ScButton>
    </div>
  </Card>

  <Card v-if="!userStore.isLogin" class="w-full">
    <div class="text-center text-gray-content">
      {{
        $t('d.nin-huan-wei-deng-lu-qing-xian-deng-lu-hou-zai-jin-hang-cao-zuo')
      }}
    </div>
  </Card>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import Card from '@/components/common/Card.vue'
import { userApi } from '@/apis'
import type { UserType } from '@/types/user'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/module/user/userStore'
import ScInput from '@/components/common/ScInput.vue'
import { useToast } from 'vue-toastification'
import { formatLink } from '@/utils/format'
import { formatImageSrcsInHtml } from '@/utils/regex'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const toast = useToast()
const userStore = useUserStore()
const resetPassword = ref({
  newPassword: '',
  confirmPassword: '',
  captcha: '',
})
const isSendCode = ref(false)
const sendCodeText = ref(t('f.huo-qu-yan-zheng-ma'))
const signature = ref('')

// 计时x秒
const countdown = (duration: number) => {
  let timer: ReturnType<typeof setInterval>
  let timeLeft = duration

  const updateText = () => {
    if (timeLeft > 0) {
      sendCodeText.value = t('b.resend', { seconds: timeLeft })
      timeLeft--
    } else {
      clearInterval(timer)
      sendCodeText.value = t('f.huo-qu-yan-zheng-ma')
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
        toast.success(t('t.yan-zheng-ma-yi-fa-song-dao-nin-de-you-xiang'))
      } else {
        toast.error(t('t.huo-qu-yan-zheng-ma-shi-bai') + res.data.msg)
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
      signature.value = data.signature || ''
      userStore.userInfo = data
      console.log(res.data.data)
    })
    .catch((error) => {
      console.error('Error fetching user data:', error)
    })
}

const updatePassword = () => {
  if (resetPassword.value.newPassword !== resetPassword.value.confirmPassword) {
    toast.error(t('t.liang-ci-shu-ru-de-mi-ma-bu-yi-zhi'))
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
        toast.success(t('t.mi-ma-geng-xin-cheng-gong'))
        resetPassword.value.newPassword = ''
        resetPassword.value.confirmPassword = ''
        resetPassword.value.captcha = ''
        getCurrentUserInfo() // 刷新用户信息
      } else {
        toast.error(t('t.mi-ma-geng-xin-shi-bai') + response.data.msg)
      }
    })
    .catch((error) => {
      console.error('Error updating password:', error)
      toast.error(t('t.mi-ma-geng-xin-shi-bai') + error.msg)
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

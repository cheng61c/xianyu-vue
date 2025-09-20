<template>
  <UserHeader
    @updateUserInfo="getCurrentUserInfo"
    :isEdit="isCurrentUser"
    :userInfo="userInfo" />

  <Card v-if="userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="mb-4 text-xl font-bold">{{ $t('f.ji-chu-xin-xi') }}</div>
    <div class="flex gap-4 items-center">
      {{ $t('f.you-xiang') }} <span>{{ userInfo.email ?? 'null' }}</span>
    </div>
    <div class="flex gap-4 items-center">
      {{ $t('f.zhang-hao') }} <span>{{ userInfo.account ?? 'null' }}</span>
    </div>
    <div class="flex gap-4 items-center">
      <span>{{ $t('f.ni-cheng') }}</span>
      <ScInput
        v-model="nickname"
        class="w-1/3"
        type="text"
        :placeholder="$t('f.qing-shu-ru-ni-cheng')" />
    </div>

    <div class="">
      <ScCollapse>
        <template #header>
          <span class="text-active">{{ $t('f.dian-ji-bian-ji-zhu-ye') }}</span>
        </template>
        <TipTap v-model="userInfo.signature" />
      </ScCollapse>
    </div>

    <div class="flex gap-4 items-center">
      <ScButton @click="updateInfo" Border>{{
        $t('f.ti-jiao-geng-gai')
      }}</ScButton>
    </div>
  </Card>

  <Card v-if="userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="mb-4 text-xl font-bold">{{ $t('f.zhong-zhi-mi-ma') }}</div>
    <div class="flex gap-4 items-center">
      <span>{{ $t('f.xin-mi-ma') }}</span>
      <ScInput
        v-model="resetPassword.newPassword"
        class="w-1/3"
        type="password"
        :placeholder="$t('f.qing-shu-ru-xin-mi-ma')" />
    </div>

    <div class="flex gap-4 items-center">
      <span>{{ $t('f.que-ren-mi-ma') }}</span>
      <ScInput
        v-model="resetPassword.confirmPassword"
        class="w-1/3"
        type="password"
        :placeholder="$t('f.qing-zai-ci-shu-ru-xin-mi-ma')" />
    </div>

    <div class="flex gap-4 items-center">
      <span>{{ $t('f.you-xiang-yan-zheng-ma') }}</span>
      <ScInput
        v-model="resetPassword.captcha"
        class="w-1/3"
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
        {{ $t('f.ti-jiao-geng-gai') }}
      </ScButton>
    </div>
  </Card>

  <Card v-if="userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="mb-4 text-xl font-bold">{{ $t('d.zhang-hao-mi-yue') }}</div>
    <div>
      {{
        $t(
          'd.zhang-hao-mi-yue-shi-nin-zhang-hao-de-si-mi-xin-xi-yong-yu-yan-zheng-shen-fen-she-zhi-xin-de-mi-yue-hou-jiu-de-mi-yue-jiang-shi-xiao'
        )
      }}
    </div>
    <div>
      {{ $t('d.yan-zheng-ma-she-zhi-hou-wu-fa-huo-qu-qing-tuo-shan-bao-guan') }}
    </div>

    <div class="flex items-center">
      <div>{{ $t('d.zhang-hao-mi-yue') }}</div>
      <ScInput v-model="code" class="w-1/4" type="text" />
    </div>
    <div class="flex gap-4 items-center">
      <ScButton @click="updateUserVerifyCode(code)" Border>
        {{ $t('f.ti-jiao-geng-gai') }}
      </ScButton>
    </div>
  </Card>

  <Card v-if="userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
    <div class="mb-4 text-xl font-bold">{{ $t('b.qiang-zhi-xia-xian') }}</div>
    <div>
      {{
        $t(
          'd.rang-suo-you-deng-lu-de-she-bei-qiang-zhi-xia-xian-bao-kuo-dang-qian-she-bei'
        )
      }}
    </div>
    <div>{{ $t('d.xia-xian-hou-shi-yong-mi-ma-ke-zhong-xin-deng-lu') }}</div>
    <div class="flex gap-2 items-center">
      <ScButton @click="forceLogout" Border class="w-1/4">
        {{ $t('b.xia-xian') }}
      </ScButton>
    </div>
  </Card>

  <Card v-if="!userStore.isLogin" class="stats max-w-6xl min-w-4xl w-full">
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
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import ScCollapse from '@/components/common/ScCollapse.vue'
import { userApi } from '@/apis'
import type { UserType } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/module/user/userStore'
import { forceLogout, updateUserVerifyCode } from '@/stores/module/user/service'
import ScInput from '@/components/common/ScInput.vue'
import { useToast } from 'vue-toastification'
import UserHeader from '@/components/pc/user/UserHeader.vue'
import { formatLink } from '@/utils/format'
import { formatImageSrcsInHtml } from '@/utils/regex'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()

const toast = useToast()
const userStore = useUserStore()
const userInfo = ref<UserType>(userStore.userInfo)
const resetPassword = ref({
  newPassword: '',
  confirmPassword: '',
  captcha: '',
})
const isSendCode = ref(false)
const sendCodeText = ref(t('f.huo-qu-yan-zheng-ma'))
const route = useRoute()
const code = ref('')
const isCurrentUser = computed(() => {
  return !route.query.userId
})
const nickname = ref('')

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

const updateInfo = () => {
  userApi
    .updateUser({
      nickname: nickname.value,
      signature: userInfo.value.signature,
    })
    .then((response) => {
      if (response.data.code === 200) {
        toast.success(t('t.xin-xi-geng-xin-cheng-gong'))
        userStore.userInfo.nickname = userInfo.value.nickname
        userStore.userInfo.signature = userInfo.value.signature
        getCurrentUserInfo() // 刷新用户信息
      } else {
        toast.error(t('t.xin-xi-geng-xin-shi-bai') + response.data.msg)
      }
    })
    .catch((error) => {
      console.error('Error updating user info:', error)
      toast.error(t('t.xin-xi-geng-xin-shi-bai') + error.msg)
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

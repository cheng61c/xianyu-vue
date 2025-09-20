<template>
  <MobileUserHeader
    ref="mobileUserHeader"
    @updateUserInfo="getCurrentUserInfo"
    :userInfo="userInfo"
    isEdit />

  <Card v-if="userStore.isLogin" class="w-full">
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
        v-model="userInfo.nickname"
        type="text"
        :placeholder="$t('f.qing-shu-ru-ni-cheng')" />
    </div>

    <div class="space-y-2">
      <ScButton @click="onUpdateAvatar" Border class="w-full">
        {{ $t('b.xiu-gai-tou-xiang') }}
      </ScButton>

      <ScButton @click="onTipTap" Border class="w-full">
        {{ $t('b.bian-ji-zhu-ye') }}
        {{
          signature == userInfo.signature
            ? ''
            : $t('b.yi-xiu-gai-qing-dian-ji-ti-jiao-bao-cun-xiu-gai')
        }}
      </ScButton>
    </div>

    <div class="flex gap-4 items-center">
      <ScButton @click="updateInfo" Border>{{
        $t('f.ti-jiao-geng-gai')
      }}</ScButton>
    </div>
  </Card>

  <Card v-if="!userStore.isLogin" class="w-full">
    <div class="text-center text-gray-content">
      {{
        $t('d.nin-huan-wei-deng-lu-qing-xian-deng-lu-hou-zai-jin-hang-cao-zuo')
      }}
    </div>
  </Card>

  <ScDrawer v-model="isOpen" position="bottom">
    <div v-if="userInfo.signature !== null" class="bg-background rounded-t-lg">
      <TipTap
        v-model="userInfo.signature"
        :class="deviceStore.device == 1 ? 'mobileTipTap' : ''" />
    </div>
  </ScDrawer>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'

import Card from '@/components/common/Card.vue'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import { userApi } from '@/apis'
import type { UserType } from '@/types/user'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/module/user/userStore'

import ScInput from '@/components/common/ScInput.vue'
import { useToast } from 'vue-toastification'
import MobileUserHeader from '@/components/mobile/user/MobileUserHeader.vue'
import { formatLink } from '@/utils/format'
import { formatImageSrcsInHtml } from '@/utils/regex'
import { useI18n } from 'vue-i18n'
import { useDeviceStore } from '@/stores/global/deviceStore'
import ScDrawer from '@/components/common/ScDrawer.vue'
const { t } = useI18n()

const toast = useToast()
const userStore = useUserStore()
const userInfo = userStore.userInfo as UserType
const deviceStore = useDeviceStore()
const isOpen = ref(false)
const signature = ref('')
const mobileUserHeader = ref<InstanceType<typeof MobileUserHeader> | null>(null)

const onUpdateAvatar = () => {
  if (mobileUserHeader.value) {
    mobileUserHeader.value.triggerFileInput()
  }
}
const onTipTap = () => {
  signature.value = userInfo.signature || ''
  isOpen.value = true
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

const updateInfo = () => {
  userApi
    .updateUser({
      nickname: userInfo.nickname,
      signature: userInfo.signature,
    })
    .then((response) => {
      if (response.data.code === 200) {
        toast.success(t('t.xin-xi-geng-xin-cheng-gong'))
        userStore.userInfo.nickname = userInfo.nickname
        userStore.userInfo.signature = userInfo.signature
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

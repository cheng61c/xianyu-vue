<template>
  <Card v-if="userStore.isLogin" class="w-full items-center" noCol>
    <Avatar
      :src="formatLink(userStore.userInfo.headImg) || ''"
      :alt="userStore.userInfo.nickname"
      :size="64"
      @click="triggerFileInput" />
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onFileChange" />
    <div>
      <div class="text-lg font-bold">{{ userStore.userInfo.nickname }}</div>
      <div class="flex items-center flex-wrap gap-2">
        <ScTag size="sm" status="info"> uid {{ userInfo.id }} </ScTag>
        <ScRole :user="userInfo" isAll size="sm"></ScRole>
      </div>
      <div class="text-sm text-background-content">
        {{
          $t(
            'd.shang-ci-deng-lu-shi-jian-formattimeuserstoreuserinfolastlogintime',
            [formatTime(userStore.userInfo.lastLoginTime)]
          )
        }}
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatLink } from '@/utils/format'
import { formatTime } from '@/utils/format'
import { useUserStore } from '@/stores/module/user/userStore'
import { uploadApi, userApi } from '@/apis'
import Avatar from '@/components/common/Avatar.vue'
import ScRole from '@/components/common/ScRole.vue'
import ScTag from '@/components/common/ScTag.vue'

import Card from '@/components/common/Card.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const toast = useToast()
const userStore = useUserStore()
const userInfo = ref(userStore.userInfo)
const fileInputRef = ref<HTMLInputElement | null>(null)
const emit = defineEmits(['updateUserInfo'])

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const res = await uploadApi.uploadFile(file, 6)
    if (res.data.code === 200) {
      const avatarUrl = res.data.data.url
      const response = await userApi.updateUser({ headImg: avatarUrl })
      if (response.data.code === 200) {
        userStore.userInfo.headImg = avatarUrl
        toast.success(t('t.tou-xiang-geng-xin-cheng-gong'))
        emit('updateUserInfo')
      } else {
        toast.error(t('t.tou-xiang-geng-xin-shi-bai'))
      }
    } else {
      toast.error(t('t.tou-xiang-shang-chuan-shi-bai'))
    }
  } catch (error: any) {
    toast.error(t('t.tou-xiang-shang-chuan-shi-bai') + (error?.msg || ''))
  }
}
</script>

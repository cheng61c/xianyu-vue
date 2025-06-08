<template>
  <ScButton
    :shadow="false"
    size="small"
    @click.stop="togglePopup()"
    hoverable
    class="relative flex items-center gap-2">
    <template #icon>
      <Avatar
        :src="userStore.userInfo.headImg"
        :alt="userStore.userInfo.nickname" />
    </template>
    <span> {{ userStore.userInfo.nickname }}</span>
    <template #endIcon>
      <ChevronUp class="transition-all" :class="{ 'rotate-180': !isOpen }" />
    </template>
  </ScButton>
  <div v-if="isOpen" class="absolute z-50" ref="userCard">
    <Card noPg class="overflow-hidden">
      <div
        class="cursor-pointer px-4 py-2 hover:bg-active hover:text-active-content"
        @click="($router.push('/user/panel'), closePopup())">
        用户主页
      </div>
      <div
        v-if="verifyPermissions([1, 2, 3, 4, 5, 6, 7])"
        class="cursor-pointer px-4 py-2 hover:bg-active hover:text-active-content"
        @click="($router.push('/admin/panel'), closePopup())">
        后台管理
      </div>
      <div class="border border-gray/60"></div>
      <div
        class="cursor-pointer text-error px-4 py-2 hover:bg-error hover:text-active-content"
        @click="logout">
        登出
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Card from '../Card.vue'
import { ChevronUp } from 'lucide-vue-next'
import type { UserType } from '@/types'
import ScButton from '../ScButton.vue'
import Avatar from '../Avatar.vue'
import { userApi } from '@/apis'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import { verifyPermissions } from '@/hook/verify'

const isOpen = ref(false)
const toast = useToast()

const userStore = useUserStore()

const logout = () => {
  // 这里可以调用登出接口
  userApi
    .logout()
    .then(() => {
      // 清除用户信息
      userStore.token = ''
      userStore.userInfo = {} as UserType
      toast.success('登出成功')
      closePopup()
    })
    .catch(() => {
      toast.error('登出失败')
    })
}

const togglePopup = () => {
  isOpen.value = !isOpen.value
}

const closePopup = () => {
  isOpen.value = false
}

const userCard = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (userCard.value && !userCard.value.contains(event.target as Node)) {
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

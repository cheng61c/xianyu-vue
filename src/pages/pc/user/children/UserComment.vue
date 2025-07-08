<template>
  <div class="w-full text-center">尚未开发</div>
  <Card v-if="!userStore.isLogin" class="stats max-w-5xl min-w-4xl w-full">
    <div class="text-center text-gray-content">
      您还未登录，请先登录后再进行操作。
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/module/user/userStore'
const userStore = useUserStore()
</script>

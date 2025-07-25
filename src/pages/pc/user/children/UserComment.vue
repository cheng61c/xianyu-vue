<template>
  <div class="w-full text-center">{{ $t('d.shang-wei-kai-fa') }}</div>
  <Card v-if="!userStore.isLogin" class="stats max-w-5xl min-w-4xl w-full">
    <div class="text-center text-gray-content">
      {{
        $t('d.nin-huan-wei-deng-lu-qing-xian-deng-lu-hou-zai-jin-hang-cao-zuo')
      }}
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/module/user/userStore'
const userStore = useUserStore()
</script>

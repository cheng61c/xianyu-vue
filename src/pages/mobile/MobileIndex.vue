<template>
  <div class="overflow-y-auto overflow-x-hidden w-full h-[100dvh]">
    <!-- 内容列表 - 这个区域现在会填充剩余空间 -->
    <RouterView />
  </div>

  <!-- <div class="absolute top-1"><DevTools /></div> -->
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import DevTools from '@/components/common/DevTools.vue'

const route = useRoute()
const routeName = ref('')

watch(
  () => route.path,
  (newPath) => {
    routeName.value = newPath
  },
  { immediate: true }
)
</script>

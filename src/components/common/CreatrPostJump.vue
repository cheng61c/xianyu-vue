<template>
  <div class="flex gap-4 items-center py-2">
    <div>
      <h2 class="text-md font-semibold text-active-content">帖子发布完成！</h2>
      <p class="text-active-content">点击跳转到资源发布页</p>
    </div>
    <ScButton @click="$emit('click')" class="mt-2" Border> 跳转 </ScButton>
  </div>
</template>

<script setup lang="ts">
import ScButton from './ScButton.vue'

defineProps<{
  postId: string
}>()
</script>

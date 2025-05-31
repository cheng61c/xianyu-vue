<template>
  <div class="w-full">
    <!-- 表头 -->
    <div class="flex font-semibold py-2 px-4 border-b border-gray-content">
      <div class="flex-1">版本</div>
      <div class="flex-[1.2]">标题</div>
      <div class="flex-1">文件数</div>
      <div class="flex-1">创建时间</div>
      <div class="flex-[1.2]">操作</div>
    </div>

    <!-- 表格行 -->
    <div class="flex py-2 px-4 border-b border-gray-content hover:bg-gray-50">
      <div class="flex-1">版本</div>
      <div class="flex-[1.2]">标题</div>
      <div class="flex-1">文件数</div>
      <div class="flex-1">创建时间</div>
      <div class="flex-[1.2]">操作</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  col: {
    type: Array,
    default: () => [],
  },
})
</script>

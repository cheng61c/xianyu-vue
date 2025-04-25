<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <!-- 图标 -->

    <component
      :is="icon"
      v-if="icon"
      :size="iconSize"
      class="mx-auto h-12 w-12 text-gray-400 flex-shrink-0"
    />

    <PackageSearch
      v-else
      class="mx-auto h-12 w-12 text-gray-400 flex-shrink-0"
    />

    <!-- 标题 -->
    <h3 v-if="title" class="mt-4 text-lg font-medium text-gray-900">
      {{ title }}
    </h3>

    <!-- 描述 -->
    <p v-if="description" class="mt-2 text-sm text-gray-500">
      {{ description }}
    </p>

    <!-- 操作按钮 -->
    <div v-if="action" class="mt-6">
      <ScButton
        :variant="actionVariant"
        :icon="actionIcon"
        :icon-size="actionIconSize"
        @click="$emit('action-click')"
      >
        {{ action }}
      </ScButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScButton from './ScButton.vue' // 引入 ScButton 组件
import { PackageSearch } from 'lucide-vue-next'

const props = defineProps({
  icon: {
    type: [Object, Function],
    default: null, // 默认使用 PackageSearch 图标
  },
  iconSize: {
    type: [Number, String],
    default: 48,
  },
  title: {
    type: String,
    default: '( º﹃º )啥也没有呀~',
  },
  description: {
    type: String,
    default: '当前没有可显示的内容，您可以尝试刷新或创建新内容。',
  },
  action: {
    type: String,
    default: '',
  },
  actionVariant: {
    type: String,
    default: 'solid',
  },
  actionIcon: {
    type: [Object, Function],
    default: null,
  },
  actionIconSize: {
    type: [Number, String],
    default: 16,
  },
})

defineEmits(['action-click'])
</script>

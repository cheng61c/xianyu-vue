<template>
  <div
    class="flex items-center justify-center text-gray-content font-bold overflow-hidden rounded-md flex-shrink-0"
    :class="{
      'bg-gray': loadError,
    }"
    :style="{
      width: size + 'px',
      height: size + 'px',
      fontSize: size / 2 + 'px',
    }">
    <img
      v-if="!loadError"
      class="w-full h-full object-cover"
      :src="src"
      :alt="alt"
      @error="loadError = true" />

    <span v-else>{{ alt?.charAt(0) || '?' }}</span>
  </div>
</template>

<script setup lang="ts">
import { formatLink } from '@/hook/format'
import { ref, defineProps, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    size?: number
  }>(),
  {
    size: 26,
  }
)

const loadError = ref(false)

// 监听 src 变化，重置错误状态
watch(
  () => props.src,
  () => {
    loadError.value = false
  }
)
</script>

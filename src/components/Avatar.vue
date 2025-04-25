<template>
  <div
    class="flex items-center justify-center bg-gray text-gray-content font-bold overflow-hidden rounded-md"
    :style="{
      width: size + 'px',
      height: size + 'px',
      fontSize: size / 2 + 'px',
    }"
  >
    <img
      v-if="!loadError"
      class="w-full h-full object-cover"
      :src="formatLink(src)"
      :alt="alt"
      @error="loadError = true"
    />

    <span v-else>{{ alt?.charAt(0) || '?' }}</span>
  </div>
</template>

<script setup lang="ts">
import { formatLink } from '@/hook/format'
import { ref, defineProps } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    size?: number
  }>(),
  {
    size: 26, // 默认尺寸为 40px
  }
)

const loadError = ref(false)
</script>

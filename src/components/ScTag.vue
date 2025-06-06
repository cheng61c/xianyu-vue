<template>
  <div
    class="flex items-center gap-1 rounded-lg"
    :class="[sizeClass[size]]"
    :style="Style">
    <component :is="icon" v-if="icon" :size="iconSize" class="flex-shrink-0" />
    <slot name="icon" />
    <span><slot /></span>
    <slot name="endIcon" />
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

const props = defineProps({
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md',
  },
  color: {
    type: String,
    default: '#fff',
  },
  bgColor: {
    type: String,
    default: 'var(--color-active)',
  },
  icon: {
    type: [Object, Function] as PropType<any>,
    default: null,
  },
  iconSize: {
    type: Number,
    default: 16,
  },
  status: {
    type: String as PropType<'success' | 'error' | 'warning' | 'info'>,
    default: '',
  },
})

const sizeClass = {
  xs: 'text-xs px-1 py-0.5',
  sm: 'text-sm px-1.5 py-0.5',
  md: 'text-base px-2 py-1',
  lg: 'text-lg px-2 py-1',
} as const

const Style = computed(() => {
  switch (props.status) {
    case 'success':
      return {
        color: 'var(--color-success-content)',
        backgroundColor: 'var(--color-success)',
      }
    case 'error':
      return { color: '#f44336', backgroundColor: '#ffebee' }
    case 'warning':
      return {
        color: 'var(--color-warning-content)',
        backgroundColor: 'var(--color-warning)',
      }
    case 'info':
      return {
        color: 'var(--color-info-content)',
        backgroundColor: 'var(--color-info)',
      }
    default:
      return { color: props.color, backgroundColor: props.bgColor }
  }
})
</script>

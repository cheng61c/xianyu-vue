<template>
  <div
    class="flex space-x-1 items-center rounded-lg flex-shrink-0"
    :class="[sizeClass[size], bgClass]"
    :style="Style">
    <template v-if="icon">
      <component :is="icon" :size="iconSize" />
    </template>

    <slot />
    <slot name="endIcon" />
  </div>
</template>

<script setup lang="ts">
import { adjustColor } from '@/utils/color'
import { computed, type PropType } from 'vue'

const props = defineProps({
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md',
  },
  color: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: 'var(--color-active)',
  },
  bgClass: {
    type: String,
    default: '',
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
    type: String as PropType<'success' | 'error' | 'warning' | 'info' | ''>,
    default: '',
  },
})

const sizeClass = {
  xs: 'text-[10px] px-1.5 py-1 h-4',
  sm: 'text-[12px] px-1.5 py-0.5 h-5',
  md: 'text-[14px] px-2 py-1',
  lg: 'text-[16px] px-2 py-1',
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
        color: 'var(--color-active-content)',
        backgroundColor: 'var(--color-active)',
      }
    default:
      return {
        color:
          props.color != '' ? props.color : adjustColor(props.bgColor, 1, 0.5),
        ...{ background: props.bgClass == '' ? props.bgColor : undefined },
      }
  }
})
</script>

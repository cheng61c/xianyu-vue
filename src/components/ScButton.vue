<template>
  <button
    :class="[
      'relative flex justify-center items-center gap-1 text-background-content hover:text-active transition-all cursor-no-drop',
      className,
    ]">
    <component :is="icon" v-if="icon" :size="iconSize" class="flex-shrink-0" />
    <slot name="icon" />
    <span><slot /></span>
    <slot name="endIcon" />
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/80 border-white/80 z-10 cursor-no-drop">
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-active cursor-no-drop"></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconSize: {
    type: [Number, String],
    default: 16,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  noPd: {
    type: Boolean,
    default: false,
  },
  noBg: {
    type: Boolean,
    default: false,
  },
  activation: {
    type: Boolean,
    default: false,
  },
  noRounded: {
    type: Boolean,
    default: false,
  },
  Border: {
    type: Boolean,
    default: false,
  },
  isCol: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const className = computed(() =>
  [
    props.activation
      ? 'bg-active text-active-content'
      : 'bg-background text-background-content',
    props.Border
      ? props.activation
        ? 'border border-active'
        : 'border border-gray-content hover:border-active'
      : '',
    props.noPadding || props.noPd ? 'p-0' : 'p-2',
    props.noBg ? 'bg-transparent' : 'bg-background',
    props.noRounded ? 'rounded-none' : 'rounded-md',
    props.isCol ? 'flex-col' : '',
    props.loading || props.disabled
      ? 'pointer-events-none opacity-50 '
      : 'cursor-pointer',
  ].filter(Boolean)
)
</script>

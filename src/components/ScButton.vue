<template>
  <button
    :class="[
      'relative flex justify-center items-center gap-1 transition-all cursor-no-drop',
      className,
      tip ? 'tooltip tooltip-' + tipPosition : '',
    ]"
    :data-tip="tip">
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
  tip: {
    type: String,
    default: '',
  },
  tipPosition: {
    type: String,
    default: 'top',
  },
})

const className = computed(() =>
  [
    props.activation
      ? 'bg-active text-active-content'
      : 'bg-background text-background-content hover:text-active',
    props.Border
      ? props.activation
        ? 'border border-active'
        : 'border border-gray-content/50 hover:border-active'
      : '',
    props.noPadding || props.noPd ? 'p-0' : 'p-2',
    props.noBg ? 'bg-transparent' : '',
    props.noRounded ? 'rounded-none' : 'rounded-md',
    props.isCol ? 'flex-col' : '',
    props.loading || props.disabled
      ? 'pointer-events-none opacity-50 '
      : 'cursor-pointer',
  ].filter(Boolean)
)
</script>

<template>
  <button
    :class="['flex justify-center items-center flex-shrink-0', className]"
    :data-tip="tip">
    <component :is="icon" v-if="icon" :size="iconSize" class="flex-shrink-0" />
    <slot v-else name="icon" />
    <slot />
    <slot name="endIcon" />

    <span
      v-if="loading"
      class="loading loading-spinner loading-sm flex-shrink-0"></span>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  icon: {
    type: [Object, Function, null],
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
  noGap: {
    type: Boolean,
    default: false,
  },
})

const className = computed(() =>
  [
    props.activation
      ? props.noBg
        ? 'bg-active text-active'
        : 'bg-active text-active-content'
      : 'bg-background text-background-content hover:text-active',
    props.Border
      ? props.activation
        ? 'border border-active'
        : 'border border-gray hover:border-active'
      : '',
    props.noPadding || props.noPd ? 'p-0' : 'py-1.5 px-3',
    props.noBg ? 'bg-transparent' : '',
    props.noRounded ? '' : 'rounded-md',
    props.isCol ? 'flex-col' : '',
    props.loading || props.disabled
      ? 'pointer-events-none opacity-50 '
      : 'cursor-pointer',
    props.noGap ? '' : 'gap-1',
    props.tip ? 'tooltip tooltip-' + props.tipPosition : '',
  ].filter(Boolean)
)
</script>

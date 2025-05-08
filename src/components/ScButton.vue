<template>
  <button
    :class="[
      'flex items-center justify-center gap-1 text-background-content hover:text-active transition-all',
      { 'p-2': !noPadding },
      { 'bg-transparent': noBg },
      { 'bg-background': !noBg },
      { 'rounded-md': !noRounded },
      {
        'border border-gray-content hover:border-active ':
          !activation && Border,
      },
      { 'border border-active': activation && Border },
      className,
    ]"
    :style="{
      ...(activation
        ? {
            color: 'var(--color-active-content)',
            backgroundColor: 'var(--color-active)',
          }
        : {}),
    }"
  >
    <component :is="icon" v-if="icon" :size="iconSize" class="flex-shrink-0" />
    <slot name="icon" />
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  // ...其他props
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
  className: {
    type: String,
    default: '',
  },
})
</script>

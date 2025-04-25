<template>
  <button
    :class="[
      'flex items-center justify-center gap-1 text-background-content hover:text-gray',
      { 'py-2 px-4': !noPadding },
      { 'bg-transparent': noBg },
      { 'bg-background': !noBg },
      { 'bg-primary': activation },
    ]"
  >
    <component :is="icon" v-if="icon" :size="iconSize" class="flex-shrink-0" />
    <slot name="icon" />
    <span><slot /></span>
  </button>
</template>

<script setup>
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
})
</script>

<template>
  <label class="flex items-center">
    <input
      type="checkbox"
      class="mr-2"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)" />
    <span>
      <slot></slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])
</script>

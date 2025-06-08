<template>
  <div class="relative">
    <component
      :is="multiline ? 'textarea' : 'input'"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :class="[
        'w-full px-4 py-2 rounded-md border transition-colors',
        'focus:outline-none focus:ring-1 focus:border-opacity-70',
        borderColor,
        focusBorderColor,
        error ? 'border-error' : '',
        multiline ? 'min-h-[100px]' : '',
        multiline && !resizable ? 'resize-none' : '',
      ]"
      :rows="multiline ? rows : null" />
    <span v-if="error" class="absolute -bottom-5 left-0 text-xs text-error">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue'
interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  borderColor?: string
  focusBorderColor?: string
  error?: string
  multiline?: boolean
  rows?: number
  resizable?: boolean // 新增：是否可调整大小
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  borderColor: 'border-gray',
  focusBorderColor: 'focus:border-blue-300 focus:ring-blue-200',
  error: '',
  multiline: false,
  rows: 3,
  resizable: true, // 默认允许调整大小
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <component
      :is="multiline ? 'textarea' : 'input'"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :class="[
        'w-full px-4 py-1.5 rounded-md border transition-colors',
        'focus:outline-none focus:ring-1 focus:border-opacity-70',
        borderColor,
        focusBorderColor,
        error ? 'border-error' : '',
        multiline ? 'min-h-[100px]' : '',
        multiline && !resizable ? 'resize-none' : '',
      ]"
      :rows="multiline ? rows : null" />
    <div v-if="showLengthCounter" class="flex justify-between">
      <span v-if="error" class="absolute -bottom-5 left-0 text-xs text-error">
        {{ error }}
      </span>
      <span
        class="text-xs text-gray-500 ml-auto"
        :class="{ 'text-error': isLengthExceeded }">
        {{ currentLength }} / {{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits, computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  borderColor?: string
  focusBorderColor?: string
  error?: string
  multiline?: boolean
  rows?: number
  resizable?: boolean
  maxlength?: number // 新增：最大长度限制
  showLengthCounter?: boolean // 新增：是否显示长度计数器
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  borderColor: 'border-gray',
  focusBorderColor: 'focus:border-blue-300 focus:ring-blue-200',
  error: '',
  multiline: false,
  rows: 3,
  resizable: true,
  maxlength: undefined,
  showLengthCounter: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const currentLength = computed(() => {
  return String(props.modelValue).length
})

const isLengthExceeded = computed(() => {
  return props.maxlength ? currentLength.value > props.maxlength : false
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

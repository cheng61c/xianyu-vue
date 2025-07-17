<template>
  <div class="relative">
    <component
      :is="multiline ? 'textarea' : 'input'"
      ref="inputElement"
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
        multiline ? 'min-h-[2.5rem]' : '',
        multiline && !resizable ? 'resize-none' : '',
      ]"
      :style="multiline ? textareaStyle : null"
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
import {
  defineProps,
  withDefaults,
  defineEmits,
  computed,
  ref,
  watch,
  nextTick,
} from 'vue'

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
  maxlength?: number
  showLengthCounter?: boolean
  maxHeight?: number | string // 新增：最大高度
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
  maxHeight: '300px', // 默认最大高度
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputElement = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
const textareaStyle = ref({
  maxHeight:
    typeof props.maxHeight === 'number'
      ? `${props.maxHeight}px`
      : props.maxHeight,
  overflowY: 'hidden',
})

const currentLength = computed(() => {
  return String(props.modelValue).length
})

const isLengthExceeded = computed(() => {
  return props.maxlength ? currentLength.value > props.maxlength : false
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)

  if (props.multiline) {
    adjustTextareaHeight()
  }
}

// const handleKeydown = (event: KeyboardEvent) => {
//   if (props.multiline && event.key === 'Enter' && !event.shiftKey) {
//     event.preventDefault()
//     // 可以在这里添加提交逻辑（如果需要）
//   }
// }

const adjustTextareaHeight = () => {
  nextTick(() => {
    if (!props.multiline || !inputElement.value) return

    const textarea = inputElement.value as HTMLTextAreaElement
    textarea.style.height = 'auto' // 先重置高度

    // 计算新的高度（不超过最大高度）
    const newHeight = Math.min(
      textarea.scrollHeight,
      typeof props.maxHeight === 'number'
        ? props.maxHeight
        : parseInt(props.maxHeight)
    )

    // 如果内容高度超过最大高度，显示滚动条
    if (textarea.scrollHeight > newHeight) {
      textareaStyle.value.overflowY = 'auto'
      textarea.style.height = `${newHeight}px`
    } else {
      textareaStyle.value.overflowY = 'hidden'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  })
}

// 监听modelValue变化（外部更新时也需要调整高度）
watch(
  () => props.modelValue,
  () => {
    if (props.multiline) {
      adjustTextareaHeight()
    }
  }
)

// 监听maxHeight变化
watch(
  () => props.maxHeight,
  (newVal) => {
    if (props.multiline) {
      textareaStyle.value.maxHeight =
        typeof newVal === 'number' ? `${newVal}px` : newVal
      adjustTextareaHeight()
    }
  }
)

// 初始化时调整高度（如果有初始值）
if (props.multiline) {
  nextTick(() => {
    adjustTextareaHeight()
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-show="visible" class="fixed inset-0 z-50 flex pointer-events-none">
      <!-- 遮罩层 -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity"
        :class="{
          'opacity-100': animationClass === '' && visible,
          'opacity-0': animationClass !== '' || !visible,
        }"
        @click="close" />

      <!-- 内容面板 -->
      <div
        ref="drawerRef"
        class="pointer-events-auto transition-transform transform fixed shadow-xl overflow-auto bg-background"
        :class="[
          position === 'bottom'
            ? 'left-0 bottom-0 w-full max-h-[90%]'
            : position === 'left'
              ? 'left-0 top-0 h-full max-w-4/5'
              : 'right-0 top-0 h-full max-w-4/5',
          animationClass,
        ]">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  position?: 'side' | 'bottom' | 'left'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const position = props.position ?? 'side'

const drawerRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const animationClass = ref('')

const open = () => {
  visible.value = true
  // 初始进场动画
  animationClass.value = getTranslateClass('enter')
  requestAnimationFrame(() => {
    animationClass.value = ''
  })
}

const close = () => {
  emit('update:modelValue', false)
  animationClass.value = getTranslateClass('leave')

  // 等待动画完成后再隐藏
  setTimeout(() => {
    visible.value = false
  }, 200) // 和全局动画 duration 匹配
}

const getTranslateClass = (type: 'enter' | 'leave') => {
  const map: Record<string, string> = {
    side: type === 'enter' ? 'translate-x-full' : 'translate-x-full',
    right: type === 'enter' ? 'translate-x-full' : 'translate-x-full',
    left: type === 'enter' ? '-translate-x-full' : '-translate-x-full',
    bottom: type === 'enter' ? 'translate-y-full' : 'translate-y-full',
  }
  return map[position] || 'translate-x-full'
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open()
    } else {
      close()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 transition-opacity"
    :class="{ 'opacity-0 pointer-events-none': !showing }"
    @click.self="handleClick">
    <div
      class="rounded-lg shadow-2xl transition-all transform"
      :class="{
        'scale-95 opacity-0': !showing,
        'scale-100 opacity-100': showing,
        'overflow-auto': !offOverflow,
      }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 定义组件 props
const props = defineProps({
  // 控制组件显示/隐藏
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 点击背景时是否关闭组件
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  offOverflow: {
    type: Boolean,
    default: true,
  },
})

// 定义组件 emits
const emits = defineEmits(['update:modelValue'])

// 内部状态
const visible = ref(props.modelValue)
const showing = ref(props.modelValue)

// 监听 props.modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      visible.value = true
      // 在下一帧设置 showing 为 true 以触发动画
      nextTick(() => {
        showing.value = true
      })
    } else {
      showing.value = false
      // 动画结束后隐藏组件
      setTimeout(() => {
        visible.value = false
      }, 300)
    }
  }
)

// 处理背景点击事件
const handleClick = (_event: MouseEvent) => {
  if (props.closeOnClickOutside) {
    emits('update:modelValue', false)
  }
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnClickOutside) {
    emits('update:modelValue', false)
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

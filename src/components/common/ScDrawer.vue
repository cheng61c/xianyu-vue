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
        class="pointer-events-auto transition-transform transform fixed shadow-xl"
        :class="[
          position === 'bottom'
            ? 'left-0 bottom-0 w-full max-h-[95%]'
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
import { useDrawertore } from '@/stores/global/drawerStore'
import {
  defineProps,
  defineEmits,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from 'vue'
import { useRouter } from 'vue-router'
// import { useToast } from 'vue-toastification'

const drawertore = useDrawertore()
const router = useRouter()
// const toast = useToast()
let routerGuard: (() => void) | null = null
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

  drawertore.drawers.push({
    close: off,
    id: Symbol().toString(),
  })
}

const close = () => {
  if (drawertore.drawers.length === 0) {
    off()
    return
  }
  try {
    drawertore.drawers[drawertore.drawers.length - 1].close()
  } catch (error) {
    console.error('关闭抽屉时发生错误:', error)
  }
  drawertore.drawers.pop()
}
const off = () => {
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

onMounted(() => {
  drawertore.drawers = []
  routerGuard = router.beforeEach((_to, from, next) => {
    if (from.name === 'publish' || from.name === 'publishResource') {
      if (drawertore.drawers.length > 0) {
        close()
        next(false)
        return
      } else {
        next()
        drawertore.drawers = []
      }
    }
    next()
  })
})

onUnmounted(() => {
  if (routerGuard) {
    routerGuard()
    routerGuard = null
  }
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open()
    }
  },
  { immediate: true }
)
</script>

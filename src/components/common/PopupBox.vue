<template>
  <div ref="popupWrapper" class="relative inline-block">
    <!-- 触发按钮 -->
    <ScButton
      @click="togglePopup"
      :activation="isOpen"
      :icon="icon"
      class="h-10 w-10">
      {{ buttonText }}
    </ScButton>

    <!-- 弹窗内容 -->
    <transition name="fade-slide">
      <div
        v-if="isOpen"
        class="absolute z-10 flex justify-center w-full h-full"
        :class="{
          'top-[110%]': position === 'bottom',
          'bottom-[110%]': position === 'top',
          'left-[110%] top-0': position === 'right',
          'right-[110%] top-0': position === 'left',
        }">
        <slot :close="closePopup" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ScButton from './ScButton.vue'

defineProps<{
  buttonText: string
  icon?: any
  //位置
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}>()

const emit = defineEmits(['close'])

const isOpen = ref(false)
const popupWrapper = ref<HTMLElement | null>(null)

const togglePopup = () => {
  isOpen.value = !isOpen.value
}

const closePopup = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    popupWrapper.value &&
    !popupWrapper.value.contains(event.target as Node)
  ) {
    closePopup()
  }
}

defineExpose({
  togglePopup,
  closePopup,
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

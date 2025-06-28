<template>
  <div ref="popupWrapper" class="relative inline-block">
    <!-- 触发按钮 -->
    <template v-if="buttonText || icon">
      <ScButton
        @click="togglePopup"
        :activation="noActivation ? false : isOpen"
        :icon="icon"
        :no-pd="noPd"
        class="">
        {{ buttonText }}
      </ScButton>
    </template>
    <template v-else>
      <div @click="togglePopup">
        <slot name="trigger" />
      </div>
    </template>

    <!-- 弹窗内容 -->
    <transition name="fade-slide">
      <div
        v-if="isOpen"
        class="absolute z-10"
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
  buttonText?: string
  icon?: any
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  noActivation?: boolean
  noPd?: boolean
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

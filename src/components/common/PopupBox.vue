<template>
  <div ref="popupWrapper" class="relative inline-block">
    <!-- 触发按钮 -->
    <template v-if="buttonText || icon">
      <ScButton
        @click="togglePopup"
        :activation="noActivation ? false : isOpen"
        :icon="icon"
        :icon-size="iconSize"
        :no-pd="noPd"
        :Border="Border"
        :class="className">
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
        class="absolute z-10 shadow-lg bg-transparent"
        :class="{
          'top-[110%]': position === 'bottom',
          'bottom-[110%]': position === 'top',
          'left-[110%] top-0': position === 'right',
          'right-[110%] top-0': position === 'left',
          'top-[110%] right-0': position === 'bottom-left',
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
  iconSize?: number
  position?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-left'
  className?: string
  noActivation?: boolean
  noPd?: boolean
  Border?: boolean
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

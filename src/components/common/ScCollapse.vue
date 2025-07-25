<template>
  <Card noPg noShadow :Borlder="false">
    <div
      class="flex justify-between items-center cursor-pointer select-none w-full"
      @click="toggleCollapse">
      <slot name="header">
        <span>{{ title }}</span>
      </slot>
    </div>

    <transition
      enter-active-class="transition-all ease-out"
      leave-active-class="transition-all ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-screen opacity-100"
      leave-from-class="max-h-screen opacity-100"
      leave-to-class="max-h-0 opacity-0">
      <div v-show="isOpen">
        <slot></slot>
      </div>
    </transition>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from './Card.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

interface Props {
  title?: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
})

const title = computed(() => props.title ?? t('b.dian-ji-zhan-kai'))

const isOpen = ref(props.defaultOpen)

const toggleCollapse = () => {
  isOpen.value = !isOpen.value
}

// 如果需要从父组件控制展开状态，可以暴露方法
defineExpose({
  toggle: toggleCollapse,
  open: () => (isOpen.value = true),
  close: () => (isOpen.value = false),
})
</script>

<template>
  <div
    ref="containerRef"
    class="overflow-y-auto overflow-x-hidden w-full h-[100vh]">
    <!-- 内容列表 - 这个区域现在会填充剩余空间 -->
    <div class="home-content">
      <RouterView />
    </div>
    <!-- 滚动进度显示 -->
    <!-- <div
      v-if="progress !== undefined"
      class="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded-md z-50">
      Progress: {{ (progress * 100).toFixed(1) }}%
    </div> -->
  </div>
  <!-- <div class="absolute top-1"><DevTools /></div> -->
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import DevTools from '@/components/common/DevTools.vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
provide('refreshScroll', progress)
provide('containerRef', containerRef)

const route = useRoute()
const routeName = ref('')

onMounted(() => {
  if (!containerRef.value) return

  // 确保内容高度大于容器高度
  const content = containerRef.value.querySelector(
    '.home-content'
  ) as HTMLElement

  ScrollTrigger.create({
    scroller: containerRef.value,
    trigger: content,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      progress.value = self.progress
    },
  })
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})

watch(
  () => route.path,
  (newPath) => {
    routeName.value = newPath
  },
  { immediate: true }
)
</script>

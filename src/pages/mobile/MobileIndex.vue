<template>
  <div
    ref="containerRef"
    class="overflow-y-auto overflow-x-hidden w-full h-[100dvh]">
    <!-- 内容列表 - 这个区域现在会填充剩余空间 -->
    <div class="home-content">
      <RouterView />
    </div>
  </div>
  <PopUpAnnouncement />
  <!-- <div class="absolute top-1"><DevTools /></div> -->
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PopUpAnnouncement from '@/components/common/PopUpAnnouncement.vue'
// import DevTools from '@/components/common/DevTools.vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDeviceStore } from '@/stores/global/deviceStore'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
provide('refreshScroll', progress)
provide('containerRef', containerRef)

const route = useRoute()
const router = useRouter()
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

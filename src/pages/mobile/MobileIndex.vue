<template>
  <div class="w-full flex flex-col h-screen">
    <MobileHomeNav />
    <div class="flex-1 overflow-auto px-4 w-full">
      <!-- 内容列表 - 这个区域现在会填充剩余空间 -->
      <!-- 添加 overflow-auto 以便内容超出时可以滚动 -->
      <RouterView />
    </div>
    <div
      class="flex items-center justify-between sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm shadow-[0_-1px_3px_0_rgba(0,0,0,0.1)] py-2 px-4">
      <ScButton
        class="h-10"
        :activation="routeName.includes('postList')"
        @click="$router.push({ name: 'postList' })">
        帖子
      </ScButton>
      <ScButton
        class="h-10"
        :activation="routeName.includes('modList')"
        @click="$router.push({ name: 'modList' })">
        资源
      </ScButton>
      <div class="relative bottom-2 w-10 h-10 z-2">
        <button
          class="absolute bg-active left-[-0.75rem] bottom-[-0.75rem] w-16 h-16 text-active-content rounded-full flex items-center justify-center shadow-md"
          @click="$router.push({ name: 'publish' })">
          <Plus :size="24" />
        </button>
      </div>
      <ScButton
        class="h-10"
        :activation="routeName.includes('message')"
        @click="$router.push({ name: 'message' })">
        消息
      </ScButton>
      <ScButton
        class="h-10"
        :activation="routeName.includes('user')"
        @click="$router.push({ name: 'user' })">
        我的
      </ScButton>
    </div>
  </div>
  <!-- <div class="absolute top-1"><DevTools /></div> -->
</template>
<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import MobileHomeNav from '@/components/mobile/homeHeader/MobileHomeNav.vue'
import { Plus } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import DevTools from '@/components/common/DevTools.vue'

const route = useRoute()
const routeName = ref('')

watch(
  () => route.path,
  (newPath) => {
    routeName.value = newPath
  },
  { immediate: true }
)
</script>

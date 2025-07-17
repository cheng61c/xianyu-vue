<template>
  <div class="absolute top-0 z-1 bg-white w-full">
    <MobileHomeNav />
  </div>

  <div class="flex flex-col gap-4 px-4 pt-2">
    <MobilePlate />
    <div class="flex gap-2">
      <ScInput
        v-model="postStore.searchText"
        class="flex-1"
        placeholder="搜索帖子标题"
        @input="postStore.searchText = $event.target.value" />
      <ScButton :icon="Funnel" noPd>筛选</ScButton>
    </div>
    <template v-if="postStore.post.length">
      <MobilePostItem
        v-for="post in postStore.post"
        :key="post.id"
        :post="post" />
    </template>
    <div class="w-full min-h-4"></div>
  </div>

  <button
    class="absolute bg-active right-4 bottom-6 w-12 h-12 text-active-content rounded-full flex items-center justify-center shadow-md"
    @click="$router.push({ name: 'publish' })">
    <Plus :size="24" />
  </button>
</template>

<script setup lang="ts">
import MobilePostItem from '@/components/mobile/post/MobilePostItem.vue'
import MobileHomeNav from '@/components/mobile/homeHeader/MobileHomeNav.vue'
import MobilePlate from '@/components/mobile/homeHeader/MobilePlate.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButton from '@/components/common/ScButton.vue'
import { usePostStore } from '@/stores/module/post/postStore'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import { getPost, search } from '@/stores/module/post/service'
import { Funnel, Plus } from 'lucide-vue-next'

const postStore = usePostStore()
const route = useRoute()
const plateId = ref<string>(route.params.plateId as string)

watch(
  () => route.params,
  (newPlate) => {
    if (newPlate.plateId && postStore.currentPlate.pathName === route.name) {
      plateId.value = newPlate.plateId as string
      postStore.postPage.page = 1
      postStore.postPage.limit = 10
      postStore.postPage.total = 0
      postStore.post = []
    }
  },
  { immediate: true }
)

onMounted(() => {
  // 初始化或获取数据
  postStore.currentPlate.currentRouteName = (route.name as string) || ''
  postStore.searchText = ''
})
</script>

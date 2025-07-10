<template>
  <nav>
    <ul v-if="show" ref="menuList" class="flex gap-4 relative p-0">
      <li
        v-for="(item, index) in configStore.menuItems"
        :key="item.pathName"
        class="list-none"
        :class="{ 'text-primary': postStore.nav.name === item.pathName }"
        @click="setActive(index)">
        <button
          class="navitem inline-block px-2 transition-colors"
          :class="{ 'text-primary': postStore.nav.name === item.pathName }">
          {{ item.name }}
        </button>
      </li>
      <div
        class="absolute bottom-[-2px] h-1 transition-all"
        :style="indicatorStyle">
        <div class="w-4 h-1 bg-primary rounded-full mx-auto my-0"></div>
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/global/configStore'
import { usePostStore } from '@/stores/module/post/postStore'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const configStore = useConfigStore()
const postStore = usePostStore()

const route = useRoute()
const router = useRouter()
const menuList = ref<HTMLElement>()
const activeIndex = ref(0)
const indicatorStyle = ref({
  left: '0px',
  width: '0px',
})
const show = ref(true)

const isMenuItem = computed(() => {
  return configStore.menuItems.some((item) => item.pathName === route.name)
})

const updateIndicator = () => {
  nextTick(() => {
    if (!menuList.value?.children?.[activeIndex.value]) return
    if (!isMenuItem.value) return

    const activeElement = menuList.value.children[
      activeIndex.value
    ] as HTMLElement
    const linkElement = activeElement.querySelector('button') as HTMLElement

    if (linkElement) {
      const { left: parentLeft } = menuList.value.getBoundingClientRect()
      const { width: linkWidth, left: linkLeft } =
        linkElement.getBoundingClientRect()

      indicatorStyle.value = {
        left: `${linkLeft - parentLeft}px`,
        width: `${linkWidth}px`,
      }
    }
  })
}

const setActive = (index: number) => {
  activeIndex.value = index
  postStore.nav.name = configStore.menuItems[index].pathName
  router.push({
    name: configStore.menuItems[index].pathName,
    params: configStore.menuItems[index].params || {},
  })
  updateIndicator()
}

const updateActiveIndex = () => {
  const index = configStore.menuItems.findIndex(
    (item) => item.pathName === route.name
  )
  show.value = true
  activeIndex.value = index !== -1 ? index : 0
  updateIndicator()
}

// 初始化
onMounted(() => {
  postStore.nav.name = (route.name as string) || ''
  if (isMenuItem.value) {
    updateActiveIndex()
  } else {
    show.value = false
  }
})

// 监听路由变化
watch(
  () => route.name,
  () => {
    // 判断当前name是否属于menuItems中的一项
    if (isMenuItem.value) {
      updateActiveIndex()
      updateIndicator()
    } else {
      show.value = false
    }
  },
  { immediate: true }
)

// 监听窗口变化
window.addEventListener('resize', updateIndicator)
</script>

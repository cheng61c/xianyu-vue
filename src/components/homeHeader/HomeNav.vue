<template>
  <nav>
    <ul ref="menuList" class="flex gap-4 relative p-0">
      <li
        v-for="(item, index) in menuItems"
        :key="item.path"
        class="list-none"
        :class="{ 'text-blue-500': isActive(item) }"
        @click="setActive(index)"
      >
        <router-link
          :to="item.path"
          class="inline-block px-2 transition-colors"
          :class="{ 'text-info': isActive(item) }"
        >
          {{ item.name }}
        </router-link>
      </li>
      <div
        class="absolute bottom-[-2px] h-1 transition-all duration-300"
        :style="indicatorStyle"
      >
        <div class="w-4 h-1 bg-info rounded-full mx-auto my-0"></div>
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface MenuItem {
  name: string
  path: string
}

const menuItems: MenuItem[] = [
  { name: '交流帖子', path: '/postList/0' },
  { name: '资源下载', path: '/modList/0' },
]

const route = useRoute()
const router = useRouter()
const menuList = ref<HTMLElement>()
const activeIndex = ref(0)
const indicatorStyle = ref({
  left: '0px',
  width: '0px',
})

const isActive = computed(() => (item: MenuItem) => {
  return route.path === item.path
})

const updateIndicator = () => {
  nextTick(() => {
    if (!menuList.value?.children?.[activeIndex.value]) return

    const activeElement = menuList.value.children[
      activeIndex.value
    ] as HTMLElement
    const linkElement = activeElement.querySelector('a') as HTMLElement

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
  router.push(menuItems[index].path)
}

const updateActiveIndex = () => {
  const index = menuItems.findIndex((item) => item.path === route.path)
  activeIndex.value = index >= 0 ? index : 0
}

// 初始化
onMounted(() => {
  updateActiveIndex()
  updateIndicator()
})

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateActiveIndex()
    updateIndicator()
  }
)

// 监听窗口变化
window.addEventListener('resize', updateIndicator)
</script>

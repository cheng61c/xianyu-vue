<template>
  <nav>
    <ul v-if="show" ref="menuList" class="flex gap-4 relative p-0">
      <li
        v-for="(item, index) in configStore.menuItems"
        :key="item.path"
        class="list-none"
        :class="{ 'text-primary': isActive(item) }"
        @click="setActive(index)">
        <router-link
          :to="item.path"
          class="inline-block px-2 transition-colors"
          :class="{ 'text-primary': isActive(item) }">
          {{ item.name }}
        </router-link>
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
import { useConfigStore } from '@/stores/configStore'
import type { MenuItem } from '@/types/Config'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const configStore = useConfigStore()

const route = useRoute()
const router = useRouter()
const menuList = ref<HTMLElement>()
const activeIndex = ref(0)
const indicatorStyle = ref({
  left: '0px',
  width: '0px',
})
const show = ref(true)

// 使用 currentPlate.pathName 和 pathName 来判断是否高亮
const isActive = computed(() => (item: MenuItem) => {
  return item.pathName === configStore.currentPlate.pathName
})

const updateIndicator = () => {
  nextTick(() => {
    if (!menuList.value?.children?.[activeIndex.value]) return
    if (!isMenuItem.value) return

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
  router.push(configStore.menuItems[index].path).then(() => {
    updateIndicator()
  })
}

const updateActiveIndex = () => {
  const index = configStore.menuItems.findIndex(
    (item) => item.pathName === route.name
  )
  show.value = true
  activeIndex.value = index !== -1 ? index : 0
  // 更新当前所选板块
  configStore.currentPlate = {
    name: configStore.menuItems[activeIndex.value].name,
    pathName: configStore.menuItems[activeIndex.value].pathName,
  }
  updateIndicator()
}

const isMenuItem = computed(() => {
  return configStore.menuItems.some((item) => item.pathName === route.name)
})

// 初始化
onMounted(() => {
  if (isMenuItem.value) {
    updateActiveIndex()
    updateIndicator()
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
  }
)

// 监听窗口变化
window.addEventListener('resize', updateIndicator)
</script>

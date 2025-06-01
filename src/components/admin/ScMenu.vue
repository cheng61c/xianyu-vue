<template>
  <div
    class="border-r border-gray transition-all duration-300 h-[calc(100vh-5rem)]"
    :class="{ 'w-48': !collapsed, 'w-13': collapsed }">
    <!-- 菜单标题和折叠按钮 -->
    <div
      class="flex items-center justify-between p-4 cursor-pointer h-6"
      @click="toggleCollapse">
      <h3 v-if="!collapsed" class="whitespace-nowrap font-bold">菜单</h3>
      <button class="transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transform transition-transform duration-200"
          :class="{ 'rotate-180': collapsed }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- 菜单项列表 -->
    <div class="relative divide-gray-200 z-1">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="w-full h-12 flex items-center justify-start">
        <ScButton
          :icon="item.icon"
          :iconSize="20"
          noPd
          noRounded
          :activation="activation === item.name"
          :tip="collapsed ? item.name : ''"
          @click="toggleOptions(item.name)"
          tipPosition="right"
          class="transition-colors h-full w-full px-4 flex items-center justify-start">
          <span
            v-if="!collapsed"
            data-tip="item.name"
            class="ml-2 whitespace-nowrap overflow-hidden text-ellipsis">
            {{ item.name }}
          </span>
        </ScButton>
      </div>
      <!-- 左侧图标 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScButton from '../ScButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface MenuItem {
  icon?: any // 可以使用 Vue 组件或 SVG
  name: string
  path: string
}

const props = defineProps({
  items: {
    type: Array as () => MenuItem[],
    required: true,
  },
  activation: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (e: 'update:activation', value: string): void
}>()

const collapsed = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
const toggleOptions = (name: string) => {
  if (props.activation === name) {
    emit('update:activation', '')
  } else {
    emit('update:activation', name)
  }
  const item = props.items.find((item) => item.name === name)
  if (item && item.path) {
    router.push(item.path)
  }
}
</script>

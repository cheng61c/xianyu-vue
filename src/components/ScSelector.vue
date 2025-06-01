<template>
  <div class="relative bg-background" ref="dropdownRef">
    <!-- 触发器 -->
    <div
      class="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-active"
      :class="{
        'border-active ': isOpen,
        'border-gray': !isOpen && !selectedItems.length,
      }"
      @click="toggleDropdown">
      <div class="flex flex-wrap gap-1 min-h-6 flex-1 overflow-hidden">
        <!-- 多选标签 -->
        <template v-if="multiple && selectedItems.length">
          <span
            v-for="item in selectedItems"
            :key="getKey(item)"
            class="inline-flex items-center px-2 py-1 bg-gray rounded-md text-sm hover:bg-active hover:text-active-content">
            {{ getLabel(item) }}
            <button
              type="button"
              class="ml-1 cursor-pointer hover:text-active-content"
              @click.stop="removeItem(item)">
              &times;
            </button>
          </span>
        </template>

        <!-- 单选显示或占位符 -->
        <template v-else>
          <span class="text-gray-content">
            {{ selectedItem ? getLabel(selectedItem) : placeholder }}
          </span>
        </template>
      </div>

      <!-- 下拉图标 -->
      <svg
        class="w-5 h-5 text-gray-content transform transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- 下拉菜单 -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0">
      <div
        v-show="isOpen"
        class="absolute z-10 mt-1 w-full shadow-lg rounded-md py-1 border border-gray bg-background max-h-60 overflow-auto focus:outline-none">
        <!-- 搜索框 -->
        <div v-if="searchable" class="sticky top-0 px-2 py-1 border-b">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-active focus:border-active"
            placeholder="搜索..."
            @click.stop />
        </div>

        <!-- 选项列表 -->
        <ul>
          <li
            v-for="item in filteredOptions"
            :key="getKey(item)"
            class="px-3 py-2 text-sm cursor-pointer hover:bg-active/60 group"
            @click="handleItemClick(item)">
            <div class="flex items-center group-hover:text-active-content">
              <!-- 多选复选框 -->
              <input
                v-if="multiple"
                type="checkbox"
                class="checkbox checkbox-xs mr-2 rounded text-active group-hover:text-active-content focus:ring-active"
                :checked="isSelected(item)"
                @click.stop />
              {{ getLabel(item) }}
            </div>
          </li>

          <!-- 无结果提示 -->
          <li
            v-if="filteredOptions.length === 0"
            class="px-3 py-2 text-sm text-center hover:text-active">
            无匹配结果
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

interface DropdownItem {
  value: any
  label: string
  [key: string]: any
}

interface Props {
  modelValue?: any
  options: DropdownItem[] | any[]
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  labelKey?: string // 自定义label字段名
  valueKey?: string // 自定义value字段名
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  options: () => [],
  placeholder: '请选择',
  multiple: false,
  searchable: false,
  labelKey: 'label',
  valueKey: 'value',
})

const emit = defineEmits(['update:modelValue', 'change'])

const dropdownRef = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')

// 获取显示的label
const getLabel = (item: any): string => {
  return props.labelKey && item[props.labelKey]
    ? item[props.labelKey]
    : item.label || item.toString()
}

// 获取唯一key
const getKey = (item: any): any => {
  return props.valueKey && item[props.valueKey]
    ? item[props.valueKey]
    : item.value || item
}

// 判断是否选中
const isSelected = (item: any): boolean => {
  if (props.multiple) {
    return Array.isArray(props.modelValue)
      ? props.modelValue.some((val) => getKey(val) === getKey(item))
      : false
  } else {
    return (
      props.modelValue !== undefined &&
      getKey(props.modelValue) === getKey(item)
    )
  }
}

// 当前选中的项（单选）
const selectedItem = computed(() => {
  if (props.multiple || !props.modelValue) return null
  return (
    props.options.find((item) => getKey(item) === getKey(props.modelValue)) ||
    null
  )
})

// 当前选中的项（多选）
const selectedItems = computed(() => {
  if (!props.multiple || !props.modelValue) return []
  return props.options.filter((item) =>
    Array.isArray(props.modelValue)
      ? props.modelValue.some((val) => getKey(val) === getKey(item))
      : false
  )
})

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter((item) =>
    getLabel(item).toLowerCase().includes(query)
  )
})

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && props.searchable) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

// 点击选项
const handleItemClick = (item: any) => {
  if (props.multiple) {
    const newValue = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : []
    const itemIndex = newValue.findIndex((val) => getKey(val) === getKey(item))

    if (itemIndex > -1) {
      newValue.splice(itemIndex, 1)
    } else {
      newValue.push(item)
    }

    emit('update:modelValue', newValue)
    emit('change', newValue)
  } else {
    emit('update:modelValue', item)
    emit('change', item)
    isOpen.value = false
  }
}

// 移除已选项（多选）
const removeItem = (item: any) => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return

  const newValue = props.modelValue.filter(
    (val) => getKey(val) !== getKey(item)
  )
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <!-- 移动端：简单分页 -->
    <div class="flex flex-1 items-center justify-between sm:hidden">
      <ScButton
        variant="ghost"
        :disabled="currentPage <= 1"
        :icon="ChevronLeft"
        icon-size="20"
        noBg
        @click="handlePageChange(currentPage - 1)">
        上一页
      </ScButton>
      <span class="text-sm text-background-content">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
      <ScButton
        variant="ghost"
        :disabled="currentPage >= totalPages"
        :icon="ChevronRight"
        icon-position="right"
        icon-size="20"
        noBg
        @click="handlePageChange(currentPage + 1)">
        下一页
      </ScButton>
    </div>

    <!-- 桌面端：完整分页 -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div class="pr-4">
        <p class="text-sm text-background-content">
          显示
          <span class="font-medium">{{
            (currentPage - 1) * pageSize + 1
          }}</span>
          到
          <span class="font-medium">{{
            Math.min(currentPage * pageSize, totalItems)
          }}</span>
          条， 共 <span class="font-medium">{{ totalItems }}</span> 条
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination">
          <ScButton
            class="rounded-l-md"
            :disabled="currentPage <= 1"
            :icon="ChevronLeft"
            icon-size="20"
            @click="handlePageChange(currentPage - 1)">
            <span class="sr-only">上一页</span>
          </ScButton>

          <!-- 页码按钮 -->
          <template v-for="page in visiblePages" :key="page">
            <PopupBox v-if="page === '...'" buttonText="..." position="top">
              <template #default="{ close }">
                <div class="flex items-center justify-center w-36 p-2 gap-2">
                  <input
                    type="number"
                    v-model="inputPage"
                    class="w-20 text-center border border-gray-content/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="页码"
                    @keydown.enter="(handlePageChange(inputPage), close())"
                    @keydown.esc="close()"
                    min="1"
                    :max="totalPages" />
                  <ScButton
                    class="border-gray-content/50"
                    @click="(handlePageChange(inputPage), close())">
                    跳转
                  </ScButton>
                </div>
              </template>
            </PopupBox>

            <ScButton
              v-else
              class="h-10 w-10"
              :activation="page == currentPage"
              @click="handlePageChange(page)">
              {{ page }}
            </ScButton>
          </template>

          <ScButton
            class="rounded-r-md"
            :disabled="currentPage >= totalPages"
            :icon="ChevronRight"
            icon-size="20"
            noBg
            @click="handlePageChange(+currentPage + 1)">
            <span class="sr-only">下一页</span>
          </ScButton>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import ScButton from '@/components/ScButton.vue'
import PopupBox from '@/components/PopupBox.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0,
  },
  pageSize: {
    type: Number,
    required: true,
    default: 10,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(props.maxVisiblePages / 2)
  let start = Math.max(props.currentPage - half, 1)
  let end = Math.min(start + props.maxVisiblePages - 1, totalPages.value)

  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(end - props.maxVisiblePages + 1, 1)
  }

  // 添加第一页和省略号
  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }

  // 添加中间页码
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // 添加省略号和最后一页
  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      pages.push('...')
    }
    pages.push(totalPages.value)
  }

  return pages
})
const inputPage = ref(props.currentPage)

const handlePageChange = (page: number | string) => {
  console.log('handlePageChange', page)

  page = Number(page)
  if (page < 1 || page > totalPages.value || page === props.currentPage) {
    return
  }
  emit('page-change', page)
}
</script>

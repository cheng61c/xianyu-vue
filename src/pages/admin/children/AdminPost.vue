<template>
  <Card>
    <div class="flex gap-4">
      <Dropdown
        v-model="searchTypeValue"
        :options="searchTypeoptions"
        placeholder="搜索类型"
        class="w-40" />
      <ScInput v-model="searchPostValue" placeholder="搜索" class="" />
      <ScButton class="px-4" Border> 搜索 </ScButton>
    </div>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 w-full">
        <span>状态:</span>
        <Dropdown
          v-model="searchStatus"
          :options="searchStatusOptions"
          placeholder="状态"
          class="flex-1" />
      </label>

      <label class="flex items-center gap-2 w-full">
        <span>类型:</span>
        <Dropdown
          v-model="postTypeValue"
          :options="postTypeOptions"
          placeholder="类型"
          class="flex-1" />
      </label>
    </div>
  </Card>

  <EmptyState
    title="暂无帖子"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    action="点击刷新"
    :actionIcon="RotateCcw"
    @action-click="" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  Package,
  ArrowDownFromLine,
  ArrowUpToLine,
  MessageSquare,
  Server,
  Flame,
  Trash2,
  Eye,
  SquarePen,
  SquareArrowOutUpRight,
  RotateCcw,
  ArchiveX,
} from 'lucide-vue-next'
import Dropdown from '@/components/ScSelector.vue'
import Card from '@/components/Card.vue'
import ScInput from '@/components/ScInput.vue'
import ScButton from '@/components/ScButton.vue'
import EmptyState from '@/components/EmptyState.vue'

const selectedValue = ref(1)
const selectedValues = ref([])
const searchPostValue = ref('')

const postTypeValue = ref(1)
const postTypeOptions = [
  { value: 1, label: '普通' },
  { value: 2, label: '置顶' },
  { value: 3, label: '精品' },
  { value: 4, label: '活动' },
]

const searchStatus = ref(1)
const searchStatusOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '正常' },
  { value: 2, label: '禁用' },
  { value: 3, label: '未通过' },
  { value: 4, label: '已审核' },
]

const searchTypeValue = ref(1)
const searchTypeoptions = [
  { value: 1, label: '搜索 标题' },
  { value: 2, label: '搜索 投稿者昵称' },
  { value: 3, label: '搜索 投稿者账号' },
]
</script>

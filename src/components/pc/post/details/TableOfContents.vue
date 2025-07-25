<template>
  <Card v-if="tocList.length">
    <h3 class="text-lg font-bold mb-2">{{ $t('d.mu-lu') }}</h3>
    <ul class="space-y-1 text-sm">
      <li
        v-for="item in tocList"
        :key="item.id"
        :style="{ paddingLeft: `${(item.level - 1) * 12}px` }">
        <a :href="`#${item.id}`" class="hover:underline text-blue-600">
          {{ item.text }}
        </a>
      </li>
    </ul>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/common/Card.vue'
import { type TocItem } from '@/utils/toc'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
  tocList: {
    type: Array as PropType<TocItem[]>,
    default: () => [],
  },
})
</script>

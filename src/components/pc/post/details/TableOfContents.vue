<template>
  <Card>
    <h3 class="text-lg font-bold mb-2">{{ $t('d.mu-lu') }}</h3>
    <ul class="space-y-1 text-sm">
      <template v-if="tocList.length">
        <li
          v-for="item in tocList"
          :key="item.id"
          :style="{ paddingLeft: `${(item.level - 1) * 12}px` }">
          <!-- 使用 router-link -->
          <RouterLink
            :to="{ hash: `#${item.id}` }"
            class="hover:underline text-blue-600 cursor-pointer">
            {{ item.text }}
          </RouterLink>
        </li>
      </template>
      <template v-else>
        <li>
          <RouterLink
            :to="{ hash: `#post-top` }"
            class="hover:underline text-blue-600 cursor-pointer">
            {{ $t('b.wen-zhang-zhu-ti') }}
          </RouterLink>
        </li>
      </template>

      <li v-if="postData?.type == 2">
        <RouterLink
          :to="{ hash: `#releases` }"
          class="hover:underline text-blue-600 cursor-pointer">
          {{ $t('d.zi-yuan-xia-zai') }}
        </RouterLink>
      </li>

      <li v-if="postData?.type == 2">
        <RouterLink
          :to="{ hash: `#score-container` }"
          class="hover:underline text-blue-600 cursor-pointer">
          {{ $t('b.ping-fen') }}
        </RouterLink>
      </li>

      <li>
        <RouterLink
          :to="{ hash: `#comment-container` }"
          class="hover:underline text-blue-600 cursor-pointer">
          {{ $t('b.ping-lun-qu') }}
        </RouterLink>
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

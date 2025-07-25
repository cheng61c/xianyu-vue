<!-- 空内容 -->
<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <!-- 图标 -->

    <component
      :is="icon"
      v-if="icon"
      :size="iconSize"
      class="mx-auto h-12 w-12 text-gray-400 flex-shrink-0" />

    <PackageSearch
      v-else
      class="mx-auto h-12 w-12 text-gray-content flex-shrink-0" />

    <!-- 标题 -->
    <h3
      v-if="computedTitle"
      class="mt-4 text-lg font-medium background-content">
      {{ computedTitle }}
    </h3>

    <!-- 描述 -->
    <p v-if="computedDescription" class="mt-2 text-sm text-background-content">
      {{ computedDescription }}
    </p>

    <!-- 操作按钮 -->
    <div v-if="action" class="mt-6">
      <ScButton
        :icon="actionIcon"
        :icon-size="actionIconSize"
        @click="$emit('action-click')">
        {{ action }}
      </ScButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScButton from './ScButton.vue' // 引入 ScButton 组件
import { PackageSearch } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
const { t } = useI18n()

const props = defineProps({
  icon: {
    type: [Object, Function],
    default: null, // 默认使用 PackageSearch 图标
  },
  iconSize: {
    type: [Number, String],
    default: 48,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  action: {
    type: String,
    default: '',
  },
  actionIcon: {
    type: [Object, Function],
    default: null,
  },

  actionIconSize: {
    type: [Number, String],
    default: 16,
  },
})

defineEmits(['action-click'])

const computedTitle = computed(() => props.title || t('t.sha-ye-mei-you-ya'))
const computedDescription = computed(
  () =>
    props.description ||
    t(
      'd.dang-qian-mei-you-ke-xian-shi-de-nei-rong-nin-ke-yi-chang-shi-shua-xin-huo-chuang-jian-xin-nei-rong'
    )
)
</script>

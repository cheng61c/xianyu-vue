<template>
  <div
    class="flex items-center justify-center text-gray-content font-bold overflow-hidden rounded-md flex-shrink-0"
    :class="{
      'bg-gray': loadError,
    }"
    :style="{
      width: size + 'px',
      height: size + 'px',
      fontSize: size / 2 + 'px',
    }">
    <img
      v-if="!loadError"
      class="w-full h-full object-cover"
      :src="imageSrc"
      :alt="alt"
      @error="onImgError" />

    <span v-else>{{ alt?.charAt(0) || '?' }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'
import { formatLink } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    size?: number
    isLocal?: boolean
  }>(),
  {
    size: 26,
    isLocal: false,
  }
)

const loadError = ref(false)

// 本地用于实际渲染的图片地址（可重试修改）
const imageSrc = ref(props.isLocal ? props.src : formatLink(props.src))
// 是否已尝试过去掉后缀并重试
const triedStrip = ref(false)

// 监听 src 变化，重置错误状态
watch(
  () => props.src,
  () => {
    loadError.value = false
    triedStrip.value = false
    imageSrc.value = props.isLocal ? props.src : formatLink(props.src)
  }
)

const onImgError = () => {
  // 如果尚未尝试去掉常见的尺寸后缀，则尝试一次
  if (!triedStrip.value && typeof props.src === 'string') {
    const suffixRegex = /!\/fwfh\/\d+x\d+$/
    if (suffixRegex.test(props.src)) {
      triedStrip.value = true
      const stripped = props.src.replace(suffixRegex, '')
      imageSrc.value = props.isLocal ? stripped : formatLink(stripped)
      return
    }
  }

  // 如果没有可重试的地址或重试后仍失败，则显示占位字母
  loadError.value = true
}
</script>

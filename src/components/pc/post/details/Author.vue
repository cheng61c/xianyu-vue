<template>
  <Card v-if="postData">
    <h3 class="text-lg font-bold mb-2">{{ $t('b.zuo-zhe') }}</h3>
    <div class="flex gap-2 items-center">
      <Avatar
        :src="postData.author.headImg || ''"
        :alt="postData.author.nickname"
        :size="32"
        @click.stop="openImg(postData.author.headImg)" />
      <div
        class="flex flex-wrap gap-x-1 items-center"
        @click.stop="
          $router.push({
            name: 'userPanel',
            query: { userId: postData.author.id },
          })
        ">
        <span class="text-background-content font-bold">
          {{ postData.author.nickname }}
        </span>
        <ScRole :user="postData.author" size="sm"></ScRole>
      </div>
    </div>
  </Card>

  <ScModal v-model="imageModal">
    <div class="relative w-screen h-[100dvh] overflow-hidden">
      <ScZoomableImage :src="imgurl" @click-outside="imageModal = false" />
      <button
        class="absolute z-[10] top-[1rem] right-[1rem] rounded-full w-10 h-10 border border-error hover:border-active/80 text-error hover:text-active/80"
        @click="imageModal = false">
        <X class="mx-auto" />
      </button>
    </div>
  </ScModal>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps, ref } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/common/Card.vue'
import Avatar from '@/components/common/Avatar.vue'
import ScRole from '@/components/common/ScRole.vue'
import ScModal from '@/components/common/ScModal.vue'
import { X } from 'lucide-vue-next'
import { formatLink } from '@/utils/format'
import ScZoomableImage from '@/components/common/ScZoomableImage.vue'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})

const imageModal = ref(false)
const imgurl = ref('')

const openImg = (src: string) => {
  // console.log('Image clicked:', (e.target as HTMLImageElement).src)
  imageModal.value = true
  imgurl.value = formatLink(src)
}
</script>

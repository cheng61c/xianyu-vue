<template>
  <Card v-if="postData && postData.postVersions.length > 0">
    <h3 class="text-lg font-bold mb-2">发布版</h3>

    <div>
      <div
        class="flex gap-x-2"
        v-for="(item, vIndex) in postData.postVersions"
        :key="item.id">
        <div class="flex flex-col items-center w-4">
          <div
            class="h-1/3 w-1 flex-1"
            :class="{
              'bg-gray': vIndex != 0,
            }"></div>
          <div
            class="bg-secondary h-4 w-4 rounded-full tooltip tooltip-left z-2"
            :data-tip="item.createdAt"></div>
          <div
            class="h-1/3 w-1 flex-1"
            :class="{
              'bg-gray': vIndex != postData.postVersions.length - 1,
            }"></div>
        </div>

        <!-- 内容 -->
        <div
          @click="handleModalChange"
          class="flex gap-1 items-center py-2 col-start-2 row-start-1 row-span-3">
          <ScTag v-if="vIndex == 0" size="sm" :bgColor="'#41B883'">
            最新
          </ScTag>
          <ScTag size="sm">
            {{ item.version }}
          </ScTag>
          {{ item.title }}
        </div>
      </div>
    </div>
  </Card>

  <ScModal v-model="showModal">
    <Card> 123123 </Card>
  </ScModal>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import { defineProps, ref } from 'vue'
import type { PropType } from 'vue'
import Card from '@/components/Card.vue'
import ScTag from '@/components/ScTag.vue'
import ScModal from '@/components/ScModal.vue'

defineProps({
  postData: {
    type: Object as PropType<Post | null>,
    required: true,
  },
})

const showModal = ref(false)

const handleModalChange = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <Card noPg class="p-2 w-28">
    <ScButton class="w-full text-error" @click=""> 举报 </ScButton>
    <ScButton v-if="isAdmin" class="w-full text-error" @click="">
      删除评论
    </ScButton>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { verifyPermissions } from '@/hook/verify'
import { computed } from 'vue'

const emit = defineEmits(['updateComment'])
const isAdmin = computed(() => {
  return verifyPermissions([1, 2, 3, 5, 9])
})
</script>

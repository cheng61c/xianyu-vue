<template>
  <Card>
    <ScButton
      variant="ghost"
      class="text-active"
      @click="$router.push({ name: 'publish' })"
      :icon="MessageSquarePlus"
      :border="true"
    >
      <span class="font-bold text-sm">发布文章</span>
    </ScButton>
    <ScButton
      variant="ghost"
      class="text-active"
      :icon="PackagePlus"
      :border="true"
    >
      <span class="font-bold text-sm">发布资源</span>
    </ScButton>
  </Card>
</template>
<script setup lang="ts">
import Card from '@/components/Card.vue'
import ScButton from '@/components/ScButton.vue'
import { PackagePlus, MessageSquarePlus } from 'lucide-vue-next'
</script>

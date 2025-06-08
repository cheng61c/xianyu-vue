<template>
  <Card>
    <ScButton
      variant="ghost"
      class="text-active"
      @click="$router.push({ name: 'publish' })"
      :icon="MessageSquarePlus"
      Border>
      发布内容
    </ScButton>
  </Card>
</template>
<script setup lang="ts">
import Card from '@/components/Card.vue'
import ScButton from '@/components/ScButton.vue'
import { MessageSquarePlus } from 'lucide-vue-next'
</script>

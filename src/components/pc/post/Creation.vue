<template>
  <Card>
    <ScButton
      variant="ghost"
      class="text-active"
      @click="$router.push({ name: 'publishPost' })"
      :icon="MessageSquarePlus"
      Border>
      {{ $t('b.fa-bu-nei-rong') }}
    </ScButton>
  </Card>
</template>
<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { MessageSquarePlus } from 'lucide-vue-next'
</script>

<template>
  <div class="flex gap-4 items-center py-2">
    <div>
      <h2 class="text-md font-semibold text-active-content">
        {{ $t('d.tie-zi-fa-bu-wan-cheng') }}
      </h2>
      <p class="text-active-content">
        {{ $t('d.dian-ji-tiao-zhuan-dao-zi-yuan-fa-bu-ye') }}
      </p>
    </div>
    <ScButton @click="$emit('click')" class="mt-2" Border>
      {{ $t('b.tiao-zhuan') }}
    </ScButton>
  </div>
</template>

<script setup lang="ts">
import ScButton from './ScButton.vue'

defineProps<{
  postId: string
}>()
</script>

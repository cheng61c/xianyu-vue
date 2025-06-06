<template>
  <Card class="stats w-full" noCol noPg>
    <div class="stat">
      <div class="stat-figure text-primary">
        <ScrollText />
      </div>
      <div class="stat-title">总注册数</div>
      <div class="stat-value text-primary">666</div>
      <div class="stat-desc">最近注册 111</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-primary">
        <ScrollText />
      </div>
      <div class="stat-title">总注册数</div>
      <div class="stat-value text-primary">666</div>
      <div class="stat-desc">最近注册 111</div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from '@/components/Card.vue'
</script>

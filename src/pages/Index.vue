<template>
  <!-- 主窗口 -->
  <div class="window bg-background-300 w-dvw h-dvh">
    <div class="w-full max-w-7xl mx-auto px-4 transition-all duration-300">
      <HomeHeader />

      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/homeHeader/HomeHeader.vue'
</script>

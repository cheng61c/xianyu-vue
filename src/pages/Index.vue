<template>
  <!-- 主窗口 -->
  <div class="bg-background w-dvw h-screen">
    <div class="w-full max-w-7xl mx-auto px-4 transition-all duration-300">
      <HomeHeader />

      <div class="h-[calc(100vh-64px)]">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/homeHeader/HomeHeader.vue'
</script>

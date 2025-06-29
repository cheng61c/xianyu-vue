<template>
  <!-- 主窗口 -->
  <div class="h-full mx-auto max-w-[1600px]">
    <HomeHeader />
    <div class="w-full h-full mx-auto px-4 pt-1 overflow-y-auto">
      <router-view></router-view>
    </div>
    <PopUpAnnouncement />
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/pc/homeHeader/HomeHeader.vue'
import PopUpAnnouncement from '@/components/common/PopUpAnnouncement.vue'
</script>

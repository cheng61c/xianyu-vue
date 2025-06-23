<template>
  <!-- 主窗口 -->
  <div class="h-screen mx-auto max-w-[1600px]">
    <HomeHeader />
    <div class="w-full mx-auto px-4 pt-1 h-[calc(100vh-78px)] overflow-y-auto">
      <router-view></router-view>
    </div>
    <PopUpAnnouncement />
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/pc/homeHeader/HomeHeader.vue'
import PopUpAnnouncement from '@/components/common/PopUpAnnouncement.vue'
</script>

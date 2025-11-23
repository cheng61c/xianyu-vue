<template>
  <!-- 主窗口 -->
  <div class="mx-auto max-w-[1600px] pb-4 pm-4">
    <HomeHeader />
    <div class="w-full mx-auto px-4 pt-1 overflow-y-auto">
      <router-view></router-view>
    </div>
    <div
      class="text-center"
      v-if="verifyPermissions([1, 2, 3, 4, 5, 6, 7, 9, 10])">
      updateTime: 2025年11月23日22:31:24
    </div>
    <PopUpAnnouncement />
  </div>
  <!-- <div class="absolute bottom-0 right-0"><DevTools /></div> -->
</template>

<script setup lang="ts">
import HomeHeader from '@/components/pc/homeHeader/HomeHeader.vue'
import PopUpAnnouncement from '@/components/common/PopUpAnnouncement.vue'
import { verifyPermissions } from '@/utils/verify'
// import DevTools from '@/components/common/DevTools.vue'
</script>

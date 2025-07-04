<template>
  <!-- 主窗口 -->
  <div class="mx-auto max-w-[1600px] pb-4 pm-4">
    <HomeHeader />
    <div class="w-full mx-auto px-4 pt-1 overflow-y-auto">
      <router-view></router-view>
    </div>
    <div v-if="configStore.padAdaptation" class="h-[8vh]"></div>
    <PopUpAnnouncement />
  </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/pc/homeHeader/HomeHeader.vue'
import PopUpAnnouncement from '@/components/common/PopUpAnnouncement.vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

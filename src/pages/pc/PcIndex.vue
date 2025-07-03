<template>
  <!-- 主窗口 -->
  <div
    class="mx-auto max-w-[1600px]"
    :class="{
      'h-[calc(100vh-4rem)]': !configStore.padAdaptation,
      'h-[calc(100vh-5.5rem)]': configStore.padAdaptation,
    }">
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
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

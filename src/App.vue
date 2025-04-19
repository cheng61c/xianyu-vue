<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useConfigStore } from '@/stores/configStore'
import { computed } from 'vue'

const configStore = useConfigStore()
const elementLocale = computed(() => {
  return configStore.lang === 'en' ? en : zhCn
})
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>

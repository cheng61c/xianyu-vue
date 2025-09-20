<template>
  <div class="relative w-0 flex justify-end">
    <div class="loading-container">
      <span class="loading loading-spinner loading-xs mb-0.5"></span>
      <span
        v-for="(char, index) in loadingText"
        :key="index"
        class="loading-char"
        :style="{ animationDelay: `${index * 0.1}s` }">
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loadingText = ref(t('b.loading'))
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-char {
  font-size: 16px;
  animation: bounce 0.4s infinite alternate;
  margin-left: 2px; /* 添加一些间距 */
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-4px);
  }
}
</style>

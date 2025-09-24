<template>
  <PopupBox :icon="Languages" :icon-size="24" noPd position="bottom">
    <template #default="{ close }">
      <Card class="p-2 w-28 items-center">
        <div
          class="text-center cursor-pointer hover:text-active"
          :class="{
            'text-active': configStore.lang.value === lang.value,
          }"
          v-for="lang in configStore.langs"
          :key="lang.value"
          @click="(setLang(lang), close())">
          {{ lang.label }}
        </div>
      </Card>
    </template>
  </PopupBox>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/global/configStore'
import Card from './Card.vue'
import PopupBox from './PopupBox.vue'
import { Languages } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const configStore = useConfigStore()
const setLang = (lang: { value: string; label: string }) => {
  configStore.lang = lang
  locale.value = lang.value
}
</script>

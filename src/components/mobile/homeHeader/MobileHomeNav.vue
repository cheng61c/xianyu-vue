<template>
  <div class="h-16 w-full flex justify-between items-center px-4">
    <ScButton @click="leftDrawer = true" :icon="Menu" :iconSize="20" />
    <div class="flex">
      <ScButton @click="leftDrawer = true" :icon="Search" :iconSize="20" />
      <ScLogin />
    </div>
  </div>

  <ScDrawer v-model="leftDrawer" position="left">
    <div class="bg-background w-64 h-full p-4">
      <h3 class="text-xl px-2">菜单</h3>
      <template v-if="postStore.plate">
        <AccordionItem v-model:open="open1">
          <template #title>标题 1</template>
          <template #content> 折叠内容一段文本，你可以插入任意内容。 </template>
        </AccordionItem>

        <AccordionItem v-model:open="open2">
          <template #title>标题 2</template>
          <template #content> 第二段内容，默认展开。 </template>
        </AccordionItem>
      </template>
    </div>
  </ScDrawer>
</template>

<script setup lang="ts">
import ScButton from '@/components/common/ScButton.vue'
import ScDrawer from '@/components/common/ScDrawer.vue'
import ScLogin from '@/components/pc/homeHeader/ScLogin.vue'
import AccordionItem from '@/components/common/ScAccordionItem.vue'
import { Menu, Search } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { usePostStore } from '@/stores/module/post/postStore'
import { getPlate } from '@/stores/module/post/service'

const postStore = usePostStore()
const leftDrawer = ref(false)

const open1 = ref(false)
const open2 = ref(true)

onMounted(() => {
  // 初始化或获取数据
  getPlate()
})
</script>

<style scoped>
input[type='checkbox'] {
  padding: 0;
}
</style>

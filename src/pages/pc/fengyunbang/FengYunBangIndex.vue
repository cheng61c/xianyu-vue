<template>
  <div class="flex gap-4 h-[calc(100vh-84px)] overflow-y-auto">
    <div class="p-1">
      <Card class="h-full overflow-y-auto overflow-x-hidden w-[12rem]">
        <div
          class="flex gap-2 items-center justify-center text-lg font-bold border-b border-gray/40 pb-1 mb-2">
          <Trophy :size="24" />
          <span>名人堂</span>
        </div>
        <div class="text-gray text-sm text-center mb-2">顺序无关排名</div>
        <div class="flex flex-col">
          <div
            v-for="item in fengYunBangStore.list"
            :key="item.id"
            class="py-2 transition-all hover:text-active hover:bg-active/5 px-2 rounded-md hover:text-lg transform cursor-pointer"
            :class="{
              'text-active bg-active/5 ': item.id === currentId,
            }"
            @click="scrollToCard(item.id)">
            {{ item.title }}
          </div>
        </div>
      </Card>
    </div>
    <div
      ref="rightContainer"
      class="flex-1 h-[100vh-68px] overflow-y-auto p-1 space-y-4">
      <template v-if="fengYunBangStore.list.length">
        <Card
          v-for="item in fengYunBangStore.list"
          :key="item.id"
          :ref="
            (el) => {
              if (el) cardRefs[item.id] = el
            }
          ">
          <!-- 卡片内容保持不变 -->
          <div class="flex gap-4 items-center pb-4">
            <Avatar :src="item.headImg" :size="46" />
            <div class="flex flex-col">
              <span class="text-lg font-bold">{{ item.title }}</span>
              <span>
                创建于: {{ item.createdAt }}
                {{
                  item.createdAt != item.updatedAt
                    ? `; 最后更新于: ${item.updatedAt}`
                    : ''
                }}
              </span>
            </div>
            <div>
              <Card v-if="item.user" noPg class="">
                <div class="flex gap-4 items-center p-1">
                  <Avatar :src="item.user.headImg" :size="46" />
                  <div class="flex gap-1 flex-wrap">
                    <span class="text-lg font-bold flex-shrink-0">
                      {{ item.user.nickname }}
                    </span>

                    <ScRole
                      v-if="item.user && item.user.roles"
                      :user="item.user"
                      isAll
                      size="sm"></ScRole>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div class="tiptap" v-html="item.content"></div>
        </Card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import ScRole from '@/components/common/ScRole.vue'
import { useFengYunBangStore } from '@/stores/module/fengyunbang/FengYunBangStore'
import { getFengYunBangList } from '@/stores/module/fengyunbang/service'
import { Trophy } from 'lucide-vue-next'

const fengYunBangStore = useFengYunBangStore()
const currentId = ref(fengYunBangStore.list[0]?.id || 0)
const rightContainer = ref<HTMLElement | null>(null)
import type { ComponentPublicInstance } from 'vue'
const cardRefs = ref<
  Record<number, HTMLElement | Element | ComponentPublicInstance>
>({})

// 滚动到指定卡片
const scrollToCard = (id: number) => {
  currentId.value = id
  const card = cardRefs.value[id]
  let cardEl: HTMLElement | null = null
  if (card) {
    // If it's a Vue component, get its $el, otherwise use as HTMLElement
    cardEl = (card as ComponentPublicInstance).$el
      ? ((card as ComponentPublicInstance).$el as HTMLElement)
      : (card as HTMLElement)
  }
  if (cardEl && rightContainer.value) {
    // 计算滚动位置（考虑容器顶部padding），并减去1px避免误差
    const topPos =
      cardEl.offsetTop -
      (parseInt(getComputedStyle(rightContainer.value).paddingTop) || 0) -
      68

    // 平滑滚动到指定位置
    rightContainer.value.scrollTo({
      top: topPos < 0 ? 0 : topPos,
      behavior: 'smooth',
    })
  }
}

// 初始化选中第一个卡片并滚动到顶部
watch(
  () => fengYunBangStore.list,
  (newList) => {
    if (newList.length > 0) {
      nextTick(() => {
        currentId.value = newList[0].id
        scrollToCard(newList[0].id)
      })
    }
  }
)

onMounted(() => {
  getFengYunBangList()
})
</script>

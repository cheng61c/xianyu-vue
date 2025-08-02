<template>
  <div class="flex gap-4 h-[calc(100vh-84px)] overflow-y-auto">
    <div class="p-1">
      <Card class="h-full overflow-y-auto overflow-x-hidden w-[12rem]">
        <div
          class="flex gap-2 items-center justify-center text-lg font-bold border-b border-gray/40 pb-1 mb-2">
          <Trophy :size="24" />
          <span>玩家风云榜</span>
        </div>
        <div class="flex flex-col">
          <div
            v-for="item in fengYunBangStore.list"
            :key="item.id"
            class="py-2 transition-all hover:text-active hover:bg-active/5 px-2 rounded-md hover:text-lg transform cursor-pointer"
            :class="{
              'text-active bg-active/5 ': item.id === currentId,
            }">
            {{ item.title }}
          </div>
        </div>
      </Card>
    </div>
    <div class="flex-1 h-[100vh-68px] overflow-y-auto p-1 space-y-4">
      <template v-if="fengYunBangStore.list.length">
        <Card v-for="item in fengYunBangStore.list" :key="item.id" class="p-2">
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
              <Card v-if="item.user" noPg>
                <div class="flex gap-4 items-center p-1">
                  <Avatar :src="item.user.headImg" :size="46" />
                  <div class="flex gap-1">
                    <span class="text-lg font-bold">
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
import Avatar from '@/components/common/Avatar.vue'
import Card from '@/components/common/Card.vue'
import ScRole from '@/components/common/ScRole.vue'
import { useFengYunBangStore } from '@/stores/module/fengyunbang/FengYunBangStore'
import { getFengYunBangList } from '@/stores/module/fengyunbang/service'
import { Trophy } from 'lucide-vue-next'
import { onMounted } from 'vue'

const fengYunBangStore = useFengYunBangStore()
const currentId = fengYunBangStore.list[0]?.id || 0
onMounted(() => {
  getFengYunBangList()
})
</script>

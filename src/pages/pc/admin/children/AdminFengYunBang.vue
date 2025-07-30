<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getFengYunBangAll" :icon="RotateCcw" Border>
        刷新列表
      </ScButton>
      <ScButton @click="addPlayer" :icon="Plus" Border> 添加玩家 </ScButton>
    </div>
  </Card>
  <Card v-if="fengYunBangStore.list.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('b.ming-cheng') }}</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>{{ $t('b.cao-zuo') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in fengYunBangStore.list" :key="item.id">
            <th>{{ item.id }}</th>
            <td>
              {{ item.title }}
            </td>
            <td>{{ item.createdAt }}</td>
            <td>{{ item.updatedAt }}</td>
            <td>
              <div class="flex items-center gap-2">
                <ScButton Border>
                  {{ $t('b.bian-ji') }}
                </ScButton>
                <ScButton Border> 删除 </ScButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <ScModal v-model="isOpen" offOverflow>
    <Card class="max-h-[80vh] overflow-y-auto w-6xl">
      <span class="text-xl">添加玩家</span>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput v-model="forms.title" :placeholder="'玩家名称'" class="m-2" />
      </div>

      <div class="flex items-center gap-4">
        <span> 头像地址: </span>
        <ScInput v-model="forms.title" :placeholder="'头像地址'" class="m-2" />
      </div>

      <div class="flex items-center gap-4">
        <span> 社区id: </span>
        <ScInput
          v-model="forms.title"
          :placeholder="'在社区中有账号时填写'"
          class="m-2" />
      </div>

      <div class="mt-4">
        <TipTap v-model="forms.content" />
      </div>

      <div class="flex justify-end mt-1 gap-4">
        <ScButton @click="addPlayer" Border> 确认添加 </ScButton>
        <ScButton @click="isOpen = false" Border> 取消 </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import ScModal from '@/components/common/ScModal.vue'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import ScButton from '@/components/common/ScButton.vue'
import ScInput from '@/components/common/ScInput.vue'
import { Plus, RotateCcw } from 'lucide-vue-next'
import { useFengYunBangStore } from '@/stores/module/fengyunbang/FengYunBangStore'
import { getFengYunBangAll } from '@/stores/module/fengyunbang/service'
import type { FengYunBangDto } from '@/types/FengYunBang'
import { onMounted, ref } from 'vue'

const fengYunBangStore = useFengYunBangStore()
const isOpen = ref(false)

const forms = ref<FengYunBangDto>({
  title: '',
  headImg: '',
  content: '',
})

const addPlayer = () => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
}

onMounted(() => {
  getFengYunBangAll()
})
</script>

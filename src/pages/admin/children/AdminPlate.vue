<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getPlateList" :icon="RotateCcw" Border>
        刷新列表
      </ScButton>
      <ScButton @click="addPlate" :icon="Plus" Border> 添加新板块 </ScButton>
    </div>
  </Card>

  <Card v-if="plateList.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>帖子数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(plate, index) in plateList" :key="plate.id">
            <th>{{ plate.id }}</th>
            <td>
              {{ plate.name }}
            </td>
            <td>
              {{ plate.postCount }}
            </td>

            <td>
              <div class="flex">
                <ScTag
                  :status="plate.disabled === 0 ? 'success' : 'error'"
                  size="sm">
                  {{ plate.disabled === 0 ? '启用' : '禁用' }}
                </ScTag>
              </div>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <ScButton @click="updatePlate(index)" Border> 编辑 </ScButton>
                <ScButton @click="deletePlate(index)" Border> 禁用 </ScButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <EmptyState
    v-else
    title="暂无帖子"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    action="点击刷新"
    :actionIcon="RotateCcw"
    @action-click="getPlateList" />

  <ScModal v-model="updateModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">编辑板块</div>

      <div>板块名称: {{ plateList[currentPlate].name }}</div>

      <div class="flex items-center gap-4">
        <span> 名称: </span>
        <ScInput
          v-model="currentPlateBody.name"
          placeholder="板块名称"
          class="m-2" />
      </div>

      <div class="flex items-center gap-4">
        <span> 类型: </span>
        <Dropdown
          v-model="plateBar"
          :options="plateBarOptions"
          placeholder="请选择板块类型"
          class="m-2 w-full max-w-xs" />
      </div>

      <div class="flex items-start justify-start gap-4">
        <span class="mt-2"> 描述: </span>
        <ScInput
          v-model="currentPlateBody.description"
          placeholder="描述"
          class="m-2 w-4/5"
          multiline
          :resizable="false" />
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updatePlate(currentPlate)" Border>
          确认修改
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="addPlateModal">
    <Card class="p-6 w-2xl h-[18rem]">
      <div class="text-xl mb-4">添加板块</div>
      <div class="flex items-center gap-4">
        <span> 名称: </span>
        <ScInput
          v-model="newPlateBody.name"
          placeholder="板块名称"
          class="m-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> 类型: </span>
        <Dropdown
          v-model="plateBar"
          :options="plateBarOptions"
          placeholder="请选择板块类型"
          class="m-2 w-full max-w-xs" />
      </div>

      <div class="flex gap-4 justify-end h-full items-end">
        <ScButton class="px-4" @click="addPlate" Border> 确认添加 </ScButton>
        <ScButton class="px-4" @click="addPlateModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="deletePlateModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">禁用角色</div>
      <div class="text-warning mb-4">
        删除板块后，该板块下所有帖子将一并删除，板块下的文件也无法下载。
      </div>
      <div class="text-error mb-4">
        删除板块是不可逆的操作，删除后将无法恢复
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="deletePlate(currentPlate)">
          确认删除
        </ScButton>

        <ScButton class="px-4" @click="deletePlateModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RotateCcw, ArchiveX, Plus } from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import ScInput from '@/components/ScInput.vue'
import ScButton from '@/components/ScButton.vue'
import EmptyState from '@/components/EmptyState.vue'
import { plateApi } from '@/apis'
import Dropdown from '@/components/ScSelector.vue'
import ScTag from '@/components/ScTag.vue'
import { formatTime } from '@/hook/format'
import ScModal from '@/components/ScModal.vue'

import type { Role } from '@/types/Role'
import type { Plate, PlateDto } from '@/types/Plate'

const plateBar = ref(1)
const plateBarOptions = ref([
  { label: '交流板块', value: 1 },
  { label: '文件板块', value: 2 },
]) // 板块类型选项

const plateList = ref<Plate[]>([]) // 帖子列表数据
const currentPlate = ref(-1) // 当前操作的帖子ID
const updateModal = ref(false) // 更新帖子模态框状态
const addPlateModal = ref(false) // 添加新角色模态框状态
const deletePlateModal = ref(false) // 删除角色模态框状态
const newPlateBody = ref<PlateDto>({
  name: '',
  type: 1,
})
const currentPlateBody = ref<Plate>({
  id: -1,
  name: '',
  /** 板块介绍 */
  description: '',
  /** 帖子数量 */
  postCount: 0,
  /** 板块类型，1交流板块，2文件板块 */
  type: 1,
  disabled: 0,
})

const getPlateList = () => {
  plateApi
    .getPlateListAsAdmin()
    .then((res) => {
      if (res.data.code === 200) {
        // 处理获取到的帖子数据
        plateList.value = res.data.data.map((item: Role) => {
          item.createdAt = formatTime(item.createdAt)
          item.updatedAt = formatTime(item.updatedAt)
          return item
        })
      }
    })
    .catch((error) => {
      console.error('请求错误:', error.msg)
    })
}

const updatePlate = (index: number) => {
  const item = plateList.value[index]
  if (!updateModal.value) {
    currentPlate.value = index // 设置当前操作的帖子
    currentPlateBody.value.id = item.id
    currentPlateBody.value.name = ''
    currentPlateBody.value.description = item.description || ''
    currentPlateBody.value.type = item.type
    currentPlateBody.value.disabled = item.disabled
    updateModal.value = true
    return
  }
  const body: PlateDto = {
    id: item.id,
  }
  if (currentPlateBody.value.name.trim() !== '') {
    body.name = currentPlateBody.value.name // 如果新名称不为空，则使用新名称
  }
  if (currentPlateBody.value.description.trim() !== '') {
    body.description = currentPlateBody.value.description // 如果新描述不为空，则使用新描述
  }
  if (currentPlateBody.value.type !== item.type) {
    body.type = currentPlateBody.value.type // 如果新类型不等于旧类型，则使用新类型
  }
  plateApi
    .updatePlate(body)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPlateList()
        updateModal.value = false
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

const addPlate = () => {
  if (!addPlateModal.value) {
    addPlateModal.value = true // 打开添加新角色模态框
    newPlateBody.value.name = '' // 清空新名称
    newPlateBody.value.type = 1 // 默认设置为交流板块
    newPlateBody.value.description = '' // 清空新描述
    return
  }
  plateApi
    .createPlate(newPlateBody.value)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPlateList()
        addPlateModal.value = false // 关闭模态框
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

const deletePlate = (index: number) => {
  const item = plateList.value[index]
  if (!deletePlateModal.value) {
    currentPlate.value = index // 设置当前操作的帖子
    deletePlateModal.value = true // 打开删除角色模态框
    return
  }
  plateApi
    .plateDelete(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getPlateList()
        deletePlateModal.value = false // 关闭模态框
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

onMounted(() => {
  getPlateList() // 页面加载时获取帖子列表
})
</script>

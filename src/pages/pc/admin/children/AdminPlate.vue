<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getPlateList" :icon="RotateCcw" Border>
        {{ $t('b.shua-xin-lie-biao') }}
      </ScButton>
      <ScButton @click="addPlate" :icon="Plus" Border>
        {{ $t('b.tian-jia-xin-ban-kuai') }}
      </ScButton>
    </div>
  </Card>

  <Card v-if="plateList.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('b.ming-cheng') }}</th>
            <th>{{ $t('b.tie-zi-shu') }}</th>
            <th>{{ $t('f.zhuang-tai') }}</th>
            <th>{{ $t('b.cao-zuo') }}</th>
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
                <ScButton @click="updatePlate(index)" Border>
                  {{ $t('b.bian-ji') }}
                </ScButton>
                <ScButton @click="deletePlate(index)" Border>
                  {{ $t('b.jin-yong') }}
                </ScButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <EmptyState
    v-else
    :title="$t('t.zan-wu-tie-zi')"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    :action="'点击刷新'"
    :actionIcon="RotateCcw"
    @action-click="getPlateList" />

  <ScModal v-model="updateModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">{{ $t('b.bian-ji-ban-kuai') }}</div>

      <div>
        {{ $t('d.ban-kuai-ming-cheng') }}:
        <span>{{ plateList[currentPlate].name }}</span>
      </div>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput
          v-model="currentPlateBody.name"
          :placeholder="$t('d.ban-kuai-ming-cheng')"
          class="m-2" />
      </div>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.lei-xing') }} </span>
        <Dropdown
          v-model="plateBar"
          :options="plateBarOptions"
          placeholder="t('d.qing-xuan-ze-ban-kuai-lei-xing')"
          class="m-2 w-full max-w-xs" />
      </div>

      <div class="flex items-start justify-start gap-4">
        <span class="mt-2"> {{ $t('d.miao-shu') }} :</span>
        <ScInput
          v-model="currentPlateBody.description"
          :placeholder="$t('d.miao-shu')"
          class="m-2 w-4/5"
          multiline
          :resizable="false" />
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updatePlate(currentPlate)" Border>
          {{ $t('b.que-ren-xiu-gai') }}
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="addPlateModal">
    <Card class="p-6 w-2xl h-[18rem]">
      <div class="text-xl mb-4">{{ $t('b.tian-jia-ban-kuai') }}</div>
      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput
          v-model="newPlateBody.name"
          placeholder="{{ $t('d.ban-kuai-ming-cheng') }}"
          class="m-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> {{ $t('d.lei-xing') }} </span>
        <Dropdown
          v-model="plateBar"
          :options="plateBarOptions"
          :placeholder="$t('d.qing-xuan-ze-ban-kuai-lei-xing')"
          class="m-2 w-full max-w-xs" />
      </div>

      <div class="flex gap-4 justify-end h-full items-end">
        <ScButton class="px-4" @click="addPlate" Border>
          {{ $t('b.que-ren-tian-jia') }}
        </ScButton>
        <ScButton class="px-4" @click="addPlateModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="deletePlateModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">{{ $t('d.jin-yong-jiao-se') }}</div>
      <div class="text-warning mb-4">
        {{
          $t(
            'd.shan-chu-ban-kuai-hou-gai-ban-kuai-xia-suo-you-tie-zi-jiang-yi-bing-shan-chu-ban-kuai-xia-de-wen-jian-ye-wu-fa-xia-zai'
          )
        }}
      </div>
      <div class="text-error mb-4">
        {{
          $t(
            'd.shan-chu-ban-kuai-shi-bu-ke-ni-de-cao-zuo-shan-chu-hou-jiang-wu-fa-hui-fu'
          )
        }}
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="deletePlate(currentPlate)">
          {{ $t('b.que-ren-shan-chu') }}
        </ScButton>

        <ScButton class="px-4" @click="deletePlateModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RotateCcw, ArchiveX, Plus } from 'lucide-vue-next'
import Card from '@/components/common/Card.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButton from '@/components/common/ScButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { plateApi } from '@/apis'
import Dropdown from '@/components/common/ScSelector.vue'
import ScTag from '@/components/common/ScTag.vue'
import { formatTime } from '@/utils/format'
import ScModal from '@/components/common/ScModal.vue'

import type { Role } from '@/types/Role'
import type { Plate, PlateDto } from '@/types/Plate'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const plateBar = ref<number | { value: number; label: string }>(0) // 板块ID，0为全部板块
const plateBarOptions = ref([
  { label: t('b.jiao-liu-ban-kuai'), value: 1 },
  { label: t('b.wen-jian-ban-kuai'), value: 2 },
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
  const plateBarValue =
    typeof plateBar.value === 'object' ? plateBar.value.value : plateBar.value

  const data = {
    name: (newPlateBody.value.name ?? '').trim(),
    type: plateBarValue,
  }
  console.log('data', data)

  plateApi
    .createPlate(data)
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
    .plateDisabled({
      id: item.id,
      disabled: item.disabled == 1 ? 0 : 1, // 禁用板块
    })
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

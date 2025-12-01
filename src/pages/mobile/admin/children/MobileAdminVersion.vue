<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getVersionList" :icon="RotateCcw" Border>
        {{ $t('b.shua-xin-ban-ben-lie-biao') }}
      </ScButton>
      <ScButton @click="addVersion" :icon="Plus" Border>
        {{ $t('b.tian-jia-xin-ban-ben-hao') }}
      </ScButton>
    </div>
  </Card>

  <Card v-if="versionList.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('b.ming-cheng') }}</th>
            <th>{{ $t('b.hui-fu') }}</th>
            <th>{{ $t('b.ban-ben-lei-xing') }}</th>
            <th>{{ $t('b.chuang-jian-shi-jian') }}</th>
            <th>{{ $t('b.zui-hou-geng-xin-shi-jian') }}</th>
            <th>{{ $t('b.cao-zuo') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(version, index) in versionList" :key="version.id">
            <th>{{ version.id }}</th>
            <td>{{ version.name }}</td>
            <td>{{ version.version }}</td>
            <td>{{ typeMap[version.type] }}</td>
            <td>{{ version.createdAt }}</td>
            <td>{{ version.updatedAt }}</td>
            <td>
              <div class="flex items-center gap-2">
                <ScButton @click="updateVersion(index)" Border>
                  {{ $t('b.bian-ji') }}
                </ScButton>
                <ScButton @click="disabledVersion(index, 1)" Border>
                  {{ $t('b.jin-yong') }}
                </ScButton>
                <ScButton @click="deleteVersion(index)" Border>
                  {{ $t('b.shan-chu') }}
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
    :icon="ArchiveX"
    class="mt-8"
    :action="$t('b.dian-ji-shua-xin')"
    :actionIcon="RotateCcw"
    @action-click="getVersionList" />

  <ScModal v-model="updateModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('d.xiu-gai-ban-ben-hao') }}</div>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput
          v-model="currentVersionBody.name"
          :placeholder="$t('d.ban-ben-ming-cheng')"
          class="m-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> {{ $t('d.lei-xing') }} </span>
        <Dropdown
          v-model="typeBar"
          :options="typeBarOptions"
          :placeholder="$t('b.cha-jian-ban')"
          class="w-53 ml-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> {{ $t('b.ban-ben-hao') }} </span>
        <ScInput
          v-model="currentVersionBody.version"
          :placeholder="$t('b.ban-ben-hao')"
          class="m-2" />
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateVersion(currentVersion)" Border>
          {{ $t('b.ti-jiao-xiu-gai') }}
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="addVersionModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('b.tian-jia-xin-ban-ben-hao') }}</div>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput
          v-model="newVersionBody.name"
          :placeholder="$t('d.ban-ben-ming-cheng')"
          class="m-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> {{ $t('d.lei-xing') }} </span>
        <Dropdown
          v-model="typeBar"
          :options="typeBarOptions"
          :placeholder="$t('b.cha-jian-ban')"
          class="w-53 ml-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> {{ $t('b.ban-ben-hao') }} </span>
        <ScInput
          v-model="newVersionBody.version"
          :placeholder="$t('b.hui-fu')"
          class="m-2" />
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="addVersion" Border>
          {{ $t('b.que-ren-tian-jia') }}
        </ScButton>
        <ScButton class="px-4" @click="addVersionModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="deleteVersionModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('b.shan-chu-ban-ben-hao') }}</div>
      <div class="mb-4">
        {{ $t('d.mu-biao-ban-ben-hao') }}
        <span>{{ versionList[currentVersion].version }}</span>
      </div>

      <div class="text-warning mb-4">
        {{
          $t(
            'd.shan-chu-ban-ben-hou-zhi-qian-shi-yong-gai-ban-ben-de-tie-zi-jiang-bu-zai-zhan-shi-tian-jia-xin-de-zi-yuan-shi-ye-wu-fa-xuan-ze-gai-ban-ben-hao'
          )
        }}
      </div>
      <div class="text-error mb-4">
        {{ $t('d.shan-chu-cao-zuo-bu-ke-ni-qing-jin-shen-cao-zuo') }}
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="deleteVersion(currentVersion)">
          {{ $t('b.que-ren-shan-chu') }}
        </ScButton>

        <ScButton class="px-4" @click="deleteVersionModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="disabledVersionModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('d.jin-yong-ban-ben-hao') }}</div>
      <div class="text-warning mb-4">
        {{
          $t(
            'd.jin-yong-ban-ben-hou-zhi-qian-shi-yong-gai-ban-ben-de-tie-zi-zheng-chang-xian-shi-dan-wu-fa-zai-tian-jia-xin-de-zi-yuan-shi-xuan-ze-gai-ban-ben-hao'
          )
        }}
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="disabledVersion(currentVersion, 2)">
          {{ $t('b.que-ren-jin-yong') }}
        </ScButton>

        <ScButton
          class="px-4 border border-success text-success"
          @click="disabledVersion(currentVersion, 1)">
          {{ $t('b.hui-fu') }}
        </ScButton>

        <ScButton class="px-4" @click="disabledVersionModal = false" Border>
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
import { versionApi } from '@/apis'
import Dropdown from '@/components/common/ScSelector.vue'
import { formatTimeOrAgo } from '@/utils/format'
import ScModal from '@/components/common/ScModal.vue'
import type { ApiVersion, PutVersionDto, Version } from '@/types/version'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const toast = useToast()

const typeBar = ref<
  | 'plugin'
  | 'online'
  | 'original'
  | { value: 'plugin' | 'online' | 'original'; label: string }
>('plugin')
const typeBarOptions: {
  value: 'plugin' | 'online' | 'original'
  label: string
}[] = [
  { value: 'plugin', label: t('b.cha-jian-ban') },
  { value: 'online', label: t('b.lian-ji-ban') },
  { value: 'original', label: t('b.yuan-ban') },
]
const typeMap: Record<string, string> = {
  plugin: t('b.cha-jian-ban'),
  online: t('b.lian-ji-ban'),
  original: t('b.yuan-ban'),
}

const versionList = ref<Version[]>([]) // 帖子列表数据
const currentVersion = ref(-1) // 当前操作的帖子ID
const updateModal = ref(false) // 更新帖子模态框状态
const addVersionModal = ref(false) // 添加新角色模态框状态
const deleteVersionModal = ref(false) // 删除角色模态框状态
const disabledVersionModal = ref(false) // 禁用角色模态框状态

const newVersionBody = ref<PutVersionDto>({
  name: '',
  version: '',
}) // 新角色信息

const currentVersionBody = ref<Version>({
  id: -1,
  name: '',
  type: 'plugin',
  version: '',
}) // 当前操作的角色信息

const getVersionList = () => {
  versionApi
    .getVersionAsAdmin()
    .then((res) => {
      if (res.data.code === 200) {
        // 处理获取到的帖子数据
        versionList.value = res.data.data.map((item: ApiVersion) => {
          item.createdAt = formatTimeOrAgo(item.createdAt, t)
          item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
          return item
        })
      }
    })
    .catch((error) => {
      toast.error(t('t.wei-zhi-cuo-wu'))
      console.error('请求错误:', error.msg)
    })
}

const updateVersion = (index: number) => {
  const item = versionList.value[index]
  if (!updateModal.value) {
    currentVersion.value = index // 设置当前操作的帖子
    currentVersionBody.value.id = item.id
    currentVersionBody.value.name = item.name
    currentVersionBody.value.type = item.type
    currentVersionBody.value.version = item.version
    typeBar.value =
      typeof typeBar.value === 'object'
        ? typeBar.value
        : typeBarOptions.find((option) => option.value === item.type) ||
          typeBar.value
    updateModal.value = true
    return
  }
  const typeBarValue =
    typeof typeBar.value === 'object' ? typeBar.value.value : typeBar.value

  const body: PutVersionDto = {}

  if (item.name !== currentVersionBody.value.name) {
    body.name = currentVersionBody.value.name
  }

  if (item.type !== typeBarValue) {
    body.type = typeBarValue
  }

  if (item.version !== currentVersionBody.value.version) {
    body.version = currentVersionBody.value.version
  }

  // 如果没有修改任何内容，则不发送请求
  if (Object.keys(body).length === 0) {
    toast.warning(t('t.sha-ye-bu-shi-zou-le'))
    updateModal.value = false
    return
  }

  versionApi
    .putVersion(item.id, body)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getVersionList()
        toast.success(t('t.xiu-gai-cheng-gong'))
        currentVersion.value = -1 // 重置当前操作的帖子
        updateModal.value = false
      }
    })
    .catch((error) => {
      toast.error(t('t.wei-zhi-cuo-wu'))
      console.error('请求失败:', error.msg)
    })
}

const addVersion = () => {
  if (!addVersionModal.value) {
    newVersionBody.value.name = ''
    newVersionBody.value.type = 'plugin'
    newVersionBody.value.version = ''
    addVersionModal.value = true
    return
  }
  const typeBarValue =
    typeof typeBar.value === 'object' ? typeBar.value.value : typeBar.value

  if (!newVersionBody.value.name || !newVersionBody.value.version) {
    toast.warning(t('t.qing-tian-xie-wan-zheng-de-ban-ben-xin-xi'))
    return
  }
  const body = {
    name: newVersionBody.value.name,
    type: typeBarValue,
    version: newVersionBody.value.version,
  }
  versionApi
    .addVersion(body)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getVersionList()
        addVersionModal.value = false
      }
    })
    .catch((error) => {
      toast.error(t('t.wei-zhi-cuo-wu'))
      console.error('请求失败:', error.msg)
    })
}

const deleteVersion = (index: number) => {
  const item = versionList.value[index]
  if (!deleteVersionModal.value) {
    currentVersion.value = index // 设置当前操作的帖子
    deleteVersionModal.value = true
    return
  }
  versionApi
    .delVersion(item.id)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getVersionList()
        deleteVersionModal.value = false
      }
    })
    .catch((error) => {
      toast.error(t('t.wei-zhi-cuo-wu'))
      console.error('请求失败:', error.msg)
    })
}

const disabledVersion = (index: number, disabled: number) => {
  const item = versionList.value[index]
  if (!disabledVersionModal.value) {
    currentVersion.value = index // 设置当前操作的帖子
    disabledVersionModal.value = true
    return
  }
  versionApi
    .disableVersion({
      id: item.id,
      disabled,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getVersionList()
        toast.success(t('t.cao-zuo-cheng-gong'))
        disabledVersionModal.value = false
      }
    })
    .catch((error) => {
      toast.error(t('t.wei-zhi-cuo-wu'))
      console.error('请求失败:', error.msg)
    })
}

onMounted(() => {
  getVersionList() // 页面加载时获取帖子列表
})
</script>

<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getVersionList" :icon="RotateCcw" Border>
        刷新版本列表
      </ScButton>
      <ScButton @click="addVersion" :icon="Plus" Border>
        添加新版本号
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
            <th>名称</th>
            <th>版本号</th>
            <th>版本类型</th>
            <th>创建时间</th>
            <th>最后更新时间</th>
            <th>操作</th>
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
                <ScButton @click="updateVersion(index)" Border> 编辑 </ScButton>
                <ScButton @click="disabledVersion(index, 1)" Border>
                  禁用
                </ScButton>
                <ScButton @click="deleteVersion(index)" Border> 删除 </ScButton>
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
    @action-click="getVersionList" />

  <ScModal v-model="updateModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">修改版本号</div>

      <div class="flex items-center gap-4">
        <span> 名称: </span>
        <ScInput
          v-model="currentVersionBody.name"
          placeholder="版本名称"
          class="m-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> 类型: </span>
        <Dropdown
          v-model="typeBar"
          :options="typeBarOptions"
          placeholder="插件版"
          class="w-53 ml-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> 版本号: </span>
        <ScInput
          v-model="currentVersionBody.version"
          placeholder="版本号"
          class="m-2" />
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateVersion(currentVersion)" Border>
          提交修改
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="addVersionModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">添加新版本号</div>

      <div class="flex items-center gap-4">
        <span> 名称: </span>
        <ScInput
          v-model="newVersionBody.name"
          placeholder="版本名称"
          class="m-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> 类型: </span>
        <Dropdown
          v-model="typeBar"
          :options="typeBarOptions"
          placeholder="插件版"
          class="w-53 ml-2" />
      </div>
      <div class="flex items-center gap-4">
        <span> 版本号: </span>
        <ScInput
          v-model="newVersionBody.version"
          placeholder="版本号"
          class="m-2" />
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="addVersion" Border> 确认添加 </ScButton>
        <ScButton class="px-4" @click="addVersionModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="deleteVersionModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">删除版本号</div>
      <div class="mb-4">
        目标版本号: {{ versionList[currentVersion].version }}
      </div>

      <div class="text-warning mb-4">
        删除版本后，之前使用该版本的帖子将不再展示，添加新的资源时也无法选择该版本号。
      </div>
      <div class="text-error mb-4">删除操作不可逆，请谨慎操作。</div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="deleteVersion(currentVersion)">
          确认删除
        </ScButton>

        <ScButton class="px-4" @click="deleteVersionModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="disabledVersionModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">禁用版本号</div>
      <div class="text-warning mb-4">
        禁用版本后，之前使用该版本的帖子正常显示，但无法再添加新的资源时选择该版本号。
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="disabledVersion(currentVersion, 2)">
          确认禁用
        </ScButton>

        <ScButton
          class="px-4 border border-success text-success"
          @click="disabledVersion(currentVersion, 1)">
          恢复
        </ScButton>

        <ScButton class="px-4" @click="disabledVersionModal = false" Border>
          取消
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
import { formatTime } from '@/utils/format'
import ScModal from '@/components/common/ScModal.vue'
import type { ApiVersion, PutVersionDto, Version } from '@/types/version'
import { useToast } from 'vue-toastification'
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
  { value: 'plugin', label: '插件版' },
  { value: 'online', label: '联机版' },
  { value: 'original', label: '原版' },
]
const typeMap: Record<string, string> = {
  plugin: '插件版',
  online: '联机版',
  original: '原版',
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
    toast.warning('啥也不是，走了')
    updateModal.value = false
    return
  }

  versionApi
    .putVersion(item.id, body)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getVersionList()
        toast.success('修改成功')
        currentVersion.value = -1 // 重置当前操作的帖子
        updateModal.value = false
      }
    })
    .catch((error) => {
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
    toast.warning('请填写完整的版本信息')
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
        toast.success('操作成功')
        disabledVersionModal.value = false
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

onMounted(() => {
  getVersionList() // 页面加载时获取帖子列表
})
</script>

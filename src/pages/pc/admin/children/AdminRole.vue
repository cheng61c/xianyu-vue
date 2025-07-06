<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getRoleList" :icon="RotateCcw" Border>
        刷新角色列表
      </ScButton>
      <ScButton @click="addRole" :icon="Plus" Border> 添加新角色 </ScButton>
    </div>
  </Card>

  <div class="text-error" v-if="!isPlusAdmin">当前权限不足, 无法进行操作</div>

  <Card v-if="roleList.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>背景色</th>
            <th>拥有人数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(role, index) in roleList" :key="role.id">
            <th>{{ role.id }}</th>
            <td>
              <div class="flex">
                <ScTag :bgColor="role.color" size="md">
                  {{ role.name }}
                </ScTag>
              </div>
            </td>
            <td class="max-w-lg">
              {{ role.color }}
            </td>
            <td>{{ role.users.length }}</td>

            <td>
              <div class="flex">
                <ScTag
                  :status="role.status === 1 ? 'success' : 'error'"
                  size="sm">
                  {{ role.status === 1 ? '启用' : '禁用' }}
                </ScTag>
              </div>
            </td>
            <td v-if="isPlusAdmin">
              <div class="flex items-center gap-2">
                <ScButton @click="updateRole(index)" Border> 编辑 </ScButton>
                <ScButton
                  v-if="role.id > 10"
                  @click="deleteRole(index, 0)"
                  Border>
                  禁用
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
    title="暂无帖子"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    action="点击刷新"
    :actionIcon="RotateCcw"
    @action-click="getRoleList" />

  <ScModal v-model="updateModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">修改角色</div>
      <div class="flex items-center gap-4">
        <span> 名称: </span>
        <ScInput
          v-model="currentRoleBody.name"
          placeholder="角色名称"
          class="m-2" />
      </div>

      <div class="flex items-center gap-4 mb-2">
        <span> 背景颜色: </span>
        <ScTag :bgColor="currentRoleBody.color" size="md">
          {{ currentRoleBody.name }}
        </ScTag>
      </div>

      <Vue3ColorPicker
        v-model="currentRoleBody.color"
        mode="solid"
        :showColorList="false"
        :showEyeDrop="true"
        :theme="themeStore.darkTheme ? 'dark' : 'light'"
        type="RGBA" />

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateRole(currentRole)" Border>
          确认修改
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="addRoleModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">添加新角色</div>
      <div class="text-warning">新添加的角色不会有任何实际权限</div>
      <div class="flex items-center gap-4">
        <span> 名称: </span>
        <ScInput
          v-model="newRoleBody.name"
          placeholder="角色名称"
          class="m-2" />
      </div>

      <div class="flex items-center gap-4 mb-2">
        <span> 背景颜色: </span>
        <template v-if="newRoleBody.name">
          <ScTag :bgColor="newRoleBody.color" size="md">
            {{ newRoleBody.name }}
          </ScTag>
        </template>
      </div>

      <Vue3ColorPicker
        v-model="newRoleBody.color"
        mode="solid"
        :showColorList="false"
        :showEyeDrop="true"
        :theme="themeStore.darkTheme ? 'dark' : 'light'"
        type="RGBA" />

      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="addRole" Border> 确认添加 </ScButton>
        <ScButton class="px-4" @click="addRoleModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="deleteRoleModal">
    <Card class="p-6 w-2xl">
      <div class="text-xl mb-4">禁用角色</div>
      <div class="text-warning mb-4">
        禁用角色后，该角色将不再展示，不会删除该角色的相关数据，在账号管理中仍然可以看到该角色，但不能再赋予新用户。
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="deleteRole(currentRole, 0)">
          确认禁用
        </ScButton>

        <ScButton
          class="px-4 border border-success text-success"
          @click="deleteRole(currentRole, 1)">
          恢复
        </ScButton>

        <ScButton class="px-4" @click="deleteRoleModal = false" Border>
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
import { roleApi } from '@/apis'

import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'
import { verifyPermissions } from '@/hook/verify'

import ScTag from '@/components/common/ScTag.vue'
import { formatTime } from '@/hook/format'
import ScModal from '@/components/common/ScModal.vue'

import type { Role } from '@/types/Role'
import { useThemeStore } from '@/stores/global/themeStore'

const themeStore = useThemeStore() // 引入主题状态管理

const roleList = ref<Role[]>([]) // 帖子列表数据
const currentRole = ref(-1) // 当前操作的帖子ID
const updateModal = ref(false) // 更新帖子模态框状态
const addRoleModal = ref(false) // 添加新角色模态框状态
const deleteRoleModal = ref(false) // 删除角色模态框状态
const isPlusAdmin = ref(verifyPermissions([1])) // 是否为超级管理员
// const isAdmin = ref(verifyPermissions([2])) // 是否为管理员
const newRoleBody = ref({
  color: '#66ccff',
  name: '',
}) // 新角色信息

const currentRoleBody = ref({
  color: '',
  name: '',
}) // 当前操作的角色信息

const getRoleList = () => {
  roleApi
    .getRoleListAsAdmin()
    .then((res) => {
      if (res.data.code === 200) {
        // 处理获取到的帖子数据
        roleList.value = res.data.data.map((item: Role) => {
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

const updateRole = (index: number) => {
  const item = roleList.value[index]
  if (!updateModal.value) {
    currentRole.value = index // 设置当前操作的帖子
    currentRoleBody.value.color = item.color
    currentRoleBody.value.name = item.name
    updateModal.value = true
    return
  }
  roleApi
    .updateRoleAsAdmin({
      id: item.id,
      color: currentRoleBody.value.color,
      name: currentRoleBody.value.name,
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getRoleList()
        updateModal.value = false
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

const addRole = () => {
  if (!addRoleModal.value) {
    newRoleBody.value.name = ''
    addRoleModal.value = true
    return
  }
  roleApi
    .createRoleAsAdmin(newRoleBody.value)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getRoleList()
        addRoleModal.value = false
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

const deleteRole = (index: number, val: number) => {
  const item = roleList.value[index]
  if (!deleteRoleModal.value) {
    currentRole.value = index // 设置当前操作的帖子
    deleteRoleModal.value = true
    return
  }
  roleApi
    .updateRoleAsAdmin({
      id: item.id,
      status: val, // 切换状态
    })
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getRoleList()
        deleteRoleModal.value = false
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

onMounted(() => {
  getRoleList() // 页面加载时获取帖子列表
})
</script>

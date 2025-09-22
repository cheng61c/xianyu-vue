<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getRoleList(true)" :icon="RotateCcw" Border>
        {{ $t('b.shua-xin-jiao-se-lie-biao') }}
      </ScButton>
      <ScButton @click="addRole" :icon="Plus" Border>
        {{ $t('b.tian-jia-xin-jiao-se') }}
      </ScButton>
    </div>
  </Card>

  <div class="text-error" v-if="!isPlusAdmin">
    {{ $t('d.dang-qian-quan-xian-bu-zu-wu-fa-jin-hang-cao-zuo') }}
  </div>

  <Card v-if="roleList.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('b.ming-cheng') }}</th>
            <th>{{ $t('b.yong-you-ren-shu') }}</th>
            <th>{{ $t('f.zhuang-tai') }}</th>
            <th>{{ $t('b.cao-zuo') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(role, index) in roleList" :key="role.id">
            <th>{{ role.id }}</th>
            <td>
              <div class="flex w-22">
                <ScTag :bgColor="role.color" size="sm">
                  {{ role.name }}
                </ScTag>
              </div>
            </td>

            <td>{{ role.users.length }}</td>

            <td>
              <div class="flex">
                <ScTag
                  :status="role.status === 1 ? 'success' : 'error'"
                  size="sm">
                  {{ role.status === 1 ? $t('b.qi-yong') : $t('b.jin-yong') }}
                </ScTag>
              </div>
            </td>
            <td v-if="isPlusAdmin">
              <div class="flex items-center gap-2">
                <ScButton @click="updateRole(index)" Border>
                  {{ $t('b.bian-ji') }}
                </ScButton>
                <ScButton
                  v-if="role.id > 10"
                  @click="deleteRole(index, 0)"
                  Border>
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
    :action="$t('b.dian-ji-shua-xin')"
    :actionIcon="RotateCcw"
    @action-click="getRoleList(true)" />

  <ScModal v-model="updateModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('d.xiu-gai-jiao-se') }}</div>
      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput
          v-model="currentRoleBody.name"
          :placeholder="$t('d.jiao-se-ming-cheng')"
          class="m-2" />
      </div>

      <div class="flex items-center gap-4 mb-2">
        <span> {{ $t('d.bei-jing-yan-se') }} </span>
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
          {{ $t('b.que-ren-xiu-gai') }}
        </ScButton>
        <ScButton class="px-4" @click="updateModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="addRoleModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('b.tian-jia-xin-jiao-se') }}</div>
      <div class="text-warning">
        {{ $t('d.xin-tian-jia-de-jiao-se-bu-hui-you-ren-he-shi-ji-quan-xian') }}
      </div>
      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput
          v-model="newRoleBody.name"
          :placeholder="$t('d.jiao-se-ming-cheng')"
          class="m-2" />
      </div>

      <div class="flex items-center gap-4 mb-2">
        <span> {{ $t('d.bei-jing-yan-se') }} </span>
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
        <ScButton class="px-4" @click="addRole" Border>
          {{ $t('b.que-ren-tian-jia') }}
        </ScButton>
        <ScButton class="px-4" @click="addRoleModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="deleteRoleModal">
    <Card class="w-[95vw]">
      <div class="text-xl mb-4">{{ $t('d.jin-yong-jiao-se') }}</div>
      <div class="text-warning mb-4">
        {{
          $t(
            'd.jin-yong-jiao-se-hou-gai-jiao-se-jiang-bu-zai-zhan-shi-bu-hui-shan-chu-gai-jiao-se-de-xiang-guan-shu-ju-zai-zhang-hao-guan-li-zhong-reng-ran-ke-yi-kan-dao-gai-jiao-se-dan-bu-neng-zai-fu-yu-xin-yong-hu'
          )
        }}
      </div>

      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="deleteRole(currentRole, 0)">
          {{ $t('b.que-ren-jin-yong') }}
        </ScButton>

        <ScButton
          class="px-4 border border-success text-success"
          @click="deleteRole(currentRole, 1)">
          {{ $t('b.hui-fu') }}
        </ScButton>

        <ScButton class="px-4" @click="deleteRoleModal = false" Border>
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
import { roleApi } from '@/apis'

import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'
import { verifyPermissions } from '@/utils/verify'

import ScTag from '@/components/common/ScTag.vue'
import { formatTimeOrAgo } from '@/utils/format'
import ScModal from '@/components/common/ScModal.vue'

import type { Role } from '@/types/Role'
import { useThemeStore } from '@/stores/global/themeStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const themeStore = useThemeStore() // 引入主题状态管理
const toast = useToast()
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

const getRoleList = (click = false) => {
  roleApi
    .getRoleListAsAdmin()
    .then((res) => {
      if (res.data.code === 200) {
        // 处理获取到的帖子数据
        roleList.value = res.data.data.map((item: Role) => {
          item.createdAt = formatTimeOrAgo(item.createdAt, t)
          item.updatedAt = formatTimeOrAgo(item.updatedAt, t)
          return item
        })
        if (click) {
          toast.success(t('t.jiao-se-lie-biao-shua-xin-cheng-gong'))
        }
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
        toast.success(t('t.jiao-se-geng-xin-cheng-gong'))
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
      toast.error(t('t.jiao-se-geng-xin-shi-bai') + error.msg)
    })
}

const addRole = () => {
  if (!addRoleModal.value) {
    newRoleBody.value.name = ''
    addRoleModal.value = true
    return
  }
  if (!newRoleBody.value.name) {
    toast.error(t('t.jiao-se-ming-cheng-bu-neng-wei-kong'))
    return
  }
  roleApi
    .createRoleAsAdmin(newRoleBody.value)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新帖子列表
        getRoleList()
        addRoleModal.value = false
        toast.success(t('t.jiao-se-tian-jia-cheng-gong'))
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
      toast.error(t('t.jiao-se-tian-jia-shi-bai') + error.msg)
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
        toast.success(t('t.jiao-se-shan-chu-cheng-gong'))
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

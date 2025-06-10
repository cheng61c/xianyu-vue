<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <Dropdown
        v-model="searchType"
        :options="searchTypeoptions"
        placeholder="搜索 用户名"
        class="w-40" />
      <ScInput v-model="searchPostValue" placeholder="搜索" class="w-xs" />
      <ScButton class="px-4" Border @click="search"> 搜索 </ScButton>
      <ScButton class="px-4" Border @click="getUserList"> 刷新 </ScButton>
    </div>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 w-full">
        <span>状态:</span>
        <Dropdown
          v-model="searchStatus"
          :options="searchStatusOptions"
          placeholder="全部"
          class="flex-1" />
      </label>

      <label class="flex items-center gap-2 w-full">
        <span>角色:</span>
        <Dropdown
          v-model="roleBar"
          :options="roleBarOptions"
          placeholder="全部角色"
          class="flex-1" />
      </label>
    </div>
  </Card>

  <Card class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>昵称</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>注册时间</th>
            <th>最后登录时间</th>
            <th>最后登录IP</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userList" :key="user.id">
            <th>{{ user.id }}</th>
            <td>
              <div class="flex gap-2 flex-wrap max-w-xs">
                {{ user.nickname }}
                <ScTag
                  v-for="(role, roleIndex) in user.roles"
                  :key="roleIndex"
                  :bgColor="role.color"
                  size="xs">
                  {{ role.name }}
                </ScTag>
              </div>
            </td>
            <td>{{ user.account }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.regTime }}</td>
            <td>{{ user.lastLoginTime }}</td>
            <td>{{ user.lastLoginIp }}</td>
            <td>
              <div class="flex items-center gap-2 flex-wrap min-w-20">
                <ScTag v-if="user.disabled" size="xs" status="error">
                  封禁
                </ScTag>
                <ScTag v-else size="xs" status="success"> 正常 </ScTag>
              </div>
            </td>

            <td>
              <div class="flex items-center gap-2 flex-wrap">
                <ScButton
                  @click="banned(index)"
                  class="border border-error text-error">
                  封禁
                </ScButton>

                <ScButton @click="updateUser(index)" Border>
                  修改信息
                </ScButton>

                <ScButton
                  v-if="verifyPermissions([1, 2])"
                  @click="updateUserRole(index)"
                  Border>
                  设置角色
                </ScButton>

                <ScButton
                  v-if="verifyPermissions([1, 2])"
                  @click="logOff(index)"
                  Border>
                  强制下线
                </ScButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <Pagination
    v-if="userList.length"
    :current-page="userPage.page"
    :total-items="userPage.total"
    :page-size="userPage.limit"
    @page-change="toPage" />

  <EmptyState
    v-else
    title="暂无数据"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    action="点击刷新"
    :actionIcon="RotateCcw"
    @action-click="toPage" />

  <ScModal v-model="bannedModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">封禁账号</h3>
      <div>封禁原因:</div>
      <ScInput
        v-model="updateBody.remark"
        placeholder="什么也没有"
        multiline
        :rows="12"
        :resizable="false"
        class="mb-4 h-[20rem]" />
      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="banned(currentUser, 1)">
          封禁
        </ScButton>
        <ScButton class="px-4" @click="banned(currentUser, 0)" Border>
          撤销封禁
        </ScButton>
        <ScButton class="px-4" @click="bannedModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="updateModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">修改用户信息</h3>
      <div class="flex items-center gap-2">
        <span> 昵称: </span>
        <ScInput v-model="updateBody.nickname" placeholder="昵称" class="m-2" />
      </div>
      <div class="flex items-center gap-2" v-if="verifyPermissions([1, 2])">
        <span> 邮箱: </span>
        <ScInput v-model="updateBody.email" placeholder="邮箱" class="m-2" />
      </div>
      <div class="flex items-center gap-2">
        <span> 密码: </span>
        <ScInput v-model="updateBody.password" placeholder="密码" class="m-2" />
        <Info :size="18" class="text-warning" />
        <span class="text-sm text-warning"> 对自己修改密码会强制下线 </span>
      </div>
      <div class="flex items-center gap-2" v-if="verifyPermissions([1, 2])">
        <span> 用户名: </span>
        <ScInput
          v-model="updateBody.account"
          placeholder="用户名"
          class="m-2" />
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateUser(currentUser)" Border>
          提交修改
        </ScButton>

        <ScButton class="px-4" @click="updateModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="updateRoleModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">修改用户权限</h3>
      <div>角色池:</div>
      <div class="flex items-center gap-2 flex-wrap">
        <ScTag
          v-for="(role, index) in roleList"
          :key="index"
          :bgColor="role.color"
          size="sm"
          class="cursor-pointer"
          @click="addRoleItem(index)">
          {{ role.name }}
        </ScTag>
      </div>
      <div>当前存在:</div>
      <div class="flex items-center gap-2 flex-wrap">
        <ScTag
          v-for="(role, index) in userList[currentUser].roles"
          :key="index"
          :bgColor="role.color"
          size="sm"
          class="cursor-pointer"
          @click="removeRoleItem(index)">
          {{ role.name }}
        </ScTag>
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateUserRole(currentUser)" Border>
          提交修改
        </ScButton>
        <ScButton class="px-4" @click="updateRoleModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>
  <ScModal v-model="logOffModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">强制下线</h3>
      <div class="flex gap-2 flex-wrap">
        目标账号:
        {{ userList[currentUser].nickname }}
        <ScTag size="xs">uid: {{ userList[currentUser].id }}</ScTag>
        <ScTag
          v-for="(role, roleIndex) in userList[currentUser].roles"
          :key="roleIndex"
          :bgColor="role.color"
          size="xs">
          {{ role.name }}
        </ScTag>
      </div>
      <div>
        让该账号所有设备失去登录状态，可使用账号密码再次登录，即使目标是自己也不例外
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="logOff(currentUser)" Border>
          确定
        </ScButton>
        <ScButton class="px-4" @click="logOffModal = false" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RotateCcw, ArchiveX } from 'lucide-vue-next'
import Dropdown from '@/components/ScSelector.vue'
import Card from '@/components/Card.vue'
import ScInput from '@/components/ScInput.vue'
import ScButton from '@/components/ScButton.vue'
import EmptyState from '@/components/EmptyState.vue'
import { roleApi, userApi } from '@/apis'
import { Info } from 'lucide-vue-next'
import Pagination from '@/components/Pagination.vue'

import ScTag from '@/components/ScTag.vue'
import { formatTime } from '@/hook/format'
import ScModal from '@/components/ScModal.vue'
import type { UpdateUserAsAdminDto, UserSelectDto, UserType } from '@/types'
import { verifyPermissions } from '@/hook/verify'
import type { Role, UserRole } from '@/types/Role'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
const toast = useToast()
const userStore = useUserStore()
const router = useRouter()

const searchPostValue = ref('') // 搜索帖子内容

const searchStatus = ref<number | { value: number; label: string }>(0) // 账号状态
const searchStatusOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '正常' },
  { value: 2, label: '禁用' },
]

const searchType = ref<number | { value: number; label: string }>(0) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: '搜索 用户名' },
  { value: 1, label: '搜索 昵称' },
  { value: 2, label: '搜索 上次登录ip' },
  { value: 3, label: '搜索 邮箱' },
  { value: 4, label: '搜索 ID' },
  { value: 5, label: '搜索 备注' },
]

const roleBar = ref<number | { value: number; label: string }>(0) // 角色ID，0为全部角色
const roleBarOptions = ref([{ value: 0, label: '全部角色' }]) // 角色下拉选项

// const timeRange = ref({
//   startTime: '',
//   endTime: '',
// }) // 时间范围选择

const userPage = ref({
  page: 1,
  total: 0,
  limit: 3,
})

const userList = ref<UserType[]>([]) // 帖子列表数据
const bannedModal = ref(false) // 封禁帖子模态框状态
const currentUser = ref(-1) // 当前操作的帖子ID
const updateModal = ref(false) // 更新用户信息模态框状态
const updateRoleModal = ref(false) // 更新用户角色模态框状态
const roleList = ref<Role[]>([]) // 角色列表数据
const logOffModal = ref(false) // 强制下线模态框状态

const updateBody = ref({
  id: 0,
  nickname: '',
  email: '',
  remark: '',
  password: '', // 密码
  account: '', // 账号
  roles: [] as UserRole[], // 角色ID数组
})

const toPage = (page: number) => {
  userPage.value.page = page
  getUserList()
}

const search = () => {
  userPage.value.page = 1 // 重置页码
  getUserList() // 重新获取列表
}

const addRoleItem = (index: number) => {
  const role = roleList.value[index] // 获取角色列表中的角色
  if (updateBody.value.roles.some((r) => r.id === role.id)) {
    return // 如果角色已存在，则不添加
  }
  updateBody.value.roles.push(role) // 将角色添加到角色数组中
}

const removeRoleItem = (index: number) => {
  updateBody.value.roles.splice(index, 1) // 从角色数组中移除角色
}

const getUserList = () => {
  const query: UserSelectDto = {
    page: userPage.value.page,
    limit: userPage.value.limit,
  }

  let roleBarValue =
    typeof roleBar.value === 'object' ? roleBar.value.value : roleBar.value
  let searchStatusValue =
    typeof searchStatus.value === 'object'
      ? searchStatus.value.value
      : searchStatus.value
  let searchTypeValue =
    typeof searchType.value === 'object'
      ? searchType.value.value
      : searchType.value

  if (searchStatusValue !== 0) {
    query.disabled = searchStatusValue
  }
  if (roleBarValue !== 0) {
    query.roleId = roleBarValue
  }

  switch (searchTypeValue) {
    case 0:
      query.account = searchPostValue.value // 搜索用户名
      break
    case 1:
      query.nickname = searchPostValue.value // 搜索昵称
      break
    case 2:
      query.lastLoginIp = searchPostValue.value // 搜索上次登录IP
      break
    case 3:
      query.email = searchPostValue.value // 搜索邮箱
      break
    case 4:
      query.id = Number(searchPostValue.value) // 搜索ID
      break
    case 5:
      query.remark = searchPostValue.value // 搜索备注
      break
    default:
      break
  }

  // 获取用户列表
  userApi
    .getUserListAsAdmin(query)
    .then((response) => {
      if (response.data.code === 200) {
        userList.value = response.data.data.list.map((user: UserType) => ({
          ...user,
          regTime: formatTime(user.regTime),
          lastLoginTime: formatTime(user.lastLoginTime),
        }))
        userPage.value.total = response.data.data.total
        userPage.value.page = response.data.data.page
        userPage.value.limit = response.data.data.limit
      }
    })
    .catch((error) => {
      console.error('获取板块列表失败:', error.msg)
    })
}

const getRoleList = () => {
  // 获取角色列表
  roleApi
    .getRoleList()
    .then((response) => {
      if (response.data.code === 200) {
        roleList.value = response.data.data // 更新角色列表
        roleBarOptions.value = [
          { value: 0, label: '全部角色' },
          ...response.data.data.map((role: any) => ({
            value: role.id,
            label: role.name,
          })),
        ]
      }
    })
    .catch((error) => {
      console.error('获取角色列表失败:', error.msg)
    })
}

const banned = (index: number, val?: number) => {
  const item = userList.value[index]
  if (!bannedModal.value) {
    currentUser.value = index // 设置当前操作的帖子
    updateBody.value.remark = item.remark || '' // 设置当前帖子备注内容
    bannedModal.value = true
    return
  }
  userApi
    .updateUserAsAdmin({
      id: item.id,
      disabled: val, // 封禁状态
      remark: updateBody.value.remark, // 备注内容
    })
    .then((response) => {
      if (response.data.code === 200) {
        userApi
          .updateUserKey(item.id)
          .then(() => {
            toast.success('操作成功')
            getUserList()
            bannedModal.value = false
          })
          .catch((error) => {
            toast.error('更新用户信息失败: ' + error.msg)
          })
      }
    })
    .catch((error) => {
      console.error('请求失败:', error.msg)
    })
}

const updateUser = (index: number) => {
  const item = userList.value[index]
  if (!updateModal.value) {
    currentUser.value = index // 设置当前操作的用户
    updateModal.value = true
    return
  }
  const body = {} as UpdateUserAsAdminDto
  // 将updateBody中值不为空或空字符串的属性添加到body中
  if (updateBody.value.nickname.trim() !== '') {
    body.nickname = updateBody.value.nickname
  }
  if (updateBody.value.email.trim() !== '') {
    body.email = updateBody.value.email
  }
  if (updateBody.value.password.trim() !== '') {
    body.password = updateBody.value.password
  }
  if (updateBody.value.account.trim() !== '') {
    body.account = updateBody.value.account
  }
  body.id = item.id // 设置用户ID

  if (Object.keys(body).length === 1) {
    toast.warning('啥也不是，走了')
    updateModal.value = false
    return
  }

  userApi
    .updateUserAsAdmin(body)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新用户列表
        getUserList()

        updateModal.value = false
        toast.success('更新用户信息成功')
        if (item.id === userStore.userInfo.id) {
          // 如果更新的是当前登录用户的信息，重新获取用户信息
          getInfo()
        } else {
          userApi.updateUserKey(item.id)
        }
      }
    })
    .catch((error) => {
      toast.error('更新用户信息失败: ' + error.msg)
      console.error('更新用户信息失败:', error.msg)
    })
}

const updateUserRole = (index: number) => {
  const item = userList.value[index]
  if (!updateRoleModal.value) {
    currentUser.value = index // 设置当前操作的用户
    updateBody.value.id = item.id // 设置用户ID
    updateBody.value.roles = item.roles // 设置当前用户角色
    updateRoleModal.value = true
    return
  }
  let updateData = {
    id: item.id,
    roleIds: updateBody.value.roles.map((role) => role.id), // 角色ID数组
  }
  userApi
    .updateRoles(updateData)
    .then((response) => {
      if (response.data.code === 200) {
        // 刷新用户列表
        getUserList()
        updateRoleModal.value = false
      }
    })
    .catch((error) => {
      toast.error('更新角色失败:  ' + error.msg)
      console.error('请求失败:', error.msg)
    })
}

const logOff = (index: number) => {
  const item = userList.value[index]
  if (!logOffModal.value) {
    currentUser.value = index // 设置当前操作的用户
    logOffModal.value = true
    return
  }
  userApi
    .updateUserKey(item.id)
    .then(() => {
      toast.success('操作成功')
      getUserList()
      getInfo()
      bannedModal.value = false
    })
    .catch((error) => {
      toast.error('更新用户信息失败: ' + error.msg)
    })
}

const getInfo = () => {
  // 获取用户信息
  userApi.getCurrentUser().catch((error) => {
    userStore.token = '' // 清除token
    userStore.userInfo = {} as UserType // 清除用户信息
    router.replace({ path: '/' })
    toast.error('获取用户信息失败: ' + error.msg)
  })
}

onMounted(() => {
  userPage.value.page = 1 // 初始化页码
  userPage.value.limit = 10 // 初始化每页条数
  getUserList() // 页面加载时获取用户列表
  getRoleList() // 页面加载时获取角色列表
})
</script>

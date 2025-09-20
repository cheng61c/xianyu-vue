<template>
  <Card class="mb-4">
    <div class="flex gap-4">
      <Dropdown
        v-model="searchType"
        :options="searchTypeoptions"
        :placeholder="$t('b.sou-suo-yong-hu-ming')"
        class="w-40" />
      <ScInput
        v-model="searchPostValue"
        :placeholder="$t('b.sou-suo')"
        class="w-xs" />
      <ScButton class="px-4" Border @click="search">
        {{ $t('b.sou-suo') }}
      </ScButton>
      <ScButton class="px-4" Border @click="getUserList">
        {{ $t('b.shua-xin') }}
      </ScButton>
    </div>
    <div class="flex gap-4">
      <label class="flex items-center gap-2 w-full">
        <span>{{ $t('b.zhuang-tai') }}</span>
        <Dropdown
          v-model="searchStatus"
          :options="searchStatusOptions"
          :placeholder="$t('b.quan-bu')"
          class="flex-1" />
      </label>

      <label class="flex items-center gap-2 w-full">
        <span>{{ $t('b.jiao-se') }}</span>
        <Dropdown
          v-model="roleBar"
          :options="roleBarOptions"
          :placeholder="$t('b.quan-bu-jiao-se')"
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
            <th>{{ $t('f.ni-cheng') }}</th>
            <th>{{ $t('f.yong-hu-ming') }}</th>
            <th>{{ $t('f.you-xiang') }}</th>
            <th>{{ $t('f.zhu-ce-shi-jian') }}</th>
            <th>{{ $t('f.zui-hou-deng-lu-shi-jian') }}</th>
            <th>{{ $t('f.zui-hou-deng-lu-ip') }}</th>
            <th>{{ $t('f.zhuang-tai') }}</th>
            <th>{{ $t('f.cao-zuo') }}</th>
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
                  {{ $t('b.feng-jin') }}
                </ScTag>
                <ScTag v-else size="xs" status="success">
                  {{ $t('b.zheng-chang') }}
                </ScTag>
              </div>
            </td>

            <td>
              <div class="flex items-center gap-2 flex-wrap">
                <ScButton
                  @click="banned(index)"
                  class="border border-error text-error">
                  {{ $t('b.feng-jin') }}
                </ScButton>

                <ScButton @click="updateUser(index)" Border>
                  {{ $t('b.xiu-gai-xin-xi') }}
                </ScButton>

                <ScButton
                  v-if="verifyPermissions([1, 2])"
                  @click="updateUserRole(index)"
                  Border>
                  {{ $t('b.she-zhi-jiao-se') }}
                </ScButton>

                <ScButton
                  v-if="verifyPermissions([1, 2])"
                  @click="logOff(index)"
                  Border>
                  {{ $t('b.qiang-zhi-xia-xian') }}
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
    :title="$t('d.zan-wu-shu-ju')"
    iconSize="64"
    iconColor="#ccc"
    :icon="ArchiveX"
    class="mt-8"
    :action="$t('b.dian-ji-shua-xin')"
    :actionIcon="RotateCcw"
    @action-click="toPage" />

  <ScModal v-model="bannedModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">{{ $t('f.feng-jin-zhang-hao') }}</h3>
      <div>{{ $t('f.feng-jin-yuan-yin') }}</div>
      <ScInput
        v-model="updateBody.remark"
        :placeholder="$t('d.shi-mo-ye-mei-you')"
        multiline
        :rows="12"
        :resizable="false"
        class="mb-4 h-[20rem]" />
      <div class="flex gap-4 justify-end">
        <ScButton
          class="px-4 border border-error text-error"
          @click="banned(currentUser, 1)">
          {{ $t('b.feng-jin') }}
        </ScButton>
        <ScButton class="px-4" @click="banned(currentUser, 0)" Border>
          {{ $t('d.che-xiao-feng-jin') }}
        </ScButton>
        <ScButton class="px-4" @click="bannedModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="updateModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">{{ $t('f.xiu-gai-yong-hu-xin-xi') }}</h3>
      <div class="flex items-center gap-2">
        <span> {{ $t('f.ni-cheng') }} </span>
        <ScInput
          v-model="updateBody.nickname"
          :placeholder="$t('f.ni-cheng')"
          class="m-2" />
      </div>
      <div class="flex items-center gap-2" v-if="verifyPermissions([1, 2])">
        <span> {{ $t('f.you-xiang') }} </span>
        <ScInput
          v-model="updateBody.email"
          :placeholder="$t('f.you-xiang')"
          class="m-2" />
      </div>
      <div class="flex items-center gap-2">
        <span> {{ $t('f.mi-ma') }} </span>
        <ScInput
          v-model="updateBody.password"
          :placeholder="$t('f.mi-ma')"
          class="m-2" />
        <Info :size="18" class="text-warning" />
        <span class="text-sm text-warning">
          {{ $t('d.dui-zi-ji-xiu-gai-mi-ma-hui-qiang-zhi-xia-xian') }}
        </span>
      </div>
      <div class="flex items-center gap-2" v-if="verifyPermissions([1, 2])">
        <span> {{ $t('f.yong-hu-ming') }} </span>
        <ScInput
          v-model="updateBody.account"
          :placeholder="$t('f.yong-hu-ming')"
          class="m-2" />
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateUser(currentUser)" Border>
          {{ $t('b.ti-jiao-xiu-gai') }}
        </ScButton>

        <ScButton class="px-4" @click="updateModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="updateRoleModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">{{ $t('d.xiu-gai-yong-hu-quan-xian') }}</h3>
      <div class="text-warning">
        {{ $t('d.dian-ji-biao-qian-tian-jia-huo-yi-chu') }}
      </div>
      <div>{{ $t('d.jiao-se-chi') }}</div>
      <div
        class="flex items-center gap-2 flex-wrap border border-gray p-2 rounded-lg">
        <ScTag
          v-for="(role, index) in roleList"
          :key="index"
          :bgColor="role.color"
          size="md"
          class="cursor-pointer"
          @click="addRoleItem(index)">
          {{ role.name }}
        </ScTag>
      </div>
      <div>{{ $t('d.dang-qian-cun-zai') }}</div>
      <div
        class="flex items-center gap-2 flex-wrap border border-gray p-2 rounded-lg">
        <ScTag
          v-for="(role, index) in userList[currentUser].roles"
          :key="index"
          :bgColor="role.color"
          size="sm"
          class="cursor-pointer"
          @click="removeRoleItem(index)">
          {{ role.name }}
        </ScTag>
        <span
          v-if="!userList[currentUser].roles.length"
          class="text-sm text-error">
          {{ $t('other.null') }}
        </span>
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="updateUserRole(currentUser)" Border>
          {{ $t('b.ti-jiao-xiu-gai') }}
        </ScButton>
        <ScButton class="px-4" @click="updateRoleModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
  <ScModal v-model="logOffModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">{{ $t('b.qiang-zhi-xia-xian') }}</h3>
      <div class="flex gap-2 flex-wrap items-center">
        {{ $t('d.mu-biao-zhang-hao') }}
        <span>{{ userList[currentUser].nickname }}</span>
        <ScTag size="xs" status="info">
          uid: {{ userList[currentUser].id }}
        </ScTag>
        <ScTag
          v-for="(role, roleIndex) in userList[currentUser].roles"
          :key="roleIndex"
          :bgColor="role.color"
          size="xs">
          {{ role.name }}
        </ScTag>
      </div>
      <div>
        {{
          $t(
            'd.rang-gai-zhang-hao-suo-you-she-bei-shi-qu-deng-lu-zhuang-tai-ke-shi-yong-zhang-hao-mi-ma-zai-ci-deng-lu-ji-shi-mu-biao-shi-zi-ji-ye-bu-li-wai'
          )
        }}
      </div>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="logOff(currentUser)" Border>
          {{ $t('b.que-ding') }}
        </ScButton>
        <ScButton class="px-4" @click="logOffModal = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RotateCcw, ArchiveX } from 'lucide-vue-next'
import Dropdown from '@/components/common/ScSelector.vue'
import Card from '@/components/common/Card.vue'
import ScInput from '@/components/common/ScInput.vue'
import ScButton from '@/components/common/ScButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { roleApi, userApi } from '@/apis'
import { Info } from 'lucide-vue-next'
import Pagination from '@/components/common/Pagination.vue'

import ScTag from '@/components/common/ScTag.vue'
import { formatTime } from '@/utils/format'
import ScModal from '@/components/common/ScModal.vue'
import type { UpdateUserAsAdminDto, UserSelectDto, UserType } from '@/types'
import { verifyPermissions } from '@/utils/verify'
import type { Role, UserRole } from '@/types/Role'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/module/user/userStore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()
const userStore = useUserStore()
const router = useRouter()

const searchPostValue = ref('') // 搜索帖子内容

const searchStatus = ref<number | { value: number; label: string }>(0) // 账号状态
const searchStatusOptions = [
  { value: 0, label: t('b.quan-bu') },
  { value: 1, label: t('b.zheng-chang') },
  { value: 2, label: t('b.jin-yong') },
]

const searchType = ref<number | { value: number; label: string }>(0) // 搜索类型
const searchTypeoptions = [
  { value: 0, label: t('b.sou-suo-yong-hu-ming') },
  { value: 1, label: t('b.sou-suo-ni-cheng') },
  { value: 2, label: t('b.sou-suo-shang-ci-deng-lu-ip') },
  { value: 3, label: t('b.sou-suo-you-xiang') },
  { value: 4, label: t('b.sou-suo-id') },
  { value: 5, label: t('b.sou-suo-bei-zhu') },
]

const roleBar = ref<number | { value: number; label: string }>(0) // 角色ID，0为全部角色
const roleBarOptions = ref([{ value: 0, label: t('b.quan-bu-jiao-se') }]) // 角色下拉选项

// const timeRange = ref({
//   startTime: '',
//   endTime: '',
// }) // 时间范围选择

const userPage = ref({
  page: 1,
  total: 0,
  limit: 10,
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

  if (searchPostValue.value && searchTypeValue == 0)
    query.account = searchPostValue.value // 搜索用户名

  if (searchPostValue.value && searchTypeValue == 1)
    query.nickname = searchPostValue.value // 搜索昵称

  if (searchPostValue.value && searchTypeValue == 2)
    query.lastLoginIp = searchPostValue.value // 搜索上次登录IP

  if (searchPostValue.value && searchTypeValue == 3)
    query.email = searchPostValue.value // 搜索邮箱

  if (searchPostValue.value && searchTypeValue == 4)
    query.id = Number(searchPostValue.value) // 搜索ID

  if (searchPostValue.value && searchTypeValue == 5)
    query.remark = searchPostValue.value // 搜索备注

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
          { value: 0, label: t('b.quan-bu-jiao-se') },
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
    .userDisabledAsAdmin({
      userId: item.id,
      disabled: val, // 封禁状态
    })
    .then(async (response) => {
      if (response.data.code === 200) {
        try {
          await userApi.updateUserAsAdmin({
            id: item.id,
            remark: updateBody.value.remark, // 备注内容
          })
          if (verifyPermissions([1, 2])) {
            await userApi.updateUserKeyAsAdmin(item.id)
          }
          toast.success(t('t.cao-zuo-cheng-gong'))
        } catch (error) {
          console.error('更新用户key失败:', error)
        }
        getUserList()
        bannedModal.value = false
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
    toast.warning(t('t.sha-ye-bu-shi-zou-le'))
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
        toast.success(t('t.geng-xin-yong-hu-xin-xi-cheng-gong'))
        if (item.id === userStore.userInfo.id) {
          // 如果更新的是当前登录用户的信息，重新获取用户信息
          getInfo()
        } else {
          userApi.updateUserKeyAsAdmin(item.id)
        }
      }
    })
    .catch((error) => {
      toast.error(t('t.geng-xin-yong-hu-xin-xi-shi-bai') + error.msg)
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
      toast.error(t('t.geng-xin-jiao-se-shi-bai') + error.msg)
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
    .updateUserKeyAsAdmin(item.id)
    .then(() => {
      toast.success(t('t.cao-zuo-cheng-gong'))
      getUserList()
      getInfo()
      bannedModal.value = false
    })
    .catch((error) => {
      toast.error(t('t.geng-xin-yong-hu-xin-xi-shi-bai') + error.msg)
    })
}

const getInfo = () => {
  // 获取用户信息
  userApi.getCurrentUser().catch((error) => {
    userStore.token = '' // 清除token
    userStore.userInfo = {} as UserType // 清除用户信息
    userStore.isLogin = false // 设置登录状态为false
    router.replace({ path: '/' })
    toast.error(t('t.huo-qu-yong-hu-xin-xi-shi-bai') + error.msg)
  })
}

onMounted(() => {
  userPage.value.page = 1 // 初始化页码
  userPage.value.limit = 10 // 初始化每页条数
  getUserList() // 页面加载时获取用户列表
  getRoleList() // 页面加载时获取角色列表
})
</script>

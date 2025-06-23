<template>
  <Card class="mb-4">
    <h1 class="text-lg font-bold">管理注册通道</h1>
  </Card>
  <Card class="mb-4">
    <div class="flex gap-4 items-center">
      <span>昵称</span>
      <ScInput v-model="form.nickname" placeholder="请输入昵称" type="text" />
    </div>
    <div class="flex gap-4 items-center">
      <span>账号</span>
      <ScInput v-model="form.account" placeholder="请输入账号" type="text" />
    </div>
    <div class="flex gap-4 items-center">
      <span>邮箱</span>
      <ScInput v-model="form.email" placeholder="请输入邮箱" type="email" />
      <span class="text-gray"> 邮箱不限制格式 </span>
    </div>
    <div class="flex gap-4 items-center">
      <span>密码</span>
      <ScInput
        v-model="form.password"
        placeholder="请输入密码"
        type="password" />
    </div>
    <div class="flex gap-4 items-center">
      <ScButton Border @click="register"> 提交注册 </ScButton>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { userApi } from '@/apis'
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import ScInput from '@/components/common/ScInput.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const form = ref({
  account: '',
  nickname: '机器人',
  password: '',
  email: '',
})

const register = () => {
  if (
    !form.value.account ||
    !form.value.password ||
    !form.value.email ||
    !form.value.nickname
  ) {
    toast.error('请填写完整信息')
    return
  }
  userApi
    .registerAsAdmin(form.value)
    .then((res) => {
      if (res.data.code === 200) {
        toast.success('注册成功')
        form.value = {
          account: '',
          nickname: '',
          password: '',
          email: '',
        }
      }
    })
    .catch((error) => {
      console.error(error)
      toast.error('注册失败: ' + error.msg + error.duplicates || '未知错误')
    })
}
</script>

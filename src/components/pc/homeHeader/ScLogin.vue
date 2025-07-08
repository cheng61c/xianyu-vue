<template>
  <!-- Open the modal using ID.showModal() method -->
  <div
    v-if="!userStore.isLogin"
    class="flex gap-4 items-center justify-between">
    <ScButton noPadding @click="handleModalChange('login')">{{
      $t('login')
    }}</ScButton>
    <ScButton noPadding @click="handleModalChange('register')">{{
      $t('register')
    }}</ScButton>
  </div>
  <div v-else>
    <ScUserCard />
  </div>
  <ScModal v-model="showModal">
    <Card noPg class="max-w-[48rem] h-[36rem]">
      <div class="flex h-full">
        <div class="flex-1">
          <img
            src="/public/85120626_p0_master1200.jpg"
            alt="头图"
            class="w-full h-full object-cover rounded-lg" />
        </div>

        <div class="flex items-center justify-center">
          <!-- 登录 -->
          <div
            v-if="modalType === 'login'"
            class="px-4 py-8 mx-4 flex-1 flex flex-col justify-center gap-4 w-[22rem]">
            <div class="flex justify-between items-end">
              <h3 class="text-2xl font-bold">登录</h3>
              <div class="label">
                <span> 还没有账号？ </span>
                <span
                  class="text-active cursor-pointer"
                  @click="handleModalChange('register')">
                  去注册
                </span>
              </div>
            </div>

            <form class="flex flex-col" @submit.prevent="handleLogin">
              <div class="w-full mb-4">
                <label class="label py-1">账号</label>
                <ScInput
                  type="text"
                  placeholder="邮箱或用户名"
                  v-model="loginForm.account" />
              </div>

              <div class="w-full mb-6">
                <label class="label py-1">密码</label>
                <ScInput
                  type="password"
                  placeholder="密码"
                  v-model="loginForm.password" />
              </div>

              <div class="w-full mb-4 flex justify-between items-center">
                <label class="label cursor-pointer">
                  <span class="label-text">记住我</span>
                  <input
                    type="checkbox"
                    class="checkbox"
                    checked
                    v-model="note" />
                </label>
                <label
                  class="label cursor-pointer"
                  @click="handleModalChange('reset_password')">
                  <span class="label-text text-active">忘记密码？</span>
                </label>
              </div>
            </form>

            <div class="modal-action mt-2">
              <ScButton Border class="px-4" @click="offModal">取消</ScButton>

              <ScButton
                Border
                activation
                class="px-4"
                :loading="buttonLoading"
                @click="handleLogin">
                {{ $t('login') }}
              </ScButton>
            </div>
          </div>

          <!-- 注册 -->
          <div
            v-if="modalType === 'register'"
            class="px-4 py-8 mx-4 flex-1 flex flex-col justify-center gap-4 w-[22rem]">
            <div class="flex justify-between items-end">
              <h3 class="text-2xl font-bold">注册</h3>
              <div class="label">
                <span> 已经有账号？ </span>
                <span
                  class="text-active cursor-pointer"
                  @click="handleModalChange('login')">
                  返回登录
                </span>
              </div>
            </div>

            <form class="flex flex-col" @submit.prevent="handleRregister">
              <div class="w-full mb-4">
                <label class="label py-1">用户名</label>
                <ScInput
                  type="text"
                  placeholder="邮箱或用户名"
                  v-model="registerForm.account" />
              </div>

              <div class="w-full mb-4">
                <label class="label py-1">邮箱</label>
                <ScInput
                  type="email"
                  placeholder="邮箱"
                  v-model="registerForm.email" />
              </div>

              <div class="w-full mb-6">
                <label class="label py-1">密码</label>
                <ScInput
                  type="password"
                  placeholder="密码"
                  v-model="registerForm.password" />
              </div>

              <div class="w-full mb-6">
                <label class="label py-1">验证码</label>
                <div class="flex gap-2 items-center">
                  <ScInput
                    type="text"
                    placeholder="请输入验证码"
                    v-model="registerForm.captcha" />

                  <ScButton
                    Border
                    class="w-44"
                    :disabled="isSendCode"
                    @click="getCaptcha(registerForm.email)"
                    type="button">
                    {{ sendCodeText }}
                  </ScButton>
                </div>
              </div>
            </form>

            <div class="modal-action mt-2">
              <!-- if there is a button in form, it will close the modal -->
              <ScButton Border class="px-4" @click="offModal">取消</ScButton>

              <ScButton
                Border
                activation
                class="px-4"
                :loading="buttonLoading"
                @click="handleRregister">
                {{ $t('register') }}
              </ScButton>
            </div>
          </div>

          <!-- 忘记密码 -->
          <div
            v-if="modalType === 'reset_password'"
            class="px-4 py-8 mx-4 flex-1 flex flex-col justify-center gap-4 w-[22rem]">
            <div class="flex justify-between items-end">
              <h3 class="text-2xl font-bold">重置密码</h3>
              <div class="label">
                <span> 想起来了？ </span>
                <span
                  class="text-active cursor-pointer"
                  @click="handleModalChange('login')">
                  返回登录
                </span>
              </div>
            </div>

            <form class="flex flex-col" @submit.prevent="handleRregister">
              <div class="w-full mb-4">
                <label class="label py-1">邮箱</label>
                <ScInput
                  type="email"
                  placeholder="邮箱"
                  v-model="resetPasswordForm.email" />
              </div>

              <div class="w-full mb-6">
                <label class="label py-1">新密码</label>
                <ScInput
                  type="password"
                  placeholder="密码"
                  v-model="resetPasswordForm.password" />
              </div>

              <div class="w-full mb-6">
                <label class="label py-1">验证码</label>
                <div class="flex gap-2 items-center">
                  <ScInput
                    type="text"
                    placeholder="请输入验证码"
                    v-model="resetPasswordForm.captcha" />

                  <ScButton
                    Border
                    class="w-44 py-2"
                    :disabled="isSendCode"
                    @click="getCaptcha(resetPasswordForm.email)"
                    type="button">
                    {{ sendCodeText }}
                  </ScButton>
                </div>
              </div>
            </form>

            <div class="modal-action mt-2">
              <!-- if there is a button in form, it will close the modal -->
              <ScButton Border class="px-4" @click="offModal">取消</ScButton>

              <ScButton
                Border
                activation
                class="px-4"
                :loading="buttonLoading"
                @click="handleReset">
                确认重置
              </ScButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import ScButton from '@/components/common/ScButton.vue'
import Card from '@/components/common/Card.vue'
import { userApi } from '@/apis'
import type { Api, UserType } from '@/types'
import { useUserStore } from '@/stores/module/user/userStore'
import { useToast } from 'vue-toastification'
import ScUserCard from './ScUserCard.vue'
import ScModal from '@/components/common/ScModal.vue'
import ScInput from '@/components/common/ScInput.vue'
import { formatLink } from '@/utils/format'

const showModal = ref(false)
const buttonLoading = ref(false)
const isSendCode = ref(false)
const sendCodeText = ref('获取验证码')
const note = ref(false)

const toast = useToast()

const userStore = useUserStore()

const loginForm = reactive({
  account: '',
  password: '',
})

const registerForm = reactive({
  account: '',
  email: '',
  password: '',
  captcha: '',
  nickname: '',
})

const resetPasswordForm = reactive({
  email: '',
  password: '',
  captcha: '',
})

// 计时x秒
const countdown = (duration: number) => {
  let timer: ReturnType<typeof setInterval>
  let timeLeft = duration

  const updateText = () => {
    if (timeLeft > 0) {
      sendCodeText.value = `${timeLeft}秒后重发`
      timeLeft--
    } else {
      clearInterval(timer)
      sendCodeText.value = '获取验证码'
      isSendCode.value = false
    }
  }

  timer = setInterval(updateText, 1000)
}

const modalType = ref('login') // 'login' or 'register' or 'reset_password'
const handleModalChange = (type: string) => {
  modalType.value = type
  showModal.value = true
}

const getCaptcha = (email: string) => {
  isSendCode.value = true
  countdown(30)
  userApi
    .sendCode({ email })
    .then((res: Api) => {
      if (res.data.code === 200) {
        toast.success('验证码已发送到您的邮箱')
      } else {
        toast.error('获取验证码失败: ' + res.data.msg)
      }
    })
    .catch((error) => {
      // 处理获取验证码错误
      toast.error(error.msg)
    })
}

const handleLogin = () => {
  buttonLoading.value = true
  userApi
    .login(loginForm)
    .then((res: Api) => {
      if (res.data.code === 200) {
        const user = res.data.data.user as UserType
        user.headImg = formatLink(user.headImg)
        userStore.userInfo = user
        userStore.token = res.data.data.token

        toast.success('登录成功')
        offModal()
        buttonLoading.value = false

        userStore.account = loginForm.account
        userStore.password = loginForm.password
        userStore.autoLogin = note.value
        userStore.isLogin = true
      }
    })
    .catch((error) => {
      // 处理登录错误
      toast.error(error.msg)
      buttonLoading.value = false
      userStore.account = ''
      userStore.password = ''
      userStore.userInfo = {} as UserType
      userStore.isLogin = false
    })
}

const handleRregister = () => {
  if (registerForm.password.length < 6 || registerForm.password.length > 20) {
    toast.error('密码长度为6-20个字符')
    return
  }
  if (
    registerForm.captcha.length !== 6 ||
    !/^\d+$/.test(registerForm.captcha)
  ) {
    toast.error('验证码为6位数字')
    return
  }
  if (registerForm.account.length < 3 || registerForm.account.length > 20) {
    toast.error('用户名长度为3-20个字符')
    return
  }
  if (!/^[a-zA-Z0-9_]+$/.test(registerForm.account)) {
    toast.error('用户名只能是字母、数字或下划线')
    return
  }

  userApi
    .register(registerForm)
    .then((res: Api) => {
      if (res.data.code === 200) {
        toast.success('注册成功')
        modalType.value = 'login'
        loginForm.account = registerForm.account
        loginForm.password = registerForm.password
        buttonLoading.value = false
      }
    })
    .catch((error) => {
      console.log(error)

      // 处理注册错误
      toast.error(error.msg)
      buttonLoading.value = false
    })
}

const handleReset = () => {
  if (
    resetPasswordForm.password.length < 6 ||
    resetPasswordForm.password.length > 20
  ) {
    toast.error('密码长度为6-20个字符')
    return
  }
  if (
    resetPasswordForm.captcha.length !== 6 ||
    !/^\d+$/.test(resetPasswordForm.captcha)
  ) {
    toast.error('验证码为6位数字')
    return
  }

  userApi
    .updatePassword(resetPasswordForm)
    .then((res: Api) => {
      if (res.data.code === 200) {
        toast.success('密码重置成功')
        modalType.value = 'login'
        buttonLoading.value = false
      }
    })
    .catch((error) => {
      console.log(error)

      // 处理重置密码错误
      toast.error(error.msg)
      buttonLoading.value = false
    })
}

const offModal = () => {
  showModal.value = false
}

onMounted(() => {
  // 监听键盘esc键，关闭弹窗
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      offModal()
    }
  })
})
</script>

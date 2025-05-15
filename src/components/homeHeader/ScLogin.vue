<template>
  <!-- Open the modal using ID.showModal() method -->
  <div
    v-if="userStore.token == ''"
    class="flex gap-4 items-center justify-between"
  >
    <ScButton
      noPadding
      onclick="modal_login.showModal()"
      @click="handleModalChange('login')"
      >{{ $t('login') }}</ScButton
    >
    <ScButton
      noPadding
      onclick="modal_login.showModal()"
      @click="handleModalChange('register')"
      >{{ $t('register') }}</ScButton
    >
  </div>
  <div v-else>
    <ScUserCard :userInfo="userStore.userInfo" onclick="modal_login.close()" />
  </div>
  <dialog id="modal_login" class="modal">
    <Card noPg class="modal-box max-w-[48rem] h-[36rem]">
      <div class="flex h-full">
        <div class="flex-1">
          <img
            src="/public/85120626_p0_master1200.jpg"
            alt="头图"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex items-center justify-center">
          <!-- 登录 -->
          <div
            v-if="modalType === 'login'"
            class="px-4 py-8 mx-4 flex-1 flex flex-col justify-center gap-4 w-[22rem]"
          >
            <div class="flex justify-between items-end">
              <h3 class="text-2xl font-bold">登录</h3>
              <div class="label">
                <span> 还没有账号？ </span>
                <span
                  class="text-active cursor-pointer"
                  @click="handleModalChange('register')"
                  >去注册</span
                >
              </div>
            </div>

            <form class="flex flex-col" @submit.prevent="handleLogin">
              <div class="form-control w-full mb-4">
                <label class="label py-1">账号</label>
                <input
                  type="text"
                  placeholder="邮箱或用户名"
                  v-model="loginForm.account"
                  class="input"
                />
              </div>

              <div class="form-control w-full mb-6">
                <label class="label py-1">密码</label>
                <input
                  type="password"
                  placeholder="密码"
                  v-model="loginForm.password"
                  class="input"
                />
              </div>

              <div
                class="form-control w-full mb-4 flex justify-between items-center"
              >
                <label class="label cursor-pointer">
                  <span class="label-text">记住我</span>
                  <input type="checkbox" class="checkbox" checked />
                </label>
                <label class="label cursor-pointer">
                  <span class="label-text text-active">忘记密码？</span>
                </label>
              </div>
            </form>

            <div class="modal-action mt-2">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <ScButton Border class="cursor-pointer px-4">取消</ScButton>
              </form>
              <ScButton
                Border
                activation
                class="cursor-pointer px-4"
                @click="handleLogin"
              >
                {{ $t('login') }}
              </ScButton>
            </div>
          </div>

          <!-- 注册 -->
          <div
            v-if="modalType === 'register'"
            class="px-4 py-8 mx-4 flex-1 flex flex-col justify-center gap-4 w-[22rem]"
          >
            <div class="flex justify-between items-end">
              <h3 class="text-2xl font-bold">注册</h3>
              <div class="label">
                <span> 已经有账号？ </span>
                <span
                  class="text-active cursor-pointer"
                  @click="handleModalChange('login')"
                  >返回登录</span
                >
              </div>
            </div>

            <form class="flex flex-col" @submit.prevent="handleLogin">
              <div class="form-control w-full mb-4">
                <label class="label py-1">用户名</label>
                <input
                  type="text"
                  placeholder="邮箱或用户名"
                  v-model="registerForm.account"
                  class="input"
                />
              </div>

              <div class="form-control w-full mb-4">
                <label class="label py-1">邮箱</label>
                <input
                  type="email"
                  placeholder="邮箱"
                  v-model="registerForm.email"
                  class="input"
                />
              </div>

              <div class="form-control w-full mb-6">
                <label class="label py-1">密码</label>
                <input
                  type="password"
                  placeholder="密码"
                  v-model="registerForm.password"
                  class="input"
                />
              </div>

              <div class="form-control w-full mb-6">
                <label class="label py-1">验证码</label>
                <div class="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    v-model="registerForm.captcha"
                    class="input"
                  />

                  <ScButton Border class="cursor-pointer w-44"
                    >获取验证码</ScButton
                  >
                </div>
              </div>
            </form>

            <div class="modal-action mt-2">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <ScButton Border class="cursor-pointer px-4">取消</ScButton>
              </form>
              <ScButton Border activation class="cursor-pointer px-4">{{
                $t('register')
              }}</ScButton>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <form method="dialog" class="modal-backdrop">
      <button></button>
    </form>
  </dialog>

  <dialog id="modal_reset_password" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Hello!</h3>
      <p class="py-4">Press ESC key or click the button below to close</p>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ScButton from '@/components/ScButton.vue'
import Card from '@/components/Card.vue'
import { userApi } from '@/apis'
import type { Api, ApiUser } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import ScUserCard from './ScUserCard.vue'

const username = ref('')
const password = ref('')
const router = useRouter()

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
  confirmPassword: '',
  captcha: '',
  nickname: '',
})

const modalType = ref('login') // 'login' or 'register' or 'reset_password'
const handleModalChange = (type: string) => {
  modalType.value = type
}

const handleLogin = () => {
  userApi
    .login(loginForm)
    .then((res: Api) => {
      if (res.data.code === 200) {
        const userInfo = res.data.data as ApiUser
        userStore.token = userInfo.token
        userStore.userInfo = userInfo.user

        toast.success('登录成功')

        const modalLoginDialog = document.getElementById(
          'modal_login'
        ) as HTMLDialogElement
        modalLoginDialog?.close()
      } else {
        toast.error('登录失败: ' + res.data.msg)
      }
    })
    .catch((error) => {
      // 处理登录错误
      toast.error(error.msg)
    })
}
</script>

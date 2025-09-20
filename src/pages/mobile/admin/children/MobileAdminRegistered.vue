<template>
  <Card class="mb-4">
    <h1 class="text-lg font-bold">{{ $t('d.hou-tai-zhu-ce') }}</h1>
  </Card>
  <Card class="mb-4">
    <div class="flex gap-4 items-center">
      <span class="w-12">{{ $t('f.ni-cheng') }}</span>
      <ScInput
        v-model="form.nickname"
        :placeholder="$t('f.qing-shu-ru-ni-cheng')"
        type="text" />
    </div>
    <div class="flex gap-4 items-center">
      <span class="w-12">{{ $t('f.zhang-hao') }}</span>
      <ScInput
        v-model="form.account"
        :placeholder="$t('d.qing-shu-ru-zhang-hao')"
        type="text" />
    </div>
    <div class="flex gap-4 items-center">
      <span class="w-12">{{ $t('f.you-xiang') }}</span>
      <ScInput
        v-model="form.email"
        :placeholder="$t('d.qing-shu-ru-you-xiang')"
        type="email" />
      <span class="text-gray w-16">
        {{ $t('d.you-xiang-bu-xian-zhi-ge-shi') }}
      </span>
    </div>
    <div class="flex gap-4 items-center">
      <span class="w-12">{{ $t('f.mi-ma') }}</span>
      <ScInput
        v-model="form.password"
        :placeholder="$t('d.qing-shu-ru-mi-ma')"
        type="password" />
    </div>
    <div class="flex gap-4 items-center">
      <ScButton Border @click="register">
        {{ $t('b.ti-jiao-zhu-ce') }}
      </ScButton>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

const form = ref({
  account: '',
  nickname: t('other.ji-qi-ren'),
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
    toast.error(t('t.qing-tian-xie-wan-zheng-xin-xi'))
    return
  }
  userApi
    .registerAsAdmin(form.value)
    .then((res) => {
      if (res.data.code === 200) {
        toast.success(t('t.zhu-ce-cheng-gong'))
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
      toast.error(
        t('t.zhu-ce-shi-bai') + error.msg + error.duplicates ||
          t('t.wei-zhi-cuo-wu')
      )
    })
}
</script>

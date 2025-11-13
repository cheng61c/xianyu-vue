<template>
  <Card noPg class="p-2 w-28">
    <ScButton class="w-full text-error" @click="toggleReportModal">
      {{ $t('b.ju-bao') }}
    </ScButton>
    <ScButton
      v-if="isAdmin || uid === userStore.userInfo.id"
      class="w-full text-error"
      @click="del">
      {{ $t('b.shan-chu-ping-lun') }}
    </ScButton>
  </Card>

  <ScModal v-model="reportModal">
    <Card class="p-6 w-2xl">
      <div class="flex">
        <h3 class="text-xl mb-4 mr-4">{{ $t('d.ju-bao-ping-lun') }}</h3>
        <div v-if="!userStore.isLogin" class="text-error">
          {{ $t('t.qing-xian-deng-lu-hou-zai-cao-zuo') }}
        </div>
      </div>

      <div>
        {{
          $t(
            'd.ni-que-ding-yao-ju-bao-ci-ping-lun-ma-qing-ti-gong-ju-bao-li-you-wo-men-hui-jin-kuai-chu-li'
          )
        }}
      </div>
      <ScInput
        class="mt-4"
        multiline
        :placeholder="$t('d.qing-shu-ru-ju-bao-li-you')"
        :rows="4"
        :maxlength="200"
        v-model="reportReason"></ScInput>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="handleReportSubmit" Border>
          {{ $t('b.ti-jiao') }}
        </ScButton>
        <ScButton class="px-4" @click="toggleReportModal" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { verifyPermissions } from '@/utils/verify'
import { computed, ref } from 'vue'
import ScModal from '@/components/common/ScModal.vue'
import ScInput from '@/components/common/ScInput.vue'
import { reportApi } from '@/apis'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/module/user/userStore'
import { deleteComment } from '@/stores/module/comment/service'
const { t } = useI18n()

const toast = useToast()
const userStore = useUserStore()
const props = defineProps({
  commentId: {
    type: Number,
    required: true,
  },
  uid: {
    type: Number,
    required: true,
  },
})

const reportModal = ref(false)
const reportReason = ref('')

const toggleReportModal = () => {
  reportModal.value = !reportModal.value
}
const handleReportSubmit = () => {
  if (!userStore.isLogin) {
    toast.error(t('t.qing-xian-deng-lu'))
    return
  }
  if (!reportModal.value) return
  if (!reportReason.value.trim()) {
    toast.error(t('t.ju-bao-li-you-bu-neng-wei-kong'))
    return
  }
  reportApi
    .createReport({
      targetType: 2,
      targetId: props.commentId,
      reason: reportReason.value,
    })
    .then(() => {
      toast.success(t('t.ju-bao-yi-ti-jiao-wo-men-hui-jin-kuai-chu-li'))
      reportModal.value = false
      reportReason.value = ''
    })
    .catch((error) => {
      toast.error(t('t.ju-bao-shi-bai') + error.msg)
    })
}

const del = () => {
  deleteComment(t, props.commentId, () => {
    emit('updateComment')
  })
}

const emit = defineEmits(['updateComment'])
const isAdmin = computed(() => {
  return verifyPermissions([1, 2, 3, 5, 9])
})
</script>

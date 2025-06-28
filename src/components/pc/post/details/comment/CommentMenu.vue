<template>
  <Card noPg class="p-2 w-28">
    <ScButton class="w-full text-error" @click="toggleReportModal">
      举报
    </ScButton>
    <ScButton v-if="isAdmin" class="w-full text-error" @click="">
      删除评论
    </ScButton>
  </Card>

  <ScModal v-model="reportModal">
    <Card class="p-6 w-2xl">
      <h3 class="text-xl mb-4">举报评论</h3>
      <div>你确定要举报此评论吗？请提供举报理由，我们会尽快处理。</div>
      <ScInput
        class="mt-4"
        multiline
        placeholder="请输入举报理由"
        :rows="4"
        :maxlength="200"
        v-model="reportReason"></ScInput>
      <div class="flex gap-4 justify-end">
        <ScButton class="px-4" @click="handleReportSubmit" Border>
          提交
        </ScButton>
        <ScButton class="px-4" @click="toggleReportModal" Border>
          取消
        </ScButton>
      </div>
    </Card>
  </ScModal>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import ScButton from '@/components/common/ScButton.vue'
import { verifyPermissions } from '@/hook/verify'
import { computed, ref } from 'vue'
import ScModal from '@/components/common/ScModal.vue'
import ScInput from '@/components/common/ScInput.vue'
import { reportApi } from '@/apis'
import { useToast } from 'vue-toastification'

const toast = useToast()
const props = defineProps({
  commentId: {
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
  if (!reportModal.value) return
  if (!reportReason.value.trim()) {
    toast.error('举报理由不能为空')
    return
  }
  reportApi
    .createReport({
      targetType: 2,
      targetId: props.commentId,
      reason: reportReason.value,
    })
    .then(() => {
      toast.success('举报已提交，我们会尽快处理')
      reportModal.value = false
      reportReason.value = ''
    })
    .catch((error) => {
      toast.error('举报失败: ' + error.msg)
    })
}

const emit = defineEmits(['updateComment'])
const isAdmin = computed(() => {
  return verifyPermissions([1, 2, 3, 5, 9])
})
</script>

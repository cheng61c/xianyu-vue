<template>
  <Card class="mb-4">
    {{ forms }}{{ content }}
    <div class="flex gap-2">
      <ScButton @click="getFengYunBangAll" :icon="RotateCcw" Border>
        刷新列表
      </ScButton>
      <ScButton @click="addPlayer" :icon="Plus" Border> 添加玩家 </ScButton>
    </div>
  </Card>
  <Card v-if="fengYunBangStore.list.length" class="mb-4">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ $t('b.ming-cheng') }}</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>{{ $t('b.cao-zuo') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in fengYunBangStore.list" :key="item.id">
            <th>{{ item.id }}</th>
            <td>
              {{ item.title }}
            </td>
            <td>{{ item.createdAt }}</td>
            <td>{{ item.updatedAt }}</td>
            <td>
              <div class="flex items-center gap-2">
                <ScButton Border @click="editPlayer(item)">
                  {{ $t('b.bian-ji') }}
                </ScButton>
                <ScButton Border @click="deletePlayer(item)"> 删除 </ScButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <ScModal v-model="isOpen" offOverflow>
    <Card class="max-h-[80vh] overflow-y-auto w-[95vw] gap-4">
      <span class="text-xl">添加玩家</span>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput v-model="forms.title" :placeholder="'玩家名称'" />
      </div>

      <div class="flex flex-col">
        <p>社区id:</p>
        <ScInput v-model="forms.userId" :placeholder="'在社区中有账号时填写'" />
      </div>

      <div class="flex flex-col gap-1">
        <p>头像链接:</p>
        <ScInput v-model="forms.headImg" :placeholder="'头像链接'" />
        <ScButton
          Border
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="triggerFileInput">
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            class="hidden"
            @change="handleFileChange" />
          <div>将图片拖到此处，或点击上传</div>
          <template v-if="forms.headImg" #endIcon>
            <Avatar :src="forms.headImg" :alt="forms.title" />
          </template>
        </ScButton>
        <ScButton v-if="uploadLoading" noPd>
          <span class="loading loading-spinner"></span>
        </ScButton>

        <p>或者使用QQ头像:</p>
        <p>http://q1.qlogo.cn/g?b=qq&s=4&nk=</p>

        <div class="flex items-center gap-4">
          <ScInput v-model="qid" :placeholder="'填入QQ号做为头像'" />
          <template v-if="qid != ''">
            <Avatar :src="getQQAvatar(qid)" :alt="forms.title" />
          </template>
        </div>
      </div>

      <!-- 帖子内容 -->
      <ScButton
        v-if="deviceStore.device == 1"
        @click="onTipTap"
        Border
        class="w-full">
        编写文章
      </ScButton>

      <div class="flex justify-end mt-1 gap-4">
        <ScButton @click="addPlayer" Border>
          {{ forms.id != 0 ? '确认修改' : '确认添加' }}
        </ScButton>
        <ScButton @click="isOpen = false" Border> 取消 </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="isOpenDel" offOverflow>
    <Card class="max-h-[80vh] overflow-y-auto w-2xl">
      <span class="text-xl">删除</span>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <span class="font-bold"> {{ forms.title }} </span>
      </div>

      <div class="flex justify-end mt-1 gap-4">
        <ScButton
          @click="deletePlayer()"
          Border
          class="text-error border-error">
          确认删除
        </ScButton>
        <ScButton @click="isOpenDel = false" Border> 取消 </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScDrawer v-model="isOpenTipTap" position="bottom">
    <div class="bg-background rounded-t-lg">
      <TipTap v-if="content !== null" v-model="content" class="mobileTipTap" />
    </div>
  </ScDrawer>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import ScModal from '@/components/common/ScModal.vue'
import TipTap from '@/components/pc/tiptap/TipTap.vue'
import ScButton from '@/components/common/ScButton.vue'
import ScInput from '@/components/common/ScInput.vue'
import { Plus, RotateCcw } from 'lucide-vue-next'
import { useFengYunBangStore } from '@/stores/module/fengyunbang/FengYunBangStore'
import {
  addFengYunBang,
  getFengYunBangAll,
  deleteFengYunBang,
} from '@/stores/module/fengyunbang/service'
import type { FengYunBangDto } from '@/types/FengYunBang'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { uploadApi } from '@/apis'
import Avatar from '@/components/common/Avatar.vue'
import ScDrawer from '@/components/common/ScDrawer.vue'
import { useDeviceStore } from '@/stores/global/deviceStore'

const toast = useToast()
const { t } = useI18n()
const fengYunBangStore = useFengYunBangStore()
const deviceStore = useDeviceStore()
const isOpen = ref(false)
const isOpenDel = ref(false)
const isOpenTipTap = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadLoading = ref(false)
const isEditing = ref(false)

const forms = ref<FengYunBangDto>({
  id: 0,
  title: '',
  headImg: '',
  content: '',
})
const qid = ref('')
const content = ref<string | null>(null)

const onTipTap = () => {
  isOpenTipTap.value = true
}

const addPlayer = () => {
  if (!isOpen.value) {
    forms.value = {
      id: 0,
      title: '',
      headImg: '',
      content: '',
    }
    content.value = ''
    qid.value = ''
    isOpen.value = true
    return
  }
  if (qid.value !== '') {
    forms.value.headImg = `http://q1.qlogo.cn/g?b=qq&s=4&nk=${qid.value.trim()}`
  }
  if (content.value) {
    forms.value.content = content.value
  }
  addFengYunBang(forms.value, t, () => {
    isOpen.value = false
    forms.value = {
      title: '',
      headImg: '',
      content: '',
    }
    content.value = ''
    qid.value = ''
    isEditing.value = false
  })
}

const deletePlayer = (item?: FengYunBangDto) => {
  if (item) {
    forms.value = {
      id: item.id,
      title: item.title,
      headImg: item.headImg,
      content: item.content || '',
    }
    isOpenDel.value = true
    return
  }
  console.log('forms.value.id', forms.value.id)

  if (forms.value.id) {
    deleteFengYunBang(forms.value.id, t, () => {
      forms.value = {
        id: 0,
        title: '',
        headImg: '',
        content: '',
      }
      qid.value = ''
      isOpenDel.value = false
    })
  }
}

const getQQAvatar = (qq: string) => {
  return `http://q1.qlogo.cn/g?b=qq&s=4&nk=${qq.trim()}`
}

const editPlayer = (item: FengYunBangDto) => {
  forms.value = {
    id: item.id,
    title: item.title,
    headImg: item.headImg,
    content: item.content || '',
  }
  content.value = item.content

  if (item.userId) {
    forms.value.userId = item.userId
  }
  if (qid.value !== '') {
    forms.value.headImg = `http://q1.qlogo.cn/g?b=qq&s=4&nk=${qid.value.trim()}`
  }
  isOpen.value = true
  isEditing.value = true
}

const handleKeydown = (e: KeyboardEvent) => {
  if (isOpen.value && e.ctrlKey && e.key.toLowerCase() === 's') {
    e.preventDefault()
    addFengYunBang(forms.value, t, () => {
      isOpen.value = false
      forms.value = {
        title: '',
        headImg: '',
        content: '',
      }
      qid.value = ''
    })
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileChange({ target: { files } } as unknown as Event)
  }
}
const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return
  uploadLoading.value = true
  try {
    const file = files[0]
    const res = await uploadApi.uploadFile(file, 6)
    forms.value.headImg = res.data.data.url
    uploadLoading.value = false
  } catch (error) {
    toast.error(t('t.tu-pian-shang-chuan-shi-bai-filename', [files[0].name]))
    uploadLoading.value = false
  }

  // 清空 input 的值，否则无法上传同一张图两次
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
onMounted(() => {
  getFengYunBangAll()
  window.addEventListener('keydown', handleKeydown)
})
</script>

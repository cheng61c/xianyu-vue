<template>
  <Card class="mb-4">
    <div class="flex gap-2">
      <ScButton @click="getFengYunBangAll" :icon="RotateCcw" Border>
        {{ $t('b.shua-xin-lie-biao') }}
      </ScButton>
      <ScButton @click="addPlayer" :icon="Plus" Border>
        {{ $t('b.tian-jia-wan-jia') }}
      </ScButton>
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
            <th>{{ $t('b.chuang-jian-shi-jian') }}</th>
            <th>{{ $t('b.geng-xin-shi-jian') }}</th>
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
                <ScButton Border @click="deletePlayer(item)">
                  {{ $t('b.shan-chu') }}
                </ScButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <ScModal v-model="isOpen" offOverflow>
    <Card class="max-h-[80vh] overflow-y-auto w-5xl">
      <span class="text-xl">{{ $t('b.tian-jia-wan-jia') }}</span>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <ScInput
          v-model="forms.title"
          :placeholder="$t('t.wan-jia-ming-cheng')"
          class="m-2" />
      </div>

      <div class="flex items-center gap-4">
        <span> {{ $t('f.tou-xiang-lian-jie') }} </span>
        <ScInput
          v-model="forms.headImg"
          :placeholder="$t('t.tou-xiang-lian-jie')"
          class="m-2" />
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
          <div>
            {{ $t('f.jiang-tu-pian-tuo-dao-ci-chu-huo-dian-ji-shang-chuan') }}
          </div>
          <template v-if="forms.headImg" #endIcon>
            <Avatar :src="forms.headImg" :alt="forms.title" />
          </template>
        </ScButton>
        <ScButton v-if="uploadLoading" noPd>
          <span class="loading loading-spinner"></span>
        </ScButton>
      </div>

      <div class="flex items-center gap-4">
        <span> {{ $t('f.huo-zhe-shi-yong-qq-tou-xiang') }} </span
        ><span>http://q1.qlogo.cn/g?b=qq&s=4&nk=</span>
        <ScInput
          v-model="qid"
          :placeholder="$t('f.tian-ru-qq-hao-zuo-wei-tou-xiang')"
          class="m-2" />
        <template v-if="qid != ''">
          <Avatar :src="getQQAvatar(qid)" :alt="forms.title" />
        </template>
      </div>

      <div class="flex items-center gap-4">
        <span> {{ $t('f.she-qu-id') }} </span>
        <ScInput
          v-model="forms.userId"
          :placeholder="$t('t.zai-she-qu-zhong-you-zhang-hao-shi-tian-xie')"
          class="m-2" />
      </div>

      <div class="mt-4">
        <TipTap v-model="forms.content" />
      </div>

      <div class="flex justify-end mt-1 gap-4">
        <ScButton @click="addPlayer" Border>
          {{
            forms.id != 0 ? $t('b.que-ren-xiu-gai') : $t('b.que-ren-tian-jia')
          }}
        </ScButton>
        <ScButton @click="isOpen = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>

  <ScModal v-model="isOpenDel" offOverflow>
    <Card class="max-h-[80vh] overflow-y-auto w-2xl">
      <span class="text-xl">{{ $t('b.shan-chu') }}</span>

      <div class="flex items-center gap-4">
        <span> {{ $t('d.ming-cheng') }} </span>
        <span class="font-bold"> {{ forms.title }} </span>
      </div>

      <div class="flex justify-end mt-1 gap-4">
        <ScButton
          @click="deletePlayer()"
          Border
          class="text-error border-error">
          {{ $t('b.que-ren-shan-chu') }}
        </ScButton>
        <ScButton @click="isOpenDel = false" Border>
          {{ $t('b.qu-xiao') }}
        </ScButton>
      </div>
    </Card>
  </ScModal>
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

const toast = useToast()
const { t } = useI18n()
const fengYunBangStore = useFengYunBangStore()
const isOpen = ref(false)
const isOpenDel = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadLoading = ref(false)

const forms = ref<FengYunBangDto>({
  id: 0,
  title: '',
  headImg: '',
  content: '',
})
const qid = ref('')

const addPlayer = () => {
  if (!isOpen.value) {
    isOpen.value = true
    forms.value = {
      id: 0,
      title: '',
      headImg: '',
      content: '',
    }
    return
  }
  if (qid.value !== '') {
    forms.value.headImg = `http://q1.qlogo.cn/g?b=qq&s=4&nk=${qid.value.trim()}`
  }
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
  if (item.userId) {
    forms.value.userId = item.userId
  }
  if (qid.value !== '') {
    forms.value.headImg = `http://q1.qlogo.cn/g?b=qq&s=4&nk=${qid.value.trim()}`
  }
  isOpen.value = true
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

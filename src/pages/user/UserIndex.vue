<template>
  <div class="flex flex-col w-full items-center gap-4">
    <Card class="stats w-5xl" noCol noPg>
      <div class="stat place-items-center">
        <div class="text-primary">
          <Avatar
            :src="formatLink(userInfo.headImg) || ''"
            alt="头像"
            :size="64"
          />
        </div>
      </div>
    </Card>
    <Card class="stats w-5xl" noCol noPg>
      <div class="stat">
        <div class="stat-figure text-primary">
          <ScrollText />
        </div>
        <div class="stat-title">帖子</div>
        <div class="stat-value text-primary">999</div>
        <div class="stat-desc">总获赞 120</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-emerald-500">
          <MessageCircle />
        </div>
        <div class="stat-title">评论</div>
        <div class="stat-value text-emerald-500">2.6M</div>
        <div class="stat-desc">总获赞 222</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-violet-500">
          <Package />
        </div>
        <div class="stat-title">资源</div>
        <div class="stat-value text-violet-500">2.6M</div>
        <div class="stat-desc">总获赞 222</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-primary">
          <File />
        </div>
        <div class="stat-title">文件</div>
        <div class="stat-value text-primary">20</div>
        <div class="stat-desc">下载次数 999</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-amber-500">
          <Server />
        </div>
        <div class="stat-title">服务器</div>
        <div class="stat-value text-amber-500">2.6M</div>
        <div class="stat-desc">总获赞 222</div>
      </div>
    </Card>

    <Card class="stats w-5xl" noCol>
      <div
        v-html="html2 || '这个人很懒，什么都没写'"
        class="tiptap w-full"
      ></div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import {
  ScrollText,
  MessageCircle,
  File,
  Package,
  Server,
} from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import type { UserType } from '@/types'
import { userApi } from '@/apis'
import { formatLink } from '@/hook/format'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const route = useRoute()
const isUserId = ref(false)
const userInfo = ref<UserType>(userStore.userInfo)

const html2 =
  ref(`<p>That's a boring paragraph followed by a fenced code block:</p><pre><code class="language-javascript">for (var i=1; i &lt;= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre><p>Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.</p>`)

onMounted(() => {
  if (route.params.userId) {
    isUserId.value = true
    userApi
      .getCurrentUser()
      .then((response) => {
        userInfo.value = response.data.data as UserType
        console.log(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  } else {
    isUserId.value = false
  }
})
</script>

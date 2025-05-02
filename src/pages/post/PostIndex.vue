<template>
  <div class="flex w-full gap-x-6 justify-between px-1 h-[calc(100vh-64px)]">
    <PostPlate />
    <PostList />
    <BulletinBoard />
  </div>
</template>

<script setup lang="ts">
import PostList from '@/components/post/PostList.vue'
import PostPlate from '@/components/post/PostPlate.vue'
import BulletinBoard from '@/components/post/BulletinBoard.vue'
</script>

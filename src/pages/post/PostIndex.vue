<template>
  <div class="flex w-full gap-x-8">
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

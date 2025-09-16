<template>
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th
            v-for="(item, index) in thead"
            :key="index"
            class="bg-background"
            :class="{
              'sticky left-0 w-[5rem]  bg-gray-100 dark:bg-[#22262b]':
                lockId === index,
            }"
            @click="lock(index)">
            <div class="flex items-center gap-1">
              {{ item }}
              <Lock v-if="lockId === index" :size="18" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, rowIndex) in tbody" :key="rowIndex">
          <template v-for="(cell, cellIndex) in thead" :key="cellIndex">
            <td
              class="bg-background"
              :class="{
                'sticky left-0 bg-gray-100 dark:bg-[#22262b]':
                  lockId === cellIndex,
              }">
              <div
                :class="{
                  ' w-[5rem] overflow-hidden break-words ':
                    lockId === cellIndex,
                }">
                <slot
                  :name="`cell-${cellIndex}`"
                  :data="user"
                  :index="rowIndex">
                  {{ user[cell] }}
                </slot>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { Lock } from 'lucide-vue-next'

const props = defineProps<{
  thead: string[]
  tbody: any[]
  lockId: number
}>()

const emit = defineEmits(['update:lockId'])

const lock = (index: number) => {
  emit('update:lockId', props.lockId === index ? -1 : index)
}
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid rgba(var(--color-gray-rgb), 0.4);

  white-space: nowrap; /* 防止换行 */
}

.sticky {
  position: sticky;
  z-index: 1;
}
</style>

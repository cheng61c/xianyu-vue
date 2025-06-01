<template>
  <Card class="w-full">
    <div class="flex justify-between">
      <div class="flex gap-2">
        <ScInput
          v-model="searchText"
          :placeholder="placeholder"
          type="search"
          @keyup.enter="handleSearch" />
        <ScButton @click="handleSearch" Border> 搜索 </ScButton>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '../Card.vue'
import { defineProps, ref, watch } from 'vue'
import ScButton from '../ScButton.vue'
import ScInput from '../ScInput.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '搜索...',
  },
})

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'update:modelValue', value: string | number): void
}>()

const searchText = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    searchText.value = val
  }
)

watch(searchText, (val) => {
  emit('update:modelValue', val)
})

const handleSearch = () => {
  emit('search', String(searchText.value))
}
</script>

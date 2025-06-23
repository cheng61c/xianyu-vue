<script setup lang="ts">
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import type { CSSProperties } from 'vue'
import ScButton from './ScButton.vue'
import ScCard from './Card.vue'

interface Option {
  value: number | string
  label: string
}

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array<Option>,
    default: () => [],
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const useDropdown = (
  props: {
    readonly options: Option[]
    readonly active: boolean
    readonly modelValue?: string | number | undefined
  },
  emit: (event: 'update:modelValue', value: string | number) => void
) => {
  const isOpen = ref(false)
  const containerRef = ref()
  const selectedValue = ref(props.modelValue)
  const selectedLabel = ref('')

  const updateSelectedLabel = () => {
    const selected = props.options.find(
      (opt: { value: any }) => opt.value === selectedValue.value
    )
    selectedLabel.value = selected?.label || ''
  }

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }

  const selectOption = (option: { value: any }) => {
    selectedValue.value = option.value
    isOpen.value = false
    emit('update:modelValue', option.value)
  }

  const handleClickOutside = (event: { target: any }) => {
    if (containerRef.value && !containerRef.value.contains(event.target)) {
      isOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    updateSelectedLabel()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  watchEffect(() => {
    updateSelectedLabel()
  })

  return {
    isOpen,
    containerRef,
    selectedLabel,
    toggleDropdown,
    selectOption,
  }
}

const { isOpen, containerRef, selectedLabel, toggleDropdown, selectOption } =
  useDropdown(props, emit)

const ScDropListButtonsListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
}
</script>

<template>
  <div class="dropdown-container" ref="containerRef">
    <sc-button
      :activation="props.active"
      size="small"
      hoverable
      @click="toggleDropdown"
      class="p-2"
      noPd>
      <slot name="trigger">
        {{ selectedLabel || '请选择' }}
      </slot>
    </sc-button>
    <transition name="fade">
      <sc-card
        no-margin
        in-card
        background
        v-show="isOpen"
        class="dropdown-list">
        <ul :style="ScDropListButtonsListStyle">
          <li
            v-for="option in options"
            :key="option.value"
            class="dropdown-item"
            @click="selectOption(option)">
            <slot :name="option.label">
              {{ option.label }}
            </slot>
          </li>
        </ul>
      </sc-card>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-list {
  position: absolute;
  top: 120%;
  left: 0;
  right: 0;
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

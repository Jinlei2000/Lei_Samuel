<template>
  <div class="relative flex w-1/3 items-center justify-center gap-3">
    <div
      class="absolute left-2 rounded-full bg-transparent p-2 transition-all hover:scale-110"
    >
      <Search class="h-[22px] w-[22px]" />
    </div>
    <input
      :value="modelValue"
      class="h-12 w-full rounded-full bg-gray-200 py-3 pl-11 text-lg"
      type="text"
      :placeholder="placeholder"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

// props
const props = defineProps({
  modelValue: {
    type: String,
  },
  placeholder: {
    type: String,
    default: 'Search for ...',
  },
})

// emits
const emits = defineEmits(['update:modelValue'])
</script>

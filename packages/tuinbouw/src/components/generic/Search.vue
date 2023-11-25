<template>
  <div class="relative flex w-1/3 items-center justify-center gap-3">
    <button
      class="absolute left-2 rounded-full bg-transparent p-2 transition-all hover:scale-110"
    >
      <Search class="h-[22px] w-[22px]" />
    </button>
    <input
      :value="modelValue"
      class="h-12 w-full rounded-full bg-gray-200 py-3 pl-11 text-lg"
      type="text"
      placeholder="Search for materials"
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
})

// emits
const emits = defineEmits(['update:modelValue'])
</script>

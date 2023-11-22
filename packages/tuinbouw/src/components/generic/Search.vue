<template>
  <div class="flex items-center justify-center gap-3 relative w-1/3">
    <button
      class="bg-transparent p-2 rounded-full hover:scale-110 transition-all absolute left-2"
    >
      <Search class="h-[22px] w-[22px]" />
    </button>
    <input
      :value="modelValue"
      class="bg-gray-200 rounded-full h-12 py-3 pl-11 w-full text-lg"
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
</script>

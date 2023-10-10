<template>
  <div
    class="bg-gray-200 rounded-2xl max-h-32 w-full p-3 pl-6 relative overflow-hidden"
  >
    <div
      class="w-1 h-full absolute left-0 top-0"
      :class="
        props.type === 'maintenance'
          ? 'bg-primary-green'
          : props.type === 'repair'
          ? 'bg-primary-orange'
          : props.type === 'inspection'
          ? 'bg-primary-blue'
          : 'bg-transparent'
      "
    ></div>
    <h2 class="text-xl mb-1">{{ props.title }}</h2>
    <div class="flex gap-3 items-end justify-between">
      <p class="text-base">
        {{ props.description }}
      </p>
      <button
        class="bg-primary-orange rounded-[8px] text-gray-200 pr-[7px] pl-3 py-[6px] flex gap-2 h-fit items-center"
      >
        Navigate <Navigation stroke-width="2" class="w-[17px] h-[17px]" />
      </button>
    </div>
    <button class="absolute top-3 right-3 hover:scale-105 transition-all">
      <Info class="w-[24px] h-[24px]" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Navigation, Info } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  description: String,
  type: String,
})

console.log(props.type)
</script>

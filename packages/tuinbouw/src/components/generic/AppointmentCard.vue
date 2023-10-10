<template>
  <div
    class="bg-gray-200 rounded-2xl gap-1 max-h-32 w-[420px] p-3 pl-6 relative overflow-hidden"
  >
    <div class="w-1 h-full absolute left-0 top-0 bg-primary-green"></div>
    <h2 class="text-xl">Mr. Johnson</h2>
    <div class="flex gap-3 items-end">
      <p class="text-base">
        Excepteur do aute amet tempor aliqua adipisicing aliquip minim quis ad
        do sint.
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
</script>

<template>
  <div class="flex flex-col mt-12 gap-5 max-w-7xl m-auto">
    <div class="w-full grid grid-cols-3">
      <h1 class="col-start-1 text-2xl">Calendar</h1>
      <div
        class="w-full col-start-2 justify-self-center bg-gray-500 p-1 flex justify-between items-center rounded-2xl mb-3"
      >
        <button
          class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
        >
          <ArrowLeft @click="" class="text-white" />
        </button>
        <div class="flex gap-4">
          <p class="">week</p>
          <p>-</p>
          <p class="">week</p>
        </div>
        <button
          class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
        >
          <ArrowRight @click="" class="text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
</script>

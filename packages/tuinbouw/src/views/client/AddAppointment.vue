<template>
  <div class="max-w-7xl m-auto">
    <h1 class="mt-12 mb-3 text-2xl">
      Nieuwe afspraak maken
    </h1>
    <div class="flex gap-3">
      <div class="flex flex-col w-1/3">
        <div class="bg-gray-200 flex flex-col p-3 rounded-2xl w-full gap-3">
          <div class="bg-primary-green bg-opacity-10 outline-primary-green outline flex p-3 rounded w-full items-center relative">
            <h3 class="text-lg w-1/5">Home</h3>
            <p>Hertogstraat 27, 8870 Izegem</p>
            <div class="bg-primary-green rounded-full p-[2px] absolute top-4 right-4">
              <Check :size="16" class="text-white" />
            </div>
          </div>
          <div class="flex p-3 rounded w-full items-center hover:bg-primary-green hover:outline-primary-green hover:bg-opacity-10 hover:outline hover:cursor-pointer">
            <h3 class="text-lg w-1/5">Office</h3>
            <p>Parijsstraat 82, 3000 Leuven</p>
          </div>
        </div>
        <div>
          <h2 class="text-xl opacity-80">
            Reeds gemaakte afspraken
          </h2>
        </div>
      </div>
      <div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Check } from 'lucide-vue-next'

const selectedLocation = ref('home')

</script>

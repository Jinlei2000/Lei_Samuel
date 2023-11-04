<template>
  <div
    class="relative max-h-32 w-full overflow-hidden rounded-2xl bg-gray-200 p-3 pl-6"
  >
    <div
      class="absolute left-0 top-0 h-full w-1"
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
    <h2 class="mb-1 text-xl">{{ props.title }}</h2>
    <div class="flex items-end justify-between gap-3">
      <p class="overflow-hidden text-base">
        {{ props.description }}
      </p>
      <button @click="navigateToLocation(location!.address)"
        class="bg-primary-orange flex h-fit items-center gap-2 rounded-[8px] py-[6px] pl-3 pr-[7px] text-gray-200"
      >
        Navigate <Navigation stroke-width="2" class="h-[17px] w-[17px]" />
      </button>
    </div>
    <button class="absolute right-3 top-3 transition-all hover:scale-105">
      <Info class="h-[24px] w-[24px]" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Navigation, Info } from 'lucide-vue-next'

// Open location in google maps
function navigateToLocation(location: any) {
  console.log(location)
  const latitude = 37.7749; // Replace with the latitude of your location
  const longitude = -122.4194; // Replace with the longitude of your location
  
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  window.open(googleMapsUrl, '_blank');
}

const props = defineProps({
  title: String,
  description: String,
  type: String,
  location: Object,
})
</script>

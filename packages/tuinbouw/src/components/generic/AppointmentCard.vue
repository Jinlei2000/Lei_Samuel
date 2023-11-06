<template>
  <div
    class="relative max-h-32 w-full overflow-hidden rounded-2xl bg-gray-200 p-3 pl-6"
  >
    <div
      class="absolute left-0 top-0 h-full w-1"
      :class="
        props.appointment?.type === 'maintenance'
          ? 'bg-primary-green'
          : props.appointment?.type === 'repair'
          ? 'bg-primary-orange'
          : props.appointment?.type === 'inspection'
          ? 'bg-primary-blue'
          : 'bg-transparent'
      "
    ></div>
    <h2 class="mb-1 text-xl">{{ props.appointment?.user?.fullname }}</h2>
    <div class="flex items-end justify-between gap-3">
      <p class="overflow-hidden text-base">
        {{ props.appointment?.description }}
      </p>
      <button @click="navigateToLocation(props.appointment?.location!.address)"
        class="bg-primary-orange flex h-fit items-center gap-2 rounded-[8px] py-[6px] pl-3 pr-[7px] text-gray-200"
      >
        Navigate <Navigation stroke-width="2" class="h-[17px] w-[17px]" />
      </button>
    </div>
    <button @click="openModal()" class="absolute right-3 top-3 transition-all hover:scale-105">
      <Info class="h-[24px] w-[24px]" />
    </button>
  </div>
  <!-- Appointment Detail Modal -->
  <Dialog
    v-model:visible="showModal"
    modal
    :header="props.appointment.user!.fullname"
    :style="{ width: '50vw', position: 'relative', overflow: 'hidden'}"
    v-if="props.appointment"
    @click:close="closeModal"
    class="max-w-lg"
  >
  <div
      class="absolute left-0 top-0 h-full w-1"
      :class="
        props.appointment.type === 'maintenance'
          ? 'bg-primary-green'
          : props.appointment.type === 'repair'
          ? 'bg-primary-orange'
          : props.appointment.type === 'inspection'
          ? 'bg-primary-blue'
          : 'bg-transparent'
      "
    ></div>
    <p class="text-gray-900">
      {{ props.appointment.description }}
    </p>
    <div class="my-6 flex flex-col gap-3">
      <div class="flex gap-3">
        <Clock />
        <p class="">
          {{ props.appointment.finalDate!.substring(11, 16) }}
        </p>
      </div>
      <div class="flex gap-3">
        <MapPin />
        <p class="">
          {{ props.appointment.location!.address }}
        </p>
      </div>
    </div>
    <div class="flex gap-3 justify-between w-full">
      <button
        class="bg-transparent outline outline-[1px] flex h-fit items-center gap-2 rounded-[8px] py-[6px] px-3 hover:bg-black hover:text-gray-200"
      >
        Cancel
      </button>
      <button
        class="bg-primary-green flex h-fit items-center gap-2 rounded-[8px] py-[6px] pl-3 pr-[7px] text-gray-200"
      >
        Finished <CheckCircle stroke-width="2" class="h-[17px] w-[17px]" />
      </button>
    </div>
  </Dialog>
  <!-- End Appointment Detail Modal -->
</template>

<script setup lang="ts">
import { Navigation, Info } from 'lucide-vue-next'
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-vue-next'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import { ref, type PropType } from 'vue';

const showModal = ref(false)

const props = defineProps({
  // title: String,
  // description: String,
  // type: String,
  // location: Object,
  appointment: Object as PropType<Appointment>,
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Open location in google maps
const navigateToLocation = (location: any) => {
  console.log(location)
  const latitude = 37.7749; // Replace with the latitude of your location
  const longitude = -122.4194; // Replace with the longitude of your location
  
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  window.open(googleMapsUrl, '_blank');
}


</script>

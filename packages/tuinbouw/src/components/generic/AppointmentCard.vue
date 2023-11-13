<template>
  <div
    v-if="appointment"
    @click="openModal()"
    class="relative max-h-32 w-full overflow-hidden rounded-2xl bg-gray-200 p-3 pl-6"
    :class="appointment.isDone ? 'opacity-50' : ''"
  >
    <div
      class="absolute left-0 top-0 h-full w-1"
      :class="
        appointment?.type === 'maintenance'
          ? 'bg-primary-green'
          : appointment?.type === 'repair'
          ? 'bg-primary-orange'
          : appointment?.type === 'inspection'
          ? 'bg-primary-blue'
          : 'bg-transparent'
      "
    ></div>
    <h2 class="mb-1 text-xl">{{ appointment.user?.fullname }}</h2>
    <div class="flex items-end justify-between gap-3">
      <p class="overflow-hidden text-base">
        {{ appointment.description }}
      </p>
      <button
        @click="navigateToLocation(appointment.location!)"
        v-on:click.stop
        class="bg-primary-orange flex h-fit items-center gap-2 rounded-[8px] py-[6px] pl-3 pr-[7px] text-gray-200"
      >
        Navigate <Navigation stroke-width="2" class="h-[17px] w-[17px]" />
      </button>
    </div>
    <button
      @click="openModal()"
      class="absolute right-3 top-3 transition-all hover:scale-105"
    >
      <Info class="h-[24px] w-[24px]" />
    </button>
  </div>
  <!-- Appointment Detail Modal -->
  <Dialog
    v-model:visible="showModal"
    modal
    :header="appointment.user!.fullname"
    :style="{ width: '50vw', position: 'relative', overflow: 'hidden' }"
    v-if="appointment"
    @click:close="closeModal"
    class="max-w-lg"
  >
    <div
      class="absolute left-0 top-0 h-full w-1"
      :class="
        appointment.type === 'maintenance'
          ? 'bg-primary-green'
          : appointment.type === 'repair'
          ? 'bg-primary-orange'
          : appointment.type === 'inspection'
          ? 'bg-primary-blue'
          : 'bg-transparent'
      "
    ></div>
    <div class="flex flex-col gap-3">
      <p class="text-gray-900">
        {{ appointment.description }}
      </p>
      <p
        class="capitalize"
        :class="
          appointment.type == 'maintenance'
            ? 'text-primary-green'
            : appointment.type == 'repair'
            ? 'text-primary-orange'
            : ''
        "
      >
        {{ appointment.type }}
      </p>
    </div>

    <div class="my-6 flex flex-col gap-3">
      <div class="flex gap-3">
        <Clock />
        <p class="">
          {{ appointment.finalDate!.substring(11, 16) }}
        </p>
      </div>
      <div class="flex gap-3">
        <MapPin />
        <p class="">
          {{ appointment.location!.address }}
        </p>
      </div>
    </div>
    <div class="flex gap-3 justify-between w-full">
      <button
        @click="closeModal()"
        class="bg-transparent outline outline-[1px] flex h-fit items-center gap-2 rounded-[4px] py-[6px] px-3 hover:bg-black hover:text-gray-200"
      >
        Cancel
      </button>
      <button
        @click="handleAppointmentUpdate()"
        class="bg-primary-green flex h-fit items-center gap-2 rounded-[4px] py-[6px] pl-3 pr-[7px] text-gray-200"
        :class="appointmentIsDone ? 'bg-primary-orange' : 'bg-primary-green'"
      >
        {{ appointmentIsDone ? 'Unfinish' : 'Finish'
        }}<XCircle
          v-if="appointmentIsDone"
          stroke-width="2"
          class="h-[17px] w-[17px]"
        /><CheckCircle v-else stroke-width="2" class="h-[17px] w-[17px]" />
      </button>
    </div>
  </Dialog>
  <!-- End Appointment Detail Modal -->
</template>

<script setup lang="ts">
import { Navigation, Info } from 'lucide-vue-next'
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-vue-next'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import { ref, type PropType } from 'vue'
import { UPDATE_APPOINTMENT } from '@/graphql/appointment.mutation'
import { useMutation } from '@vue/apollo-composable'
import type { Location } from '@/interfaces/location.interface'

const { mutate: updateAppointment, error: updateAppointmentError } =
  useMutation<Appointment>(UPDATE_APPOINTMENT)

const showModal = ref(false)

const props = defineProps({
  appointment: Object as PropType<Appointment>,
})

const appointmentIsDone = ref(props.appointment?.isDone)

// const updatedAppointment = ref<Appointment>(props.appointment)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleAppointmentUpdate = () => {
  updateAppointment({
    updateAppointmentInput: {
      id: props.appointment!.id,
      isDone: !appointmentIsDone.value,
    },
  })
  appointmentIsDone.value = !appointmentIsDone.value

  showModal.value = false
}

// Open location in google maps
const navigateToLocation = (location: Location) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`
  window.open(googleMapsUrl, '_blank')
}
</script>

<template>
  <main
    v-if="appointment"
    class="relative h-fit w-full overflow-hidden rounded-2xl bg-gray-200 p-3 pl-6"
    :class="appointment.isDone ? 'opacity-50' : ''"
    @click="toggleModal()"
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
    <div
      class="grid grid-flow-col gap-3 md:grid-flow-row md:grid-cols-2 md:items-start"
    >
      <p
        class="overflow-hidden text-base"
        :class="variant == 'simple' ? 'col-span-2' : ''"
      >
        {{ appointment.description }}
      </p>
      <button
        v-if="nav"
        class="bg-primary-orange flex items-center gap-2 self-end rounded-[8px] py-[6px] pl-3 pr-[7px] text-gray-200"
        @click="navigateToLocation(appointment.location!)"
        @click.stop
      >
        {{ $t('component.appointment.card.button.navigate') }}
        <Navigation stroke-width="2" class="h-[17px] w-[17px]" />
      </button>
    </div>

    <button
      class="absolute right-3 top-3 transition-all hover:scale-105"
      @click="toggleModal()"
      @click.stop
    >
      <Info class="h-[24px] w-[24px]" />
    </button>
  </main>

  <!-- Appointment Detail Modal -->
  <Dialog
    v-if="appointment"
    v-model:visible="showModal"
    modal
    :header="appointment.user!.fullname"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
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
        {{ $t(appointment.type) }}
      </p>
    </div>

    <div class="my-6 flex flex-col gap-3">
      <div class="flex gap-3">
        <MapPin />
        <p>
          {{ appointment.location!.address }}
        </p>
      </div>
      <div class="h-48 w-full overflow-auto rounded-lg">
        <Map class="h-full w-full" :locations="[appointment.location]" />
      </div>
    </div>
    <div class="flex w-full justify-between gap-3">
      <button
        class="flex h-fit items-center gap-2 rounded-[4px] bg-transparent px-3 py-[6px] outline outline-[1px] hover:bg-black hover:text-gray-200"
        @click="toggleModal()"
      >
        {{ $t('component.appointment.card.button.cancel') }}
      </button>
      <button
        class="bg-primary-green h-fit items-center gap-2 rounded-[4px] py-[6px] pl-3 pr-[7px] text-gray-200"
        :class="[
          appointmentIsDone ? 'bg-primary-orange' : 'bg-primary-green',
          variant === 'simple' ? 'hidden' : 'flex',
        ]"
        @click="handleAppointmentUpdate()"
      >
        {{
          $t(
            appointmentIsDone
              ? 'component.appointment.card.button.unfinish'
              : 'component.appointment.card.button.finish',
          )
        }}<XCircle
          v-if="appointmentIsDone"
          stroke-width="2"
          class="h-[17px] w-[17px]"
        /><CheckCircle v-else stroke-width="2" class="h-[17px] w-[17px]" />
      </button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Map from '../Map.vue'
import useCustomToast from '@/composables/useCustomToast'
import { UPDATE_APPOINTMENT } from '@/graphql/appointment.mutation'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { Location } from '@/interfaces/location.interface'
import { useMutation } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { Info, Navigation } from 'lucide-vue-next'
import { CheckCircle, MapPin, XCircle } from 'lucide-vue-next'
import { type PropType, ref } from 'vue'

// props
const props = defineProps({
  appointment: Object as PropType<Appointment>,
  nav: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: 'default',
  },
})

// composable
const { showToast } = useCustomToast()

// variables
const showModal = ref(false)

const appointmentIsDone = ref(props.appointment?.isDone)

// graphql
const { mutate: updateAppointment } =
  useMutation<Appointment>(UPDATE_APPOINTMENT)

// logics
const toggleModal = () => {
  showModal.value = !showModal.value
}

const handleAppointmentUpdate = () => {
  try {
    updateAppointment({
      updateAppointmentInput: {
        id: props.appointment!.id,
        isDone: !appointmentIsDone.value,
      },
    })
    appointmentIsDone.value = !appointmentIsDone.value

    showModal.value = false
  } catch (error) {
    // console.log('error', error)
    LogRocket.captureException(error as Error)
    showToast(
      'error',
      'toast.error',
      'component.appointment.card.error.appointment',
    )
  }
}

// Open location in google maps
const navigateToLocation = (location: Location) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`
  window.open(googleMapsUrl, '_blank')
}
</script>

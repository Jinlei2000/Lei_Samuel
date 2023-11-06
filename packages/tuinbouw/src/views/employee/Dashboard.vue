<template>
  <div class="flex flex-col items-center justify-center max-w-7xl mx-auto mt-12">
    <div class="grid grid-cols-4 w-full gap-3">
      <div class="col-start-1 col-span-1">
        <h2 class="mb-3 text-2xl">Next Appointment</h2>
        <div class="flex flex-col">
          <AppointmentCard
            v-if="nextAppointment"
            :appointment="nextAppointment"
          />
        </div>
        <div class="flex justify-between items-center mb-3 mt-6">
          <h2 class="text-2xl">Schedule</h2>
          <button class="flex text-base text-primary-orange">
            Calendar <ChevronRight stroke-width="1" />
          </button>
        </div>

        <div
          class="bg-gray-500 p-1 flex justify-between items-center rounded-2xl mb-3"
        >
          <button
            class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
          >
            <ArrowLeft @click="prevDay" class="text-white" />
          </button>
          <p class="">{{ dateDisplay }}</p>
          <button
            class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
          >
            <ArrowRight @click="nextDay" class="text-white" />
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <template v-if="appointments" v-for="(item, index) in appointments">
            <AppointmentCard
              v-if="item !== nextAppointment"
              :appointment="item"
            />
          </template>
        </div>
      </div>
      <div class="col-span-2 col-start-2">
        <h2 class="mb-3 text-2xl">Weather</h2>
        <div class="bg-gray-200 rounded-2xl px-5 py-3">test</div>
      </div>
      <div class="col-span-1 col-start-4">
        <h2 class="mb-3 text-2xl">Tools for the day</h2>
        <ChecklistItem />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import ChecklistItem from '@/components/generic/ChecklistItem.vue'
import { ArrowLeft, ArrowRight, ChevronRight} from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { GET_SCHEDULE_BY_USER_AND_DATE } from '@/graphql/schedule.query'
import { useMutation, useQuery } from '@vue/apollo-composable'

import Button from 'primevue/button'

import useFirebase from '@/composables/useFirebase'
import useCustomUser from '@/composables/useCustomUser'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import Materials from './Materials.vue'
const { firebaseUser } = useFirebase()
const { customUser } = useCustomUser()

const myDate = ref(new Date())
const dateDisplay = ref('Today')

const {
  result: schedule,
  error: scheduleError,
  refetch: scheduleRefetch,
  loading: scheduleLoading,
} = useQuery(GET_SCHEDULE_BY_USER_AND_DATE, () => ({
  userId: customUser.value?.id,
  date: myDate.value.toISOString().substring(0, 10),
}))

const appointments = ref<[Appointment]>()
const nextAppointment = ref<Appointment>()

const showModal = ref(false)
const selectedAppointment = ref<Appointment | null>(null)



watch(schedule, () => {
  if (schedule.value.scheduleByDateAndUserId.length > 0) {
    const now = new Date()
    // // check if there is an appointment that has finalDate withing 30 minutes of current time
    schedule.value.scheduleByDateAndUserId[0].appointments.forEach(
      (appointment: Appointment) => {
        const finalDate = new Date(appointment.finalDate!)
        finalDate.setHours(finalDate.getHours() - 1)
        const diff = Math.abs(finalDate.getTime() - now.getTime())
        const minutes = Math.floor(diff / 1000 / 60)
        if (minutes < 30) {
          console.log('next appointment found', appointment)
          nextAppointment.value = appointment
        } else {
          console.log('no appointment found')
        }

      }
    )

    // set appointments to appointments of schedule
    appointments.value = schedule.value.scheduleByDateAndUserId[0].appointments

    // // if appointment has finaldate that has passed remove it from appointments
    // appointments.value?.forEach((appointment: Appointment) => {
    //   const finalDate = new Date(appointment.finalDate!)
    //   finalDate.setHours(finalDate.getHours() - 1)
    //   const now = new Date()
    //   if (finalDate < now) {
    //     appointments.value?.splice(appointments.value.indexOf(appointment), 1)
    //   }
    // })
  }
})

firebaseUser.value?.getIdToken().then(token => {
  console.log(`{"Authorization": "Bearer ${token}"}`)
})

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

// nextday function
const nextDay = () => {
  const currentDate = myDate.value
  const nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1))
  myDate.value = nextDay
}

const prevDay = () => {
  const currentDate = myDate.value
  const prevDay = new Date(currentDate.setDate(currentDate.getDate() - 1))
  myDate.value = prevDay
}

// @ts-ignore
watch(myDate, () => {
  switch (myDate.value.getDate()) {
    case new Date().getDate():
      dateDisplay.value = 'Today'
      break
    case new Date().getDate() + 1:
      dateDisplay.value = 'Tomorrow'
      break
    case new Date().getDate() - 1:
      dateDisplay.value = 'Yesterday'
      break
    default:
      dateDisplay.value =
        days[myDate.value.getDay()] +
        ' (' +
        myDate.value.getDate() +
        '/' +
        myDate.value.getMonth() +
        ')'
      break
  }
})
</script>

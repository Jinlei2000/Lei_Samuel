<template>
  <div
    class="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-center"
  >
    <div class="grid w-full grid-cols-4 gap-3">
      <div class="col-span-1 col-start-1">
        <h2 class="mb-3 text-2xl">Next Appointment</h2>
        <div class="flex flex-col">
          <AppointmentCard
            v-if="nextAppointment"
            :appointment="nextAppointment"
          />
          <div
            v-else
            class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <p class="text-gray-500">No appointments for today</p>
          </div>
        </div>
        <div class="mb-3 mt-6 flex items-center justify-between">
          <h2 class="text-2xl">Schedule</h2>
          <RouterLink
            :to="`/employee/calendar`"
            class="text-primary-orange group flex text-base"
          >
            Calendar
            <ChevronRight
              class="transition-all group-hover:translate-x-1"
              stroke-width="1"
            />
          </RouterLink>
        </div>

        <div
          class="mb-3 flex items-center justify-between rounded-2xl bg-gray-500 p-1"
        >
          <button
            class="bg-primary-orange rounded-xl p-1 transition-all hover:scale-110"
          >
            <ArrowLeft class="text-white" @click="prevDay" />
          </button>
          <p class="">{{ dateDisplay }}</p>
          <button
            class="bg-primary-orange rounded-xl p-1 transition-all hover:scale-110"
          >
            <ArrowRight class="text-white" @click="nextDay" />
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <template v-for="(item, index) in appointments" v-if="appointments">
            <AppointmentCard
              v-if="item !== nextAppointment"
              :key="index"
              :appointment="item"
            />
          </template>
          <template
            v-for="(item, index) in finishedAppointments"
            v-if="finishedAppointments"
          >
            <AppointmentCard
              v-if="item !== nextAppointment"
              :key="index"
              :appointment="item"
            />
          </template>
          <div
            v-else
            class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <p class="text-gray-500">No appointments for today</p>
          </div>
        </div>
      </div>
      <div class="col-span-2">
        <div class="mb-3">
          <h2 class="mb-3 text-2xl">Weather</h2>
          <div
            class="min-h-24 flex items-center justify-center rounded-2xl bg-gray-200 px-5 py-3"
          >
            <Loader2 v-if="!forecast" class="text-primary-green animate-spin" />
            <div v-if="forecast" class="flex h-full w-full justify-between">
              <div
                v-for="(item, index) in forecast"
                :key="index"
                class="flex flex-col items-center"
              >
                <h3>{{ days[new Date(item.dt_txt).getDay()] }}</h3>
                <img
                  class="h-20 w-20 mix-blend-multiply"
                  :src="getWeatherIconUrl(item.weather[0].icon)"
                  alt=""
                />
                <p class="text-sm">
                  {{ Math.round(item.main.temp).toFixed() }}°C
                </p>
              </div>
            </div>
          </div>
        </div>
        <Map
          v-if="todaysLocations"
          class="rounded-2xl"
          :locations="todaysLocations"
        ></Map>
        <Map v-else class="rounded-2xl"></Map>
      </div>
      <div class="col-span-1 col-start-4">
        <h2 class="mb-3 text-2xl">Tools for the day</h2>
        <div v-if="materials" class="flex flex-col gap-3">
          <ChecklistItem
            v-for="item in materials"
            :key="item.id"
            :material="item"
          />
        </div>
        <div
          v-else
          class="flex h-12 w-full items-center justify-center rounded-2xl bg-gray-200"
        >
          <p class="text-gray-500">No materials for today</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getForecastForWeek } from '@/api/openWeather'
import Map from '@/components/Map.vue'
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import ChecklistItem from '@/components/generic/ChecklistItem.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import { GET_SCHEDULE_BY_USER_AND_DATE } from '@/graphql/schedule.query'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { Location } from '@/interfaces/location.interface'
import type { Material } from '@/interfaces/material.interface'
import { useQuery } from '@vue/apollo-composable'
import { ArrowLeft, ArrowRight, ChevronRight, Loader2 } from 'lucide-vue-next'
import { ref, watch, watchEffect } from 'vue'

const { customUser } = useCustomUser()
const { showToast } = useCustomToast()

const myDate = ref(new Date())
const dateDisplay = ref('Today')
const forecast = ref<any>()

const todaysLocations = ref<Location[]>()

const getWeekForecast = async (lon: string, lat: string) => {
  await getForecastForWeek(lon, lat).then(data => {
    forecast.value = data
  })
}

const getWeatherIconUrl = (icon: string) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

navigator.geolocation.getCurrentPosition(position => {
  getWeekForecast(
    position.coords.latitude.toString(),
    position.coords.longitude.toString(),
  )
})

const {
  result: schedule,
  error: scheduleError,
  refetch: scheduleRefetch,
  loading: scheduleLoading,
} = useQuery(
  GET_SCHEDULE_BY_USER_AND_DATE,
  () => ({
    userId: customUser.value?.id,
    date: myDate.value.toISOString().substring(0, 10),
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

const appointments = ref<[Appointment]>()
const nextAppointment = ref<Appointment>()
const finishedAppointments = ref<[Appointment]>()

const materials = ref<[Material]>()

const setNextAppointment = () => {
  // get only first appointment in schedule.value.scheduleByDateAndUserId[0].appointments with isDone false
  nextAppointment.value =
    schedule.value.scheduleByDateAndUserId[0].appointments.find(
      (appointment: Appointment) => appointment.isDone === false,
    )
}

const setAppointments = () => {
  // set appointments to appointments of schedule where isDone is false
  appointments.value =
    schedule.value.scheduleByDateAndUserId[0].appointments.filter(
      (appointment: Appointment) => appointment.isDone === false,
    )
}

const setTodaysLocations = () => {
  // set appointments to appointments of schedule where isDone is false
  todaysLocations.value = schedule.value.scheduleByDateAndUserId[0].appointments
    .filter((appointment: Appointment) => appointment.isDone === false)
    .map((appointment: Appointment) => {
      return {
        id: appointment.location?.id,
        userId: appointment.location?.userId,
        address: appointment.location?.address,
        lat: appointment.location?.lat,
        lng: appointment.location?.lng,
      }
    })
}

const setFinishedAppointments = () => {
  // set appointments to appointments of schedule where isDone is true
  finishedAppointments.value =
    schedule.value.scheduleByDateAndUserId[0].appointments.filter(
      (appointment: Appointment) => appointment.isDone === true,
    )
}

watch(schedule, () => {
  if (schedule.value && schedule.value.scheduleByDateAndUserId.length > 0) {
    // const now = new Date()
    // // check if there is an appointment that has finalDate withing 30 minutes of current time
    // schedule.value.scheduleByDateAndUserId[0].appointments.forEach(
    //   (appointment: Appointment) => {
    //     const finalDate = new Date(appointment.finalDate!)
    //     finalDate.setHours(finalDate.getHours() - 1)
    //     const diff = Math.abs(finalDate.getTime() - now.getTime())
    //     const minutes = Math.floor(diff / 1000 / 60)
    //     if (minutes < 30) {
    //       console.log('next appointment found', appointment)
    //       nextAppointment.value = appointment
    //     } else {
    //       console.log('no appointment found')
    //     }

    //   }
    // )

    setNextAppointment()
    setAppointments()
    setFinishedAppointments()
    setTodaysLocations()

    // set appointments to appointments of schedule
    // appointments.value = schedule.value.scheduleByDateAndUserId[0].appointments

    // // if appointment has finaldate that has passed remove it from appointments
    // appointments.value?.forEach((appointment: Appointment) => {
    //   const finalDate = new Date(appointment.finalDate!)
    //   finalDate.setHours(finalDate.getHours() - 1)
    //   const now = new Date()
    //   if (finalDate < now) {
    //     appointments.value?.splice(appointments.value.indexOf(appointment), 1)
    //   }
    // })

    materials.value = schedule.value.scheduleByDateAndUserId[0].materials
  }
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
  resetAppointments()
  const currentDate = myDate.value
  const nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1))
  myDate.value = nextDay
}

const prevDay = () => {
  resetAppointments()
  const currentDate = myDate.value
  const prevDay = new Date(currentDate.setDate(currentDate.getDate() - 1))
  myDate.value = prevDay
}

const resetAppointments = () => {
  nextAppointment.value = undefined
  appointments.value = undefined
  finishedAppointments.value = undefined
  materials.value = undefined
  todaysLocations.value = undefined
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

watchEffect(() => {
  // log the queries

  // all errors
  const errors = [scheduleError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

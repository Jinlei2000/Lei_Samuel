<template>
  <div
    class="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-center"
  >
    <div class="grid w-full grid-cols-4 gap-3">
      <div class="col-span-1 col-start-1">
        <h2 class="mb-3 text-2xl">Next Appointment</h2>
        <div class="flex flex-col">
          <AppointmentCard
            v-if="scheduleData.nextAppointment"
            :appointment="scheduleData.nextAppointment"
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
          <template
            v-for="(item, index) in scheduleData.appointments"
            v-if="scheduleData.appointments"
          >
            <AppointmentCard
              v-if="item !== scheduleData.nextAppointment"
              :key="index"
              :appointment="item"
            />
          </template>
          <template
            v-for="(item, index) in scheduleData.finishedAppointments"
            v-if="scheduleData.finishedAppointments"
          >
            <AppointmentCard
              v-if="item !== scheduleData.nextAppointment"
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
          class="h-72 w-full overflow-hidden rounded-2xl"
          :locations="scheduleData.todaysLocations"
          :controls="true"
        />
      </div>
      <div class="col-span-1 col-start-4">
        <h2 class="mb-3 text-2xl">Tools for the day</h2>
        <div v-if="scheduleData.materials" class="flex flex-col gap-3">
          <ChecklistItem
            v-for="item in scheduleData.materials"
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
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import ChecklistItem from '@/components/generic/ChecklistItem.vue'
import Map from '@/components/Map.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import { GET_SCHEDULE_BY_USER_AND_DATE } from '@/graphql/schedule.query'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import { useQuery } from '@vue/apollo-composable'
import { ArrowLeft, ArrowRight, ChevronRight, Loader2 } from 'lucide-vue-next'
import { computed, ref, watch, watchEffect } from 'vue'

const { customUser } = useCustomUser()
const { showToast } = useCustomToast()

const myDate = ref(new Date())
const dateDisplay = ref('Today')
const forecast = ref<any>()

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
  result: scheduleResult,
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

const schedule = computed(() => {
  return scheduleResult.value?.scheduleByDateAndUserId[0] ?? null
})

const scheduleData = ref({
  appointments: computed(() => {
    return schedule.value?.appointments.filter(
      (appointment: Appointment) => appointment.isDone === false,
    )
  }),
  materials: computed(() => {
    return schedule.value?.materials
  }),
  finishedAppointments: computed(() => {
    return schedule.value?.appointments.filter(
      (appointment: Appointment) => appointment.isDone === true,
    )
  }),
  nextAppointment: computed(() => {
    return schedule.value?.appointments.find(
      (appointment: Appointment) => appointment.isDone === false,
    )
  }),
  todaysLocations: computed(() => {
    return schedule.value?.appointments
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
  }),
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
  scheduleRefetch()
  const currentDate = myDate.value
  const nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1))
  myDate.value = nextDay
}

const prevDay = () => {
  scheduleRefetch()
  const currentDate = myDate.value
  const prevDay = new Date(currentDate.setDate(currentDate.getDate() - 1))
  myDate.value = prevDay
}

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

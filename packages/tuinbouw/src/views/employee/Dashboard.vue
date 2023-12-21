<template>
  <main
    class="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center justify-center"
  >
    <div
      class="w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4"
    >
      <!-- Next Appointment & Schedule -->
      <section class="col-span-1 col-start-1 mb-6 sm:mb-0">
        <h2 class="mb-3 text-2xl">
          {{ $t('dashboard.employee.title.next.appointment') }}
        </h2>
        <!-- Next Appointment -->
        <div class="flex flex-col">
          <!-- Next Appointment -->
          <AppointmentCard
            v-if="scheduleData.nextAppointment"
            :appointment="scheduleData.nextAppointment"
          />
          <!-- Skeleton Loader -->
          <div
            v-else-if="loading.schedule"
            class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <Loader2 class="text-primary-green h-32 animate-spin" />
          </div>
          <!-- No Appointments -->
          <div
            v-else
            class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <p class="text-gray-500">
              {{ $t('dashboard.employee.no.appointments.today') }}
            </p>
          </div>
        </div>

        <!-- Header Schedule -->
        <div class="mb-3 mt-6 flex items-center justify-between">
          <h2 class="text-2xl">
            {{ $t('dashboard.employee.title.schedule') }}
          </h2>
          <RouterLink
            :to="`/employee/calendar`"
            class="text-primary-orange group flex items-center text-lg sm:text-base"
          >
            {{ $t('dashboard.employee.button.calender') }}
            <ChevronRight
              class="h-8 w-8 transition-all group-hover:translate-x-1 sm:h-auto sm:w-auto"
              stroke-width="1"
            />
          </RouterLink>
        </div>

        <!-- Controls Schedule -->
        <div
          class="mb-3 flex items-center justify-between rounded-2xl bg-gray-500 p-1 text-xl sm:text-base"
        >
          <button
            class="bg-primary-orange rounded-xl p-1 transition-all hover:scale-110"
          >
            <ArrowLeft
              class="h-7 w-7 text-white sm:h-auto sm:w-auto"
              @click="prevDay"
            />
          </button>
          <p>{{ $t(dateDisplay) }}</p>
          <button
            class="bg-primary-orange rounded-xl p-1 transition-all hover:scale-110"
          >
            <ArrowRight
              class="h-7 w-7 text-white sm:h-auto sm:w-auto"
              @click="nextDay"
            />
          </button>
        </div>
        <!-- Appointments Of Schedule -->
        <div class="flex flex-col gap-3">
          <!-- Appointments -->
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
          <!-- Finished Appointments -->
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
          <!-- Skeleton Loader -->
          <div
            v-else-if="loading.schedule"
            class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <Loader2 class="text-primary-green h-32 animate-spin" />
          </div>
          <!-- No Appointments -->
          <div
            v-else
            class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <p class="text-gray-500">
              {{ $t('dashboard.employee.no.appointments.today') }}
            </p>
          </div>
        </div>
      </section>
      <!-- Weather & Map -->
      <section class="col-span-1 hidden md:block lg:col-span-2">
        <!-- Weather -->
        <div class="mb-3">
          <h2 class="mb-3 hidden text-2xl lg:block">
            {{ $t('dashboard.employee.title.weather') }}
          </h2>
          <h2 class="mb-3 text-2xl lg:hidden">
            {{ $t('dashboard.employee.title.map') }}
          </h2>
          <div
            class="min-h-24 hidden items-center justify-center rounded-2xl bg-gray-200 px-5 py-3 lg:flex"
          >
            <Loader2 v-if="!forecast" class="text-primary-green animate-spin" />
            <div v-if="forecast" class="flex h-full w-full justify-between">
              <div
                v-for="(item, index) in forecast"
                :key="index"
                class="flex flex-col items-center"
              >
                <h3>{{ $t(days[new Date(item.dt_txt).getDay()]) }}</h3>
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
        <!-- Map -->
        <Map
          class="h-72 w-full overflow-hidden rounded-2xl"
          :locations="scheduleData.todaysLocations"
          :controls="true"
        />
      </section>
      <!-- Weather Notifications & Materials -->
      <section class="col-span-1 mb-3 lg:col-start-4">
        <!-- Header -->
        <button
          class="mb-3 flex w-full items-center justify-between"
          @click="handleMaterialsCollapsible()"
        >
          <h2 class="text-2xl">
            {{ $t('dashboard.employee.title.tools') }}
          </h2>
          <ChevronDown
            v-if="isMobile()"
            class="h-8 w-8 transform transition-all"
            :class="materialsCollapsed ? 'rotate-0' : 'rotate-180'"
          />
        </button>
        <!-- Content -->
        <div v-show="!isMobile() || !materialsCollapsed">
          <!-- Notifications -->
          <div
            v-if="forecast && forecast[0].rain"
            class="bg-primary-blue relative mb-3 rounded-2xl p-3 text-white"
          >
            <CloudRainWind class="absolute right-3 top-3 h-7 w-7" />
            <h3 class="mb-3 text-xl">
              {{ $t('dashboard.employee.weather.rain.title') }}
            </h3>
            <p>{{ $t('dashboard.employee.weather.rain.text') }}</p>
          </div>
          <div
            v-if="forecast && forecast[0].main.temp < 10"
            class="bg-primary-blue relative mb-3 rounded-2xl p-3 text-white"
          >
            <ThermometerSnowflake class="absolute right-3 top-3 h-7 w-7" />
            <h3 class="mb-3 text-xl">
              {{ $t('dashboard.employee.weather.cold.title') }}
            </h3>
            <p>
              {{ $t('dashboard.employee.weather.cold.text') }}
            </p>
          </div>
          <div
            v-if="forecast && forecast[0].main.temp > 28"
            class="bg-primary-red relative mb-3 rounded-2xl p-3 text-white"
          >
            <Sun class="absolute right-3 top-3 h-7 w-7" />
            <h3 class="mb-3 text-xl">
              {{ $t('dashboard.employee.weather.hot.title') }}
            </h3>
            <p>{{ $t('dashboard.employee.weather.hot.text') }}</p>
          </div>
          <!-- Materials -->
          <div v-if="scheduleData.materials" class="flex flex-col gap-3">
            <ChecklistItem
              v-for="item in scheduleData.materials"
              :key="item.id"
              :material="item"
            />
          </div>
          <!-- Skeleton Loader -->
          <div
            v-else-if="loading.schedule"
            class="flex h-12 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <Loader2 class="text-primary-green h-12 animate-spin" />
          </div>
          <!-- No Materials -->
          <div
            v-else
            class="flex h-12 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <p class="text-gray-500">
              {{ $t('dashboard.employee.no.materials') }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
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
import LogRocket from 'logrocket'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CloudRainWind,
  Loader2,
  Sun,
  ThermometerSnowflake,
} from 'lucide-vue-next'
import type { ComputedRef } from 'vue'
import { computed, ref, watch, watchEffect } from 'vue'

const { customUser } = useCustomUser()
const { showToast } = useCustomToast()

const myDate = ref(new Date())
const dateDisplay = ref('dashboard.employee.schedule.today')
const forecast = ref<any>()

const materialsCollapsed = ref(true)
const loading = ref<{
  schedule: ComputedRef<boolean>
}>({
  schedule: computed(() => {
    return scheduleLoading.value
  }),
})

const getWeekForecast = async (lon: string, lat: string) => {
  await getForecastForWeek(lon, lat).then(data => {
    forecast.value = data
  })
  // console.log(forecast.value)
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
  'dashboard.employee.schedule.sunday',
  'dashboard.employee.schedule.monday',
  'dashboard.employee.schedule.tuesday',
  'dashboard.employee.schedule.wednesday',
  'dashboard.employee.schedule.thursday',
  'dashboard.employee.schedule.friday',
  'dashboard.employee.schedule.saturday',
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
      dateDisplay.value = 'dashboard.employee.schedule.today'
      break
    case new Date().getDate() + 1:
      dateDisplay.value = 'dashboard.employee.schedule.tomorrow'
      break
    case new Date().getDate() - 1:
      dateDisplay.value = 'dashboard.employee.schedule.yesterday'
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

// Check if website is being viewed on mobile (responsiveness)
const isMobile = () => {
  if (window.innerWidth <= 640) {
    return true
  }
  return false
}

const handleMaterialsCollapsible = () => {
  materialsCollapsed.value = !materialsCollapsed.value
}

watchEffect(() => {
  // log the queries

  // all errors
  if (scheduleError.value) {
    // console.log(scheduleError.value)
    LogRocket.captureException(scheduleError.value)
    showToast('error', 'toast.error', 'dashboard.employee.error.schedules')
  }
})
</script>

<template>
  <main class="m-auto mt-12 flex max-w-7xl flex-col gap-3">
    <!-- Week selection -->
    <section class="flex w-full grid-cols-3 flex-col gap-3 md:grid md:gap-0">
      <h1 class="col-start-1 text-2xl">Calendar</h1>
      <div class="flex gap-3">
        <div
          class="col-start-2 row-start-2 flex w-full items-center justify-between justify-self-center rounded-2xl bg-gray-500 p-1 md:row-start-1"
        >
          <button
            class="bg-primary-orange rounded-xl p-1 transition-all hover:scale-110"
          >
            <ArrowLeft class="text-white" @click="getPreviousWeekBounds" />
          </button>
          <div v-if="firstDay && lastDay" class="flex gap-4">
            <p>
              {{ formatDate(firstDay) }}
            </p>
            <p>-</p>
            <p>
              {{ formatDate(lastDay) }}
            </p>
          </div>
          <button
            class="bg-primary-orange rounded-xl p-1 transition-all hover:scale-110"
          >
            <ArrowRight class="text-white" @click="getNextWeekBounds" />
          </button>
        </div>
        <button
          class="border-primary-green text-primary-green flex w-fit items-center justify-center gap-3 rounded-2xl border px-[18px] transition-all hover:scale-105"
          @click="getWeekBounds"
        >
          Today
        </button>
      </div>
    </section>

    <!-- Calendar for the selected week -->
    <section class="flex w-full grid-cols-5 flex-col gap-3 md:grid">
      <div
        v-for="index in 5"
        v-if="firstDay"
        :key="index"
        class="flex flex-col gap-3"
      >
        <div
          class="relative flex items-center justify-center rounded-2xl bg-gray-500 p-2"
          @click="toggleAccordion(index)"
        >
          <p class="text-lg">
            {{
              days[getDateWithOffset(index).getDay()] +
              ' ' +
              formatDate(getDateWithOffset(index))
            }}
          </p>
          <div
            class="bg-primary-green absolute right-1 flex h-9 w-9 items-center justify-center rounded-xl text-white sm:hidden"
          >
            {{ getAppointmentAmountForDay(getDateWithOffset(index)) }}
          </div>
        </div>

        <div
          v-show="
            (!isMobile() && schedulesLoading) ||
            (isAccordionOpen[index - 1] && schedulesLoading)
          "
          class="flex flex-col gap-3"
        >
          <div
            v-for="n in Math.floor(Math.random() * 3) + 1"
            :key="n"
            class="flex h-32 w-full animate-pulse flex-col gap-2 rounded-2xl bg-gray-200 p-3"
          >
            <div class="h-4 w-full rounded-full bg-gray-500"></div>
            <div class="flex h-16 w-full flex-col gap-2 rounded-2xl">
              <div class="h-3 w-2/3 rounded-full bg-gray-400"></div>
              <div class="h-3 w-1/2 rounded-full bg-gray-400"></div>
              <div class="h-3 w-3/4 rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>

        <div
          v-show="
            (!isMobile() && !schedulesLoading) ||
            (isAccordionOpen[index - 1] && !schedulesLoading)
          "
          v-if="getAppointmentAmountForDay(getDateWithOffset(index)) > 0"
        >
          <div v-for="schedule in weekSchedules" :key="schedule.id">
            <div
              v-if="
                schedule.finalDate.toString().substring(0, 10) ===
                getDateWithOffset(index).toISOString().substring(0, 10)
              "
              class="flex flex-col gap-3"
            >
              <AppointmentCard
                v-for="(item, index) in schedule.appointments"
                :key="index"
                :appointment="item"
                :nav="false"
              />
            </div>
          </div>
        </div>

        <div
          v-show="!isMobile() || isAccordionOpen[index - 1]"
          v-if="
            getAppointmentAmountForDay(getDateWithOffset(index)) == 0 &&
            weekSchedules &&
            weekSchedules.length > 0
          "
        >
          <div
            v-if="!schedulesLoading"
            class="flex h-20 w-full items-center justify-center rounded-2xl bg-gray-200 p-3"
          >
            <p>No Appointments this day</p>
          </div>
        </div>
      </div>
      <div
        v-if="!schedulesLoading && weekSchedules && weekSchedules.length < 1"
        class="col-span-5 flex h-36 w-full items-center justify-center rounded-2xl bg-gray-200"
      >
        <p>No Appointments this week</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import { GET_SCHEDULES_FROM_DATE_FOR_DAYS_BY_USER_ID } from '@/graphql/schedule.query'
import type { Schedule } from '@/interfaces/schedule.interface'
import { useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { ref, watch, watchEffect } from 'vue'

// composable
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()

// variables
const firstDay = ref<Date>()
const lastDay = ref<Date>()
const isAccordionOpen = ref<boolean[]>([true, false, false, false, false])

const weekSchedules = ref<[Schedule]>()

const variables = ref<{
  userId: string | undefined
  date: string
  days: number
}>({
  userId: customUser.value?.id,
  date: '',
  days: 5,
})

const days: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

// graphql
const {
  result: schedules,
  error: schedulesError,
  loading: schedulesLoading,
} = useQuery(GET_SCHEDULES_FROM_DATE_FOR_DAYS_BY_USER_ID, variables, {
  fetchPolicy: 'cache-and-network',
})

// logics
const setWeekSchedule = (): void => {
  // console.log('schedules', schedules.value?.schedulesFromDateForDaysByUserId)
  weekSchedules.value = schedules.value?.schedulesFromDateForDaysByUserId
}

const toggleAccordion = (index: number): void => {
  // console.log(index)
  isAccordionOpen.value[index - 1] = !isAccordionOpen.value[index - 1]
  // console.log(isAccordionOpen.value)
}

const isMobile = (): boolean => {
  if (window.innerWidth <= 640) {
    return true
  }
  return false
}

const getAppointmentAmountForDay = (date: Date): number => {
  let amount = 0
  if (weekSchedules.value) {
    for (const schedule of weekSchedules.value) {
      if (
        schedule.finalDate.toString().substring(0, 10) ===
        date.toISOString().substring(0, 10)
      ) {
        amount = schedule.appointments.length
      }
    }
    return amount
  }
  return 0
}

// Functions that run on component mount
const initialize = (): void => {
  getWeekBounds()
}

// Function that returns the first and last day of the workweek (Monday - Friday)
const getWeekBounds = (): void => {
  const today = new Date()
  const first = today.getDate() - today.getDay() + 1
  const last = first + 4

  const firstDayOfWeek = new Date(today.setDate(first))
  const lastDayOfWeek = new Date(today.setDate(last))

  firstDay.value = firstDayOfWeek
  lastDay.value = lastDayOfWeek

  variables.value.date = firstDayOfWeek.toISOString().substring(0, 10)
}

// Function that sets firstDay and lastDay to 1 week later
const getNextWeekBounds = (): void => {
  const newFirstDay = firstDay.value!.setDate(firstDay.value!.getDate() + 7)
  const newLastDay = lastDay.value!.setDate(lastDay.value!.getDate() + 7)

  firstDay.value = new Date(newFirstDay)
  lastDay.value = new Date(newLastDay)

  variables.value.date = firstDay.value!.toISOString().substring(0, 10)
}

// Function that sets firstDay and lastDay to 1 week earlier
const getPreviousWeekBounds = (): void => {
  const newFirstDay = firstDay.value!.setDate(firstDay.value!.getDate() - 7)
  const newLastDay = lastDay.value!.setDate(lastDay.value!.getDate() - 7)

  firstDay.value = new Date(newFirstDay)
  lastDay.value = new Date(newLastDay)

  variables.value.date = firstDay.value!.toISOString().substring(0, 10)
}

// Get date with offset
const getDateWithOffset = (offset: number): Date => {
  const date = new Date(firstDay.value!)
  date.setDate(date.getDate() + offset - 1)
  return date
}

// Function that formats a date to a string (dd/mm)
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
  })
}

watch(schedules, () => {
  setWeekSchedule()
})

initialize()

watchEffect(() => {
  // all errors
  if (schedulesError.value) {
    // console.log(schedulesError.value)
    LogRocket.captureException(schedulesError.value)
    showToast('error', 'Error', "Couldn't load schedules")
  }
})
</script>

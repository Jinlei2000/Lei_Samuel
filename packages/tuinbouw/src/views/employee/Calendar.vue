<template>
  <div class="flex flex-col mt-12 gap-5 max-w-7xl m-auto">
    <!-- Week selection -->
    <div class="w-full grid grid-cols-3">
      <h1 class="col-start-1 text-2xl">Calendar</h1>
      <div
        class="w-full col-start-2 justify-self-center bg-gray-500 p-1 flex justify-between items-center rounded-2xl mb-3"
      >
        <button
          class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
        >
          <ArrowLeft @click="getPreviousWeekBounds" class="text-white" />
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
          class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
        >
          <ArrowRight @click="getNextWeekBounds" class="text-white" />
        </button>
      </div>
    </div>

    <!-- Calendar for the selected week -->
    <div class="w-full grid grid-cols-5 gap-3">
      <div
        v-if="firstDay"
        v-for="index in 5"
        :key="index"
        class="bg-gray-500 p-1 rounded-2xl"
      >
        <p class="text-white">
          <!-- display firstDay + index days -->
          {{ index }}
          {{ getDateWithOffset(index) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { ref, watchEffect, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import { GET_SCHEDULES_FROM_DATE_FOR_DAYS_BY_USER_ID } from '@/graphql/schedule.query'
import useCustomUser from '@/composables/useCustomUser'

// Variables
const firstDay = ref<Date>()
const lastDay = ref<Date>()
const daysOfWeek = ref<Date[]>([])

const { customUser } = useCustomUser()

const variables = ref({
  userId: customUser.value?.id,
  date: '',
  days: 5,
})

const {
  result: schedules,
  error: schedulesError,
  loading: schedulesLoading,
  refetch: refetchSchedules,
} = useQuery(GET_SCHEDULES_FROM_DATE_FOR_DAYS_BY_USER_ID, variables, {
  fetchPolicy: 'cache-and-network',
})

// Functions that run on component mount
const initialize = () => {
  getWeekBounds()
}

// Function that returns the first and last day of the workweek (Monday - Friday)
const getWeekBounds = () => {
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
const getNextWeekBounds = () => {
  const newFirstDay = firstDay.value!.setDate(firstDay.value!.getDate() + 7)
  const newLastDay = lastDay.value!.setDate(lastDay.value!.getDate() + 7)

  firstDay.value = new Date(newFirstDay)
  lastDay.value = new Date(newLastDay)

  variables.value.date = firstDay.value!.toISOString().substring(0, 10)
}

// Function that sets firstDay and lastDay to 1 week earlier
const getPreviousWeekBounds = () => {
  const newFirstDay = firstDay.value!.setDate(firstDay.value!.getDate() - 7)
  const newLastDay = lastDay.value!.setDate(lastDay.value!.getDate() - 7)

  firstDay.value = new Date(newFirstDay)
  lastDay.value = new Date(newLastDay)

  variables.value.date = firstDay.value!.toISOString().substring(0, 10)
}

// Get date with offset
const getDateWithOffset = (offset: number) => {
  const date = new Date(firstDay.value!)
  date.setDate(date.getDate() + offset - 1)
  return date
}

// Function that formats a date to a string (dd/mm)
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
  })
}

watchEffect(() => {
  if (schedules.value) {
    console.log(schedules.value)
  }
})

initialize()
</script>

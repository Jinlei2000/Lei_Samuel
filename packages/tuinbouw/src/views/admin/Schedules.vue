<template>
  <div
    class="m-auto mb-6 mt-12 flex max-w-7xl flex-col items-center justify-center gap-3"
  >
    <div class="flex w-full flex-col gap-3">
      <!-- Title + Sort -->
      <header class="flex w-full items-center justify-between">
        <!-- Title -->
        <h1 class="text-2xl">Appointments</h1>
        <div class="flex gap-3">
          <!-- Sort -->
          <Sort v-model="variables.order" :options="SORT_OPTIONS_SCHEDULES" />
        </div>
      </header>
    </div>
    <div class="flex w-full justify-end">
      <!-- add schedule button -->
      <Router-link :to="`/admin/add-schedule`">
        <button class="bg-primary-green rounded px-4 py-2 font-bold text-white">
          Add Schedule
        </button>
      </Router-link>
    </div>
  </div>

  <!-- show loading -->
  <div v-if="schedulesLoading" class="m-auto flex max-w-7xl flex-col gap-3">
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
  </div>

  <!-- show schedules -->
  <div v-else-if="schedules && schedules.length > 0">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="schedule in schedules"
        :key="schedule.id"
        class="transform overflow-hidden rounded-md border border-gray-400 bg-white shadow-md transition-transform hover:scale-105"
      >
        <div class="p-6">
          <h2 class="mb-2 text-2xl font-semibold">
            {{ schedule.id }}
          </h2>
          <p class="text-gray-600">Created By: {{ schedule.createdBy }}</p>
          <p class="text-gray-600">
            Final Date: {{ formatDateTime(schedule.finalDate) }}
          </p>

          <!-- Add other schedule information as needed -->

          <!-- Appointments, Employees, Materials -->
          <div>
            <p class="text-gray-600">
              Appointments: {{ schedule.appointments.length }}
            </p>
            <p class="text-gray-600">
              Employees: {{ schedule.employees.length }}
            </p>
            <p class="text-gray-600">
              Materials: {{ schedule.materials.length }}
            </p>
          </div>
        </div>
        <div
          class="flex items-center justify-end space-x-4 border-t border-gray-200 p-6"
        >
          <!-- View More Button -->
          <Router-link :to="`/admin/schedules/${schedule.id}`">
            <button class="text-green-500">
              <Eye />
            </button>
          </Router-link>

          <!-- Edit Button -->
          <Router-link
            v-if="isNotInPastOrToday(schedule.finalDate)"
            :to="`/admin/schedules/${schedule.id}/edit`"
          >
            <button class="text-blue-500">
              <Pencil />
            </button>
          </Router-link>

          <!-- Delete Button -->
          <button
            v-if="isNotInPastOrToday(schedule.finalDate)"
            class="text-red-500"
            @click="handleDeleteSchedule(schedule)"
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- show no schedules -->
  <div v-else-if="schedules.length === 0">
    <p class="text-6xl font-black">No Schedules Found</p>
  </div>
</template>

<script setup lang="ts">
import Sort from '@/components/generic/Sort.vue'
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { DELETE_SCHEDULE } from '@/graphql/schedule.mutation'
import { GET_ALL_SCHEDULES } from '@/graphql/schedule.query'
import { ORDER_DIRECTION, SORT_OPTIONS_SCHEDULES } from '@/helpers/constants'
import type { Schedule } from '@/interfaces/schedule.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ArrowLeft, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { computed, ref, watchEffect } from 'vue'

// composables
const { showToast } = useCustomToast()
const { formatDateTime, isNotInPastOrToday } = useTimeUtilities()

// variables
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
})

const schedules = computed(() => schedulesResult.value?.schedules || [])

// graphql
const {
  result: schedulesResult,
  error: schedulesError,
  loading: schedulesLoading,
  refetch: refetchSchedules,
} = useQuery(GET_ALL_SCHEDULES, variables, {
  fetchPolicy: 'cache-and-network',
})

const { mutate: deleteSchedule, error: deleteScheduleError } =
  useMutation(DELETE_SCHEDULE)

// logics
// delete schedule
const handleDeleteSchedule = async (schedule: Schedule) => {
  await deleteSchedule({
    id: schedule.id,
  })
  showToast('success', 'Success', `Schedule deleted`)
  refetchSchedules()
}

watchEffect(() => {
  // log the queries
  // if (schedules.value) console.log(schedules.value)

  // all errors
  const errors = [schedulesError.value, deleteScheduleError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

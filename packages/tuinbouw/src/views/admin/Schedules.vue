<template>
  <!-- go back button -->
  <button class="flex" @click="$router.go(-1)" v-bind="$attrs">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Schedules
  </h1>

  <!-- add schedule button -->
  <Router-link :to="`/admin/add-schedule`">
    <button
      class="bg-primary-green my-4 rounded px-4 py-2 font-bold text-white"
    >
      Add Schedule
    </button>
  </Router-link>

  <!-- TODO: filters & orders -->

  <!-- TODO: search bar -->

  <!-- show loading -->
  <div v-if="schedulesLoading">
    <p class="text-6xl font-black">Loading Schedules...</p>
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
            :to="`/admin/schedules/${schedule.id}/edit`"
            v-if="isNotInPastOrToday(schedule.finalDate)"
          >
            <button class="text-blue-500">
              <Pencil />
            </button>
          </Router-link>

          <!-- Delete Button -->
          <button
            v-if="isNotInPastOrToday(schedule.finalDate)"
            @click="handleDeleteSchedule(schedule)"
            class="text-red-500"
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
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { DELETE_SCHEDULE } from '@/graphql/schedule.mutation'
import { GET_ALL_SCHEDULES } from '@/graphql/schedule.query'
import { ORDER_DIRECTION } from '@/helpers/constants'
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

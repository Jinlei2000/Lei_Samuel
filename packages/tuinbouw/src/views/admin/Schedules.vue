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
    <div class="h-11 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-11 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-11 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-11 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-11 w-full animate-pulse rounded-2xl bg-gray-200"></div>
  </div>

  <!-- show schedules -->
  <div v-else-if="schedules && schedules.length > 0">
    <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
      <div v-for="schedule in schedules" :key="schedule.id">
        <button
          class="relative w-full rounded-2xl bg-gray-200 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300"
          @click="toggleModal(schedule, 'detail')"
        >
          <div class="flex h-16 items-center justify-between sm:h-11">
            <h2
              class="ml-3 w-1/2 min-w-fit text-left text-base sm:w-1/3 sm:text-lg md:w-1/4 lg:w-1/6"
            >
              {{ formatDateTime(schedule.finalDate) }}
            </h2>

            <div class="flex items-center justify-end gap-12 p-1">
              <ul class="flex -space-x-6 transition-all hover:space-x-1">
                <li v-for="employee in schedule.employees" :key="employee.id">
                  <div class="group relative">
                    <img
                      class="h-8 w-8 rounded-full"
                      src="https://i.pravatar.cc/300"
                      alt="Profile picture"
                    />
                    <p
                      class="absolute -top-7 left-1/2 -translate-x-1/2 rounded-lg border border-black border-opacity-60 bg-white bg-opacity-70 px-3 opacity-0 transition-all group-hover:opacity-100"
                    >
                      {{ employee.firstname }}
                    </p>
                  </div>
                </li>
              </ul>
              <div
                class="bg-primary-green flex h-9 w-9 items-center justify-center rounded-xl"
              >
                <p class="text-white">
                  {{ schedule.appointments.length }}
                </p>
              </div>
            </div>

            <!-- <div
              class="flex items-center justify-end space-x-4 border-t border-gray-200 p-6"
            >
              <Router-link :to="`/admin/schedules/${schedule.id}`">
                <button class="text-green-500">
                  <Eye />
                </button>
              </Router-link>

              <Router-link
                v-if="isNotInPastOrToday(schedule.finalDate)"
                :to="`/admin/schedules/${schedule.id}/edit`"
              >
                <button class="text-blue-500">
                  <Pencil />
                </button>
              </Router-link>

              <button
                v-if="isNotInPastOrToday(schedule.finalDate)"
                class="text-red-500"
                @click="handleDeleteSchedule(schedule)"
              >
                <Trash2 />
              </button>
            </div> -->
          </div>
        </button>
      </div>
    </div>
  </div>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    header="Appointment Detail"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <div v-if="selectedSchedule" class="flex flex-col gap-6">
      <h2 class="mb-2 text-xl font-semibold">
        {{ formatDateTime(selectedSchedule.finalDate.toString()) }}
      </h2>
      <div class="flex flex-col gap-3">
        <h3 class="text-lg">Appointments:</h3>
        <ul class="flex flex-col gap-1">
          <li
            v-for="appointment in selectedSchedule.appointments"
            :key="appointment.id"
            class="flex items-center gap-3"
          >
            <p>{{ appointment.location.address }}</p>
          </li>
        </ul>
      </div>
      <div class="flex flex-col gap-3">
        <h3 class="text-lg">Employees:</h3>
        <ul class="flex flex-col gap-3">
          <li
            v-for="employee in selectedSchedule.employees"
            :key="employee.id"
            class="flex items-center gap-3"
          >
            <img
              class="h-8 w-8 rounded-full"
              src="https://i.pravatar.cc/300"
              alt="Profile picture"
            />
            <p>{{ employee.fullname }}</p>
          </li>
        </ul>
      </div>
      <div class="flex justify-between">
        <CustomButton
          name="Delete"
          :loading="deleteScheduleLoading"
          variant="warning"
          @click="handleDeleteSchedule(selectedSchedule)"
        />

        <!-- edit button -->
        <Router-link
          v-if="isNotInPastOrToday(selectedSchedule.finalDate.toString())"
          :to="`/admin/schedules/${selectedSchedule.id}/edit`"
        >
          <CustomButton name="Edit" />
        </Router-link>
      </div>
    </div>
  </Dialog>

  <!-- show no schedules -->
  <div v-if="schedules.length === 0">
    <p class="text-6xl font-black">No Schedules Found</p>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
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

const selectedSchedule = ref<Schedule | null>(null)
const visible = ref({
  detail: false,
  edit: false,
})

// graphql
const {
  result: schedulesResult,
  error: schedulesError,
  loading: schedulesLoading,
  refetch: refetchSchedules,
} = useQuery(GET_ALL_SCHEDULES, variables, {
  fetchPolicy: 'cache-and-network',
})

const {
  mutate: deleteSchedule,
  error: deleteScheduleError,
  loading: deleteScheduleLoading,
} = useMutation(DELETE_SCHEDULE)

// logics
// delete schedule
const handleDeleteSchedule = async (schedule: Schedule) => {
  await deleteSchedule({
    id: schedule.id,
  })
  showToast('success', 'Success', `Schedule deleted`)
  refetchSchedules()
}

const toggleModal = (
  schedule: Schedule | null = null,
  type: string = 'close',
) => {
  selectedSchedule.value = schedule ? { ...schedule } : null
  visible.value = {
    detail: type === 'detail',
    edit: type === 'edit',
  }
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

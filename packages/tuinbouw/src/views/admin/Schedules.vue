<template>
  <main>
    <!-- Header -->
    <section
      class="m-auto mb-4 mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
    >
      <div class="flex w-full flex-col gap-3">
        <!-- Filters -->
        <section
          class="relative flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-between"
        >
          <!-- Filter -->
          <Filter
            v-model="variables.filters"
            :options="FILTER_OPTIONS_SCHEDULES"
          />
        </section>

        <!-- Title + Sort -->
        <header class="flex w-full items-center justify-between">
          <!-- Title -->
          <h1 class="text-2xl">{{ $t('schedule.title') }}</h1>
          <!-- Sort -->
          <Sort v-model="variables.order" :options="SORT_OPTIONS_SCHEDULES" />
        </header>
      </div>
    </section>

    <!-- Skeleton -->
    <section
      v-if="schedulesLoading"
      class="m-auto flex max-w-7xl flex-col gap-3"
    >
      <div
        v-for="i in 10"
        :key="i"
        class="h-11 w-full animate-pulse rounded-2xl bg-gray-200"
      ></div>
    </section>

    <!-- Schedules -->
    <section v-else-if="schedules && schedules.length > 0">
      <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
        <!-- Add Schedule -->
        <Router-link :to="`/admin/add-schedule`">
          <button
            class="border-primary-green text-primary-green flex h-14 w-full items-center justify-center rounded-2xl border-[1px]"
          >
            <PlusCircle class="mr-2" />
            {{ $t('schedule.button.add') }}
          </button>
        </Router-link>
        <!-- Schedules -->
        <button
          v-for="schedule in schedules"
          :key="schedule.id"
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
                    <Avatar
                      class="h-8 w-8 overflow-hidden rounded-full border-2 text-sm"
                      :user="employee"
                    />
                    <p
                      class="absolute -top-7 left-1/2 -translate-x-1/2 rounded-lg border border-black border-opacity-60 bg-white bg-opacity-70 px-3 capitalize opacity-0 transition-all group-hover:opacity-100"
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
          </div>
        </button>
      </div>
    </section>

    <!-- No Schedules -->
    <NoResult v-else-if="schedules.length === 0" />
  </main>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    :header="$t('schedule.modal.detail.title')"
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
        <h3 class="text-lg">{{ $t('schedule.modal.detail.appointments') }}</h3>
        <ul class="flex flex-col gap-3">
          <li
            v-for="appointment in selectedSchedule.appointments"
            :key="appointment.id"
            class="relative flex h-28 gap-3 overflow-hidden rounded-lg bg-gray-200"
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
            <div class="flex h-full w-2/3 flex-col justify-between p-3">
              <div>
                <h4 class="text-lg capitalize">
                  {{ appointment.user.fullname }}
                </h4>
                <p class="line-clamp-2">
                  {{ appointment.description }}
                </p>
              </div>
              <p class="text-xs text-gray-900">
                {{ appointment.location.address }}
              </p>
            </div>
            <div
              class="h-auto w-1/3 overflow-auto rounded-3xl rounded-t-none rounded-bl-none"
            >
              <Map class="h-full w-full" :locations="[appointment.location]" />
            </div>
          </li>
        </ul>
      </div>
      <div class="flex flex-col gap-3">
        <h3 class="text-lg">{{ $t('schedule.modal.detail.employees') }}:</h3>
        <ul class="flex flex-col gap-3">
          <li
            v-for="employee in selectedSchedule.employees"
            :key="employee.id"
            class="flex items-center gap-3"
          >
            <Avatar
              class="h-8 w-8 overflow-hidden rounded-full text-sm"
              :user="employee"
            />
            <p class="capitalize">{{ employee.fullname }}</p>
          </li>
        </ul>
      </div>
      <div class="flex flex-col gap-3">
        <div
          class="flex cursor-pointer justify-between"
          @click="toggleCollapsible()"
        >
          <h3 class="text-lg">{{ $t('schedule.modal.detail.materials') }}:</h3>
          <ChevronDown :class="collapsed ? 'transform rotate-180' : ''" />
        </div>
        <ul v-if="!collapsed" class="flex flex-col gap-3">
          <li
            v-for="material in selectedSchedule.materials"
            :key="material.id"
            class="flex items-center gap-2"
          >
            <Wrench class="h-3 w-3" />
            <p class="capitalize">{{ material.name }}</p>
          </li>
        </ul>
      </div>

      <div class="flex justify-between">
        <!-- Delete Button -->
        <CustomButton
          name="schedule.button.delete"
          :loading="loading.delete"
          variant="warning"
          @click="handleDeleteSchedule(selectedSchedule)"
        />

        <!-- Edit Button -->
        <Router-link
          v-if="isNotInPastOrToday(selectedSchedule.finalDate.toString())"
          :to="`/admin/schedules/${selectedSchedule.id}/edit`"
        >
          <CustomButton name="schedule.button.edit" />
        </Router-link>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Avatar from '@/components/generic/Avatar.vue'
import CustomButton from '@/components/generic/CustomButton.vue'
import Filter from '@/components/generic/Filter.vue'
import NoResult from '@/components/generic/NoResult.vue'
import Sort from '@/components/generic/Sort.vue'
import Map from '@/components/Map.vue'
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { DELETE_SCHEDULE } from '@/graphql/schedule.mutation'
import { GET_ALL_SCHEDULES } from '@/graphql/schedule.query'
import {
  FILTER_OPTIONS_SCHEDULES,
  ORDER_DIRECTION,
  SORT_OPTIONS_SCHEDULES,
} from '@/helpers/constants'
import type { Schedule } from '@/interfaces/schedule.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ChevronDown, PlusCircle, Wrench } from 'lucide-vue-next'
import type { ComputedRef } from 'vue'
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

const collapsed = ref(true)
const loading = ref<{
  schedules: ComputedRef<boolean>
  delete: boolean
}>({
  schedules: computed(() => schedulesLoading.value),
  delete: false,
})

const schedules = computed(() => schedulesResult.value?.schedules || [])

const selectedSchedule = ref<Schedule | null>(null)
const visible = ref<{
  detail: boolean
}>({
  detail: false,
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

const { mutate: deleteSchedule } = useMutation(DELETE_SCHEDULE)

// logics
// delete schedule
const handleDeleteSchedule = async (schedule: Schedule): Promise<void> => {
  try {
    loading.value.delete = true
    await deleteSchedule({
      id: schedule.id,
    })
    showToast('success', 'toast.success', `schedule.toast.delete`)
    refetchSchedules()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'schedule.toast.error.delete')
  } finally {
    loading.value.delete = false
  }
}

const toggleModal = (
  schedule: Schedule | null = null,
  type: string = 'close',
): void => {
  selectedSchedule.value = schedule ? { ...schedule } : null
  visible.value = {
    detail: type === 'detail',
  }
}

function toggleCollapsible(): void {
  collapsed.value = !collapsed.value
}

watchEffect(() => {
  // log the queries
  // if (schedules.value) console.log(schedules.value)

  // all errors
  if (schedulesError.value) {
    // console.log(schedulesError.value)
    LogRocket.captureException(schedulesError.value)
    showToast('error', 'toast.error', 'schedule.toast.error.schedules')
  }
})
</script>

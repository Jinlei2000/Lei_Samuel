<template>
  <div class="m-auto mt-12 flex max-w-xl flex-col gap-3 md:mt-24">
    <div class="mt-3 flex items-center justify-between">
      <h1 class="text-xl">
        {{ $t('account.welcome') }} {{ customUser!.firstname }}! These are
        todays schedules
      </h1>
      <RouterLink
        :to="`/admin/schedules`"
        class="text-primary-orange group flex items-center text-lg sm:text-base"
      >
        Schedules
        <ChevronRight
          class="h-8 w-8 transition-all group-hover:translate-x-1 sm:h-auto sm:w-auto"
          stroke-width="1"
        />
      </RouterLink>
    </div>

    <!-- Todays schedules -->
    <div
      v-if="todaysSchedules && todaysSchedules.length > 0"
      class="flex flex-col gap-3"
    >
      <button
        v-for="(schedule, index) in todaysSchedules"
        :key="index"
        class="relative flex w-full items-center justify-between rounded-2xl bg-gray-200 p-1 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300"
        @click="toggleModal(schedule, 'detail')"
      >
        <ul class="flex -space-x-6 transition-all hover:space-x-1">
          <li
            v-for="employee in schedule.employees"
            :key="employee.id"
            class="flex items-center"
          >
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
      </button>
    </div>

    <!-- No schedules -->
    <div
      v-else-if="todaysSchedules.length === 0"
      class="flex h-12 w-full items-center justify-center rounded-2xl bg-gray-200"
    >
      <p>No schedules today</p>
    </div>

    <!-- Absences -->
    <div class="mt-3 flex items-center justify-between">
      <h2 class="text-xl">Todays absences</h2>
      <RouterLink
        :to="`/admin/absences`"
        class="text-primary-orange group flex items-center text-lg sm:text-base"
      >
        Absences
        <ChevronRight
          class="h-8 w-8 transition-all group-hover:translate-x-1 sm:h-auto sm:w-auto"
          stroke-width="1"
        />
      </RouterLink>
    </div>

    <!-- Todays absences -->
    <div
      v-if="todaysAbsences && todaysAbsences.length > 0"
      class="flex flex-col gap-3"
    >
      <div
        v-for="(absence, index) in todaysAbsences"
        :key="index"
        class="flex items-center justify-between rounded-2xl bg-gray-200 p-2 px-3 text-left"
      >
        <div class="flex items-center gap-3">
          <Avatar
            class="h-10 w-10 overflow-hidden rounded-full border-2 text-sm"
            :user="absence.user"
          />
          <p class="capitalize">
            {{ absence.user.fullname }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- days left -->
          <p>
            {{
              (
                Math.abs(
                  new Date(absence.endDate).getTime() - new Date().getTime(),
                ) /
                (1000 * 3600 * 24)
              ).toFixed(0)
            }}
            day(s) left
          </p>
          <p
            class="bg-primary-orange rounded-full px-3 py-1 capitalize text-white"
          >
            {{ absence.type }}
          </p>
        </div>
      </div>
    </div>

    <!-- No absences -->
    <div
      v-else-if="todaysAbsences.length === 0"
      class="flex h-12 w-full items-center justify-center rounded-2xl bg-gray-200"
    >
      <p>No absences today</p>
    </div>
  </div>

  <!-- Absence Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    header="Schedule Detail"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <div v-if="selectedSchedule" class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <h3 class="text-lg">Appointments</h3>
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
                <p class="truncate">{{ appointment.description }}</p>
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
        <h3 class="text-lg">Employees</h3>
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
          <h3 class="text-lg">Materials:</h3>
          <ChevronDown :class="collapsed ? 'transform rotate-180' : ''" />
        </div>
        <ul v-if="!collapsed" class="flex list-disc flex-col gap-3">
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
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import Avatar from '@/components/generic/Avatar.vue'
import Map from '@/components/Map.vue'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useLanguage from '@/composables/useLanguage'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { GET_ALL_ABSENCES_BY_DATE } from '@/graphql/absence.query'
import { GET_SCHEDULES_BY_DATE } from '@/graphql/schedule.query'
import type { Absence } from '@/interfaces/absence.interface'
import type { Schedule } from '@/interfaces/schedule.interface'
import router from '@/router'
import { useQuery } from '@vue/apollo-composable'
import { ChevronDown, ChevronRight, Wrench } from 'lucide-vue-next'
import { ref } from 'vue'
import { watchEffect } from 'vue'
import { type ComputedRef } from 'vue'
import { computed } from 'vue'

const { firebaseUser } = useFirebase()
const { customUser } = useCustomUser()
const { formatDateTime } = useTimeUtilities()

const todaysSchedules: ComputedRef<Schedule[]> = computed(() => {
  return schedulesResult.value?.schedulesByDate || []
})

const todaysAbsences: ComputedRef<Absence[]> = computed(() => {
  return absencesResult.value?.absencesByDate || []
})

const selectedSchedule = ref<Schedule | null>(null)
const visible = ref<{
  detail: boolean
}>({
  detail: false,
})
const collapsed = ref(true)

// Create brearer token
firebaseUser.value?.getIdToken().then(token => {
  console.log(`{"Authorization": "Bearer ${token}"}`)
})

const toggleModal = (
  schedule: Schedule | null = null,
  type: string = 'close',
): void => {
  selectedSchedule.value = schedule ? { ...schedule } : null
  visible.value = {
    detail: type === 'detail',
  }
}

const toggleCollapsible = () => {
  collapsed.value = !collapsed.value
}

// GraphQL
const {
  result: schedulesResult,
  error: schedulesError,
  loading: schedulesLoading,
} = useQuery(GET_SCHEDULES_BY_DATE, {
  date: new Date().toISOString().slice(0, 10),
  fetchPolicy: 'cache-and-network',
})

const {
  result: absencesResult,
  error: absencesError,
  loading: absencesLoading,
} = useQuery(GET_ALL_ABSENCES_BY_DATE, {
  date: new Date().toISOString().slice(0, 10),
  fetchPolicy: 'cache-and-network',
})

watchEffect(() => {
  console.log('schedules', schedulesResult.value?.schedulesByDate)
  console.log('absences', absencesResult.value?.absencesByDate)
})
</script>

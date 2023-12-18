<template>
  <div class="m-auto mt-12 flex max-w-xl flex-col gap-3 md:mt-24">
    <h1 class="text-xl">
      {{ $t('account.welcome') }} {{ customUser!.firstname }}
    </h1>

    <div
      v-if="todaysSchedules && todaysSchedules.length > 0"
      class="flex flex-col gap-3"
    >
      <div
        v-for="(schedule, index) in todaysSchedules"
        :key="index"
        class="relative flex w-full items-center justify-between rounded-2xl bg-gray-200 p-1 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import Avatar from '@/components/generic/Avatar.vue'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useLanguage from '@/composables/useLanguage'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { GET_SCHEDULES_BY_DATE } from '@/graphql/schedule.query'
import type { Schedule } from '@/interfaces/schedule.interface'
import router from '@/router'
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
import { watchEffect } from 'vue'
import { type ComputedRef } from 'vue'
import { computed } from 'vue'

const listButtons = ref([
  'Appointments',
  'Users',
  'Profile',
  'Schedules',
  'Materials',
  'Add-Schedule',
  'Absences',
])
const { firebaseUser, logout } = useFirebase()
const { setLocale, locale } = useLanguage()
const { customUser } = useCustomUser()
const { formatDateTime } = useTimeUtilities()

const todaysSchedules: ComputedRef<Schedule[]> = computed(() => {
  return schedulesResult.value?.schedulesByDate || []
})

// Create brearer token
firebaseUser.value?.getIdToken().then(token => {
  console.log(`{"Authorization": "Bearer ${token}"}`)
})

// GraphQL
const {
  result: schedulesResult,
  error: schedulesError,
  loading: schedulesLoading,
} = useQuery(GET_SCHEDULES_BY_DATE, {
  date: new Date().toISOString().slice(0, 10),
  fetchPolicy: 'cache-and-network',
})
</script>

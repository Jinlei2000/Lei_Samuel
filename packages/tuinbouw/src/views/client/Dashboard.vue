<template>
  <div class="m-auto mt-12 flex w-full max-w-xl flex-col gap-3 md:mt-24">
    <h1 class="text-xl capitalize">
      {{ $t('dashboard.client.welcome') }} {{ customUser!.firstname }}
    </h1>
    <RouterLink to="/client/add-appointment">
      <button
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
      >
        <PlusCircle class="mr-2" />
        {{ $t('dashboard.client.button.add') }}
      </button>
    </RouterLink>
    <div class="flex w-full items-center justify-between">
      <p class="text-xl">
        {{ $t('dashboard.client.upcoming') }}
      </p>
      <RouterLink
        to="/client/appointments"
        class="text-primary-orange group flex items-center text-lg sm:text-base"
      >
        {{ $t('dashboard.client.button.all') }}
        <ChevronRight
          class="h-8 w-8 transition-all group-hover:translate-x-1 sm:h-auto sm:w-auto"
          stroke-width="1"
        />
      </RouterLink>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="upcomingAppointmentsLoading" class="flex flex-col gap-3">
      <div v-for="index in 5" :key="index">
        <div
          class="flex animate-pulse flex-col gap-3 rounded-2xl bg-gray-200 p-3"
        >
          <div class="flex flex-col gap-3">
            <div class="h-4 w-32 rounded-lg bg-gray-500"></div>
            <div class="h-4 w-72 rounded-lg bg-gray-500"></div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="upcomingAppointments && upcomingAppointments.length > 0"
      class="flex flex-col gap-3"
    >
      <div v-for="(item, index) in upcomingAppointments" :key="index">
        <AppointmentCard :appointment="item" :nav="false" :variant="'simple'" />
      </div>
    </div>

    <div
      v-else-if="
        upcomingAppointments &&
        upcomingAppointments.length === 0 &&
        !upcomingAppointmentsLoading
      "
      class="flex flex-col items-center justify-center gap-3 rounded-2xl bg-gray-200 p-6"
    >
      <p class="text-lg">{{ $t('dashboard.client.no.upcoming') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCustomUser from '../../composables/useCustomUser'
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import useCustomToast from '@/composables/useCustomToast'
import { GET_UPCOMING_APPOINTMENTS_BY_USERID } from '@/graphql/appointment.query'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import { useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ChevronRight, PlusCircle } from 'lucide-vue-next'
import { type ComputedRef, watchEffect } from 'vue'
import { computed } from 'vue'

const { customUser } = useCustomUser()
const { showToast } = useCustomToast()

const upcomingAppointments: ComputedRef<Appointment[]> = computed(() => {
  return upcomingAppointmentsResult.value?.appointmentsUpcomingByUserId || []
})

// graphql
const {
  result: upcomingAppointmentsResult,
  error: upcomingAppointmentsError,
  loading: upcomingAppointmentsLoading,
} = useQuery(GET_UPCOMING_APPOINTMENTS_BY_USERID, {
  userId: customUser?.value?.id,
  amount: 5,
  fetchPolicy: 'cache-and-network',
})

watchEffect(() => {
  // log the queries

  // all errors
  if (upcomingAppointmentsError.value) {
    // console.log(upcomingAppointmentsError.value)
    LogRocket.captureException(upcomingAppointmentsError.value)
    showToast('error', 'toast.error', 'dashboard.client.toast.error.upcoming')
  }
})
</script>

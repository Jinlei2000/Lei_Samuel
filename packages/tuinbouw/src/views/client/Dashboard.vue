<template>
  <div class="m-auto mt-12 flex max-w-xl flex-col gap-3 md:mt-24">
    <h1 class="text-xl">Welkom, {{ customUser!.firstname }}</h1>
    <RouterLink to="/client/add-appointment">
      <button
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
      >
        <PlusCircle class="mr-2" />
        Add New Appointment
      </button>
    </RouterLink>
    <div class="flex w-full items-center justify-between">
      <p class="text-xl">Upcoming appointments</p>
      <RouterLink
        to="/client/appointments"
        class="text-primary-orange group flex items-center text-lg sm:text-base"
      >
        All appointments
        <ChevronRight
          class="h-8 w-8 transition-all group-hover:translate-x-1 sm:h-auto sm:w-auto"
          stroke-width="1"
        />
      </RouterLink>
    </div>

    <div
      v-if="upcomingAppointments && upcomingAppointments.length > 0"
      class="flex flex-col gap-3"
    >
      <div v-for="(item, index) in upcomingAppointments" :key="index">
        <AppointmentCard :appointment="item" :nav="false" :variant="'simple'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCustomUser from '../../composables/useCustomUser'
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import {
  GET_RECENT_APPOINTMENTS_BY_USERID,
  GET_UPCOMING_APPOINTMENTS_BY_USERID,
} from '@/graphql/appointment.query'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { ChevronRight, PlusCircle } from 'lucide-vue-next'
import { type ComputedRef, watchEffect } from 'vue'
import { computed } from 'vue'

const { customUser } = useCustomUser()

const upcomingAppointments: ComputedRef<Appointment[]> = computed(() => {
  return upcomingAppointmentsResult.value?.appointmentsUpcomingByUserId || []
})

const recentAppointments: ComputedRef<Appointment[]> = computed(() => {
  return recentAppointmentsResult.value?.appointmentsRecentByUserId || []
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

const {
  result: recentAppointmentsResult,
  loading: recentAppointmentsLoading,
  error: recentAppointmentsError,
} = useQuery(GET_RECENT_APPOINTMENTS_BY_USERID, () => ({
  userId: customUser.value?.id,
  amount: 5,
}))

watchEffect(() => {
  console.log(upcomingAppointmentsResult.value)
})
</script>

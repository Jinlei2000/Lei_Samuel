<template>
  <!-- go back button -->
  <button class="mt-20 flex" v-bind="$attrs" @click="$router.go(-1)">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>

  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Schedules Detail
  </h1>

  <!-- loading -->
  <div v-if="scheduleLoading">
    <p class="text-6xl font-black">Loading Schedule...</p>
  </div>

  <!-- show schedule -->
  <div v-if="schedule">
    <!-- go to edit page -->
    <!-- can only edit if not in the past & today cant not edit -->
    <Router-link
      v-if="isNotInPastOrToday(schedule.schedule.finalDate)"
      :to="{
        path: `${currentRoute.params.id}/edit`,
      }"
    >
      <button class="mt-20 flex">
        <Pencil class="h-6 w-6" />
      </button>
    </Router-link>

    <div class="rounded-md bg-white p-6 shadow-md">
      <p><strong>Created By:</strong> {{ schedule.schedule.createdBy }}</p>
      <p>
        <strong>Created At:</strong>
        {{ formatDateTime(schedule.schedule.createdAt) }}
      </p>

      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-bold">Appointment Details</h2>
        <ul>
          <li
            v-for="appointment in schedule.schedule.appointments"
            :key="appointment.id"
            class="mb-2"
          >
            Type: {{ appointment.type }}
          </li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-bold">Employee Details</h2>
        <ul>
          <li
            v-for="employee in schedule.schedule.employees"
            :key="employee.id"
            class="mb-2"
          >
            {{ employee.fullname }} - {{ employee.email }}
          </li>
        </ul>
      </section>

      <section>
        <h2 class="mb-4 text-2xl font-bold">Material Details</h2>
        <ul>
          <li
            v-for="material in schedule.schedule.materials"
            :key="material.id"
            class="mb-2"
          >
            {{ material.name }} - Serial Number: {{ material.serialNumber }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { GET_SCHEDULE_BY_ID } from '@/graphql/schedule.query'
import { useQuery } from '@vue/apollo-composable'
import { ArrowLeft, Pencil } from 'lucide-vue-next'
import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// composables
const { showToast } = useCustomToast()
const { formatDateTime, isNotInPastOrToday } = useTimeUtilities()
const { currentRoute } = useRouter()

// graphql
const {
  result: schedule,
  loading: scheduleLoading,
  error: scheduleError,
} = useQuery(
  GET_SCHEDULE_BY_ID,
  () => ({
    // get id out of params
    id: currentRoute.value.params.id,
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

// logics

watchEffect(() => {
  // log the queries
  // if (schedule.value) console.log(schedule.value)

  // all errors
  const errors = [scheduleError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

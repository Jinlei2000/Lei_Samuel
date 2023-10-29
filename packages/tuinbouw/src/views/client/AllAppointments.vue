<template>
  <!-- go back button -->
  <button class="mt-20 flex" @click="$router.go(-1)">
    <ArrowLeft class="h-6 w-6" />
    <span class="ml-2">Go back</span>
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    AllAppointment
  </h1>

  <div v-for="a in allAppointment.appointmentsByUserId">{{ a.id }}</div>
</template>

<script setup lang="ts">
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import { GET_ALL_APPOINTMENT_BY_CLIENT } from '@/graphql/appointment.query'
import { useQuery } from '@vue/apollo-composable'
import { useToast } from 'primevue/usetoast'
import { ref, watch } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const { customUser } = useCustomUser()
const { firebaseUser } = useFirebase()
const toast = useToast()
const order = ref({
  field: 'createdAt',
  direction: 'ASC',
})
const filters = ref([])

const { result: allAppointment, error: allAppointmentError } = useQuery(
  GET_ALL_APPOINTMENT_BY_CLIENT,
  {
    userId: customUser.value?.id,
    filters: ["R"],
    order: {
      field: 'createdAt',
      direction: 'ASC',
    },
  },
)

console.log(allAppointment.value?.appointmentsByUserId)

watch(allAppointmentError, () => {
  if (!allAppointmentError.value) return
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: allAppointmentError.value.message,
    life: 10000,
  })
})

// Create brearer token
firebaseUser.value?.getIdToken().then(token => {
  console.log(`{"Authorization": "Bearer ${token}"}`)
})
</script>

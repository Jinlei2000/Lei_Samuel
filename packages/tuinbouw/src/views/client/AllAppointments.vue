<template>
  <!-- go back button -->
  <button class="mt-20 flex" @click="$router.go(-1)">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>

  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    AllAppointment
  </h1>

  <div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-if="allAppointment && allAppointment.appointmentsByUserId.length > 0"
        v-for="a of allAppointment.appointmentsByUserId"
        :key="a.id"
      >
        <div
          class="mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md"
          @click="openModal(a)"
        >
          <div class="p-4">
            <h2 class="mb-2 text-xl font-semibold">{{ a.type }}</h2>
            <p class="text-gray-600">{{ a.description }}</p>
          </div>
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500"
                >{{ formatDateTime(a.startProposedDate) }} -
                {{ formatDateTime(a.endProposedDate) }}</span
              >
              <span v-if="a.isScheduled" class="text-green-500">Scheduled</span>
              <span v-else class="text-gray-500">Not Scheduled</span>
            </div>
          </div>
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <span v-if="a.isDone" class="text-green-500">Done</span>
              <span v-else class="text-gray-500">Not Done</span>
              <span class="text-sm text-gray-500"
                >Priority: {{ a.priority }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Teleport Modal -->
    <Dialog
      v-model:visible="visible"
      modal
      header="Appointment"
      :style="{ width: '50vw' }"
      v-if="selectedAppointment"
      @click:close="closeModal"
    >
      <h2 class="mb-2 text-xl font-semibold">
        {{ selectedAppointment.type }}
      </h2>
      <p class="text-gray-600">
        {{ selectedAppointment.description }}
      </p>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import { GET_ALL_APPOINTMENT_BY_CLIENT } from '@/graphql/appointment.query'
import { useQuery } from '@vue/apollo-composable'
import { useToast } from 'primevue/usetoast'
import { ref, watch, watchEffect } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'
import type { Appointment } from '@/interfaces/appointment.user.interface'

const { customUser } = useCustomUser()
const { firebaseUser } = useFirebase()
const toast = useToast()
const order = ref({
  field: 'createdAt',
  direction: 'ASC',
})
const filters = ref([])
const selectedAppointment = ref<Appointment | null>(null)
const visible = ref(false)

const { result: allAppointment, error: allAppointmentError } = useQuery(
  GET_ALL_APPOINTMENT_BY_CLIENT,
  {
    userId: customUser.value?.id,
    filters: [],
    order: {
      field: 'createdAt',
      direction: 'ASC',
    },
  },
)

const openModal = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  visible.value = true
}

const closeModal = () => {
  selectedAppointment.value = null
  visible.value = false
}

const formatDateTime = (date: string) => {
  const d = new Date(date)
  return `${d.toLocaleDateString()}`
}

watchEffect(() => {
  console.log(allAppointment.value?.appointmentsByUserId)
})

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
  // console.log(`{"Authorization": "Bearer ${token}"}`)
})
</script>

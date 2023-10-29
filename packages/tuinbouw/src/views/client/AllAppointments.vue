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
          :class="[
            'mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md',
            {
              ' border border-red-400': isOverToday(a),
            },
          ]"
        >
          <div class="p-4">
            <h2 class="mb-2 text-xl font-semibold">{{ a.type }}</h2>
            <p class="mb-1 text-gray-600">{{ a.description }}</p>
            <p class="mb-1 text-gray-600">{{ a.id }}</p>
            <p class="text-gray-600" v-if="a.finalDate">
              {{ formatDateTime(a.finalDate) }}
            </p>
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
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <!-- View More button -->
              <button @click="openModalDetail(a)" class="ml-2 text-blue-500">
                View More
              </button>
              <!-- Delete button (only if not done) -->
              <button
                v-if="!a.isDone"
                @click.stop="deleteAppointmentBtn(a.id)"
                class="ml-2 text-red-500"
              >
                Delete
              </button>
              <!-- Edit button (only if not done) -->
              <button
                v-if="!a.isDone"
                @click.stop="openModalDetailEdit(a)"
                class="ml-2 text-blue-500"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Dialog
      v-model:visible="visible"
      modal
      maximizable
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

    <!-- TODO: make edit functions -->
    <!-- Edit Modal -->
    <Dialog
      v-model:visible="visibleEdit"
      modal
      maximizable
      header="Edit Appointment"
      :style="{ width: '50vw' }"
      v-if="selectedAppointment"
      @click:close="closeModal"
    >
      <div class="p-4">
        <h2 class="mb-2 text-xl font-semibold">
          {{ selectedAppointment.type }}
        </h2>
        <p class="text-gray-600">
          {{ selectedAppointment.description }}
        </p>
      </div>
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
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useToast } from 'primevue/usetoast'
import { ref, watch } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import { DELETE_APPOINTMENT } from '@/graphql/appointment.mutation'

const { customUser } = useCustomUser()
const { firebaseUser } = useFirebase()
const toast = useToast()
const order = ref({
  field: 'createdAt',
  direction: 'ASC',
})
// TODO: use dynamic filters and orders
// https://apollo.vuejs.org/guide-composable/query.html
const filters = ref([])
const selectedAppointment = ref<Appointment | null>(null)
const visible = ref(false)
const visibleEdit = ref(false)

// TODO: use fetchMore to load more appointments (add some kind of pagination in backend (limit, offset)))
// https://apollo.vuejs.org/guide-composable/pagination.html
const {
  result: allAppointment,
  error: allAppointmentError,
  refetch: allAppointmentRefectch,
} = useQuery(
  GET_ALL_APPOINTMENT_BY_CLIENT,
  {
    userId: customUser.value?.id,
    filters: [],
    order: {
      field: 'createdAt',
      direction: 'ASC',
    },
  },
  {
    // return result from cache first (if it exists), then return network result once it's available.
    fetchPolicy: 'cache-and-network',
  },
)

const { mutate: deleteAppointment } = useMutation(DELETE_APPOINTMENT)

const openModalDetail = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  visible.value = true
}

const closeModal = () => {
  selectedAppointment.value = null
  visible.value = false
  visibleEdit.value = false
}

const deleteAppointmentBtn = (id: string) => {
  deleteAppointment({
    id,
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Appointment deleted',
        life: 10000,
      })

      // refetch
      allAppointmentRefectch()
    })
    .catch(err => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: 10000,
      })
    })
}

const openModalDetailEdit = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  visibleEdit.value = true
}

// TODO: make a composables for this (useTimeUtilities)
const formatDateTime = (date: string) => {
  const d = new Date(date)
  return `${d.toLocaleDateString()}`
}

// TODO: make a composables for this (useTimeUtilities)
// check if finalDate is over today and not done
// also check if isScheduled is false and endProposedDate is over today
const isOverToday = (appointment: Appointment) => {
  if (appointment.isDone) return false

  const today = new Date().toISOString().split('T')[0]
  const finalDate = appointment.finalDate
    ? new Date(appointment.finalDate).toISOString().split('T')[0]
    : null
  const endProposedDate = new Date(appointment.endProposedDate)
    .toISOString()
    .split('T')[0]

  if (finalDate && finalDate < today && !appointment.isDone) return true

  if (!appointment.isScheduled && endProposedDate < today) return true

  return false
}

watch(allAppointmentError, () => {
  if (!allAppointmentError.value) return
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: allAppointmentError.value.message,
    life: 10000,
  })
})

//  log the allAppointment length
watch(allAppointment, () => {
  if (!allAppointment.value) return
  console.log(
    'allAppointment length: ',
    allAppointment.value.appointmentsByUserId.length,
  )
})

// Create brearer token
firebaseUser.value?.getIdToken().then(token => {
  // console.log(`{"Authorization": "Bearer ${token}"}`)
})
</script>

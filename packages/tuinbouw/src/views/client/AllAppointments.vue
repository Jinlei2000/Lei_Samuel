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

  <!-- TODO: make a filter component and use Accordion  -->
  <div class="relative flex w-full items-center justify-between">
    <!-- Filter -->
    <div class="flex items-center gap-3">
      <button
        class="border-1 group flex h-12 items-center gap-[6px] rounded-2xl border-black bg-transparent p-3 text-black"
        v-on:click="filter = !filter"
      >
        <Filter class="h-5 w-5" />
        <p class="m-0 text-lg">Filter</p>
        <ChevronDown
          :class="filter ? 'rotate-180 transition-all' : 'transition-all'"
          class="w-[22px]transition-all h-[22px]"
        />
      </button>
    </div>
    <!-- Filter dropdown -->
    <div
      :class="
        filter
          ? 'opacity-100 transition-all duration-200'
          : 'opacity-0 transition-all duration-200'
      "
      class="border-1 absolute top-16 z-50 flex gap-12 rounded-2xl border-black bg-gray-200 px-12 py-6"
    >
      <div class="flex flex-col gap-3">
        <h2 class="text-lg">Type</h2>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3">
            <div class="flex gap-2">
              <input
                type="checkbox"
                id="maintenance"
                name="maintenance"
                @change="updateFilters('M')"
                className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
              />
              <div
                class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              >
                <Check class="h-3 w-3" />
              </div>
              <label for="maintenance">Maintenance</label>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex gap-2">
              <input
                type="checkbox"
                id="repair"
                name="repair"
                @change="updateFilters('R')"
                className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
              />
              <div
                class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              >
                <Check class="h-3 w-3" />
              </div>
              <label for="repair">Repair</label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <h2 class="text-lg">Status</h2>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3">
            <div class="relative flex items-center gap-2">
              <input
                class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                type="radio"
                id="all"
                name="status"
                value="all"
                @change="updateFiltersRadio(['D', 'ND'], true)"
                checked
              />
              <div
                class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              >
                <Check class="h-3 w-3" />
              </div>
              <label for="all">All</label>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <div class="relative flex items-center gap-2">
              <input
                class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                type="radio"
                id="done"
                name="status"
                value="done"
                @change="updateFiltersRadio(['D'])"
              />
              <div
                class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              >
                <Check class="h-3 w-3" />
              </div>
              <label for="done">Done</label>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <div class="relative flex items-center gap-2">
              <input
                class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                type="radio"
                id="not-done"
                name="status"
                value="not-done"
                @change="updateFiltersRadio(['ND'])"
              />
              <div
                class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              >
                <Check class="h-3 w-3" />
              </div>
              <label for="not-done">Not Done</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End filter dropdown -->
  </div>

  <!-- TODO: make a sort component -->

  <div v-if="loading">
    <p class="text-6xl font-black">Loading...</p>
  </div>

  <!-- show all appointments -->
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
                v-if="
                  // check if is not done and is over today or not done and not scheduled
                  (!a.isDone && isOverToday(a)) || (!a.isDone && !a.isScheduled)
                "
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
      <form @submit.prevent="handleUpdateAppointment()" class="p-4">
        <!-- Location ID -->
        <label for="locationId" class="block text-sm font-medium text-gray-700">
          Address:
        </label>
        <select
          v-if="locations && locations.locationsByUserId.length > 0"
          id="locationId"
          v-model="selectedLocationId"
          class="focus:ring-primary-green focus:border-primary-green mt-1 block w-full rounded-md border p-2 shadow-sm sm:text-sm"
        >
          <option
            v-for="l of locations.locationsByUserId"
            :key="l.id"
            :value="l.id"
          >
            {{ l.address }}
          </option>
        </select>

        <!-- Type -->
        <label for="type" class="block text-sm font-medium text-gray-700">
          Type:
        </label>
        <select
          id="type"
          class="focus:ring-primary-green focus:border-primary-green mt-1 block w-full rounded-md border p-2 text-black shadow-sm sm:text-sm"
          v-model="selectedAppointment.type"
        >
          <option
            v-for="t of ['maintenance', 'repair']"
            :key="t"
            :value="t"
            @change="selectedAppointment.type = t"
          >
            {{ t }}
          </option>
        </select>

        <!-- Start Proposed Date -->
        <label
          for="startProposedDate"
          class="block text-sm font-medium text-gray-700"
        >
          Start Proposed Date:
        </label>
        <input
          type="date"
          id="startProposedDate"
          v-model="selectedAppointment.startProposedDate"
          class="focus:ring-primary-green focus:border-primary-green mt-1 block w-full rounded-md border p-2 shadow-sm sm:text-sm"
        />

        <!-- End Proposed Date -->
        <label
          for="endProposedDate"
          class="block text-sm font-medium text-gray-700"
        >
          End Proposed Date:
        </label>
        <input
          type="date"
          id="endProposedDate"
          v-model="selectedAppointment.endProposedDate"
          class="focus:ring-primary-green focus:border-primary-green mt-1 block w-full rounded-md border p-2 shadow-sm sm:text-sm"
        />

        <!-- Description -->
        <label
          for="description"
          class="block text-sm font-medium text-gray-700"
        >
          Description:
        </label>
        <textarea
          id="description"
          v-model="selectedAppointment.description"
          class="focus:ring-primary-green focus:border-primary-green mt-1 block w-full rounded-md border p-2 shadow-sm sm:text-sm"
        ></textarea>

        <button
          type="submit"
          class="bg-primary-green mt-4 rounded-md px-4 py-2 text-white"
        >
          Save
        </button>
      </form>
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
import { ArrowLeft, Filter, ChevronDown, Check } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { Location } from '@/interfaces/location.interface'
import {
  DELETE_APPOINTMENT,
  UPDATE_APPOINTMENT,
} from '@/graphql/appointment.mutation'
import { GET_LOCATIONS_BY_USERID } from '@/graphql/location.query'

const { customUser } = useCustomUser()
const { firebaseUser } = useFirebase()
const toast = useToast()

const selectedAppointment = ref<Appointment | null>()
const selectedLocationId = ref<string | null>()
const visible = ref(false)
const visibleEdit = ref(false)
const variables = ref<{
  userId: string | undefined
  filters: string[]
  order: {
    field: string
    direction: string
  }
}>({
  userId: customUser.value?.id,
  filters: [],
  order: {
    field: 'createdAt',
    direction: 'ASC',
  },
})
const filter = ref(false)

// TODO: use fetchMore to load more appointments (add some kind of pagination in backend (limit, offset)))
// use a load more button
// https://apollo.vuejs.org/guide-composable/pagination.html
const {
  result: allAppointment,
  error: allAppointmentError,
  refetch: allAppointmentRefectch,
  loading,
} = useQuery(GET_ALL_APPOINTMENT_BY_CLIENT, variables, {
  // return result from cache first (if it exists), then return network result once it's available.
  fetchPolicy: 'cache-and-network',
})

const { mutate: deleteAppointment, error: deleteAppointmentError } =
  useMutation(DELETE_APPOINTMENT)

const { mutate: updateAppointment, error: updateAppointmentError } =
  useMutation(UPDATE_APPOINTMENT)

const {
  result: locations,
  error: locationsError,
  loading: locationsLoading,
} = useQuery(GET_LOCATIONS_BY_USERID, {
  userId: customUser.value?.id,
  fetchPolicy: 'cache-and-network',
})

const updateFilters = (filter: string) => {
  const index = variables.value.filters.indexOf(filter)
  if (index !== -1) {
    // Remove the filter if it exists
    variables.value.filters.splice(index, 1)
  } else {
    // Add the filter if it doesn't exist
    variables.value.filters.push(filter)
  }
}

const updateFiltersRadio = (filters: string[], reset: boolean = false) => {
  if (reset) {
    // delete all filters
    for (let f of filters) {
      const index = variables.value.filters.indexOf(f)
      if (index !== -1) {
        // Remove the filter if it exists
        variables.value.filters.splice(index, 1)
      }
    }
  } else {
    // add all filters
    for (let f of filters) {
      const index = variables.value.filters.indexOf(f)
      if (index === -1) {
        // Add the filter if it doesn't exist
        variables.value.filters.push(f)
      }
    }
  }
}

const openModalDetail = (appointment: Appointment) => {
  selectedAppointment.value = { ...appointment }
  visible.value = true
}

const closeModal = () => {
  selectedAppointment.value = null
  selectedLocationId.value = null
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

const handleUpdateAppointment = () => {
  selectedAppointment.value = {
    ...selectedAppointment.value,
    location: locations.value?.locationsByUserId.find(
      (l: Location) => l.id === selectedLocationId.value,
    ),
  }
  console.log('selectedAppointment: ', selectedAppointment.value)
  console.log('selectedLocationId: ', selectedLocationId.value)
  // updateAppointment({
  //   updateAppointmentInput: {
  //     id: selectedAppointment.value?.id,
  //     locationId: selectedAppointment.value?.location.id,
  //     type: selectedAppointment.value?.type,
  //     startProposedDate: selectedAppointment.value?.startProposedDate,
  //     endProposedDate: selectedAppointment.value?.endProposedDate,
  //     description: selectedAppointment.value?.description,
  //   },
  // })
  //   .then(() => {
  //     toast.add({
  //       severity: 'success',
  //       summary: 'Success',
  //       detail: 'Appointment updated',
  //       life: 10000,
  //     })

  //     // refetch
  //     allAppointmentRefectch()
  //   })
  //   .catch(err => {
  //     toast.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: err.message,
  //       life: 10000,
  //     })
  //   })
}

const openModalDetailEdit = (appointment: Appointment) => {
  selectedAppointment.value = { ...appointment }
  selectedLocationId.value = appointment.location?.id
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

watch(locations, () => {
  console.log('locations: ', locations.value)
})

// Create brearer token
firebaseUser.value?.getIdToken().then(token => {
  console.log(`{"Authorization": "Bearer ${token}"}`)
})
</script>

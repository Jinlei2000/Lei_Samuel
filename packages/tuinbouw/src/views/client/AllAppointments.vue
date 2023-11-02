<template>
  <!-- go back button -->
  <button class="mt-20 flex" @click="$router.go(-1)" v-bind="$attrs">
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

  <div v-if="appointmentsLoading && locationsLoading">
    <p class="text-6xl font-black">Loading...</p>
  </div>

  <!-- show all appointments -->
  <div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-if="appointments && appointments.appointmentsByUserId.length > 0"
        v-for="a of appointments.appointmentsByUserId"
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
              <button
                @click="openModal(a, 'detail')"
                class="ml-2 text-blue-500"
              >
                View More
              </button>
              <!-- Delete button (only if not done) -->
              <button
                v-if="!a.isDone"
                @click.stop="handleDelete(a.id)"
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
                @click.stop="openModal(a, 'edit')"
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
      v-model:visible="visible.detail"
      modal
      maximizable
      header="Appointment"
      :style="{ width: '50vw' }"
      v-if="selectedAppointment"
      @click:close="closeModal"
      class="max-w-lg"
    >
      <h2 class="mb-2 text-xl font-semibold">
        {{ selectedAppointment.type }}
      </h2>
      <p class="text-gray-600">
        {{ selectedAppointment.description }}
      </p>
    </Dialog>

    <!-- Edit Modal -->
    <Dialog
      v-model:visible="visible.edit"
      modal
      maximizable
      header="Edit Appointment"
      :style="{ width: '50vw' }"
      v-if="selected"
      @click:close="closeModal"
      class="max-w-lg"
    >
      <form @submit.prevent="handleUpdate()" class="space-y-2 p-4">
        <!-- Location ID -->
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            for="locationId"
            >Start Proposed Date
          </label>
          <Dropdown
            v-if="locations && locations.locationsByUserId.length > 0"
            id="locationId"
            v-model="selected.locationId"
            :options="locations.locationsByUserId"
            optionLabel="address"
            optionValue="id"
            class="w-full"
          />
        </div>

        <!-- Type -->
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            for="type"
            >Start Proposed Date
          </label>
          <Dropdown
            id="type"
            v-model="selected.type"
            :options="[{ name: 'maintenance' }, { name: 'repair' }]"
            optionLabel="name"
            optionValue="name"
            class="w-full"
          >
            <template #dropdownicon>
              <ChevronDownIcon />
            </template>
          </Dropdown>
        </div>

        <!-- Start Proposed Date -->
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            for="startProposedDate"
            >Start Proposed Date
          </label>
          <Calendar
            id="startProposedDate"
            v-model="selected.startProposedDate"
            :manualInput="false"
            :minDate="minDate"
            showIcon
            dateFormat="yy-mm-dd"
          >
            <template #dropdownicon>
              <CalendarIcon />
            </template>
          </Calendar>
        </div>

        <!-- End Proposed Date -->
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            for="endProposedDate"
          >
            End Proposed Date
          </label>
          <Calendar
            id="endProposedDate"
            v-model="selected.endProposedDate"
            showIcon
            dateFormat="yy-mm-dd"
            :manualInput="false"
            :minDate="new Date(selected.startProposedDate!)"
          >
            <template #dropdownicon>
              <CalendarIcon />
            </template>
          </Calendar>
        </div>

        <!-- Description -->
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            for="description"
          >
            Description
          </label>
          <Textarea
            id="description"
            v-model="selected.description"
            rows="5"
            cols="30"
            placeholder="Type your description here..."
          />
        </div>

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
import useCustomUser from '@/composables/useCustomUser'
import { GET_ALL_APPOINTMENT_BY_CLIENT } from '@/graphql/appointment.query'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, watchEffect } from 'vue'
import { ArrowLeft, Filter, ChevronDown, Check } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'
import type {
  Appointment,
  AppointmentUpdate,
} from '@/interfaces/appointment.user.interface'
import {
  DELETE_APPOINTMENT,
  UPDATE_APPOINTMENT,
} from '@/graphql/appointment.mutation'
import { GET_LOCATIONS_BY_USERID } from '@/graphql/location.query'
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import Textarea from 'primevue/textarea'
import { Calendar as CalendarIcon, ChevronDownIcon } from 'lucide-vue-next'

const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime, isOverToday } = useTimeUtilities()

const minDate = new Date()
const selected = ref<AppointmentUpdate | null>(null)
const selectedAppointment = ref<Appointment | null>(null)
const visible = ref({
  detail: false,
  edit: false,
})
const variables = ref<{
  userId: string
  filters: string[]
  order: {
    field: string
    direction: string
  }
}>({
  userId: customUser.value?.id!,
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
  result: appointments,
  error: appointmentsError,
  refetch: appointmentsRefetch,
  loading: appointmentsLoading,
} = useQuery(GET_ALL_APPOINTMENT_BY_CLIENT, variables, {
  // return result from cache first (if it exists), then return network result once it's available.
  fetchPolicy: 'cache-and-network',
})

// TODO: loading on something (button, etc)
const { mutate: deleteAppointment, error: deleteAppointmentError } =
  useMutation(DELETE_APPOINTMENT)

// TODO: loading on something (button, etc)
const { mutate: updateAppointment, error: updateAppointmentError } =
  useMutation(UPDATE_APPOINTMENT)

const {
  result: locations,
  error: locationsError,
  loading: locationsLoading,
} = useQuery(
  GET_LOCATIONS_BY_USERID,
  () => ({
    userId: customUser.value?.id,
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

// TODO: make a filter component and use Accordion  (https://primefaces.org/primevue/showcase/#/accordion)
// also add a reset button
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

const handleDelete = (id: string) => {
  deleteAppointment({
    id,
  }).then(() => {
    showToast('success', 'Success', 'Appointment deleted')
    // refetch
    appointmentsRefetch()
  })
}

const handleUpdate = () => {
  console.log('selected: ', selected.value)
  updateAppointment({
    updateAppointmentInput: {
      ...selected.value,
    },
  }).then(async () => {
    showToast('success', 'Success', 'Appointment updated')
    // refetch
    await appointmentsRefetch()
    // close modal
    closeModal()
  })
}

const openModal = (appointment: Appointment, modalType: string) => {
  if (modalType === 'detail') {
    selectedAppointment.value = { ...appointment }
    visible.value.detail = true
  } else if (modalType === 'edit') {
    selected.value = {
      id: appointment.id!,
      type: appointment.type!,
      locationId: appointment.location?.id!,
      startProposedDate: formatDateTime(
        appointment.startProposedDate!.toString(),
      ),
      endProposedDate: formatDateTime(appointment.endProposedDate!.toString()),
      description: appointment.description!,
    }
    visible.value.edit = true
  }
}

const closeModal = () => {
  selectedAppointment.value = null
  selected.value = null
  visible.value = {
    detail: false,
    edit: false,
  }
}

// watch all errors
watchEffect(() => {
  const errors = [
    appointmentsError.value,
    deleteAppointmentError.value,
    updateAppointmentError.value,
    locationsError.value,
  ]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})

// // log the queries
// watchEffect(() => {
//   if (locations.value) console.log('locations: ', locations.value)
//   if (appointments.value)
//     console.log('appointments: ', appointments.value)
// })
</script>

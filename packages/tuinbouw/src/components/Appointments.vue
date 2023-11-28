<template>
  <div
    class="m-auto mb-6 mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
  >
    <div class="flex w-full flex-col gap-3">
      <!-- Filters + Searchbar -->
      <section :class="['relative flex w-full items-center justify-between']">
        <!-- Filter -->
        <Filter
          v-model="variables.filters"
          :options="FILTER_OPTIONS_APPOINTMENTS"
        />

        <!-- Searchbar -->
        <Search
          v-model="variables.searchString"
          placeholder="Search for appointments"
        />
      </section>

      <!-- Title + Sort -->
      <header class="flex w-full items-center justify-between">
        <!-- Title -->
        <h1 class="text-2xl">Appointments</h1>
        <div class="flex gap-3">
          <!-- Sort -->
          <Sort
            v-model="variables.order"
            :options="SORT_OPTIONS_APPOINTMENTS"
          />
        </div>
      </header>
    </div>
  </div>

  <!-- show loading -->
  <div v-if="loading.data" class="flex flex-col gap-3">
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
  </div>

  <!-- show all appointments -->
  <div v-else-if="appointments && appointments.length > 0">
    <div class="mb-4 flex flex-col gap-3">
      <div v-for="a of appointments" :key="a.id">
        <button
          :class="[
            'hover:scale-101 w-full overflow-hidden rounded-2xl bg-gray-200 transition-all duration-100 hover:cursor-pointer',
            {
              ' border border-red-400': isOverToday(a),
            },
          ]"
          @click="toggleModal(a, 'detail')"
        >
          <div class="flex h-16 items-center justify-between sm:h-11">
            <div class="flex w-3/4 p-3">
              <h2
                class="w-1/3 min-w-fit text-left text-xl sm:text-lg md:w-1/4 lg:w-1/6"
              >
                {{ a.user.fullname }}
              </h2>
              <p class="hidden text-gray-600 sm:block">{{ a.description }}</p>
            </div>

            <!-- <div class="border-t border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <span v-if="a.isScheduled" class="text-green-500">{{
                  formatDateTime(a.finalDate)
                }}</span>
                <span v-else class="text-gray-500">Not Scheduled</span>
              </div>
            </div> -->

            <div
              class="flex w-1/4 min-w-fit items-center justify-end gap-3 p-3 md:w-1/4"
            >
              <div v-if="!a.isDone">
                <p v-if="a.isScheduled" class="text-gray-600">
                  {{ formatDateTime(a.finalDate) }}
                </p>
                <div v-else class="flex gap-3">
                  <Star
                    v-if="a.priority"
                    class="fill-primary-yellow stroke-primary-yellow h-5 w-5"
                  />
                  <div class="w-5">
                    <CalendarX
                      v-if="!a.isScheduled"
                      class="stroke-primary-red h-5 w-5"
                    />
                  </div>
                </div>
              </div>
              <CheckCircle2 v-else class="stroke-primary-green h-5 w-5" />

              <div class="flex w-1/2 justify-end">
                <p
                  class="w-fit rounded-full px-3 py-1 text-lg lowercase text-white sm:text-base"
                  :class="
                    a.type === 'repair'
                      ? 'bg-primary-green'
                      : a.type === 'maintenance'
                        ? 'bg-primary-blue'
                        : ''
                  "
                >
                  {{ a.type }}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>

  <!-- no appointments -->
  <div v-else-if="appointments.length === 0">
    <p class="text-6xl font-black">No appointments</p>
  </div>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    header="Appointment Detail"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <div v-if="selectedAppointment">
      <h2 class="mb-2 text-xl font-semibold">
        {{ selectedAppointment.type }}
      </h2>
      <p class="text-gray-600">
        {{ selectedAppointment.description }}
      </p>
    </div>
  </Dialog>

  <!-- Edit Modal -->
  <Dialog
    v-model:visible="visible.edit"
    modal
    header="Edit Appointment"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <DynamicForm
      :schema="formAppointment"
      :validation-schema="appointmentUpdateValidationSchema"
      :handle-form="handleUpdateAppointment"
      :loading="loading.update"
      :initial-values="{
        locationId: selectedAppointment!.location!.id,
        type: selectedAppointment!.type,
        startProposedDate: formatDateTime(
          selectedAppointment!.startProposedDate,
        ),
        endProposedDate: formatDateTime(selectedAppointment!.endProposedDate),
        description: selectedAppointment!.description,
      }"
    />
  </Dialog>
</template>
<script setup lang="ts">
import DynamicForm from './generic/DynamicForm.vue'
// components
import Filter from '@/components/generic/Filter.vue'
import Search from '@/components/generic/Search.vue'
import Sort from '@/components/generic/Sort.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useTimeUtilities from '@/composables/useTimeUtilities'
import {
  DELETE_APPOINTMENT,
  UPDATE_APPOINTMENT,
} from '@/graphql/appointment.mutation'
import {
  GET_ALL_APPOINTMENT,
  GET_ALL_APPOINTMENT_BY_USERID,
} from '@/graphql/appointment.query'
import { GET_LOCATIONS_BY_USERID } from '@/graphql/location.query'
import {
  APPOINTMENT_TYPES,
  FILTER_OPTIONS_APPOINTMENTS,
  ORDER_DIRECTION,
  SORT_OPTIONS_APPOINTMENTS,
  SUPPORTED_LOCALES_TYPES,
} from '@/helpers/constants'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { Location } from '@/interfaces/location.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { appointmentUpdateValidationSchema } from '@/validation/schema'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { CalendarX, CheckCircle2, Star } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'
import { type GenericObject } from 'vee-validate'
import { computed, onMounted, ref, watchEffect } from 'vue'

// props
const props = defineProps({
  showAllOverview: {
    type: Boolean,
    default: false,
  },
})

const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime, isOverToday } = useTimeUtilities()

const selectedAppointment = ref<Appointment | null>(null)
const visible = ref({
  detail: false,
  edit: false,
})
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
})
const filter = ref(false)
const loading = ref({
  update: false,
  data: computed(
    () =>
      appointmentsByUserIdLoading.value ||
      appointmentsLoading.value ||
      locationsLoading.value,
  ),
})
const appointments = computed<Appointment[]>(() =>
  props.showAllOverview
    ? appointmentsResult.value?.appointments || []
    : appointmentsByUserIdResult.value?.appointmentsByUserId || [],
)
const locations = computed(() => locationsResult.value?.locationsByUserId || [])

// form schema update appointment client
const formAppointment = ref({
  fields: [
    {
      label: 'Location',
      name: 'locationId',
      as: 'select',
      type: 'select',
      options: locations,
      optionValue: 'id',
      optionLabel: 'address',
      placeholder: 'Select a location',
    },
    {
      label: 'Type',
      name: 'type',
      as: 'select',
      type: 'select',
      options: APPOINTMENT_TYPES,
      placeholder: 'Select a type',
    },
    {
      label: 'Start Proposed Date',
      name: 'startProposedDate',
      as: 'input',
      type: 'date',
      placeholder: 'Select a start proposed date',
      minDate: new Date(),
      linkName: 'endProposedDate',
    },
    {
      label: 'End Proposed Date',
      name: 'endProposedDate',
      as: 'input',
      type: 'date',
      placeholder: 'Select a end proposed date',
      setMinEndDate: true,
    },
    {
      label: 'Description',
      name: 'description',
      as: 'textarea',
      type: 'textarea',
      placeholder: 'Type your description here...',
      rows: 5,
    },
  ],

  button: {
    name: 'Update Appointment',
  },
})

// TODO: use fetchMore to load more appointments (add some kind of pagination in backend (limit, offset)))
// use a load more button
// https://apollo.vuejs.org/guide-composable/pagination.html

const {
  result: appointmentsByUserIdResult,
  error: appointmentsByUserIdError,
  refetch: appointmentsByUserIdRefetch,
  loading: appointmentsByUserIdLoading,
  load: loadAppointmentsByUserId,
} = useLazyQuery(GET_ALL_APPOINTMENT_BY_USERID, variables, {
  fetchPolicy: 'cache-and-network',
})

const {
  result: appointmentsResult,
  error: appointmentsError,
  refetch: appointmentsRefetch,
  loading: appointmentsLoading,
  load: loadAppointments,
} = useLazyQuery(GET_ALL_APPOINTMENT, variables, {
  fetchPolicy: 'cache-and-network',
})

// TODO: loading on something (button, etc)
const { mutate: deleteAppointment, error: deleteAppointmentError } =
  useMutation(DELETE_APPOINTMENT)

const { mutate: updateAppointment, error: updateAppointmentError } =
  useMutation(UPDATE_APPOINTMENT)

const {
  result: locationsResult,
  error: locationsError,
  loading: locationsLoading,
  load: loadLocations,
} = useLazyQuery(
  GET_LOCATIONS_BY_USERID,
  () => ({
    userId: customUser.value?.id,
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

// logics
// on mounted
onMounted(() => {
  if (props.showAllOverview) {
    loadAppointments()
  } else {
    variables.value.userId = customUser.value?.id
    loadLocations()
    loadAppointmentsByUserId()
  }
})

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

// delete appointment
const handleDeleteAppointment = async (id: string) => {
  await deleteAppointment({
    id,
  })
  showToast('success', 'Success', 'Appointment deleted')
  refetch()
}

// update appointment
const handleUpdateAppointment = async (values: GenericObject) => {
  console.log('values: ', values)
  loading.value.update = true
  updateAppointment({
    updateAppointmentInput: {
      id: selectedAppointment.value?.id,
      type: values.type,
      locationId: values.locationId,
      startProposedDate: formatDateTime(values.startProposedDate),
      endProposedDate: formatDateTime(values.endProposedDate),
      description: values.description,
    },
  })
  loading.value.update = false
  showToast('success', 'Success', 'Appointment updated')
  await refetch()
  toggleModal()
}

const toggleModal = (
  appointment: Appointment | null = null,
  type: string = 'close',
) => {
  selectedAppointment.value = appointment ? { ...appointment } : null
  visible.value = {
    detail: type === 'detail',
    edit: type === 'edit',
  }
}

const refetch = async (): Promise<void> => {
  if (props.showAllOverview) await appointmentsRefetch()
  else await appointmentsByUserIdRefetch()
}

// log the queries
watchEffect(() => {
  // if (locations.value) console.log('locations: ', locations.value)
  if (appointments.value) console.log('appointments: ', appointments.value)

  const errors = [
    appointmentsError.value,
    appointmentsByUserIdError.value,
    deleteAppointmentError.value,
    updateAppointmentError.value,
    locationsError.value,
  ]
  errors.forEach(error => {
    if (error) {
      loading.value = {
        ...loading.value,
        update: false,
      }

      showToast('error', 'Error', error.message)
    }
  })
})
</script>

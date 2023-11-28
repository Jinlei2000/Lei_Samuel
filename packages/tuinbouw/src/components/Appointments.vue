<template>
  <div
    class="m-auto mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
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
        <Search v-model="variables.searchString" />
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

  <!-- TODO: make a filter component and use Accordion  -->
  <div class="relative flex w-full items-center justify-between">
    <!-- Filter -->
    <div class="flex items-center gap-3">
      <button
        class="border-1 group flex h-12 items-center gap-[6px] rounded-2xl border-black bg-transparent p-3 text-black"
        @click="filter = !filter"
      >
        <FilterIcon class="h-5 w-5" />
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
                id="maintenance"
                type="checkbox"
                name="maintenance"
                className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                @change="updateFilters('M')"
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
                id="repair"
                type="checkbox"
                name="repair"
                className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                @change="updateFilters('R')"
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
                id="all"
                class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                type="radio"
                name="status"
                value="all"
                checked
                @change="updateFiltersRadio(['D', 'ND'], true)"
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
                id="done"
                class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                type="radio"
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
                id="not-done"
                class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                type="radio"
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

  <div v-if="loading.data">
    <p class="text-6xl font-black">Loading...</p>
  </div>

  <!-- show all appointments -->
  <div v-else-if="appointments && appointments.length > 0">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="a of appointments" :key="a.id">
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
            <p class="mb-1 text-gray-600">{{ a.location.address }}</p>
            <p class="mb-1 text-gray-600">{{ a.id }}</p>
            <p v-if="a.finalDate" class="text-gray-600">
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

          <div
            class="flex items-center justify-end space-x-4 border-t border-gray-200 p-6"
          >
            <!-- View More Button -->
            <button
              class="text-green-500 hover:underline"
              @click="toggleModal(a, 'detail')"
            >
              <Eye />
            </button>
            <!-- Edit button (only if not done) -->
            <button
              v-if="
                // check if is not done and is over today or not done and not scheduled
                (!showAllOverview && !a.isDone && isOverToday(a)) ||
                (!showAllOverview && !a.isDone && !a.isScheduled)
              "
              class="text-blue-500 hover:underline"
              @click.stop="toggleModal(a, 'edit')"
            >
              <Pencil />
            </button>
            <!-- Delete button (only if not done) -->
            <button
              v-if="!a.isDone"
              class="text-red-500 hover:underline"
              @click.stop="handleDeleteAppointment(a.id)"
            >
              <Trash2 />
            </button>
          </div>
        </div>
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
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  Filter as FilterIcon,
  Pencil,
  Trash2,
} from 'lucide-vue-next'
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
  // if (appointments.value) console.log('appointments: ', appointments.value)

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

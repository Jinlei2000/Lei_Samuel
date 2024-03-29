<template>
  <main>
    <section
      class="m-auto mb-6 mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
    >
      <div class="flex w-full flex-col gap-3">
        <!-- Filters + Searchbar -->
        <section
          class="relative flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-between"
        >
          <!-- Filter -->
          <Filter
            v-model="variables.filters"
            :options="FILTER_OPTIONS_APPOINTMENTS"
          />
          <!-- Searchbar -->
          <Search
            v-if="props.showAllOverview"
            v-model="variables.searchString"
            class="w-full sm:w-auto"
            placeholder="appointment.search.placeholder"
          />
        </section>
        <!-- Title + Sort -->
        <header class="flex w-full items-center justify-between">
          <!-- Title -->
          <h1 class="text-2xl">{{ $t('appointment.title') }}</h1>
          <!-- Sort -->
          <Sort
            v-model="variables.order"
            :options="SORT_OPTIONS_APPOINTMENTS"
          />
        </header>
      </div>
    </section>

    <!-- Skeleton -->
    <section v-if="loading.data" class="m-auto flex max-w-7xl flex-col gap-3">
      <div
        v-for="i in 10"
        :key="i"
        class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"
      />
    </section>

    <!-- Appointments -->
    <section v-else-if="appointments && appointments.length > 0">
      <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
        <div v-for="a of appointments" :key="a.id">
          <button
            :class="[
              'relative w-full  overflow-hidden rounded-2xl bg-gray-200 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300',
              {
                ' border border-red-400': isOverToday(a),
              },
            ]"
            @click="toggleModal(a, 'detail')"
          >
            <div class="flex h-16 items-center justify-between sm:h-11">
              <div class="flex w-1/2 p-3 sm:w-3/4">
                <h2
                  class="w-1/2 min-w-fit text-left text-base capitalize sm:w-1/3 sm:text-lg md:w-1/4 lg:w-1/6"
                >
                  {{ a.user.fullname }}
                </h2>
                <p class="hidden truncate text-gray-900 sm:block">
                  {{ a.description }}
                </p>
              </div>
              <div
                class="flex w-1/2 min-w-fit items-center justify-end gap-3 p-3 sm:w-1/4"
              >
                <div v-if="!a.isDone">
                  <p
                    v-if="a.isScheduled && !isOverToday(a)"
                    class="text-gray-600"
                  >
                    {{ formatDateTime(a.finalDate) }}
                  </p>
                  <div v-else class="flex gap-3">
                    <div v-if="isOverToday(a)" class="flex items-center gap-2">
                      <Clock class="stroke-primary-red h-5 w-5" />
                      <p class="text-primary-red">
                        {{ $t('appointment.list.reschedule') }}
                      </p>
                    </div>
                    <Star
                      v-if="a.priority && !isOverToday(a)"
                      class="fill-primary-yellow stroke-primary-yellow h-5 w-5"
                    />
                    <div v-if="!isOverToday(a)" class="w-5">
                      <CalendarX
                        v-if="!a.isScheduled"
                        class="stroke-primary-red h-5 w-5"
                      />
                    </div>
                  </div>
                </div>
                <CheckCircle2 v-else class="stroke-primary-green h-5 w-5" />
                <div
                  class="h-2 w-2 rounded-full"
                  :class="
                    a.type === 'repair'
                      ? 'bg-primary-green'
                      : a.type === 'maintenance'
                        ? 'bg-primary-blue'
                        : ''
                  "
                ></div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- No Appointments -->
    <NoResult v-else-if="appointments.length === 0" />
  </main>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    :header="$t('appointment.modal.detail.title')"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <!-- Show Detail -->
    <div v-if="selectedAppointment && !isEditing && !isEditingAdmin">
      <h2 class="mb-2 text-xl font-semibold">
        {{ selectedAppointment.type }}
      </h2>
      <p class="text-gray-900">
        {{ selectedAppointment.description }}
      </p>
      <div class="mt-6 flex flex-col gap-3">
        <div v-if="selectedAppointment.priority" class="flex gap-3">
          <Star class="fill-primary-yellow stroke-primary-yellow" />
          <p>{{ $t('appointment.modal.detail.priority') }}</p>
        </div>
        <div class="flex gap-3">
          <CalendarIcon
            :class="
              isOverToday(selectedAppointment) ? 'stroke-primary-red' : ''
            "
          />
          <p
            v-if="
              selectedAppointment.isScheduled &&
              !isOverToday(selectedAppointment)
            "
          >
            {{ formatDateTime(selectedAppointment.finalDate) }}
          </p>
          <p v-if="isOverToday(selectedAppointment)" class="text-primary-red">
            {{ $t('appointment.modal.detail.priority') }}
          </p>
          <p v-if="!selectedAppointment.isScheduled">
            {{ $t('appointment.modal.detail.no.scheduled') }}
          </p>
        </div>
      </div>
      <!-- Buttons -->
      <div v-if="!selectedAppointment.isDone" class="mt-6 flex justify-between">
        <!-- Delete -->
        <CustomButton
          variant="warning"
          name="appointment.modal.detail.button.delete"
          :loading="loading.delete"
          @click="handleDeleteAppointment(selectedAppointment.id)"
        />
        <!-- Edit For Client -->
        <CustomButton
          v-if="
            (!showAllOverview && isOverToday(selectedAppointment)) ||
            (!showAllOverview && !selectedAppointment.isScheduled)
          "
          name="appointment.modal.detail.button.edit"
          @click="isEditing = true"
        />
        <!-- Edit For Admin -->
        <CustomButton
          v-if="showAllOverview"
          name="appointment.modal.detail.button.edit"
          @click="isEditingAdmin = true"
        />
      </div>
    </div>

    <!-- Edit Form For Client -->
    <div v-if="isEditing">
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
    </div>

    <!-- Edit Form For Admin -->
    <div v-if="isEditingAdmin">
      <DynamicForm
        :schema="formEditAdminAppointment"
        :validation-schema="appointmentEditAdminValidationSchema"
        :handle-form="handleUpdateAppointmentForAdmin"
        :cancel="() => (isEditingAdmin = false)"
        :loading="loading.update"
        :initial-values="{
          priority: selectedAppointment!.priority,
        }"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import CustomButton from './generic/CustomButton.vue'
import DynamicForm from './generic/DynamicForm.vue'
import NoResult from './generic/NoResult.vue'
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
} from '@/helpers/constants'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import {
  appointmentEditAdminValidationSchema,
  appointmentUpdateValidationSchema,
} from '@/validation/schema'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import {
  Calendar as CalendarIcon,
  CalendarX,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-vue-next'
import Dialog from 'primevue/dialog'
import { type GenericObject } from 'vee-validate'
import { computed, type ComputedRef, onMounted, ref, watchEffect } from 'vue'

// props
const props = defineProps({
  showAllOverview: {
    type: Boolean,
    default: false,
  },
})

// composable
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime, isOverToday } = useTimeUtilities()

// variables
const selectedAppointment = ref<Appointment | null>(null)
const visible = ref<{
  detail: boolean
  edit: boolean
}>({
  detail: false,
  edit: false,
})
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
  searchString: '',
})
const loading = ref<{
  update: boolean
  delete: boolean
  data: ComputedRef<boolean>
}>({
  update: false,
  delete: false,
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
const isEditing = ref<boolean>(false)
const isEditingAdmin = ref<boolean>(false)
// form schema update appointment client
const formAppointment = ref({
  fields: [
    {
      label: 'appointment.form.location',
      name: 'locationId',
      as: 'select',
      type: 'select',
      options: locations,
      optionValue: 'id',
      optionLabel: 'address',
      placeholder: 'appointment.form.location.placeholder',
    },
    {
      label: 'appointment.form.type',
      name: 'type',
      as: 'select',
      type: 'select',
      options: APPOINTMENT_TYPES,
      optionLabel: 'name',
      optionValue: 'value',
      placeholder: 'appointment.form.type.placeholder',
    },
    {
      label: 'appointment.form.start.date',
      name: 'startProposedDate',
      as: 'input',
      type: 'date',
      placeholder: 'appointment.form.start.date.placeholder',
      minDate: new Date(),
      linkName: 'endProposedDate',
    },
    {
      label: 'appointment.form.end.date',
      name: 'endProposedDate',
      as: 'input',
      type: 'date',
      placeholder: 'appointment.form.end.date.placeholder',
      setMinEndDate: true,
    },
    {
      label: 'appointment.form.description',
      name: 'description',
      as: 'textarea',
      type: 'textarea',
      placeholder: 'appointment.form.description.placeholder',
      rows: 5,
    },
  ],

  button: {
    name: 'appointment.form.update.submit',
  },
})

const formEditAdminAppointment = ref({
  fields: [
    {
      label: 'appointment.form.priority',
      name: 'priority',
      as: 'switch',
      type: 'switch',
    },
  ],

  button: {
    name: 'appointment.form.update.submit',
  },
})

// graphql
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

const { mutate: deleteAppointment } = useMutation(DELETE_APPOINTMENT)

const { mutate: updateAppointment } = useMutation(UPDATE_APPOINTMENT)

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

// delete appointment
const handleDeleteAppointment = async (id: string): Promise<void> => {
  try {
    loading.value.delete = true
    await deleteAppointment({
      id,
    })
    showToast('success', 'toast.success', 'appointment.toast.delete')
    refetch()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'appointment.toast.error.delete')
  } finally {
    loading.value.delete = false
  }
}

// update appointment
const handleUpdateAppointment = async (
  values: GenericObject,
): Promise<void> => {
  try {
    // console.log('values: ', values)
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
    showToast('success', 'toast.success', 'appointment.toast.update')
    await refetch()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'appointment.toast.error.update')
  } finally {
    loading.value.update = false
  }
}

const handleUpdateAppointmentForAdmin = async (
  values: GenericObject,
): Promise<void> => {
  try {
    // console.log('values: ', values)
    loading.value.update = true
    updateAppointment({
      updateAppointmentInput: {
        id: selectedAppointment.value?.id,
        priority: values.priority,
      },
    })
    showToast('success', 'toast.success', 'appointment.toast.update')
    await refetch()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'appointment.toast.error.update')
  } finally {
    loading.value.update = false
  }
}

const toggleModal = (
  appointment: Appointment | null = null,
  type: string = 'close',
): void => {
  selectedAppointment.value = appointment ? { ...appointment } : null
  isEditing.value = false
  isEditingAdmin.value = false
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
  // if (locations.value) console.log(locations.value)
  // if (appointments.value) console.log(appointments.value)

  // errors
  if (appointmentsError.value) {
    // console.log(appointmentsError.value)
    LogRocket.captureException(appointmentsError.value as Error)
    showToast('error', 'toast.error', 'appointment.toast.appointments')
  } else if (appointmentsByUserIdError.value) {
    // console.log(appointmentsByUserIdError.value)
    LogRocket.captureException(appointmentsByUserIdError.value as Error)
    showToast('error', 'toast.error', 'appointment.toast.appointments')
  } else if (locationsError.value) {
    // console.log(locationsError.value)
    LogRocket.captureException(locationsError.value as Error)
    showToast('error', 'toast.error', 'appointment.toast.locations')
  }
})
</script>

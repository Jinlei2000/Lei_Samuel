<template>
  <!-- go back button -->
  <button class="flex" v-bind="$attrs" @click="$router.go(-1)">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>

  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    <p v-if="!showAllOverview">Own Absences</p>
    <p v-if="showAllOverview">All absences</p>
  </h1>

  <!-- add absence button -->
  <button
    v-if="!showAllOverview"
    class="bg-primary-green my-4 rounded px-4 py-2 font-bold text-white"
    @click="toggleModal(null, 'create')"
  >
    Add Absence
  </button>

  <!-- TODO: filters & orders -->

  <!-- show loading -->
  <div v-if="loading.data">
    <p class="text-6xl font-black">Loading Absences...</p>
  </div>

  <!-- show absences -->
  <div v-else-if="absences && absences.length > 0">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- v-for="a in absences.absencesByUserId" -->
      <div
        v-for="a in absences"
        :key="a.id"
        class="overflow-hidden rounded-lg bg-white shadow"
      >
        <div class="px-4 py-5 sm:p-6">
          <!-- Absence details go here -->
          <h3 class="text-lg font-semibold text-gray-900">
            {{ a.user.id }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">{{ a.description }}</p>
          <!-- Add more details as needed -->
          <p class="mt-2 text-sm font-medium text-indigo-600">{{ a.type }}</p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            {{ formatDateTime(a.startDate) }} -
            {{ formatDateTime(a.endDate) }}
          </p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            Total Days: {{ a.totalDays }}
          </p>
          <p class="mt-2 text-sm text-gray-500">
            Created At: {{ formatDateTime(a.createdAt) }}
          </p>
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
          <!-- Edit Button -->
          <button
            v-if="a.user.id === customUser?.id"
            class="text-blue-500 hover:underline"
            @click="toggleModal(a, 'edit')"
          >
            <Pencil />
          </button>
          <!-- Delete Button -->
          <button class="text-red-500 hover:underline" @click="handleDelete(a)">
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- show no absences -->
  <div v-else-if="absences.length === 0">
    <p class="text-6xl font-black">No Absences</p>
  </div>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    header="Absence Details"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <div v-if="selectedAbsence">
      <h2 class="mb-2 text-xl font-semibold">
        user id:
        {{ selectedAbsence.user?.id }}
      </h2>
      <p class="text-gray-600">
        {{ selectedAbsence.description }}
      </p>
    </div>
  </Dialog>

  <!-- Edit Modal -->
  <Dialog
    v-model:visible="visible.edit"
    modal
    header="Edit Absence"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <DynamicForm
      :schema="formAbsence"
      :validation-schema="absenceValidationSchema"
      :handle-form="handleUpdateAbsence"
      :loading="loading.update"
      :initial-values="{
        type: selectedAbsence!.type,
        startDate: formatDateTime(selectedAbsence!.startDate),
        endDate: formatDateTime(selectedAbsence!.endDate),
        description: selectedAbsence!.description,
      }"
    />
  </Dialog>

  <!-- Create Modal -->
  <Dialog
    v-model:visible="visible.create"
    modal
    header="Create Absence"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <DynamicForm
      :schema="formAbsence"
      :validation-schema="absenceValidationSchema"
      :handle-form="handleCreateAbsence"
      :loading="loading.create"
    />
  </Dialog>
</template>

<script setup lang="ts">
import DynamicForm from './generic/DynamicForm.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useTimeUtilities from '@/composables/useTimeUtilities'
import {
  CREATE_ABSENCE,
  DELETE_ABSENCE,
  UPDATE_ABSENCE,
} from '@/graphql/absence.mutation'
import {
  GET_ALL_ABSENCES,
  GET_ALL_ABSENCES_BY_USERID,
} from '@/graphql/absence.query'
import { ABSENCE_TYPES, ORDER_DIRECTION } from '@/helpers/constants'
import type { Absence } from '@/interfaces/absence.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { absenceValidationSchema } from '@/validation/schema'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ArrowLeft, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { computed, onMounted, ref, watchEffect } from 'vue'

// props
const props = defineProps({
  showAllOverview: {
    type: Boolean,
    default: false,
  },
})

// composables
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { customUser } = useCustomUser()

// variables
const selectedAbsence = ref<Absence | null>(null)
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
})
const visible = ref({
  detail: false,
  edit: false,
  create: false,
})
const loading = ref({
  update: false,
  create: false,
  data: computed(() => absencesLoading.value || absencesByUserIdLoading.value),
})
const absences = computed<Absence[]>(() =>
  props.showAllOverview
    ? absencesResult.value?.absences || []
    : absencesByUserIdResult.value?.absencesByUserId || [],
)

// form schema absence
const formAbsence = {
  fields: [
    {
      label: 'Type',
      name: 'type',
      as: 'select',
      type: 'select',
      options: ABSENCE_TYPES,
      placeholder: 'Select a type',
    },
    {
      label: 'Start Date',
      name: 'startDate',
      as: 'input',
      type: 'date',
      placeholder: 'Select a start date',
      minDate: new Date(),
    },
    {
      label: 'End Date',
      name: 'endDate',
      as: 'input',
      type: 'date',
      placeholder: 'Select a end date',
      setMinEndDate: true,
    },
    {
      label: 'Description',
      name: 'description',
      as: 'textarea',
      type: 'textarea',
      placeholder: 'Reason for absence',
      rows: 5,
    },
  ],

  button: {
    name: 'Create Absence',
  },
}

// graphql
const {
  result: absencesResult,
  loading: absencesLoading,
  error: absencesError,
  refetch: refetchAbsences,
  load: loadAbsences,
} = useLazyQuery(GET_ALL_ABSENCES, variables, {
  fetchPolicy: 'cache-and-network',
})

const {
  result: absencesByUserIdResult,
  loading: absencesByUserIdLoading,
  error: absencesByUserIdError,
  refetch: refetchAbsencesByUserId,
  load: loadAbsencesByUserId,
} = useLazyQuery(GET_ALL_ABSENCES_BY_USERID, variables, {
  fetchPolicy: 'cache-and-network',
})

const { mutate: deleteAbsence, error: deleteAbsenceError } =
  useMutation(DELETE_ABSENCE)

const { mutate: updateAbsence, error: updateAbsenceError } =
  useMutation(UPDATE_ABSENCE)

const { mutate: createAbsence, error: createAbsenceError } =
  useMutation(CREATE_ABSENCE)

// logics
// on mounted
onMounted(() => {
  if (props.showAllOverview) {
    loadAbsences()
  } else {
    variables.value.userId = customUser.value?.id
    loadAbsencesByUserId()
  }
})

// handle create absence
const handleCreateAbsence = async (values: Absence) => {
  try {
    loading.value.create = true
    await createAbsence({
      createAbsenceInput: {
        userId: customUser.value?.id,
        type: values.type,
        startDate: formatDateTime(values.startDate),
        endDate: formatDateTime(values.endDate),
        description: values.description,
      },
    })
    loading.value.create = false
    showToast('success', 'Success', 'Absence has been created')
    await refetch()
    toggleModal()
  } catch (error) {
    LogRocket.captureException(error as Error)
    console.log(error)
  }
}

// handle update absence
const handleUpdateAbsence = async (values: Absence) => {
  try {
    loading.value.update = true
    await updateAbsence({
      updateAbsenceInput: {
        id: values.id,
        type: values.type,
        startDate: formatDateTime(values.startDate),
        endDate: formatDateTime(values.endDate),
        description: values.description,
      },
    })
    loading.value.update = false
    showToast('success', 'Success', 'Absence has been updated')
    await refetch()
    toggleModal()
  } catch (error) {
    LogRocket.captureException(error as Error)
    console.log(error)
  }
}

// handle delete absence
const handleDelete = async (absence: Absence) => {
  try {
    await deleteAbsence({
      id: absence.id,
    })
    showToast(
      'success',
      'Success',
      `Absence of ${absence.user.firstname} has been deleted`,
    )
    await refetch()
  } catch (error) {
    LogRocket.captureException(error as Error)
    console.log(error)
  }
}

// open or close modal
const toggleModal = (
  absence: Absence | null = null,
  type: string = 'close',
) => {
  selectedAbsence.value = absence ? { ...absence } : null
  visible.value = {
    detail: type === 'detail',
    edit: type === 'edit',
    create: type === 'create',
  }
}

const refetch = async (): Promise<void> => {
  if (props.showAllOverview) await refetchAbsences()
  else await refetchAbsencesByUserId()
}

watchEffect(() => {
  // log the queries
  // if (absences.value) console.log(absences.value)
  // if (absencesByUserIdResult.value) console.log(absencesByUserIdResult.value)
  // if (absencesResult.value) console.log(absencesResult.value)

  // all errors
  const errors = [
    absencesError.value,
    deleteAbsenceError.value,
    updateAbsenceError.value,
    createAbsenceError.value,
    absencesByUserIdError.value,
  ]
  errors.forEach(error => {
    if (error) {
      loading.value = {
        ...loading.value,
        update: false,
        create: false,
      }

      LogRocket.captureException(error)
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

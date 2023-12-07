<template>
  <!-- go back button -->
  <button class="flex" v-bind="$attrs" @click="$router.go(-1)">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>

  <!-- Filters -->
  <div class="flex w-full flex-col gap-10">
    <!-- Filters -->
    <section class="relative flex w-full items-center">
      <Filter v-model="variables.filters" :options="FILTER_OPTIONS_ABSENCES" />
    </section>

    <!-- Title + Sort -->
    <header class="flex w-full items-center justify-between">
      <!-- Title -->
      <h1 class="text-2xl">Absences</h1>
      <div class="flex gap-3">
        <!-- Sort -->
        <Sort v-model="variables.order" :options="SORT_OPTIONS_ABSENCES" />
        <!-- Add Absence -->
        <button
          class="bg-primary-green my-4 rounded px-4 py-2 text-white"
          @click="toggleModal(null, 'create')"
        >
          Add Absence
        </button>
      </div>
    </header>
  </div>

  <!-- Absences -->
  <div v-if="absences && absences.length > 0">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="a in absences"
        :key="a.id"
        class="overflow-hidden rounded-lg bg-white text-left shadow"
        @click="toggleModal(a, 'detail')"
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
      </button>
    </div>
  </div>

  <!-- No Absences -->
  <div v-else-if="absences.length === 0">
    <p class="text-6xl font-black">No Absences</p>
  </div>

  <!-- Skeleton -->
  <div v-else-if="loading.data">
    <p class="text-6xl font-black">Loading Absences...</p>
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
    <!-- Show Detail -->
    <div v-if="!isEditing">
      <h2 class="mb-2 text-xl font-semibold">
        user id:
        {{ selectedAbsence?.user?.id }}
      </h2>
      <p class="text-gray-600">
        {{ selectedAbsence?.description }}
      </p>
      <div class="flex justify-between">
        <!-- Delete button -->
        <CustomButton
          name="Delete"
          :loading="loading.delete"
          variant="warning"
          @click="handleDelete(selectedAbsence!)"
        />
        <!-- Edit button -->
        <CustomButton
          name="Edit"
          :loading="loading.update"
          @click="isEditing = true"
        />
      </div>
    </div>
    <!-- Edit form -->
    <div v-if="isEditing">
      <DynamicForm
        :schema="formAbsence"
        :validation-schema="absenceValidationSchema"
        :handle-form="handleUpdateAbsence"
        :loading="loading.update"
        :cancel="cancelEdit"
        :initial-values="{
          type: selectedAbsence!.type,
          startDate: formatDateTime(selectedAbsence!.startDate),
          endDate: formatDateTime(selectedAbsence!.endDate),
          description: selectedAbsence!.description,
        }"
      />
    </div>
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
import CustomButton from '@/components/generic/CustomButton.vue'
import DynamicForm from '@/components/generic/DynamicForm.vue'
import Filter from '@/components/generic/Filter.vue'
import Sort from '@/components/generic/Sort.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useTimeUtilities from '@/composables/useTimeUtilities'
import {
  CREATE_ABSENCE,
  DELETE_ABSENCE,
  UPDATE_ABSENCE,
} from '@/graphql/absence.mutation'
import { GET_ALL_ABSENCES } from '@/graphql/absence.query'
import {
  ABSENCE_TYPES,
  FILTER_OPTIONS_ABSENCES,
  ORDER_DIRECTION,
  SORT_OPTIONS_ABSENCES,
} from '@/helpers/constants'
import type { Absence } from '@/interfaces/absence.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { absenceValidationSchema } from '@/validation/schema'
import { useMutation, useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ArrowLeft } from 'lucide-vue-next'
import { computed, type ComputedRef, ref, watchEffect } from 'vue'

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
const visible = ref<{
  detail: boolean
  create: boolean
}>({
  detail: false,
  create: false,
})
const loading = ref<{
  update: boolean
  create: boolean
  delete: boolean
  data: ComputedRef<boolean>
}>({
  update: false,
  create: false,
  delete: false,
  data: computed(() => absencesLoading.value),
})
const absences = computed<Absence[]>(() => absencesResult.value?.absences || [])
const isEditing = ref<boolean>(false)

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
  error: absencesError,
  loading: absencesLoading,
  refetch: refetchAbsences,
} = useQuery(GET_ALL_ABSENCES, variables, {
  fetchPolicy: 'cache-and-network',
})

const { mutate: deleteAbsence } = useMutation(DELETE_ABSENCE)

const { mutate: updateAbsence } = useMutation(UPDATE_ABSENCE)

const { mutate: createAbsence } = useMutation(CREATE_ABSENCE)

// logics
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
    showToast('success', 'Success', 'Absence has been created')
    await refetchAbsences()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't create absence")
  } finally {
    loading.value.create = false
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
    showToast('success', 'Success', 'Absence has been updated')
    await refetchAbsences()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't update absence")
  } finally {
    loading.value.update = false
  }
}

// handle delete absence
const handleDelete = async (absence: Absence) => {
  try {
    loading.value.delete = true
    await deleteAbsence({
      id: absence.id,
    })
    showToast(
      'success',
      'Success',
      `Absence of ${absence.user.firstname} has been deleted`,
    )
    await refetchAbsences()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't delete absence")
  } finally {
    loading.value.delete = false
  }
}

// open or close modal
const toggleModal = (
  absence: Absence | null = null,
  type: string = 'close',
) => {
  selectedAbsence.value = absence ? { ...absence } : null
  isEditing.value = false
  visible.value = {
    detail: type === 'detail',
    create: type === 'create',
  }
}

const cancelEdit = () => {
  isEditing.value = false
}

watchEffect(() => {
  // log the queries
  // if (absences.value) console.log(absences.value)
  // if (absencesResult.value) console.log(absencesResult.value)

  // all errors
  if (absencesError.value) {
    // console.log(absencesError.value)
    LogRocket.captureException(absencesError.value)
    showToast('error', 'Error', "Couldn't load absences")
  }
})
</script>

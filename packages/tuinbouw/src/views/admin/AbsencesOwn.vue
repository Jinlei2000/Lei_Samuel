<template>
  <!-- go back button -->
  <button class="flex" @click="$router.go(-1)" v-bind="$attrs">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Absences
  </h1>

  <!-- TODO: filters & orders -->

  <!-- show loading -->
  <div v-if="absencesLoading">
    <p class="text-6xl font-black">Loading Absences...</p>
  </div>

  <!-- show absences -->
  <div v-if="absences && absences.absencesByUserId.length > 0">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="a in absences.absencesByUserId"
        :key="a.id"
        class="overflow-hidden rounded-lg bg-white shadow"
      >
        <div class="px-4 py-5 sm:p-6">
          <!-- Absence details go here -->
          <h3 class="text-lg font-semibold text-gray-900">{{ a.user.id }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ a.description }}</p>
          <!-- Add more details as needed -->
          <p class="mt-2 text-sm font-medium text-indigo-600">{{ a.type }}</p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            {{ formatDateTime(a.startDate) }} - {{ formatDateTime(a.endDate) }}
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
            @click="openModal(a, 'detail')"
            class="text-green-500 hover:underline"
          >
            <Eye />
          </button>
          <!-- Edit Button -->
          <button
            @click="openModal(a, 'edit')"
            class="text-blue-500 hover:underline"
          >
            <Pencil />
          </button>
          <!-- Delete Button -->
          <button @click="handleDelete(a)" class="text-red-500 hover:underline">
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    maximizable
    header="Absence Details"
    :style="{ width: '50vw' }"
    @click:close="closeModal"
    class="max-w-lg"
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
  
  <!-- Create Modal -->
</template>

<script setup lang="ts">
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useTimeUtilities from '@/composables/useTimeUtilities'
import {
  CREATE_ABSENCE,
  DELETE_ABSENCE,
  UPDATE_ABSENCE,
} from '@/graphql/absence.mutation'
import { GET_ALL_ABSENCES_BY_USERID } from '@/graphql/absence.query'
import type { Absence } from '@/interfaces/absence.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Eye, ArrowLeft, Trash2, Pencil } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import * as yup from 'yup'

// composables
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { customUser } = useCustomUser()

// variables
const variables = ref<VariablesProps>({
  userId: customUser.value?.id,
  filters: [],
  order: {
    field: 'createdAt',
    direction: 'DESC',
  },
})
const visible = ref({
  detail: false,
  edit: false,
  create: false,
})
const selectedAbsence = ref<Absence | null>(null)
const loadingUpdate = ref(false)
const loadingCreate = ref(false)

// form
const schema = yup.object({
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  type: yup.string().required(),
  description: yup.string().optional(),
})

// error messages of forms
const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  startDate: '',
  endDate: '',
  type: '',
  description: '',
})

// create form
const { resetForm, defineComponentBinds, errors, values, validate } = useForm({
  validationSchema: schema,
})

const startDate = defineComponentBinds('startDate')
const endDate = defineComponentBinds('endDate')
const type = defineComponentBinds('type')
const description = defineComponentBinds('description')

// // update form
// const {
//   defineComponentBinds: defineComponentBindsUpdate,
//   errors: errorsUpdate,
//   values: valuesUpdate,
//   validate: validateUpdate,
//   setValues: setValuesUpdate,
// } = useForm({
//   validationSchema: schema,
// })

// const startDateUpdate = defineComponentBindsUpdate('startDate')
// const endDateUpdate = defineComponentBindsUpdate('endDate')
// const typeUpdate = defineComponentBindsUpdate('type')
// const descriptionUpdate = defineComponentBindsUpdate('description')

// graphql
const {
  result: absences,
  loading: absencesLoading,
  error: absencesError,
  refetch: refetchAbsences,
} = useQuery(GET_ALL_ABSENCES_BY_USERID, variables, {
  fetchPolicy: 'cache-and-network',
})

const { mutate: deleteAbsence, error: deleteAbsenceError } =
  useMutation(DELETE_ABSENCE)

const { mutate: updateAbsence, error: updateAbsenceError } =
  useMutation(UPDATE_ABSENCE)

const { mutate: createAbsence, error: createAbsenceError } =
  useMutation(CREATE_ABSENCE)

// logics
// handle create
const handleCreate = async (absence: Absence) => {}
// handle update
const handleUpdate = async (absence: Absence) => {}
// handle delete
const handleDelete = async (absence: Absence) => {
  await deleteAbsence({
    id: absence.id,
  }).then(() => {
    showToast(
      'success',
      'Success',
      `Absence of ${absence.user?.firstname} has been deleted`,
    )
    refetchAbsences()
  })
}

const openModal = (absence: Absence | null = null, type: string) => {
  if (type === 'detail' && absence) {
    selectedAbsence.value = { ...absence }
    visible.value.detail = true
  } else if (type === 'edit' && absence) {
    selectedAbsence.value = { ...absence }
    visible.value.edit = true
  } else if (type === 'create') {
    visible.value.create = true
  }
}

const closeModal = () => {
  visible.value = {
    detail: false,
    edit: false,
    create: false,
  }
}

watchEffect(() => {
  // log the queries
  if (absences.value) console.log(absences.value)

  // all errors
  const errors = [
    absencesError.value,
    deleteAbsenceError.value,
    updateAbsenceError.value,
    createAbsenceError.value,
  ]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

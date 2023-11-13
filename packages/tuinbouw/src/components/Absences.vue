<template>
  <!-- go back button -->
  <button class="flex" @click="$router.go(-1)" v-bind="$attrs">
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
    @click="openModal(null, 'create')"
  >
    Add Absence
  </button>

  <!-- TODO: filters & orders -->

  <!-- show loading -->
  <div v-if="absencesLoading || absencesByUserIdLoading">
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
            {{ a.user!.id }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">{{ a.description }}</p>
          <!-- Add more details as needed -->
          <p class="mt-2 text-sm font-medium text-indigo-600">{{ a.type }}</p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            {{ formatDateTime(a.startDate!) }} -
            {{ formatDateTime(a.endDate!) }}
          </p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            Total Days: {{ a.totalDays }}
          </p>
          <p class="mt-2 text-sm text-gray-500">
            Created At: {{ formatDateTime(a.createdAt!) }}
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
            v-if="a.user!.id === customUser?.id"
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

  <!-- show no absences -->
  <div v-else-if="absences.length === 0">
    <p class="text-6xl font-black">No Absences</p>
  </div>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    maximizable
    header="Absence Details"
    :style="{ width: '50vw' }"
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
  <Dialog
    v-model:visible="visible.edit"
    modal
    maximizable
    header="Edit Absence"
    :style="{ width: '50vw' }"
    class="max-w-lg"
  >
    <form @submit.prevent="handleUpdate">
      <!-- Type -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="type"
          >Type
        </label>
        <Dropdown
          id="type"
          v-bind="type"
          :options="[{ name: 'sick' }, { name: 'vacation' }, { name: 'other' }]"
          optionLabel="name"
          optionValue="name"
          class="w-full"
          placeholder="Select a type"
        >
          <template #dropdownicon>
            <ChevronDownIcon />
          </template>
        </Dropdown>
      </div>

      <!-- Start Date -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="startDate"
          >Start Date
        </label>
        <Calendar
          id="startDate"
          v-bind="startDate"
          :manualInput="false"
          :minDate="minDate"
          showIcon
          dateFormat="yy-mm-dd"
          @date-select="setValues({ endDate: startDate.modelValue })"
        >
          <template #dropdownicon>
            <CalendarIcon />
          </template>
        </Calendar>
      </div>

      <!-- End Date -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="endDate"
          >End Date
        </label>
        <Calendar
          id="endDate"
          v-bind="endDate"
          :manualInput="false"
          :minDate="new Date(startDate.modelValue!)"
          showIcon
          dateFormat="yy-mm-dd"
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
          v-bind="description"
          rows="5"
          cols="30"
          placeholder="Type your description here..."
        />
      </div>

      <CustomButton
        type="submit"
        name="Update Absence"
        :loading="loadingUpdate"
      />
    </form>
  </Dialog>

  <!-- Create Modal -->
  <Dialog
    v-model:visible="visible.create"
    modal
    maximizable
    header="Create Absence"
    :style="{ width: '50vw' }"
    class="max-w-lg"
  >
    <form @submit.prevent="handleCreate">
      <!-- Type -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="type"
          >Type
        </label>
        <Dropdown
          id="type"
          v-bind="type"
          :options="[{ name: 'sick' }, { name: 'vacation' }, { name: 'other' }]"
          optionLabel="name"
          optionValue="name"
          class="w-full"
          placeholder="Select a type"
        >
          <template #dropdownicon>
            <ChevronDownIcon />
          </template>
        </Dropdown>
        <small class="p-error" id="text-error">{{
          errorMessages.type || '&nbsp;'
        }}</small>
      </div>

      <!-- Start Date -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="startDate"
          >Start Date
        </label>
        <Calendar
          id="startDate"
          v-bind="startDate"
          :manualInput="false"
          :minDate="minDate"
          showIcon
          dateFormat="yy-mm-dd"
          @date-select="setValues({ endDate: startDate.modelValue })"
          placeholder="Select a start date"
        >
          <template #dropdownicon>
            <CalendarIcon />
          </template>
        </Calendar>
        <small class="p-error block" id="date-error">{{
          errorMessages.startDate || '&nbsp;'
        }}</small>
      </div>

      <!-- End Date -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="endDate"
          >End Date
        </label>
        <Calendar
          id="endDate"
          v-bind="endDate"
          :manualInput="false"
          :minDate="new Date(startDate.modelValue!)"
          showIcon
          dateFormat="yy-mm-dd"
          placeholder="Select an end date"
        >
          <template #dropdownicon>
            <CalendarIcon />
          </template>
        </Calendar>
        <small class="p-error block" id="date-error">{{
          errorMessages.endDate || '&nbsp;'
        }}</small>
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
          v-bind="description"
          rows="5"
          cols="30"
          placeholder="Type your description here..."
        />
        <small class="p-error" id="text-error">{{
          errorMessages.description || '&nbsp;'
        }}</small>
      </div>

      <CustomButton
        type="submit"
        name="Create Absence"
        :loading="loadingCreate"
      />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
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
import type { Absence } from '@/interfaces/absence.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import {
  Eye,
  ArrowLeft,
  Trash2,
  Pencil,
  ChevronDownIcon,
  CalendarIcon,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref, watchEffect } from 'vue'
import * as yup from 'yup'

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
const minDate = new Date()
const variables = ref<VariablesProps>({
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

const absences = computed<Absence[]>(() =>
  props.showAllOverview
    ? absencesResult.value?.absences || []
    : absencesByUserIdResult.value?.absencesByUserId || [],
)

// form
const schema = yup.object({
  startDate: yup.string().required(),
  endDate: yup.string().required(),
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
const { resetForm, defineComponentBinds, errors, values, validate, setValues } =
  useForm({
    validationSchema: schema,
  })

const startDate = defineComponentBinds('startDate')
const endDate = defineComponentBinds('endDate')
const type = defineComponentBinds('type')
const description = defineComponentBinds('description')

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

// handle create
const handleCreate = async () => {
  loadingCreate.value = true
  await validate()
  errorMessages.value = errors.value
  if (Object.keys(errors.value).length === 0) {
    // console.log('values: ', values)
    createAbsence({
      createAbsenceInput: {
        userId: customUser.value?.id,
        type: values.type,
        startDate: formatDateTime(values.startDate),
        endDate: formatDateTime(values.endDate),
        description: values.description,
      },
    }).then(async () => {
      loadingCreate.value = false
      showToast('success', 'Success', 'Absence has been created')
      // refetch
      await refetch()
      // close modal
      closeModal()
    })
  }
  loadingCreate.value = false
}

// handle update
const handleUpdate = async () => {
  loadingUpdate.value = true
  await validate()
  errorMessages.value = errors.value
  if (Object.keys(errors.value).length === 0) {
    // console.log('values: ', values)
    updateAbsence({
      updateAbsenceInput: {
        id: values.id,
        type: values.type,
        startDate: formatDateTime(values.startDate),
        endDate: formatDateTime(values.endDate),
        description: values.description,
      },
    }).then(async () => {
      loadingUpdate.value = false
      showToast('success', 'Success', 'Absence has been updated')
      // refetch
      await refetch()
      // close modal
      closeModal()
    })
  }
  loadingUpdate.value = false
}

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
    refetch()
  })
}

const openModal = (absence: Absence | null = null, type: string) => {
  if (type === 'detail' && absence) {
    selectedAbsence.value = { ...absence }
    visible.value.detail = true
  } else if (type === 'edit' && absence) {
    selectedAbsence.value = { ...absence }
    setValues({
      id: absence.id,
      startDate: formatDateTime(absence.startDate!),
      endDate: formatDateTime(absence.endDate!),
      type: absence.type,
      description: absence.description,
    })
    visible.value.edit = true
  } else if (type === 'create') {
    setValues({
      startDate: '',
      endDate: '',
      type: '',
      description: '',
    })
    visible.value.create = true
  }
}

const closeModal = () => {
  selectedAbsence.value = null
  visible.value = {
    detail: false,
    edit: false,
    create: false,
  }
}

const refetch = async (): Promise<void> => {
  props.showAllOverview ? refetchAbsencesByUserId() : refetchAbsences()
}

watchEffect(() => {
  // log the queries
  // if (absences.value) console.log(absences.value)
  // if (absencesByUserId.value) console.log(absencesByUserId.value)
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
      loadingUpdate.value = false
      loadingCreate.value = false

      showToast('error', 'Error', error.message)
    }
  })
})
</script>

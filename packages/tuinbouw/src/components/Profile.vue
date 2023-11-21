<template>
  <div class="flex flex-col mt-12 gap-6 max-w-xl m-auto">
    <!-- loading -->
    <div v-if="userLoading && !user">
      <p class="text-6xl font-black">Loading User...</p>
    </div>

    <!-- Primary user info -->
    <div class="w-full flex flex-col items-center gap-6">
      <img
        class="h-24 w-24 rounded-full"
        src="https://i.pravatar.cc/300"
        alt="Profile picture"
      />
      <div class="flex flex-col items-center gap-1">
        <h1 class="text-2xl capitalize">
          {{ user?.fullname }}
        </h1>
        <p class="opacity-80">{{ user?.email }}</p>
      </div>
    </div>

    <!-- About me -->
    <div v-if="user && !isEditingUser" class="w-full">
      <div class="w-full flex justify-between mb-3">
        <h2 class="text-2xl">About me</h2>
        <button
          @click="isEditingUser = true"
          class="flex gap-2 text-lg items-center text-primary-orange"
        >
          <Edit2 class="w-5 h-5" /> Edit
        </button>
      </div>
      <ul class="w-full flex flex-col rounded-2xl bg-gray-200 p-6">
        <li
          class="flex justify-between items-center pb-6 border-b-[1px] border-white"
        >
          <p class="text-lg">Telephone</p>
          <p>{{ user.telephone || 'unknown' }}</p>
        </li>
        <li class="flex justify-between items-center pt-6">
          <p class="text-lg">Address</p>
          <p>{{ user.locations[0].address || 'unknown' }}</p>
        </li>
      </ul>
    </div>

    <!-- Edit About me -->
    <div v-if="isEditingUser">
      <!-- go back button -->
      <button class="flex" @click="isEditingUser = false">
        <ArrowLeft class="h-6 w-6" />
        Go back
      </button>

      <DynamicForm
        :schema="formUpdateUser"
        :validationSchema="userUpdateValidationSchema"
        :handleForm="handleUpdateUser"
        :loading="loading.updateUser"
        :initial-values="{
          firstname: user!.firstname,
          lastname: user!.lastname,
          email: user!.email,
          telephone: user!.telephone,
          invoiceOption: user!.invoiceOption,
          company: user!.company,
          btwNumber: user!.btwNumber,
        }"
      />
    </div>

    <!-- Absences -->
    <div
      v-if="customUser?.role == 'ADMIN' || customUser?.role == 'EMPLOYEE'"
      class="w-full flex flex-col gap-3"
    >
      <h2 class="text-2xl">Absences</h2>
      <button
        @click="toggleAbsenceModal(null, 'create')"
        class="w-full flex items-center justify-center border-primary-green border-[1px] rounded-2xl h-16 text-primary-green"
      >
        <PlusCircle class="mr-2" />
        Add New Absence
      </button>
      <div
        v-if="absences && absences.length > 0"
        class="w-full flex flex-col gap-3"
      >
        <button
          @click="toggleAbsenceModal(absence, 'detail')"
          v-for="absence in absences"
          :key="absence.id"
          class="flex justify-between text-left items-center rounded-2xl bg-gray-200 p-3 pl-6"
        >
          <div class="flex w-2/3">
            <p class="min-w-1/3">
              {{ formatAbsenceDate(absence.startDate) }}
            </p>
            <p class="opacity-70">{{ absence.totalDays }} days</p>
          </div>
          <p
            class="px-3 py-1 bg-primary-orange capitalize rounded-full text-white"
          >
            {{ absence.type }}
          </p>
        </button>
      </div>
      <div
        v-else-if="absences.length === 0"
        class="flex justify-center items-center h-20 bg-gray-200 rounded-2xl"
      >
        <p class="text-lg">No absences</p>
      </div>
    </div>

    <!-- Absence Detail Modal -->
    <Dialog
      v-model:visible="visible.openModal"
      modal
      header="Absence Details"
      :draggable="false"
      :close-on-escape="true"
      :pt="{
        root: {
          class: 'w-full mx-3 md:m-0 md:max-w-lg',
        },
      }"
    >
      <div v-if="selectedAbsence && visible.detail" class="flex flex-col gap-6">
        <div class="flex flex-col gap-3">
          <div>
            <h2 class="text-xl font-semibold">
              {{ formatAbsenceDate(selectedAbsence.startDate) }}
            </h2>
            <p class="text-gray-900">{{ selectedAbsence.totalDays }} days</p>
          </div>
          <div>
            <h3 class="text-sm">Description:</h3>
            <p>
              {{ selectedAbsence.description }}
            </p>
          </div>
        </div>
        <div class="flex justify-between">
          <button
            @click="handleDelete(selectedAbsence)"
            class="rounded-[4px] bg-primary-red px-3 py-1 text-white"
          >
            Delete
          </button>
          <button
            @click="toggleAbsenceModal(selectedAbsence, 'edit')"
            class="rounded-[4px] px-3 py-1 border-primary-blue border text-primary-blue"
          >
            Edit
          </button>
        </div>
      </div>
      <DynamicForm
        v-if="visible.edit"
        :schema="formAbsence"
        :validationSchema="absenceValidationSchema"
        :handleForm="handleUpdateAbsence"
        :loading="loading.update"
        :initial-values="{
          type: selectedAbsence!.type,
          startDate: formatDateTime(selectedAbsence!.startDate),
          endDate: formatDateTime(selectedAbsence!.endDate),
          description: selectedAbsence!.description,
        }"
      />
    </Dialog>

    <!-- Edit Absence Modal -->
    <!-- <Dialog
      v-model:visible="visible.edit"
      modal
      header="Edit Absence"
      :draggable="false"
      :close-on-escape="true"
      :pt="{
        root: {
          class: 'w-full mx-3 md:m-0 md:max-w-lg',
        },
      }"
    >
      <DynamicForm
        :schema="formAbsence"
        :validationSchema="absenceValidationSchema"
        :handleForm="handleUpdateAbsence"
        :loading="loading.update"
        :initial-values="{
          type: selectedAbsence!.type,
          startDate: formatDateTime(selectedAbsence!.startDate),
          endDate: formatDateTime(selectedAbsence!.endDate),
          description: selectedAbsence!.description,
        }"
      />
    </Dialog> -->

    <!-- Create Absence Modal -->
    <Dialog
      v-model:visible="visible.create"
      modal
      header="Create Absence"
      :draggable="false"
      :close-on-escape="true"
      :pt="{
        root: {
          class: 'w-full mx-3 md:m-0 md:max-w-lg',
        },
      }"
    >
      <DynamicForm
        :schema="formAbsence"
        :validationSchema="absenceValidationSchema"
        :handleForm="handleCreateAbsence"
        :loading="loading.create"
      />
    </Dialog>

    <!-- Locations -->
    <div
      v-if="customUser?.role == 'CLIENT' && user"
      class="w-full flex flex-col gap-3"
    >
      <h2 class="text-2xl">Locations</h2>
      <button
        @click="openModal(null, 'create')"
        class="w-full flex items-center justify-center border-primary-green border-[1px] rounded-2xl h-16 text-primary-green"
      >
        <PlusCircle class="mr-2" />
        Add Location
      </button>
      <div
        v-if="user.locations && user.locations.length > 0"
        class="w-full flex flex-col gap-3"
      >
        <button
          @click="openModal(location, 'detail')"
          v-for="location in user.locations"
          :key="location.id"
          class="flex justify-between items-center text-left overflow-hidden rounded-2xl bg-gray-200"
        >
          <div class="flex flex-col gap-2 w-1/2 pl-6 py-3">
            <h3 class="text-lg">Home</h3>
            <div>
              <p class="opacity-70">
                {{ location.address.split(',')[0] }}
              </p>
              <p class="opacity-70">{{ location.address.split(',')[1] }}</p>
            </div>
          </div>
          <div
            class="h-28 w-1/2 overflow-auto rounded-3xl rounded-t-none rounded-bl-none"
          >
            <Map :locations="[location]" />
          </div>
        </button>
      </div>
      <div
        v-else-if="user.locations.length === 0"
        class="flex justify-center items-center h-20 bg-gray-200 rounded-2xl"
      >
        <p class="text-lg">No locations</p>
      </div>
    </div>

    <!-- delete account -->
    <button
      @click="handleDeleteUser()"
      class="bg-primary-red text-white rounded-2xl h-16"
    >
      Delete Account
    </button>

    <!-- show user -->
    <div v-if="!isEditingUser && user">
      <!-- edit button -->
      <button class="flex" @click="isEditingUser = true">
        <Pencil class="h-6 w-6" />
      </button>

      <div>
        <div class="overflow-hidden rounded-lg bg-white p-6 shadow">
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ user.fullname }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">{{ user.email }}</p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            Role: {{ user.role }}
          </p>
          <p
            v-if="user.role !== Role.CLIENT"
            class="mt-2 text-sm font-medium text-gray-600"
          >
            Absent Count: {{ user.absentCount }}
          </p>
          <p
            class="mt-2 text-sm font-medium text-gray-600"
            v-if="user.telephone"
          >
            Telephone: {{ user.telephone }}
          </p>
          <div v-if="user.role == Role.CLIENT && user.company">
            <p class="mt-2 text-sm font-medium text-gray-600">
              Company: {{ user.company }}
            </p>
            <p class="mt-2 text-sm font-medium text-gray-600">
              Invoice Option: {{ user.invoiceOption }}
            </p>
            <p class="mt-2 text-sm font-medium text-gray-600">
              VAT Number: {{ user.btwNumber }}
            </p>
          </div>
          <!-- Locations -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Locations</h3>
            <!-- Button for adding a new location -->
            <CustomButton
              v-if="user.locations?.length === 0 || user.role === Role.CLIENT"
              name="Add New Location"
              :loading="loading.createLocation"
              @click="openModal(null, 'create')"
            />
            <!-- show all locations -->
            <div
              v-if="user.locations && user.locations.length > 0"
              class="mt-4"
            >
              <!-- show all locations -->
              <div v-for="location in user.locations" :key="location.id">
                <div
                  class="mt-4 overflow-hidden rounded-lg bg-white p-4 shadow"
                >
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ location.id }}
                  </h3>
                  <p class="mt-2 text-sm font-medium text-gray-600">
                    Address: {{ location.address }}
                  </p>
                  <p class="text-gray-600">
                    Latitude: {{ location.lat }} {{ location.lng }}
                  </p>
                  <!-- Edit and Delete buttons -->
                  <div class="mt-2 flex">
                    <button
                      @click="openModal(location, 'detail')"
                      class="mr-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      <Eye />
                    </button>
                    <button
                      @click="openModal(location, 'edit')"
                      class="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      <Pencil />
                    </button>
                    <button
                      @click="handleDeleteLocation(location.id)"
                      class="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CustomButton
            name="Delete Account"
            :loading="deleteUserLoading"
            @click="handleDeleteUser()"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Location Modal -->
  <Dialog
    v-model:visible="visibleLocation.detail"
    modal
    header="Location Details"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'w-full mx-3 md:m-0 md:max-w-lg',
      },
    }"
  >
    <div v-if="selectedLocation">
      <h2 class="mb-2 text-xl font-semibold">
        {{ selectedLocation.id }}
      </h2>
      <p class="text-gray-600">
        {{ selectedLocation.address }}
      </p>

      <div class="h-80 w-full overflow-auto rounded-3xl">
        <Map :locations="[selectedLocation]" />
      </div>
    </div>
  </Dialog>

  <!-- Edit Location Modal -->
  <Dialog
    v-model:visible="visibleLocation.edit"
    modal
    header="Edit Location"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'w-full mx-3 md:m-0 md:max-w-lg',
      },
    }"
  >
    <form @submit.prevent="handleUpdateLocation">
      <InputField
        name="Address"
        type="text"
        placeholder="Search Address"
        :errorMessage="errorMessages.searchAdressInput"
        v-bind="searchAdressInput"
      />

      <!-- show search results -->
      <div v-if="searchAddressResults">
        <div
          class="address-card-container mt-4 overflow-hidden rounded-lg bg-white p-4 shadow"
          v-for="coordinate in searchAddressResults"
          :key="coordinate.address"
        >
          <div class="flex flex-col">
            <!-- Add a radio button input -->
            <input
              type="radio"
              name="selectedAddress"
              v-bind="selectedAddress"
              class="mr-2"
              :value="coordinate"
            />
            <h2 class="mb-2 text-xl font-semibold">{{ coordinate.address }}</h2>

            <div class="flex justify-between">
              <p class="text-gray-600">
                Latitude: <span>{{ coordinate.lat }}</span>
              </p>
              <p class="text-gray-600">
                Longitude: <span>{{ coordinate.lng }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <small class="p-error">{{
        errorMessages.selectedAddress || '&nbsp;'
      }}</small>

      <!-- show no results -->
      <div v-if="searchAddressResults?.length === 0 || !searchAddressResults">
        <div class="mt-4">
          <p class="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-8 h-8 mx-auto text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </p>
          <p class="text-gray-600 text-center">No results</p>
        </div>
      </div>

      <CustomButton
        class="block"
        name="Search Address"
        :loading="loading.searchAddress"
        @click="handleSearchAddress()"
      />

      <CustomButton
        type="submit"
        name="Update Location"
        :loading="loading.updateLocation"
      />
    </form>
  </Dialog>

  <!-- Create Location Modal -->
  <Dialog
    v-model:visible="visibleLocation.create"
    modal
    header="Create Location"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'w-full mx-3 md:m-0 md:max-w-lg',
      },
    }"
  >
    <form @submit.prevent="handleCreateLocation">
      <InputField
        name="Address"
        type="text"
        placeholder="Search Address"
        :errorMessage="errorMessages.searchAdressInput"
        v-bind="searchAdressInput"
      />

      <!-- show search results -->
      <div v-if="searchAddressResults">
        <div
          class="address-card-container mt-4 overflow-hidden rounded-lg bg-white p-4 shadow"
          v-for="coordinate in searchAddressResults"
          :key="coordinate.address"
        >
          <div class="flex flex-col">
            <!-- Add a radio button input -->
            <input
              type="radio"
              name="selectedAddress"
              v-bind="selectedAddress"
              class="mr-2"
              :value="coordinate"
            />
            <h2 class="mb-2 text-xl font-semibold">{{ coordinate.address }}</h2>

            <div class="flex justify-between">
              <p class="text-gray-600">
                Latitude: <span>{{ coordinate.lat }}</span>
              </p>
              <p class="text-gray-600">
                Longitude: <span>{{ coordinate.lng }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- show no results -->
      <div v-if="searchAddressResults?.length === 0 || !searchAddressResults">
        <div class="mt-4">
          <p class="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-8 h-8 mx-auto text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </p>
          <p class="text-gray-600 text-center">No results</p>
        </div>
      </div>

      <small class="p-error">{{
        errorMessages.selectedAddress || '&nbsp;'
      }}</small>

      <CustomButton
        class="block"
        name="Search Address"
        :loading="loading.searchAddress"
        @click="handleSearchAddress()"
      />

      <CustomButton
        type="submit"
        name="Create Location"
        :loading="loading.createLocation"
      />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { DELETE_USER, UPDATE_USER } from '@/graphql/user.mutation'
import { Role, type CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation, useQuery, useLazyQuery } from '@vue/apollo-composable'
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Eye,
  PlusCircle,
  Edit2,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { GET_USER_BY_ID } from '@/graphql/user.query'
import {
  CREATE_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
} from '@/graphql/location.mutation'
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
import type { Location } from '@/interfaces/location.interface'
import type { Absence } from '@/interfaces/absence.interface'
import { absenceValidationSchema } from '@/validation/schema'
import useTomTomMap from '@/composables/useTomTomMap'
import Map from '@/components/Map.vue'
import {
  locationValidationSchema,
  userUpdateValidationSchema,
} from '@/validation/schema'
import DynamicForm from './generic/DynamicForm.vue'
import { INVOICE_OPTIONS } from '@/helpers/constants'
import InputField from './generic/InputField.vue'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'

// composables
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { firebaseUser } = useFirebase()
const { replace } = useRouter()
const { searchAddress } = useTomTomMap()

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
  openModal: false,
  detail: false,
  edit: false,
  create: false,
})

// variables
const isEditingUser = ref<boolean>(false)
const user = computed<CustomUser | null>(() => userResult.value?.user || null)
const visibleLocation = ref({
  detail: false,
  edit: false,
  create: false,
})
const selectedLocation = ref<Location | null>(null)
const searchAddressResults = ref<Location[] | null>(null)

const absences = computed<Absence[]>(
  () => absencesByUserIdResult.value?.absencesByUserId || [],
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
    name: 'Update Absence',
  },
}

// graphql
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

// on mounted
onMounted(() => {
  variables.value.userId = customUser.value?.id
  if (customUser.value?.role !== Role.CLIENT) {
    loadAbsencesByUserId()
  }
})

// handle create absence
const handleCreateAbsence = async (values: Absence) => {
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
  toggleAbsenceModal()
}

// handle update absence
const handleUpdateAbsence = async (values: Absence) => {
  console.log(values)
  loading.value.update = true
  await updateAbsence({
    updateAbsenceInput: {
      id: selectedAbsence.value?.id,
      type: values.type,
      startDate: formatDateTime(values.startDate),
      endDate: formatDateTime(values.endDate),
      description: values.description,
    },
  })
  loading.value.update = false
  showToast('success', 'Success', 'Absence has been updated')
  await refetch()
  toggleAbsenceModal()
}

// handle delete absence
const handleDelete = async (absence: Absence) => {
  await deleteAbsence({
    id: absence.id,
  })
  showToast(
    'success',
    'Success',
    `Absence of ${absence.user.firstname} has been deleted`,
  )
  await refetch()
  toggleAbsenceModal()
}

// open or close modal
const toggleAbsenceModal = (
  absence: Absence | null = null,
  type: string = 'close',
) => {
  selectedAbsence.value = absence ? { ...absence } : null
  console.log(type)

  // switch case for type
  switch (type) {
    case 'edit':
      visible.value = {
        openModal: true,
        detail: false,
        edit: true,
        create: false,
      }
      break
    case 'detail':
      visible.value = {
        openModal: true,
        detail: true,
        edit: false,
        create: false,
      }
      break
    case 'create':
      visible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: true,
      }
      break
    case 'close':
      visible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: false,
      }
      break
    default:
      break
  }

  console.log(visible.value)
  console.log(selectedAbsence.value)
}

const refetch = async (): Promise<void> => {
  await refetchAbsencesByUserId()
}

watchEffect(() => {
  // log the queries
  // if (absences.value) console.log(absences.value)
  // if (absencesByUserIdResult.value) console.log(absencesByUserIdResult.value)
  // if (absencesResult.value) console.log(absencesResult.value)

  // all errors
  const errors = [
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

      showToast('error', 'Error', error.message)
    }
  })
})

// loading states
const loading = ref<{ [key: string]: boolean }>({
  updateUser: false,
  createLocation: false,
  updateLocation: false,
  searchAddress: false,
})

// form schema update user
const formUpdateUser = {
  fields: [
    {
      label: 'First Name',
      name: 'firstname',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'Last Name',
      name: 'lastname',
      placeholder: 'Doe',
      as: 'input',
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'john@example.com',
      as: 'input',
    },
    {
      label: 'Telephone (optional)',
      name: 'telephone',
      placeholder: '0412345678',
      as: 'input',
    },
    // client only
    ...(customUser.value?.role === Role.CLIENT
      ? [
          {
            label: 'Select Invoice Option',
            name: 'invoiceOption',
            as: 'select',
            type: 'select',
            options: INVOICE_OPTIONS,
            placeholder: 'Select a type',
          },
          {
            label: 'Company (optional)',
            name: 'company',
            as: 'switch',
            type: 'switch',
          },
          {
            label: 'BTW Number (optional)',
            name: 'btwNumber',
            placeholder: 'BE0123456789',
            as: 'input',
            displayIf: 'company',
          },
        ]
      : []),
  ],

  button: {
    name: 'Update User',
  },
}

// error messages of forms
const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  searchAdressInput: '',
  selectedAddress: '',
})

// create location form
const {
  defineComponentBinds: defineComponentBindsLocation,
  defineInputBinds: defineInputBindsLocation,
  errors: errorsLocation,
  values: valuesLocation,
  validate: validateLocation,
  setValues: setValuesLocation,
} = useForm({
  validationSchema: locationValidationSchema,
})

const searchAdressInput = defineComponentBindsLocation('searchAdressInput')
const selectedAddress = defineInputBindsLocation('selectedAddress')

// graphql
const {
  result: userResult,
  loading: userLoading,
  error: userError,
  refetch: refetchUser,
} = useQuery(
  GET_USER_BY_ID,
  () => ({
    id: customUser.value?.id,
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

const { mutate: updateUser, error: updateUserError } = useMutation(UPDATE_USER)

const {
  mutate: deleteUser,
  loading: deleteUserLoading,
  error: deleteUserError,
} = useMutation(DELETE_USER)

const { mutate: createLocation, error: createLocationError } =
  useMutation(CREATE_LOCATION)

const { mutate: updateLocation, error: updateLocationError } =
  useMutation(UPDATE_LOCATION)

const { mutate: deleteLocation, error: deleteLocationError } =
  useMutation(DELETE_LOCATION)

// logics
// handle delete user
const handleDeleteUser = async () => {
  await deleteUser({
    id: customUser.value?.id,
  })
  showToast('success', 'Success', `You have deleted your account`)
  customUser.value = null
  firebaseUser.value = null
  replace('/')
}

// handle update user
const handleUpdateUser = async (values: CustomUser) => {
  loading.value.updateUser = true
  await updateUser({
    updateUserInput: {
      id: customUser.value?.id,
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      telephone: values.telephone,
      // client only
      ...(customUser.value?.role === Role.CLIENT && {
        invoiceOption: values.invoiceOption,
        company: values.company,
        btwNumber: values.company ? values.btwNumber : null,
      }),
    },
  })
  loading.value.updateUser = false
  showToast('success', 'Success', `You have updated your profile`)
  isEditingUser.value = false
  refetchUser()
}

// search address
const handleSearchAddress = async () => {
  loading.value.searchAddress = true
  searchAddressResults.value = null
  errorMessages.value = {}

  await validateLocation()
  errorMessages.value.searchAdressInput = errorsLocation.value.searchAdressInput
  if (!errorsLocation.value.searchAdressInput) {
    try {
      const results = await searchAddress(valuesLocation.searchAdressInput)
      loading.value.searchAddress = false
      if (results) {
        searchAddressResults.value = results
      }
    } catch (err) {
      if (err instanceof Error) showToast('error', 'Error', err.message)
    }
  }
  loading.value.searchAddress = false
}

// add new location
const handleCreateLocation = async () => {
  loading.value.createLocation = true
  await validateLocation()
  errorMessages.value = errorsLocation.value
  if (Object.keys(errorsLocation.value).length === 0) {
    console.log('no errors', valuesLocation)
    await createLocation({
      createLocationInput: {
        address: valuesLocation.selectedAddress.address,
        lat: valuesLocation.selectedAddress.lat,
        lng: valuesLocation.selectedAddress.lng,
        userId: customUser.value?.id,
      },
    })
    loading.value.createLocation = false
    showToast('success', 'Success', `You have created a new location`)
    closeModal()
    refetchUser()
  }
  loading.value.createLocation = false
}

// update location
const handleUpdateLocation = async () => {
  loading.value.updateLocation = true
  await validateLocation()
  errorMessages.value = errorsLocation.value
  if (Object.keys(errorsLocation.value).length === 0) {
    console.log('no errors', valuesLocation)
    await updateLocation({
      updateLocationInput: {
        id: selectedLocation.value?.id,
        address: valuesLocation.selectedAddress.address,
        lat: valuesLocation.selectedAddress.lat,
        lng: valuesLocation.selectedAddress.lng,
      },
    })
    loading.value.updateLocation = false
    showToast('success', 'Success', `You have updated a location`)
    closeModal()
    refetchUser()
  }
  loading.value.updateLocation = false
}

// delete location
const handleDeleteLocation = async (id: string) => {
  await deleteLocation({
    id: id,
  })
  showToast('success', 'Success', `You have deleted a location`)
  refetchUser()
}

const openModal = (location: Location | null = null, type: string) => {
  // reset values
  setValuesLocation({
    searchAdressInput: '',
    selectedAddress: null,
  })
  selectedLocation.value = null
  searchAddressResults.value = null
  errorMessages.value = {}

  if (type === 'detail' && location) {
    selectedLocation.value = { ...location }
    visibleLocation.value.detail = true
  } else if (type === 'edit' && location) {
    selectedLocation.value = { ...location }
    searchAddressResults.value = [{ ...location }]
    setValuesLocation({
      searchAdressInput: location.address,
    })
    visibleLocation.value.edit = true
  } else if (type === 'create') {
    visibleLocation.value.create = true
  }
}

const closeModal = () => {
  visibleLocation.value = {
    detail: false,
    edit: false,
    create: false,
  }
}

watchEffect(() => {
  // log the queries
  // if (userResult.value) console.log(userResult.value)

  // all errors
  const errors = [
    userError.value,
    updateUserError.value,
    deleteUserError.value,
    createLocationError.value,
    updateLocationError.value,
    deleteLocationError.value,
  ]
  errors.forEach(error => {
    if (error) {
      loading.value = {
        updateUser: false,
        createLocation: false,
        updateLocation: false,
        searchAddress: false,
      }

      showToast('error', 'Error', error.message)
    }
  })
})

// Change date to mm/dd/yyyy
const formatAbsenceDate = (date: string) => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}
</script>

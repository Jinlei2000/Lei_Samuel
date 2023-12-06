<template>
  <div class="m-auto my-12 flex max-w-xl flex-col gap-6">
    <!-- Primary user info -->
    <div class="flex w-full flex-col items-center gap-6">
      <div class="relative">
        <div>
          <img
            v-if="user?.url"
            class="h-24 w-24 rounded-full"
            :src="user?.url"
            alt="Profile picture"
          />
          <div
            v-else
            class="bg-primary-green flex h-24 w-24 items-center justify-center rounded-full"
          >
            <p class="text-4xl text-white">
              {{ user?.firstname[0].toUpperCase() }}
            </p>
          </div>
        </div>
        <button
          class="bg-primary-orange absolute right-0 top-0 h-6 w-6 rounded-full"
          @click="toggleUserModal('editPicture')"
        >
          <Edit2
            class="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center stroke-white"
          />
        </button>
      </div>
      <div class="flex flex-col items-center gap-1">
        <h1 class="text-2xl capitalize">
          {{ user?.fullname }}
        </h1>
        <p class="opacity-80">{{ user?.email }}</p>
      </div>
    </div>

    <!-- About me -->
    <div v-if="user && !isEditingUser" class="w-full">
      <div class="mb-3 flex w-full justify-between">
        <h2 class="text-2xl">About me</h2>
        <button
          class="text-primary-orange flex items-center gap-2 text-lg"
          @click="isEditingUser = true"
        >
          <Edit2 class="h-5 w-5" /> Edit
        </button>
      </div>
      <ul class="flex w-full flex-col rounded-2xl bg-gray-200 p-6">
        <li
          class="flex items-center justify-between border-b-[1px] border-white pb-6"
        >
          <p class="text-lg">Telephone</p>
          <p>{{ user.telephone || 'unknown' }}</p>
        </li>
        <li class="flex items-center justify-between pt-6">
          <p class="text-lg">Address</p>
          <p>
            {{ user.locations[0].address || 'unknown' }}
          </p>
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
        :validation-schema="userUpdateValidationSchema"
        :handle-form="handleUpdateUser"
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
      class="flex w-full flex-col gap-3"
    >
      <h2 class="text-2xl">Absences</h2>
      <button
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
        @click="toggleAbsenceModal(null, 'create')"
      >
        <PlusCircle class="mr-2" />
        Add New Absence
      </button>
      <div
        v-if="absences && absences.length > 0"
        class="flex w-full flex-col gap-3"
      >
        <button
          v-for="absence in absences"
          :key="absence.id"
          class="flex items-center justify-between rounded-2xl bg-gray-200 p-3 pl-6 text-left"
          @click="toggleAbsenceModal(absence, 'detail')"
        >
          <div class="flex w-2/3">
            <p class="min-w-1/3">
              {{ formatAbsenceDate(absence.startDate) }}
            </p>
            <p class="opacity-70">{{ absence.totalDays }} days</p>
          </div>
          <p
            class="bg-primary-orange rounded-full px-3 py-1 capitalize text-white"
          >
            {{ absence.type }}
          </p>
        </button>
      </div>
      <div
        v-else-if="absences.length === 0"
        class="flex h-20 items-center justify-center rounded-2xl bg-gray-200"
      >
        <p class="text-lg">No absences</p>
      </div>
    </div>

    <!-- Locations -->
    <div v-if="user" class="flex w-full flex-col gap-3">
      <h2 class="text-2xl">Locations</h2>
      <button
        v-if="
          (customUser?.role == 'ADMIN' && user.locations.length === 0) ||
          (customUser?.role == 'EMPLOYEE' && user.locations.length === 0)
        "
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
        @click="toggleLocationModal(null, 'create')"
      >
        <PlusCircle class="mr-2" />
        Add Location
      </button>
      <div
        v-if="user.locations && user.locations.length > 0"
        class="flex w-full flex-col gap-3"
      >
        <button
          v-for="location in user.locations"
          :key="location.id"
          class="flex items-center justify-between overflow-hidden rounded-2xl bg-gray-200 text-left"
          @click="toggleLocationModal(location, 'detail')"
        >
          <div class="flex w-1/2 flex-col gap-2 py-3 pl-6">
            <!-- location or nothing -->
            <h3 class="text-lg">{{ location.title }}</h3>
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
            <Map class="h-full w-full" :locations="[location]" />
          </div>
        </button>
      </div>
      <div
        v-else-if="user.locations.length === 0"
        class="flex h-20 items-center justify-center rounded-2xl bg-gray-200"
      >
        <p class="text-lg">No locations</p>
      </div>
    </div>

    <!-- delete account -->
    <button
      class="bg-primary-red rounded-2xl py-3 text-white"
      @click="handleDeleteUser()"
    >
      Delete Account
    </button>
  </div>

  <!-- Detail Absence Modal -->
  <Dialog
    v-model:visible="absenceModalVisible.openModal"
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
    <div
      v-if="selectedAbsence && absenceModalVisible.detail"
      class="flex flex-col gap-6"
    >
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
          class="bg-primary-red rounded-[4px] px-3 py-1 text-white"
          @click="handleDelete(selectedAbsence)"
        >
          Delete
        </button>
        <button
          class="border-primary-blue text-primary-blue rounded-[4px] border px-3 py-1"
          @click="toggleAbsenceModal(selectedAbsence, 'edit')"
        >
          Edit
        </button>
      </div>
    </div>
    <DynamicForm
      v-if="absenceModalVisible.edit"
      :schema="formAbsence"
      :validation-schema="absenceValidationSchema"
      :handle-form="handleUpdateAbsence"
      :cancel="cancelAbsenceEdit"
      :loading="loading.update"
      :initial-values="{
        type: selectedAbsence!.type,
        startDate: formatDateTime(selectedAbsence!.startDate),
        endDate: formatDateTime(selectedAbsence!.endDate),
        description: selectedAbsence!.description,
      }"
    />
  </Dialog>

  <!-- Create Absence Modal -->
  <Dialog
    v-model:visible="absenceModalVisible.create"
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
      :validation-schema="absenceValidationSchema"
      :handle-form="handleCreateAbsence"
      :loading="loading.create"
    />
  </Dialog>

  <!-- Detail Location Modal -->
  <Dialog
    v-model:visible="locationModalVisible.openModal"
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
    <div
      v-if="selectedLocation && locationModalVisible.detail"
      class="flex flex-col gap-6"
    >
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-semibold">
          {{ selectedLocation.title }}
        </h2>
        <div>
          <p class="opacity-70">
            {{ selectedLocation.address.split(',')[0] }}
          </p>
          <p class="opacity-70">{{ selectedLocation.address.split(',')[1] }}</p>
        </div>
      </div>

      <div class="h-48 w-full overflow-auto rounded-lg">
        <Map class="h-full w-full" :locations="[selectedLocation]" />
      </div>

      <div
        class="flex"
        :class="
          user!.locations[0].id == selectedLocation.id
            ? 'justify-end'
            : 'justify-between'
        "
      >
        <button
          v-if="user!.locations[0].id != selectedLocation.id"
          class="bg-primary-red rounded-[4px] px-3 py-1 text-white"
          @click="handleDeleteLocation(selectedLocation.id)"
        >
          Delete
        </button>
        <button
          class="border-primary-blue text-primary-blue justify-self-end rounded-[4px] border px-3 py-1"
          @click="toggleLocationModal(selectedLocation, 'edit')"
        >
          Edit
        </button>
      </div>
    </div>

    <!-- Edit Location -->
    <form
      v-if="locationModalVisible.edit"
      @submit.prevent="handleUpdateLocation"
    >
      <div class="flex flex-col gap-3">
        <InputField
          name="Title"
          type="text"
          :placeholder="selectedLocation?.title"
          :error-message="errorMessages.title"
          v-bind="locationTitle"
        />
        <div class="flex w-full items-end justify-between gap-3">
          <InputField
            name="Address"
            type="text"
            placeholder="Search Address"
            :error-message="errorMessages.searchAdressInput"
            v-bind="searchAdressInput"
          />
          <CustomButton
            name="Search"
            :loading="loading.searchAddress"
            @click="handleSearchAddress()"
          />
        </div>
      </div>

      <!-- show search results -->
      <div v-if="searchAddressResults">
        <div
          v-for="coordinate in searchAddressResults"
          :key="coordinate.address"
          class="address-card-container mt-4 overflow-hidden rounded-lg bg-white p-4 shadow"
        >
          <div class="flex items-center">
            <!-- Add a radio button input -->
            <input
              type="radio"
              name="selectedAddress"
              v-bind="selectedAddress"
              class="mr-3"
              :value="coordinate"
            />
            <h2 class="text-lg">{{ coordinate.address }}</h2>
          </div>
        </div>
      </div>
      <small class="p-error">{{
        errorMessages.selectedAddress || '&nbsp;'
      }}</small>

      <!-- show no results -->
      <div v-if="searchAddressResults?.length === 0 || !searchAddressResults">
        <div class="my-4">
          <p class="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="mx-auto h-8 w-8 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </p>
          <p class="text-center text-gray-600">No results</p>
        </div>
      </div>
      <div class="flex justify-between">
        <CustomButton
          name="Cancel"
          variant="secondary"
          @click="cancelLocationEdit()"
        />
        <CustomButton
          type="submit"
          variant="primary"
          name="Update Location"
          :loading="loading.updateLocation"
        />
      </div>
    </form>
  </Dialog>

  <!-- Create Location Modal -->
  <Dialog
    v-model:visible="locationModalVisible.create"
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
      <div class="flex flex-col gap-3">
        <InputField
          name="Title"
          type="text"
          placeholder="Office"
          :error-message="errorMessages.title"
          v-bind="locationTitle"
        />
        <div class="flex w-full items-end justify-between gap-3">
          <InputField
            name="Address"
            type="text"
            placeholder="Search Address"
            :error-message="errorMessages.searchAdressInput"
            v-bind="searchAdressInput"
          />
          <CustomButton
            name="Search"
            :loading="loading.searchAddress"
            @click="handleSearchAddress()"
          />
        </div>
      </div>

      <!-- show search results -->
      <div v-if="searchAddressResults">
        <div
          v-for="coordinate in searchAddressResults"
          :key="coordinate.address"
          class="address-card-container mt-4 overflow-hidden rounded-lg bg-white p-4 shadow"
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
              class="mx-auto h-8 w-8 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </p>
          <p class="text-center text-gray-600">No results</p>
        </div>
      </div>
      <small class="text-primary-red">{{
        errorMessages.selectedAddress || '&nbsp;'
      }}</small>
      <div class="flex w-full justify-end">
        <CustomButton
          type="submit"
          name="Create Location"
          :loading="loading.createLocation"
        />
      </div>
    </form>
  </Dialog>

  <!-- Edit Profile Picture  -->
  <Dialog
    v-model:visible="userModalVisible.editPicture"
    modal
    header="Upload Image"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'w-full mx-3 md:m-0 md:max-w-lg',
      },
    }"
  >
    <form class="p-4" @submit.prevent="handleUploadImage">
      <div class="flex w-full flex-col">
        <label
          for="dropzone-file"
          class="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              class="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and
              drop
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            accept="image/*"
            @change="
              $event => {
                const target = $event.target as HTMLInputElement
                selectedPicture = (target.files as FileList)[0]
              }
            "
          />
        </label>

        <span class="block text-sm text-red-500">
          {{ errorMessageSelectedPicture }}
        </span>
      </div>

      <div class="mt-6 flex justify-between">
        <CustomButton
          name="Cancel"
          variant="secondary"
          @click="toggleUserModal()"
        />
        <CustomButton
          type="submit"
          :loading="loadingUpload"
          name="Upload"
          variant="primary"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import DynamicForm from './generic/DynamicForm.vue'
import InputField from './generic/InputField.vue'
import CustomButton from '@/components/generic/CustomButton.vue'
import Map from '@/components/Map.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useTimeUtilities from '@/composables/useTimeUtilities'
import useTomTomMap from '@/composables/useTomTomMap'
import {
  CREATE_ABSENCE,
  DELETE_ABSENCE,
  UPDATE_ABSENCE,
} from '@/graphql/absence.mutation'
import { GET_ALL_ABSENCES_BY_USERID } from '@/graphql/absence.query'
import {
  CREATE_LOCATION,
  DELETE_LOCATION,
  UPDATE_LOCATION,
} from '@/graphql/location.mutation'
import { DELETE_USER, UPDATE_USER } from '@/graphql/user.mutation'
import { GET_USER_BY_ID } from '@/graphql/user.query'
import { ABSENCE_TYPES, ORDER_DIRECTION } from '@/helpers/constants'
import { INVOICE_OPTIONS } from '@/helpers/constants'
import type { Absence } from '@/interfaces/absence.interface'
import { type CustomUser, Role } from '@/interfaces/custom.user.interface'
import type { Location } from '@/interfaces/location.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { absenceValidationSchema } from '@/validation/schema'
import {
  locationValidationSchema,
  userUpdateValidationSchema,
} from '@/validation/schema'
import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ArrowLeft, Edit2, PlusCircle } from 'lucide-vue-next'
import { Form, useForm } from 'vee-validate'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// TODO: REFRACTOR THIS FILE

// composables
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { firebaseUser, uploadProfile, deleteProfile } = useFirebase()
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
const absenceModalVisible = ref({
  openModal: false,
  detail: false,
  edit: false,
  create: false,
})

const locationModalVisible = ref({
  openModal: false,
  detail: false,
  edit: false,
  create: false,
})

// variables
const isEditingUser = ref<boolean>(false)
const selectedPicture = ref<File | null>(null)
const userModalVisible = ref({
  editPicture: false,
})
const user = computed<CustomUser | null>(() => userResult.value?.user || null)
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
    toggleAbsenceModal()
  } catch (err) {
    LogRocket.captureException(err as Error)
    console.log(err)
  }
}

// handle update absence
const handleUpdateAbsence = async (values: Absence) => {
  try {
    // console.log(values)
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
  } catch (err) {
    LogRocket.captureException(err as Error)
    console.log(err)
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
    toggleAbsenceModal()
  } catch (err) {
    LogRocket.captureException(err as Error)
    console.log(err)
  }
}

// open or close modal
const toggleAbsenceModal = (
  absence: Absence | null = null,
  type: string = 'close',
) => {
  selectedAbsence.value = absence ? { ...absence } : null

  // switch case for type
  switch (type) {
    case 'edit':
      absenceModalVisible.value = {
        openModal: true,
        detail: false,
        edit: true,
        create: false,
      }
      break
    case 'detail':
      absenceModalVisible.value = {
        openModal: true,
        detail: true,
        edit: false,
        create: false,
      }
      break
    case 'create':
      absenceModalVisible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: true,
      }
      break
    case 'close':
      absenceModalVisible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: false,
      }
      break
    default:
      break
  }
}

const cancelAbsenceEdit = () => {
  toggleAbsenceModal(selectedAbsence.value, 'detail')
}

const cancelLocationEdit = () => {
  toggleLocationModal(selectedLocation.value, 'detail')
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

      LogRocket.captureException(error)
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
  locationTitle: '',
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

const locationTitle = defineComponentBindsLocation('locationTitle')
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

const { mutate: deleteUser, error: deleteUserError } = useMutation(DELETE_USER)

const { mutate: createLocation, error: createLocationError } =
  useMutation(CREATE_LOCATION)

const { mutate: updateLocation, error: updateLocationError } =
  useMutation(UPDATE_LOCATION)

const { mutate: deleteLocation, error: deleteLocationError } =
  useMutation(DELETE_LOCATION)

const loadingUpload = ref<boolean>(false)
const errorMessageSelectedPicture = ref<string>('')

// logics
// handle upload image
const handleUploadImage = async () => {
  errorMessageSelectedPicture.value = ''
  loadingUpload.value = true
  if (!selectedPicture.value) {
    errorMessageSelectedPicture.value = 'Please select a picture'
    loadingUpload.value = false
    return
  }
  try {
    // save image to firebase & get url
    const url = await uploadProfile(
      customUser.value!.uid,
      selectedPicture.value as File,
    )
    // update user in db
    await updateUser({
      updateUserInput: {
        id: customUser.value?.id,
        url: url,
      },
    })

    loadingUpload.value = false
    showToast('success', 'Success', 'Profile picture has been updated')
    toggleUserModal()
  } catch (error) {
    console.log(error)
    if (error instanceof Error) showToast('error', 'Error', error.message)
  }
}

// handle delete user
const handleDeleteUser = async () => {
  // delete profile picture
  await deleteProfile(customUser.value!.uid)

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
        title: valuesLocation.locationTitle,
        address: valuesLocation.selectedAddress.address,
        lat: valuesLocation.selectedAddress.lat,
        lng: valuesLocation.selectedAddress.lng,
        userId: customUser.value?.id,
      },
    })
    loading.value.createLocation = false
    showToast('success', 'Success', `You have created a new location`)
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
        title: valuesLocation.locationTitle,
        address: valuesLocation.selectedAddress.address,
        lat: valuesLocation.selectedAddress.lat,
        lng: valuesLocation.selectedAddress.lng,
      },
    })
    loading.value.updateLocation = false
    showToast('success', 'Success', `You have updated a location`)
    resetInputfields()
    refetchUser()
    toggleLocationModal()
  }
  loading.value.updateLocation = false
}

// reset input fields
const resetInputfields = () => {
  setValuesLocation({
    locationTitle: '',
    searchAdressInput: '',
    selectedAddress: null,
  })
  selectedLocation.value = null
  searchAddressResults.value = null
  errorMessages.value = {}
}

// delete location
const handleDeleteLocation = async (id: string) => {
  await deleteLocation({
    id: id,
  })
  toggleLocationModal() // close modal
  showToast('success', 'Success', `You have deleted a location`)
  refetchUser()
}

const toggleLocationModal = (
  location: Location | null = null,
  type: string = 'close',
) => {
  selectedLocation.value = location ? { ...location } : null

  // switch case for type
  switch (type) {
    case 'edit':
      locationModalVisible.value = {
        openModal: true,
        detail: false,
        edit: true,
        create: false,
      }
      break
    case 'detail':
      locationModalVisible.value = {
        openModal: true,
        detail: true,
        edit: false,
        create: false,
      }
      break
    case 'create':
      locationModalVisible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: true,
      }
      break
    case 'close':
      locationModalVisible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: false,
      }
      break
    default:
      break
  }
}

const toggleUserModal = (type: string = 'close') => {
  switch (type) {
    case 'editPicture':
      userModalVisible.value = {
        editPicture: true,
      }
      selectedPicture.value = null
      errorMessageSelectedPicture.value = ''
      break
    case 'close':
      userModalVisible.value = {
        editPicture: false,
      }

      break
    default:
      break
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

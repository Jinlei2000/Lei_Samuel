<template>
  <!-- go back button -->
  <button class="flex" v-bind="$attrs" @click="$router.go(-1)">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Profile
  </h1>

  <!-- loading -->
  <div v-if="userLoading && !user">
    <p class="text-6xl font-black">Loading User...</p>
  </div>

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
        <p v-if="user.telephone" class="mt-2 text-sm font-medium text-gray-600">
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
          <div v-if="user.locations && user.locations.length > 0" class="mt-4">
            <!-- show all locations -->
            <div v-for="location in user.locations" :key="location.id">
              <div class="mt-4 overflow-hidden rounded-lg bg-white p-4 shadow">
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
                    class="mr-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    @click="openModal(location, 'detail')"
                  >
                    <Eye />
                  </button>
                  <button
                    class="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    @click="openModal(location, 'edit')"
                  >
                    <Pencil />
                  </button>
                  <button
                    class="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    @click="handleDeleteLocation(location.id)"
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

  <!-- show edit form -->
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

  <!-- Detail Location Modal -->
  <Dialog
    v-model:visible="visibleLocation.detail"
    modal
    header="Location Details"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
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
        class: 'max-w-lg',
      },
    }"
  >
    <form @submit.prevent="handleUpdateLocation">
      <InputField
        v-model="searchAdressInput"
        name="Address"
        type="text"
        placeholder="Search Address"
        :error-message="errorMessages.searchAdressInput"
      />

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
        class: 'max-w-lg',
      },
    }"
  >
    <form @submit.prevent="handleCreateLocation">
      <InputField
        name="Address"
        type="text"
        placeholder="Search Address"
        :error-message="errorMessages.searchAdressInput"
        v-bind="searchAdressInput"
      />

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
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Pencil, Trash2, ArrowLeft, Eye } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { GET_USER_BY_ID } from '@/graphql/user.query'
import {
  CREATE_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
} from '@/graphql/location.mutation'
import type { Location } from '@/interfaces/location.interface'
import useTomTomMap from '@/composables/useTomTomMap'
import Map from '@/components/Map.vue'
import {
  locationValidationSchema,
  userUpdateValidationSchema,
} from '@/validation/schema'
import DynamicForm from './generic/DynamicForm.vue'
import { INVOICE_OPTIONS } from '@/helpers/constants'
import InputField from './generic/InputField.vue'

// composables
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { firebaseUser } = useFirebase()
const { replace } = useRouter()
const { searchAddress } = useTomTomMap()

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
</script>

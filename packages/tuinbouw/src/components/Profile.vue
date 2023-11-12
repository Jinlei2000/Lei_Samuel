<template>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Profile
  </h1>

  <!-- loading -->
  <div v-if="userLoading">
    <p class="text-6xl font-black">Loading User...</p>
  </div>

  <!-- show user -->
  <div v-if="!isEditing">
    <!-- edit button -->
    <button class="flex" @click="setEditing(true)">
      <Pencil class="h-6 w-6" />
    </button>

    <div v-if="user">
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
        <p class="mt-2 text-sm font-medium text-gray-600">
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
            :loading="loadingCreateLocation"
            @click="openModal(null, 'create')"
          />
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

  <!-- show edit form -->
  <div v-if="isEditing">
    <!-- go back button -->
    <button class="flex" @click="setEditing(false)">
      <ArrowLeft class="h-6 w-6" />
      Go back
    </button>
    <form @submit.prevent="handleUpdateUser">
      <InputText
        name="First Name"
        placeholder="John"
        type="text"
        :errorMessage="errorMessages.firstname"
        v-bind="firstname"
      />

      <!-- Last Name -->
      <InputText
        name="Last Name"
        placeholder="Doe"
        type="text"
        :errorMessage="errorMessages.lastname"
        v-bind="lastname"
      />

      <!-- Email -->
      <InputText
        name="Email"
        placeholder="john@example.com"
        type="text"
        :errorMessage="errorMessages.email"
        v-bind="email"
      />

      <!-- Telephone -->
      <InputText
        name="Telephone (optional)"
        placeholder="0412345678"
        type="text"
        :errorMessage="errorMessages.telephone"
        v-bind="telephone" 
      />

      <!-- Client Only -->
      <div v-if="user?.role === Role.CLIENT">
        <!-- Invoice Option -->
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            for="invoiceOption"
            >Invoice Option (optional)
          </label>
          <Dropdown
            id="invoiceOption"
            v-model="invoiceOption"
            :options="[{ name: 'post' }, { name: 'email' }]"
            optionLabel="name"
            optionValue="name"
            class="w-full"
            placeholder="Select Invoice Option"
          >
            <template #dropdownicon>
              <ChevronDownIcon />
            </template>
          </Dropdown>
        </div>
        <!-- Company -->
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            for="company"
            >Company (optional)
          </label>
          <InputSwitch id="company" v-bind="company" />
        </div>

        <InputText
          v-if="company.modelValue"
          name="BTW Number (optional)"
          placeholder="BE0123456789"
          type="text"
          :errorMessage="errorMessages.btwNumber"
          v-bind="btwNumber"
        />
      </div>

      <CustomButton
        type="submit"
        name="Update User"
        :loading="updateUserLoading"
      />
    </form>
  </div>

  <!-- Detail Location Modal -->
  <Dialog
    v-model:visible="visibleLocation.detail"
    modal
    maximizable
    header="Location Details"
    :style="{ width: '50vw' }"
    class="max-w-lg"
  >
    <div v-if="selectedLocation">
      <h2 class="mb-2 text-xl font-semibold">
        {{ selectedLocation.id }}
      </h2>
      <p class="text-gray-600">
        {{ selectedLocation.address }}
      </p>

      <div class="h-80 w-full overflow-auto rounded-3xl">
        <Map
          :coordinates="[
            {
              lat: selectedLocation.lat!,
              lng: selectedLocation.lng!,
            },
          ]"
        />
      </div>
    </div>
  </Dialog>

  <!-- Edit Location Modal -->
  <Dialog
    v-model:visible="visibleLocation.edit"
    modal
    maximizable
    header="Edit Location"
    :style="{ width: '50vw' }"
    class="max-w-lg"
  >
    <form @submit.prevent="handleUpdateLocation">
      <InputText
        name="Address"
        placeholder="Search Address"
        type="text"
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
        <small class="p-error">{{
          errorMessages.selectedAddress || '&nbsp;'
        }}</small>
      </div>

      <CustomButton
        class="block"
        name="Search Address"
        :loading="loadingSearchAddress"
        @click="handleSearchAddress()"
      />

      <CustomButton
        type="submit"
        name="Update Location"
        :loading="loadingUpdateLocation"
      />
    </form>
  </Dialog>

  <!-- Create Location Modal -->
  <Dialog
    v-model:visible="visibleLocation.create"
    modal
    maximizable
    header="Create Location"
    :style="{ width: '50vw' }"
    class="max-w-lg"
  >
    <form @submit.prevent="handleCreateLocation">
      <InputText
        name="Address"
        placeholder="Search Address"
        type="text"
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
        <small class="p-error">{{
          errorMessages.selectedAddress || '&nbsp;'
        }}</small>
      </div>

      <CustomButton
        class="block"
        name="Search Address"
        :loading="loadingSearchAddress"
        @click="handleSearchAddress()"
      />

      <CustomButton
        type="submit"
        name="Create Location"
        :loading="loadingCreateLocation"
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
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Eye,
  ChevronDownIcon,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import InputText from '@/components/generic/form/InputText.vue'
import { GET_USER_BY_ID } from '@/graphql/user.query'
import {
  CREATE_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
} from '@/graphql/location.mutation'
import type { Location } from '@/interfaces/location.interface'
import useTomTomMap from '@/composables/useTomTomMap'
import type { Coordinate } from '@/interfaces/coordinate.interface'
import Map from '@/components/Map.vue'

// composables
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { firebaseUser } = useFirebase()
const { replace } = useRouter()
const { searchAddress } = useTomTomMap()

// variables
const isEditing = ref(false)
const user = computed<CustomUser | null>(() => userResult.value?.user || null)
const loadingCreateLocation = ref(false)
const loadingUpdateUser = ref(false)
const loadingUpdateLocation = ref(false)
const visibleLocation = ref({
  detail: false,
  edit: false,
  create: false,
})
const selectedLocation = ref<Location | null>(null)
const searchAddressResults = ref<Coordinate[] | null>(null)
const loadingSearchAddress = ref(false)

// form
const schema = yup.object({
  email: yup.string().required().email(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  telephone: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10)
    .max(10)
    .optional()
    .nullable(),
  invoiceOption: yup.string().optional().nullable(),
  company: yup.boolean().optional().nullable(),
  btwNumber: yup
    .string()
    .matches(/^[A-Za-z\d]{5,15}$/, 'Not a valid VAT Number')
    .min(5, 'VAT Number must be at least 5 characters')
    .max(15, 'VAT Number must be at most 15 characters')
    .optional()
    .nullable(),
})

// error messages of forms
const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  firstname: '',
  lastname: '',
  email: '',
  telephone: '',
  searchAdressInput: '',
  selectedAddress: '',
})

// update user form
const { resetForm, defineComponentBinds, errors, values, validate, setValues } =
  useForm({
    validationSchema: schema,
  })

const firstname = defineComponentBinds('firstname')
const lastname = defineComponentBinds('lastname')
const email = defineComponentBinds('email')
const telephone = defineComponentBinds('telephone')
const invoiceOption = defineComponentBinds('invoiceOption')
const company = defineComponentBinds('company')
const btwNumber = defineComponentBinds('btwNumber')

// create location form
const {
  resetForm: resetFormLocation,
  defineComponentBinds: defineComponentBindsLocation,
  defineInputBinds: defineInputBindsLocation,
  errors: errorsLocation,
  values: valuesLocation,
  validate: validateLocation,
  setValues: setValuesLocation,
} = useForm({
  validationSchema: yup.object({
    searchAdressInput: yup.string().required().trim(),
    selectedAddress: yup.object().required(),
  }),
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

const {
  mutate: updateUser,
  loading: updateUserLoading,
  error: updateUserError,
} = useMutation(UPDATE_USER)

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
  }).then(() => {
    showToast('success', 'Success', `You have deleted your account`)
    customUser.value = null
    firebaseUser.value = null
    replace('/')
  })
}

// handle update user
const handleUpdateUser = async () => {
  loadingUpdateUser.value = true
  await validate()
  errorMessages.value = errors.value
  if (Object.keys(errors.value).length === 0) {
    console.log('no errors', values)
    // update client
    const input =
      customUser.value?.role !== Role.CLIENT
        ? {
            invoiceOption: values.invoiceOption,
            company: values.company,
            btwNumber: values.btwNumber,
          }
        : {}
    await updateUser({
      updateUserInput: {
        id: customUser.value?.id,
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        telephone: values.telephone,
        ...input,
      },
    }).then(() => {
      showToast('success', 'Success', `You have updated your profile`)
      setEditing(false)
      resetForm()
      refetchUser()
    })
  }
  loadingUpdateUser.value = false
}

// search address
const handleSearchAddress = async () => {
  loadingSearchAddress.value = true
  searchAddressResults.value = null
  await validateLocation()
  errorMessages.value.searchAdressInput = errorsLocation.value.searchAdressInput
  if (!errorsLocation.value.searchAdressInput) {
    await searchAddress(valuesLocation.searchAdressInput)
      .then(async results => {
        loadingSearchAddress.value = false
        if (results) {
          searchAddressResults.value = results
        }
      })
      .catch(err => {
        showToast('error', 'Error', err.message)
      })
  }
  loadingSearchAddress.value = false
}

// add new location
const handleCreateLocation = async () => {
  loadingCreateLocation.value = true
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
    }).then(() => {
      showToast('success', 'Success', `You have created a new location`)
      closeModal()
      refetchUser()
    })
  }
  loadingCreateLocation.value = false
}

// update location
const handleUpdateLocation = async () => {
  loadingUpdateLocation.value = true
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
    }).then(() => {
      showToast('success', 'Success', `You have updated a location`)
      closeModal()
      refetchUser()
    })
  }
  loadingUpdateLocation.value = false
}

// delete location
const handleDeleteLocation = async (id: string) => {
  await deleteLocation({
    id: id,
  }).then(() => {
    showToast('success', 'Success', `You have deleted a location`)
    refetchUser()
  })
}

const setEditing = (value: boolean) => {
  isEditing.value = value
  const {
    role,
    firstname,
    lastname,
    email,
    telephone,
    invoiceOption,
    company,
    btwNumber,
  } = user.value ?? {}
  if (value) {
    setValues({
      firstname,
      lastname,
      email,
      telephone,
      ...(role === Role.CLIENT && { invoiceOption, company, btwNumber }),
    })
  }
}

const openModal = (location: Location | null = null, type: string) => {
  // reset values
  setValuesLocation({
    searchAdressInput: '',
    selectedAddress: null,
  })
  selectedLocation.value = null
  searchAddressResults.value = null

  if (type === 'detail' && location) {
    selectedLocation.value = { ...location }
    visibleLocation.value.detail = true
  } else if (type === 'edit' && location) {
    selectedLocation.value = { ...location }
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
      loadingCreateLocation.value = false
      loadingUpdateUser.value = false

      showToast('error', 'Error', error.message)
    }
  })
})
</script>

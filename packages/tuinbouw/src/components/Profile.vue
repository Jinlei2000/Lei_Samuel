<template>
  <main v-if="user" class="m-auto my-12 flex w-full max-w-xl flex-col gap-6">
    <!-- Primary user info -->
    <section class="flex w-full flex-col items-center gap-6">
      <div class="relative">
        <!-- Profile picture -->
        <Avatar
          class="h-24 w-24 overflow-hidden rounded-full text-4xl"
          :user="user"
        />
        <!-- Edit profile picture -->
        <label
          class="bg-primary-orange absolute right-0 top-0 h-6 w-6 rounded-full"
          for="upload-image"
          tabindex="0"
        >
          <div v-if="!loadingUser.uploadPicture">
            <Edit2
              class="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center stroke-white"
            />
            <input
              id="upload-image"
              :disabled="loadingUser.uploadPicture"
              type="file"
              class="hidden"
              accept="image/*"
              @change="$event => handleUploadImage($event)"
            />
          </div>
          <div
            v-else
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform stroke-white"
          >
            <svg
              aria-hidden="true"
              role="status"
              class="h-3 w-3 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </label>
      </div>
      <!-- Name & Email -->
      <div class="flex flex-col items-center gap-1">
        <h1 class="text-2xl capitalize">
          {{ user.fullname }}
        </h1>
        <p class="opacity-80">{{ user.email }}</p>
      </div>
    </section>

    <!-- About me -->
    <section class="w-full">
      <div class="mb-3 flex w-full justify-between">
        <h2 class="text-2xl">{{ $t('profile.about.title') }}</h2>
        <button
          class="text-primary-orange flex items-center gap-2 text-lg"
          @click="toggleUserModal('update')"
        >
          <Edit2 class="h-5 w-5" /> {{ $t('profile.about.button.edit') }}
        </button>
      </div>
      <ul class="flex w-full flex-col rounded-2xl bg-gray-200 p-6">
        <li
          class="flex items-center justify-between border-b-[1px] border-white pb-6"
        >
          <p class="text-lg">{{ $t('profile.about.telephone') }}</p>
          <p v-if="user && user.telephone">{{ user.telephone }}</p>
          <p v-else>{{ $t('profile.about.unknown') }}</p>
        </li>
        <li class="flex items-center justify-between pt-6">
          <p class="text-lg">{{ $t('profile.about.address') }}</p>
          <p
            v-if="
              user &&
              user.locations &&
              user.locations[0] &&
              user.locations[0].address
            "
          >
            {{ user.locations[0].address }}
          </p>
          <p v-else>{{ $t('profile.about.unknown') }}</p>
        </li>
      </ul>
    </section>

    <!-- Absences -->
    <section
      v-if="customUser?.role == 'ADMIN' || customUser?.role == 'EMPLOYEE'"
      class="flex w-full flex-col gap-3"
    >
      <h2 class="text-2xl">{{ $t('profile.absences.title') }}</h2>
      <button
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
        @click="toggleAbsenceModal(null, 'create')"
      >
        <PlusCircle class="mr-2" />
        {{ $t('profile.absences.button') }}
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
          <div class="flex w-2/3 gap-3 sm:gap-0">
            <p class="min-w-1/3">
              {{ formatAbsenceDate(absence.startDate) }}
            </p>
            <p class="opacity-70">
              {{ absence.totalDays }} {{ $t('profile.absences.days') }}
            </p>
          </div>
          <p
            class="bg-primary-orange rounded-full px-3 py-1 capitalize text-white"
          >
            {{ $t(absence.type) }}
          </p>
        </button>
      </div>
      <div
        v-else-if="absences.length === 0"
        class="flex h-20 items-center justify-center rounded-2xl bg-gray-200"
      >
        <p class="text-lg">{{ $t('profile.no.absences') }}</p>
      </div>
    </section>

    <!-- Locations -->
    <section class="flex w-full flex-col gap-3">
      <h2 class="text-2xl">{{ $t('profile.location.title') }}</h2>
      <button
        v-if="
          customUser?.role == 'CLIENT' ||
          (customUser?.role == 'EMPLOYEE' && user.locations.length === 0)
        "
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
        @click="toggleLocationModal(null, 'create')"
      >
        <PlusCircle class="mr-2" />
        {{ $t('profile.location.button') }}
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
        <p class="text-lg">{{ $t('profile.no.location') }}</p>
      </div>
    </section>

    <!-- Delete Account -->
    <button
      class="bg-primary-red rounded-2xl py-3 text-white"
      @click="handleDeleteUser()"
    >
      {{ $t('profile.button.delete') }}
    </button>
  </main>

  <!-- Skeleton -->
  <div v-else class="m-auto my-12 flex max-w-xl flex-col gap-6">
    <section class="flex w-full flex-col items-center gap-6">
      <div class="h-24 w-24 animate-pulse rounded-full bg-neutral-200"></div>
      <div class="flex flex-col items-center gap-2">
        <div class="w-30 h-5 animate-pulse rounded-full bg-neutral-200"></div>
        <div class="h-4 w-40 animate-pulse rounded-full bg-neutral-200"></div>
      </div>
    </section>

    <section class="w-full">
      <div class="mb-3 flex w-full justify-between">
        <h2 class="text-2xl">About me</h2>
        <button class="text-primary-orange flex items-center gap-2 text-lg">
          <Edit2 class="h-5 w-5" /> Edit
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <div
          v-for="i in [1, 2]"
          :key="i"
          class="h-15 animate-pulse gap-3 rounded-2xl bg-gray-200"
        />
      </div>
    </section>

    <section
      v-if="customUser?.role !== 'CLIENT'"
      class="flex w-full flex-col gap-3"
    >
      <h2 class="text-2xl">Absences</h2>
      <button
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
      >
        <PlusCircle class="mr-2" /> Add New Absence
      </button>
      <div class="flex w-full flex-col gap-3">
        <button
          v-for="absence in [1, 2]"
          :key="absence"
          class="flex items-center justify-between rounded-2xl bg-gray-200 p-3 pl-6 text-left"
        >
          <div class="flex w-2/3 gap-3">
            <div class="h-5 w-20 animate-pulse rounded-full bg-neutral-200" />
            <div class="h-5 w-20 animate-pulse rounded-full bg-neutral-200" />
          </div>
          <div class="h-5 w-20 animate-pulse rounded-full bg-neutral-200" />
        </button>
      </div>
    </section>

    <section class="flex w-full flex-col gap-3">
      <h2 class="text-2xl">Locations</h2>
      <button
        v-if="customUser?.role === 'CLIENT'"
        class="border-primary-green text-primary-green flex h-16 w-full items-center justify-center rounded-2xl border-[1px]"
      >
        <PlusCircle class="mr-2" /> Add Location
      </button>
      <div class="flex w-full flex-col gap-3">
        <button
          class="flex items-center justify-between overflow-hidden rounded-2xl bg-gray-200 text-left"
        >
          <div class="flex w-1/2 flex-col gap-2 py-3 pl-6">
            <div
              class="h-5 w-10 animate-pulse rounded-full bg-neutral-200 sm:w-20"
            />
            <div
              class="h-5 w-20 animate-pulse rounded-full bg-neutral-200 sm:w-40"
            />
          </div>
          <div
            class="h-28 w-1/2 animate-pulse rounded-3xl rounded-t-none rounded-bl-none bg-neutral-200"
          />
        </button>
      </div>
    </section>

    <button class="bg-primary-red rounded-2xl py-3 text-white">
      Delete Account
    </button>
  </div>

  <!-- Update User Modal -->
  <Dialog
    v-model:visible="userModalVisible.update"
    modal
    :header="$t('profile.modal.update.user.title')"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'w-full mx-3 md:m-0 md:max-w-lg',
      },
    }"
  >
    <DynamicForm
      :schema="formUpdateUser"
      :validation-schema="userUpdateValidationSchema"
      :handle-form="handleUpdateUser"
      :loading="loadingUser.update"
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
  </Dialog>

  <!-- Detail Absence Modal -->
  <Dialog
    v-model:visible="absenceModalVisible.detail"
    modal
    :header="$t('profile.modal.detail.absence.title')"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'w-full mx-3 md:m-0 md:max-w-lg',
      },
    }"
  >
    <div
      v-if="selectedAbsence && !isEditingAbsence"
      class="flex flex-col gap-6"
    >
      <div class="flex flex-col gap-3">
        <div>
          <h2 class="text-xl font-semibold">
            {{ formatAbsenceDate(selectedAbsence.startDate) }}
          </h2>
          <p class="text-gray-900">
            {{ selectedAbsence.totalDays }} {{ $t('profile.absences.days') }}
          </p>
        </div>
        <div>
          <h3 class="text-sm">
            {{ $t('profile.modal.detail.absence.description') }}
          </h3>
          <p>
            {{ selectedAbsence.description }}
          </p>
        </div>
      </div>
      <div class="flex justify-between">
        <!-- Delete Absence -->
        <CustomButton
          name="profile.form.absence.delete"
          :loading="loadingAbsence.delete"
          variant="warning"
          @click="handleDeleteAbsence(selectedAbsence)"
        />
        <!-- Edit Absence -->
        <CustomButton
          name="profile.form.absence.edit"
          @click="isEditingAbsence = true"
        />
      </div>
    </div>
    <DynamicForm
      v-if="isEditingAbsence"
      :schema="formAbsence"
      :validation-schema="absenceValidationSchema"
      :handle-form="handleUpdateAbsence"
      :cancel="cancelAbsenceEdit"
      :loading="loadingAbsence.update"
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
    :header="$t('profile.modal.create.absence.title')"
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
      :loading="loadingLocation.create"
    />
  </Dialog>

  <!-- Detail Location Modal -->
  <Dialog
    v-model:visible="locationModalVisible.detail"
    modal
    :header="$t('profile.modal.detail.location.title')"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'w-full mx-3 md:m-0 md:max-w-lg',
      },
    }"
  >
    <div
      v-if="selectedLocation && !isEditingLocation"
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

      <div class="flex justify-between">
        <!-- Delete Location -->
        <CustomButton
          v-if="!(user!.locations[0].id == selectedLocation.id)"
          name="profile.form.location.delete"
          :loading="loadingLocation.delete"
          variant="warning"
          @click="handleDeleteLocation(selectedLocation.id)"
        />
        <!-- Delete Edit -->
        <CustomButton
          name="profile.form.location.edit"
          @click="isEditingLocation = true"
        />
      </div>
    </div>

    <!-- Edit Location -->
    <form v-if="isEditingLocation" @submit.prevent="handleUpdateLocation">
      <div class="flex flex-col gap-3">
        <!-- Field Location -->
        <InputField
          id="title"
          v-model="locationTitle"
          label="profile.form.location.title"
          name="title"
          :placeholder="$t('profile.form.location.title.placeholder')"
          :error="errorMessages.locationTitle"
          :field-attrs="locationTitleAttrs"
        />
        <div class="flex w-full items-end justify-between gap-3">
          <!-- Field searchAdressInput -->
          <InputField
            id="address"
            v-model="searchAdressInput"
            label="profile.form.location.address"
            name="address"
            :placeholder="$t('profile.form.location.search.address')"
            :error="errorMessages.searchAdressInput"
            :field-attrs="searchAdressInputAttrs"
          />
          <CustomButton
            name="profile.form.location.button.search"
            :loading="loadingLocation.searchAddress"
            @click="handleSearchAddress()"
          />
        </div>
      </div>

      <!-- Show Selected Location -->
      <div
        v-if="selectedLocation && selectedLocation.address"
        class="address-card-container mt-4 overflow-hidden rounded-lg bg-gray-200 p-4"
      >
        <div>
          <p class="text-sm font-medium opacity-50">
            {{ $t('profile.modal.detail.location.current.location') }}
          </p>
          <p :for="`${selectedLocation.id}`" class="text-lg">
            {{ selectedLocation.address }}
          </p>
        </div>
      </div>

      <!-- Show Search Results -->
      <div v-if="searchAddressResults && searchAddressResults.length > 0">
        <div
          v-for="(coordinate, index) in searchAddressResults"
          :key="index"
          class="address-card-container mt-4 overflow-hidden rounded-lg bg-gray-200 p-4"
        >
          <div class="flex items-center">
            <input
              :id="`${index}`"
              v-model="selectedAddress"
              type="radio"
              name="selectedAddress"
              v-bind="selectedAddressAttrs"
              class="mr-3"
              :value="coordinate"
            />
            <label :for="`${index}`" class="text-lg">{{
              coordinate.address
            }}</label>
          </div>
        </div>
      </div>

      <!-- Show No esults -->
      <div
        v-else-if="searchAddressResults && searchAddressResults.length == 0"
        class="h-17 mt-4 flex items-center justify-center rounded-lg bg-gray-200"
      >
        <p class="text-lg">
          {{ $t('profile.modal.detail.location.no.location') }}
        </p>
      </div>

      <small
        v-if="errorMessages.selectedAddress"
        class="p-error text-sm text-red-500"
        >{{ $t(errorMessages.selectedAddress) }}</small
      >

      <div class="mt-3 flex justify-between">
        <CustomButton
          name="profile.form.location.cancel"
          variant="secondary"
          @click="cancelLocationEdit()"
        />
        <CustomButton
          type="submit"
          variant="primary"
          name="profile.form.location.update.submit"
          :loading="loadingLocation.update"
        />
      </div>
    </form>
  </Dialog>

  <!-- Create Location Modal -->
  <Dialog
    v-model:visible="locationModalVisible.create"
    modal
    :header="$t('profile.modal.create.location.title')"
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
        <!-- Field Location -->
        <InputField
          id="title"
          v-model="locationTitle"
          label="profile.form.location.title"
          name="title"
          :placeholder="$t('profile.form.location.title.placeholder')"
          :error="errorMessages.locationTitle"
          :field-attrs="locationTitleAttrs"
        />
        <div class="flex w-full items-end justify-between gap-3">
          <!-- Field searchAdressInput -->
          <InputField
            id="address"
            v-model="searchAdressInput"
            label="profile.form.location.address"
            name="address"
            :placeholder="$t('profile.form.location.search.address')"
            :error="errorMessages.searchAdressInput"
            :field-attrs="searchAdressInputAttrs"
          />
          <CustomButton
            name="profile.form.location.button.search"
            :loading="loadingLocation.searchAddress"
            @click="handleSearchAddress()"
          />
        </div>
      </div>

      <!-- Show Search Results -->
      <div v-if="searchAddressResults && searchAddressResults.length > 0">
        <div
          v-for="(coordinate, index) in searchAddressResults"
          :key="index"
          class="address-card-container mt-4 overflow-hidden rounded-lg bg-gray-200 p-4 shadow"
        >
          <div class="flex items-center">
            <input
              :id="`${index}`"
              v-model="selectedAddress"
              v-bind="selectedAddressAttrs"
              type="radio"
              name="selectedAddress"
              class="mr-3"
              :value="coordinate"
            />
            <label :for="`${index}`" class="text-lg">{{
              coordinate.address
            }}</label>
          </div>
        </div>
      </div>

      <!-- Show No esults -->
      <div
        v-else
        class="h-17 mt-4 flex items-center justify-center rounded-2xl bg-gray-200"
      >
        <p class="text-lg">
          {{ $t('profile.modal.detail.location.no.location') }}
        </p>
      </div>

      <small
        v-if="errorMessages.selectedAddress"
        class="p-error text-sm text-red-500"
        >{{ $t(errorMessages.selectedAddress) }}</small
      >

      <div class="mt-3 flex w-full justify-end">
        <CustomButton
          type="submit"
          name="profile.form.location.create.submit"
          :loading="loadingLocation.create"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import Avatar from './generic/Avatar.vue'
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
import {
  absenceValidationSchema,
  locationValidationSchema,
  userUpdateValidationSchema,
} from '@/validation/schema'
import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { Edit2, PlusCircle } from 'lucide-vue-next'
import { Form, useForm } from 'vee-validate'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// composables
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { firebaseUser, uploadProfile, deleteProfile } = useFirebase()
const { replace } = useRouter()
const { searchAddress } = useTomTomMap()

//#region USER
const userModalVisible = ref<{
  update: boolean
}>({
  update: false,
})
const loadingUser = ref<{
  update: boolean
  uploadPicture: boolean
}>({
  update: false,
  uploadPicture: false,
})
const user = computed<CustomUser | null>(() => userResult.value?.user || null)

// form schema update user
const formUpdateUser = {
  fields: [
    {
      label: 'profile.form.user.firstname',
      name: 'firstname',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'profile.form.user.lastname',
      name: 'lastname',
      placeholder: 'Doe',
      as: 'input',
    },
    {
      label: 'profile.form.user.telephone',
      name: 'telephone',
      placeholder: '0412345678',
      as: 'input',
    },
    // client only
    ...(customUser.value?.role === Role.CLIENT
      ? [
          {
            label: 'profile.form.user.invoice',
            name: 'invoiceOption',
            as: 'select',
            type: 'select',
            options: INVOICE_OPTIONS,
            placeholder: 'profile.form.user.invoice.placeholder',
          },
          {
            label: 'profile.form.user.company',
            name: 'company',
            as: 'switch',
            type: 'switch',
          },
          {
            label: 'profile.form.user.btw',
            name: 'btwNumber',
            placeholder: 'BE0123456789',
            as: 'input',
            displayIf: 'company',
          },
        ]
      : []),
  ],

  button: {
    name: 'profile.form.user.submit',
  },
}

// graphql
const {
  result: userResult,
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

const { mutate: updateUser } = useMutation(UPDATE_USER)

const { mutate: deleteUser } = useMutation(DELETE_USER)

// logics
// handle upload image
const handleUploadImage = async (event: Event): Promise<void> => {
  loadingUser.value.uploadPicture = true
  const selectedPicture = (event.target as HTMLInputElement).files?.[0]
  try {
    // save image to firebase & get url
    const url = await uploadProfile(
      customUser.value!.uid,
      selectedPicture as File,
    )
    // update user in db
    const result = await updateUser({
      updateUserInput: {
        id: customUser.value?.id,
        url: url,
      },
    })
    customUser.value! = {
      ...customUser.value!,
      url: result?.data?.updateUser?.url,
    }
    showToast('success', 'toast.success', 'profile.toast.upload.image')
    toggleUserModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)

    showToast('error', 'toast.error', 'profile.toast.error.upload.image')
  } finally {
    loadingUser.value.uploadPicture = false
  }
}

// handle delete user
const handleDeleteUser = async (): Promise<void> => {
  try {
    // delete profile picture
    await deleteProfile(customUser.value!.uid)
    // delete user in db
    await deleteUser({
      id: customUser.value?.id,
    })
    showToast('success', 'toast.success', `profile.toast.delete.account`)
    firebaseUser.value = null
    customUser.value = null
    replace('/')
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.delete.account')
  }
}

// handle update user
const handleUpdateUser = async (values: CustomUser): Promise<void> => {
  try {
    loadingUser.value.update = true
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
    refetchUser()
    showToast('success', 'toast.success', `profile.toast.update.user`)
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.update.user')
  } finally {
    loadingUser.value.update = false
  }
}

const toggleUserModal = (type: string = 'close'): void => {
  userModalVisible.value = {
    update: type === 'update',
  }
}

watchEffect(() => {
  // log the queries
  // if (userResult.value) console.log(userResult.value)
  // if (user.value) console.log(user)

  // all errors
  if (userError.value) {
    // console.log(userError.value)
    LogRocket.captureException(userError.value)
    showToast('error', 'toast.error', 'profile.toast.error.user')
  }
})
//#endregion

//#region ABSENCE
const selectedAbsence = ref<Absence | null>(null)

const absenceModalVisible = ref<{
  detail: boolean
  create: boolean
}>({
  detail: false,
  create: false,
})

const absences = computed<Absence[]>(
  () => absencesByUserIdResult.value?.absencesByUserId || [],
)

const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
})

const loadingAbsence = ref<{
  create: boolean
  update: boolean
  delete: boolean
}>({
  create: false,
  update: false,
  delete: false,
})
const isEditingAbsence = ref<boolean>(false)

// form schema absence
const formAbsence = {
  fields: [
    {
      label: 'profile.form.absence.type',
      name: 'type',
      as: 'select',
      type: 'select',
      options: ABSENCE_TYPES,
      optionLabel: 'name',
      optionValue: 'value',
      placeholder: 'profile.form.absence.type.placeholder',
    },
    {
      label: 'profile.form.absence.start.date',
      name: 'startDate',
      as: 'input',
      type: 'date',
      placeholder: 'profile.form.absence.start.date.placeholder',
      minDate: new Date(),
    },
    {
      label: 'profile.form.absence.end.date',
      name: 'endDate',
      as: 'input',
      type: 'date',
      placeholder: 'profile.form.absence.end.date.placeholder',
      setMinEndDate: true,
    },
    {
      label: 'profile.form.absence.description',
      name: 'description',
      as: 'textarea',
      type: 'textarea',
      placeholder: 'profile.form.absence.description.placeholder',
      rows: 5,
    },
  ],

  button: {
    name: 'profile.form.absence.submit',
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

const { mutate: deleteAbsence } = useMutation(DELETE_ABSENCE)

const { mutate: updateAbsence } = useMutation(UPDATE_ABSENCE)

const { mutate: createAbsence } = useMutation(CREATE_ABSENCE)

// logics
// on mounted
onMounted(() => {
  variables.value.userId = customUser.value?.id
  if (customUser.value?.role !== Role.CLIENT) {
    loadAbsencesByUserId()
  }
})

// handle create absence
const handleCreateAbsence = async (values: Absence): Promise<void> => {
  try {
    loadingAbsence.value.create = true
    await createAbsence({
      createAbsenceInput: {
        userId: customUser.value?.id,
        type: values.type,
        startDate: formatDateTime(values.startDate),
        endDate: formatDateTime(values.endDate),
        description: values.description,
      },
    })
    showToast('success', 'toast.success', 'profile.toast.create.absence')
    await refetch()
    toggleAbsenceModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.create.absence')
  } finally {
    loadingAbsence.value.create = false
  }
}

// handle update absence
const handleUpdateAbsence = async (values: Absence): Promise<void> => {
  try {
    // console.log(values)
    loadingAbsence.value.update = true
    await updateAbsence({
      updateAbsenceInput: {
        id: selectedAbsence.value?.id,
        type: values.type,
        startDate: formatDateTime(values.startDate),
        endDate: formatDateTime(values.endDate),
        description: values.description,
      },
    })
    showToast('success', 'toast.success', 'profile.toast.update.absence')
    await refetch()
    toggleAbsenceModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.update.absence')
  } finally {
    loadingAbsence.value.update = false
  }
}

// handle delete absence
const handleDeleteAbsence = async (absence: Absence): Promise<void> => {
  try {
    loadingAbsence.value.delete = true
    await deleteAbsence({
      id: absence.id,
    })
    showToast('success', 'toast.success', `profile.toast.delete.absence`)
    await refetch()
    toggleAbsenceModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.delete.absence')
  } finally {
    loadingAbsence.value.delete = false
  }
}

// open or close modal
const toggleAbsenceModal = (
  absence: Absence | null = null,
  type: string = 'close',
): void => {
  selectedAbsence.value = absence ? { ...absence } : null
  isEditingAbsence.value = false
  absenceModalVisible.value = {
    detail: type === 'detail',
    create: type === 'create',
  }
}

const cancelAbsenceEdit = (): void => {
  toggleAbsenceModal(selectedAbsence.value, 'detail')
}

const refetch = async (): Promise<void> => {
  await refetchAbsencesByUserId()
}

// Change date to mm/dd/yyyy
const formatAbsenceDate = (date: string): string => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

watchEffect(() => {
  // log the queries
  // if (absences.value) console.log(absences.value)
  // if (absencesByUserIdResult.value) console.log(absencesByUserIdResult.value)
  // if (absencesResult.value) console.log(absencesResult.value)

  // all errors
  if (absencesByUserIdError.value) {
    // console.log(absencesByUserIdError.value)
    LogRocket.captureException(absencesByUserIdError.value)
    showToast('error', 'toast.error', 'profile.toast.error.absence')
  }
})
//#endregion

//#region LOCATION
const locationModalVisible = ref<{
  detail: boolean
  create: boolean
}>({
  detail: false,
  create: false,
})
const selectedLocation = ref<Location | null>(null)
const searchAddressResults = ref<Location[] | null>(null)
const loadingLocation = ref<{
  create: boolean
  update: boolean
  delete: boolean
  searchAddress: boolean
}>({
  create: false,
  update: false,
  delete: false,
  searchAddress: false,
})
const isEditingLocation = ref<boolean>(false)

// error messages of forms
const errorMessages = ref<{
  locationTitle?: string
  searchAdressInput?: string
  selectedAddress?: string
}>({
  locationTitle: '',
  searchAdressInput: '',
  selectedAddress: '',
})

// create location form
const {
  defineField: defineFieldLocation,
  errors: errorsLocation,
  values: valuesLocation,
  validate: validateLocation,
  setValues: setValuesLocation,
} = useForm({
  validationSchema: locationValidationSchema,
})

const [locationTitle, locationTitleAttrs] = defineFieldLocation('locationTitle')
const [searchAdressInput, searchAdressInputAttrs] =
  defineFieldLocation('searchAdressInput')
const [selectedAddress, selectedAddressAttrs] =
  defineFieldLocation('selectedAddress')

// graphql
const { mutate: createLocation } = useMutation(CREATE_LOCATION)

const { mutate: updateLocation } = useMutation(UPDATE_LOCATION)

const { mutate: deleteLocation } = useMutation(DELETE_LOCATION)

// search address
const handleSearchAddress = async (): Promise<void> => {
  try {
    loadingLocation.value.searchAddress = true
    searchAddressResults.value = null
    errorMessages.value = {}

    await validateLocation()
    errorMessages.value.searchAdressInput =
      errorsLocation.value.searchAdressInput
    if (!errorsLocation.value.searchAdressInput) {
      const results = await searchAddress(valuesLocation.searchAdressInput)
      if (results) {
        searchAddressResults.value = results
      }
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)

    showToast('error', 'toast.error', 'profile.toast.error.search.address')
  } finally {
    loadingLocation.value.searchAddress = false
  }
}

// add new location
const handleCreateLocation = async (): Promise<void> => {
  try {
    loadingLocation.value.create = true
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
      showToast('success', 'toast.success', `profile.toast.create.location`)
      refetchUser()
      toggleLocationModal()
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.create.location')
  } finally {
    loadingLocation.value.create = false
  }
}

// update location
const handleUpdateLocation = async (): Promise<void> => {
  try {
    loadingLocation.value.update = true
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
      showToast('success', 'toast.success', `profile.toast.update.location`)
      refetchUser()
      toggleLocationModal()
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.update.location')
  } finally {
    loadingLocation.value.update = false
  }
}

// delete location
const handleDeleteLocation = async (id: string): Promise<void> => {
  try {
    loadingLocation.value.delete = true
    await deleteLocation({
      id: id,
    })
    toggleLocationModal() // close modal
    showToast('success', 'toast.success', `profile.toast.delete.location`)
    refetchUser()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'profile.toast.error.delete.location')
  } finally {
    loadingLocation.value.delete = false
  }
}

const toggleLocationModal = (
  location: Location | null = null,
  type: string = 'close',
): void => {
  resetInputfields()
  selectedLocation.value = location ? { ...location } : null
  isEditingLocation.value = false

  locationModalVisible.value = {
    detail: type === 'detail',
    create: type === 'create',
  }

  if (type === 'detail') {
    setValuesLocation({
      locationTitle: selectedLocation.value!.title,
      searchAdressInput: selectedLocation.value!.address,
      selectedAddress: null,
    })
  }
}

const cancelLocationEdit = (): void => {
  toggleLocationModal(selectedLocation.value, 'detail')
}

// reset input fields
const resetInputfields = (): void => {
  setValuesLocation({
    locationTitle: '',
    searchAdressInput: '',
    selectedAddress: null,
  })
  selectedLocation.value = null
  searchAddressResults.value = null
  errorMessages.value = {}
}
//#endregion
</script>

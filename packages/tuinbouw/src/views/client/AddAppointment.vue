<template>
  <main class="m-auto max-w-7xl">
    <!-- Title -->
    <div class="mb-3 mt-6 flex items-center gap-4 md:mt-12">
      <h1 class="text-2xl">Create a new appointment</h1>
    </div>
    <!-- Form -->
    <form
      class="grid grid-rows-2 gap-3 md:grid-cols-2 lg:grid-cols-3"
      @submit.prevent="handleCreateAppointment"
    >
      <!-- Locations & Recent Appointments -->
      <div class="col-span-1 row-span-2 flex flex-col gap-3">
        <!-- Locations -->
        <div>
          <!-- Skeleton Loader -->
          <div
            v-if="loading.locations"
            class="flex w-full flex-col items-center gap-3 rounded-2xl bg-gray-200 p-3"
          >
            <Loader2 class="text-primary-green h-32 animate-spin" />
          </div>
          <!-- Locations -->
          <div
            v-else-if="locations && locations.length > 0"
            class="flex w-full flex-col gap-3 rounded-2xl bg-gray-200 p-3"
          >
            <div
              v-for="location of locations"
              :key="location.id"
              class="hover:bg-primary-green hover:outline-primary-green relative flex w-full items-center rounded p-3 hover:cursor-pointer hover:bg-opacity-10 hover:outline"
              :class="{
                'bg-primary-green outline-primary-green bg-opacity-10 outline':
                  selectedLocation === location,
              }"
              @click="selectedLocation = location"
            >
              <h3 class="w-1/5 text-lg">Home</h3>
              <p>{{ location.address }}</p>
              <div
                v-if="selectedLocation == location"
                class="bg-primary-green absolute right-4 top-4 rounded-full p-[2px]"
              >
                <Check :size="16" class="text-white" />
              </div>
            </div>
          </div>
          <!-- No Locations -->
          <RouterLink
            v-else-if="locations.length === 0"
            to="/client/profile"
            class="flex w-full flex-col gap-3 rounded-2xl bg-gray-200 p-3"
          >
            <p class="text-md">You haven't created any locations yet</p>
            <CustomButton type="button" name="Add Location" />
          </RouterLink>
        </div>

        <!-- Recent Appointments -->
        <div class="hidden md:block">
          <button
            class="flex w-full items-center justify-between"
            type="button"
            @click="handleCollapsible()"
          >
            <h2 class="text-xl opacity-80">Recent appointments</h2>
            <ChevronDown
              :class="showAppointments ? 'transform rotate-180' : ''"
            />
          </button>

          <!-- Skeleton Loader -->
          <div
            v-if="loading.recentAppointments"
            class="flex w-full flex-col items-center gap-3 rounded-2xl bg-gray-200 p-3"
          >
            <Loader2 class="text-primary-green h-32 animate-spin" />
          </div>

          <!-- Appointments (top 5) -->
          <div
            v-if="
              (recentAppointments &&
                recentAppointments.length > 0 &&
                showAppointments) ||
              !isMobile()
            "
            class="mt-3 flex flex-col gap-3"
          >
            <AppointmentCard
              v-for="(item, index) in recentAppointments"
              :key="index"
              :appointment="item"
              :nav="false"
            />
          </div>

          <!-- No Appointments -->
          <div
            v-if="recentAppointments.length === 0"
            class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
          >
            <p class="text-gray-500">No recent appointments</p>
          </div>
        </div>
      </div>
      <!-- Extra info -->
      <div
        class="col-span-1 flex min-h-[300px] flex-col gap-6 rounded-2xl bg-gray-200 px-3 pb-3 pt-6 lg:col-span-2"
      >
        <!-- Type -->
        <div class="flex flex-col gap-3">
          <label for="type" class="text-xl">Type afspraak</label>
          <select
            id="type"
            v-model="type"
            class="w-fit rounded bg-gray-400 p-3"
            name="type"
          >
            <option value="" disabled selected>Select a type</option>
            <option
              v-for="type in APPOINTMENT_TYPES"
              :key="type.name"
              class="capitalize"
            >
              {{ type.name }}
            </option>
          </select>
          <span v-if="errorMessages.type" class="block text-sm text-red-500">{{
            errorMessages.type
          }}</span>
        </div>
        <!-- Description -->
        <div class="flex flex-col gap-3">
          <label for="" class="text-xl">Omschrijving</label>
          <textarea
            id=""
            v-model="description"
            class="rounded bg-gray-400 p-3"
            name=""
            rows="5"
          ></textarea>
          <span
            v-if="errorMessages.description"
            class="block text-sm text-red-500"
            >{{ errorMessages.description }}</span
          >
        </div>
        <!-- Date -->
        <div class="flex w-full flex-col gap-3">
          <div class="flex flex-col gap-2">
            <label for="" class="text-xl">Kies een moment</label>
            <p class="max-w-xs">
              We plannen de afspraak in tussen de data die je gekozen hebt
            </p>
          </div>
          <div class="flex w-full items-center justify-between">
            <!-- TODO: fix styling -->
            <Calendar
              v-model="startProposedDate"
              show-icon
              :pt="{
                root: { class: 'w-1/3' },
                input: { class: 'h-fit p-3 bg-gray-400' },
              }"
              :min-date="minDate"
              date-format="yy-mm-dd"
            >
              <template #dropdownicon>
                <CalendarIcon class="h-5 w-5" />
              </template>
            </Calendar>
            <img src="/assets/doubleArrow.svg" />
            <Calendar
              v-model="endProposedDate"
              show-icon
              :pt="{
                root: { class: 'w-1/3' },
                input: { class: 'h-fit p-3 bg-gray-400' },
              }"
              :min-date="startProposedDate"
              date-format="yy-mm-dd"
            >
              <template #dropdownicon>
                <CalendarIcon class="h-5 w-5" />
              </template>
            </Calendar>
          </div>
          <span
            v-if="errorMessages.startProposedDate"
            class="block text-sm text-red-500"
            >{{ errorMessages.startProposedDate }}</span
          >
          <span
            v-if="errorMessages.endProposedDate"
            class="block text-sm text-red-500"
            >{{ errorMessages.endProposedDate }}</span
          >
        </div>
        <div class="flex justify-end">
          <CustomButton
            type="submit"
            :loading="loading.createAppointment"
            :disabled="locations.length === 0"
            name="Create Appointment"
          />
        </div>
      </div>
      <div class="block md:hidden">
        <button
          class="flex w-full items-center justify-between"
          type="button"
          @click="handleCollapsible()"
        >
          <h2 class="text-xl opacity-80">Recent appointments</h2>
          <ChevronDown
            :class="showAppointments ? 'transform rotate-180' : ''"
          />
        </button>

        <!-- Skeleton Loader -->
        <div
          v-if="loading.recentAppointments"
          class="flex w-full flex-col items-center gap-3 rounded-2xl bg-gray-200 p-3"
        >
          <Loader2 class="text-primary-green h-32 animate-spin" />
        </div>

        <!-- Appointments (top 5) -->
        <div
          v-if="
            (recentAppointments &&
              recentAppointments.length > 0 &&
              showAppointments) ||
            !isMobile()
          "
          class="mt-3 flex flex-col gap-3"
        >
          <AppointmentCard
            v-for="(item, index) in recentAppointments"
            :key="index"
            :appointment="item"
            :nav="false"
          />
        </div>

        <!-- No Appointments -->
        <div
          v-if="recentAppointments.length === 0"
          class="flex h-32 w-full items-center justify-center rounded-2xl bg-gray-200"
        >
          <p class="text-gray-500">No recent appointments</p>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import CustomButton from '@/components/generic/CustomButton.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { CREATE_APPOINTMENT } from '@/graphql/appointment.mutation'
import { GET_RECENT_APPOINTMENTS_BY_USERID } from '@/graphql/appointment.query'
import { GET_LOCATIONS_BY_USERID } from '@/graphql/location.query'
import { APPOINTMENT_TYPES } from '@/helpers/constants'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { Location } from '@/interfaces/location.interface'
import { appointmentCreateValidationSchema } from '@/validation/schema'
import { useQuery } from '@vue/apollo-composable'
import { useMutation } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Loader2,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import type { ComputedRef } from 'vue'
import { computed, ref, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

// composables
const { customUser } = useCustomUser()
const { replace } = useRouter()

const { formatDateTime } = useTimeUtilities()
const { showToast } = useCustomToast()

// variables
const showAppointments = ref<boolean>(false)
const minDate = new Date()
const locations: ComputedRef<Location[]> = computed(() => {
  return locationsResult.value?.locationsByUserId || []
})
const recentAppointments: ComputedRef<Appointment[]> = computed(() => {
  return recentAppointmentsResult.value?.appointmentsRecentByUserId || []
})
const selectedLocation = ref<Location | null>(null)
const errorMessages = ref<{
  startProposedDate?: string
  endProposedDate?: string
  description?: string
  type?: string
}>({
  startProposedDate: '',
  endProposedDate: '',
  description: '',
  type: '',
})

const { defineField, errors, values, validate, setValues } = useForm({
  validationSchema: appointmentCreateValidationSchema,
})

const [startProposedDate] = defineField('startProposedDate')
const [endProposedDate] = defineField('endProposedDate')
const [description] = defineField('description')
const [type] = defineField('type')

setValues({
  type: '',
})

const loading = ref<{
  createAppointment: boolean
  locations: ComputedRef<boolean>
  recentAppointments: ComputedRef<boolean>
}>({
  createAppointment: false,
  locations: computed(() => locationsLoading.value),
  recentAppointments: computed(() => recentAppointmentsLoading.value),
})

// graphql
const {
  result: locationsResult,
  loading: locationsLoading,
  error: locationsError,
} = useQuery(GET_LOCATIONS_BY_USERID, () => ({
  userId: customUser.value?.id,
}))

const {
  result: recentAppointmentsResult,
  loading: recentAppointmentsLoading,
  error: recentAppointmentsError,
} = useQuery(GET_RECENT_APPOINTMENTS_BY_USERID, () => ({
  userId: customUser.value?.id,
  amount: 5,
}))

const { mutate: addAppointment } = useMutation<Appointment>(CREATE_APPOINTMENT)

// logics
const handleCreateAppointment = async (): Promise<void> => {
  try {
    loading.value.createAppointment = true
    await validate()
    errorMessages.value = errors.value
    console.log(values)
    if (Object.keys(errors.value).length === 0) {
      await addAppointment({
        input: {
          userId: customUser.value?.id,
          locationId: selectedLocation.value?.id,
          type: values.type,
          startProposedDate: formatDateTime(
            values.startProposedDate.toString(),
          ),
          endProposedDate: formatDateTime(values.endProposedDate.toString()),
          description: values.description,
          isDone: false,
          priority: false,
        },
      })
      showToast('success', 'Success', 'Afspraak is gemaakt')
      replace('/client/appointments')
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't create appointment")
  } finally {
    loading.value.createAppointment = false
  }
}

// Check if website is being viewed on mobile (responsiveness)
const isMobile = () => {
  if (window.innerWidth <= 768) {
    return true
  }
  return false
}

const handleCollapsible = () => {
  if (isMobile()) {
    showAppointments.value = !showAppointments.value
  }
}

watchEffect(() => {
  // default first location selected
  selectedLocation.value = locations.value?.[0]

  if (recentAppointmentsResult.value) {
    console.log(recentAppointmentsResult.value)
  }

  // all errors
  if (locationsError.value) {
    // console.log(locationsError.value)
    LogRocket.captureException(locationsError.value)
    showToast('error', 'Error', "Couldn't load locations")
  }
  if (recentAppointmentsError.value) {
    // console.log(recentAppointmentsError.value)
    LogRocket.captureException(recentAppointmentsError.value)
    showToast('error', 'Error', "Couldn't load recent appointments")
  }
})
</script>

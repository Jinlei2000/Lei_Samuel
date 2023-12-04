<template>
  <div
    class="m-auto mb-6 mt-12 flex max-w-7xl flex-col items-start justify-center gap-3"
  >
    <!-- go back button -->
    <button
      class="flex items-center gap-1"
      v-bind="$attrs"
      @click="$router.go(-1)"
    >
      <ArrowLeft class="h-5 w-5" />
      Go back
    </button>

    <!-- Title -->
    <div class="mt-3 flex w-full items-center justify-between">
      <h1 class="text-2xl">Schedule Edit</h1>
      <!-- reset all values back -->
      <CustomButton
        type="button"
        variant="secondary"
        name="Reset"
        @click="reset()"
      />
    </div>

    <!-- show schedule -->
    <form v-if="schedule" class="w-full" @submit.prevent="handleUpdateSchedule">
      <!-- Final Date -->
      <div v-if="next === 0" class="w-full">
        <h2 class="mb-3 text-xl">Final Date</h2>
        <div class="flex w-full justify-end">
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- validation -->
        <small id="text-error" class="p-error block">{{
          errorMessages.finalDate || '&nbsp;'
        }}</small>

        <div class="m-auto flex w-fit flex-col items-center gap-6">
          <p class="text-lg font-semibold text-gray-900">
            Your selected date is: {{ formatDateTime(values.finalDate) }}
          </p>

          <div v-if="loadingAppointments || loadingEmployees">
            <h1 class="flex animate-pulse space-x-4">Loading...</h1>
          </div>

          <!-- show calendar -->
          <Calendar
            id="finalDate"
            inline
            :manual-input="false"
            v-bind="finalDate"
            :min-date="minDate"
            date-format="yy-mm-dd"
            @date-select="checkAvailability()"
          >
          </Calendar>
        </div>
      </div>

      <!-- Appointments -->
      <div v-if="next === 1" class="w-full">
        <h2 class="mb-3 text-xl">Appointments</h2>
        <div class="flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- validation -->
        <small id="text-error" class="p-error block">{{
          errorMessages.appointmentsIds || '&nbsp;'
        }}</small>

        <!-- loading appointments -->
        <div v-if="loadingAppointments">
          <h1 class="flex animate-pulse space-x-4">Loading...</h1>
        </div>

        <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
          <!-- Selected Appointments -->
          <div v-for="a of selectedAppointmentsEdit" :key="a.id">
            <div
              :class="[
                'relative w-full  overflow-hidden rounded-2xl bg-gray-200 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300',
                isItemSelected(a.id!, appointmentsIds.modelValue)
                  ? 'outline-primary-green outline'
                  : '',
              ]"
            >
              <div class="flex h-16 items-center justify-between sm:h-11">
                <div class="flex w-1/2 p-3 sm:w-3/4">
                  <input
                    type="checkbox"
                    class="mr-2"
                    :checked="isItemSelected(a.id, appointmentsIds.modelValue)"
                    @click="addSelectedAppointment(a)"
                  />
                  <h2
                    class="w-1/2 min-w-fit text-left text-base capitalize sm:w-1/3 sm:text-lg md:w-1/4 lg:w-1/6"
                  >
                    {{ a.user.fullname }}
                  </h2>
                  <p class="hidden truncate text-gray-900 sm:block">
                    {{ a.description }}
                  </p>
                </div>
                <div
                  class="flex w-1/2 min-w-fit items-center justify-end gap-3 p-3 sm:w-1/4"
                >
                  <div class="flex items-center gap-3">
                    <p>
                      {{ formatDateTime(a.startProposedDate) }}
                    </p>
                    <ArrowRight class="h-4 w-4" />
                    <p>
                      {{ formatDateTime(a.endProposedDate) }}
                    </p>
                  </div>

                  <div class="h-5 w-5">
                    <Star
                      v-if="a.priority && !isOverToday(a)"
                      class="fill-primary-yellow stroke-primary-yellow h-5 w-5"
                    />
                  </div>
                  <div
                    class="h-2 w-2 rounded-full"
                    :class="
                      a.type === 'repair'
                        ? 'bg-primary-green'
                        : a.type === 'maintenance'
                          ? 'bg-primary-blue'
                          : ''
                    "
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Available Appointments -->
          <div
            v-for="a of appointments.appointmentsAvailableByDate"
            :key="a.id"
          >
            <div
              :class="[
                'relative w-full  overflow-hidden rounded-2xl bg-gray-200 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300',
                isItemSelected(a.id!, appointmentsIds.modelValue)
                  ? 'outline-primary-green outline'
                  : '',
              ]"
            >
              <div class="flex h-16 items-center justify-between sm:h-11">
                <div class="flex w-1/2 p-3 sm:w-3/4">
                  <input
                    type="checkbox"
                    class="mr-2"
                    :checked="isItemSelected(a.id, appointmentsIds.modelValue)"
                    @click="addSelectedAppointment(a)"
                  />
                  <h2
                    class="w-1/2 min-w-fit text-left text-base capitalize sm:w-1/3 sm:text-lg md:w-1/4 lg:w-1/6"
                  >
                    {{ a.user.fullname }}
                  </h2>
                  <p class="hidden truncate text-gray-900 sm:block">
                    {{ a.description }}
                  </p>
                </div>
                <div
                  class="flex w-1/2 min-w-fit items-center justify-end gap-3 p-3 sm:w-1/4"
                >
                  <div class="flex items-center gap-3">
                    <p>
                      {{ formatDateTime(a.startProposedDate) }}
                    </p>
                    <ArrowRight class="h-4 w-4" />
                    <p>
                      {{ formatDateTime(a.endProposedDate) }}
                    </p>
                  </div>
                  <div class="h-5 w-5">
                    <Star
                      v-if="a.priority && !isOverToday(a)"
                      class="fill-primary-yellow stroke-primary-yellow h-5 w-5"
                    />
                  </div>
                  <div
                    class="h-2 w-2 rounded-full"
                    :class="
                      a.type === 'repair'
                        ? 'bg-primary-green'
                        : a.type === 'maintenance'
                          ? 'bg-primary-blue'
                          : ''
                    "
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- no appointments -->
        <div
          v-if="
            appointments &&
            appointments.appointmentsAvailableByDate.length === 0 &&
            selectedAppointmentsEdit.length === 0
          "
          class="mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md"
        >
          <div class="p-4">
            <h2 class="mb-2 text-xl font-semibold">No appointments</h2>
            <p class="mb-1 text-gray-600">
              There are no appointments available for this date
            </p>
          </div>
        </div>
      </div>

      <!-- Fill in price of appointments -->
      <div v-if="next === 2">
        <h2 class="mb-3 text-xl">Price Appointments</h2>
        <div class="flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- validation -->
        <small id="text-error" class="p-error block">{{
          errorMessages.prices || '&nbsp;'
        }}</small>

        <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
          <!-- Selected Appointments -->
          <div v-for="a of selectedAppointments" :key="a.id">
            <div
              :class="[
                'relative w-full  overflow-hidden rounded-2xl bg-gray-200 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300',
              ]"
            >
              <div class="flex h-16 items-center justify-between sm:h-11">
                <div class="flex w-1/2 p-3 sm:w-3/4">
                  <h2
                    class="w-1/2 min-w-fit text-left text-base capitalize sm:w-1/3 sm:text-lg md:w-1/4 lg:w-1/6"
                  >
                    {{ a.user.fullname }}
                  </h2>
                  <p class="hidden truncate text-gray-900 sm:block">
                    {{ a.description }}
                  </p>
                </div>
                <div
                  class="flex w-1/2 min-w-fit items-center justify-end gap-3 p-3 sm:w-1/4"
                >
                  <InputNumber
                    id="price"
                    v-model="a.price"
                    name="price"
                    mode="currency"
                    currency="EUR"
                    locale="de-BE"
                  />
                  <div
                    class="h-2 w-2 rounded-full"
                    :class="
                      a.type === 'repair'
                        ? 'bg-primary-green'
                        : a.type === 'maintenance'
                          ? 'bg-primary-blue'
                          : ''
                    "
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Employees -->
      <div v-if="next === 3">
        <h2 class="mb-3 text-xl">Employees</h2>
        <div class="flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- validation -->
        <small id="text-error" class="p-error block">{{
          errorMessages.employeesIds || '&nbsp;'
        }}</small>

        <!-- loading employees -->
        <div v-if="loadingEmployees">
          <h1 class="flex animate-pulse space-x-4">Loading...</h1>
        </div>

        <!-- show selected employees -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <!-- Previously selected employees -->
          <button
            v-for="user in selectedEmployeesEdit"
            v-if="selectedEmployeesEdit && selectedEmployeesEdit.length > 0"
            :key="user.id"
            class="relative overflow-hidden rounded-2xl bg-gray-200 hover:bg-gray-400"
            :class="
              isItemSelected(user.id, employeesIds.modelValue)
                ? 'outline outline-primary-green'
                : ''
            "
            type="button"
            @click="addSelectedEmployee(user)"
          >
            <div class="flex items-center gap-6 p-1">
              <img
                class="h-12 w-12 rounded-xl"
                src="https://picsum.photos/200"
                alt="random picture"
              />
              <p class="text-lg">{{ user.firstname }} {{ user.lastname }}</p>
              <div
                v-if="isItemSelected(user.id, employeesIds.modelValue)"
                class="bg-primary-green absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-[2px]"
              >
                <Check :size="16" class="text-white" />
              </div>
            </div>
          </button>

          <!-- Available employees -->
          <button
            v-for="user in employees.usersEmployeesAvailableByDate"
            v-if="
              employees && employees.usersEmployeesAvailableByDate.length > 0
            "
            :key="user.id"
            class="relative flex transform items-center gap-6 overflow-hidden rounded-2xl bg-gray-200 p-1 hover:bg-gray-400"
            :class="
              isItemSelected(user.id, employeesIds.modelValue)
                ? 'outline outline-primary-green'
                : ''
            "
            type="button"
            @click="addSelectedEmployee(user)"
          >
            <img
              class="h-12 w-12 rounded-xl"
              src="https://picsum.photos/200"
              alt="random picture"
            />
            <p class="text-lg">{{ user.firstname }} {{ user.lastname }}</p>
            <div
              v-if="isItemSelected(user.id, employeesIds.modelValue)"
              class="bg-primary-green absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-[2px]"
            >
              <Check :size="16" class="text-white" />
            </div>
          </button>
        </div>
      </div>

      <!-- Materials -->
      <div v-if="next === 4">
        <h2 class="mb-3 text-xl">Materials</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- loading -->
        <div v-if="loadingMaterials">
          <h1 class="flex animate-pulse space-x-4">Loading...</h1>
        </div>

        <div
          class="grid-rows-auto grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <!-- Selected materials -->
          <button
            v-for="material of selectedMaterialsEdit"
            v-if="selectedMaterialsEdit && selectedMaterialsEdit.length > 0"
            :key="material.id"
            class="relative flex transform items-center gap-3 overflow-hidden rounded-2xl bg-gray-200 p-1 hover:bg-gray-400"
            :class="
              isItemSelected(material.id, materialsIds.modelValue)
                ? 'outline outline-primary-green'
                : ''
            "
            type="button"
            @click="addSelectedMaterial(material)"
          >
            <img
              class="w-12 rounded-xl bg-gray-400"
              src="https://picsum.photos/200"
              alt="random picture"
            />
            <h2 class="truncate text-lg">{{ material.name }}</h2>
            <div
              v-if="isItemSelected(material.id, materialsIds.modelValue)"
              class="bg-primary-green absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-[2px]"
            >
              <Check :size="16" class="text-white" />
            </div>
          </button>

          <!-- Availabe materials -->
          <button
            v-for="material of materials.materials"
            v-if="materials && materials.materials.length > 0"
            :key="material.id"
            class="relative flex transform items-center gap-3 overflow-hidden rounded-2xl bg-gray-200 p-1 hover:bg-gray-400"
            :class="
              isItemSelected(material.id, materialsIds.modelValue)
                ? 'outline outline-primary-green'
                : ''
            "
            type="button"
            @click="addSelectedMaterial(material)"
          >
            <img
              class="w-12 rounded-xl bg-gray-400"
              src="https://picsum.photos/200"
              alt="random picture"
            />
            <h2 class="truncate text-lg">{{ material.name }}</h2>
            <div
              v-if="isItemSelected(material.id, materialsIds.modelValue)"
              class="bg-primary-green absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-[2px]"
            >
              <Check :size="16" class="text-white" />
            </div>
          </button>
        </div>
      </div>

      <!-- See All -->
      <div v-if="next === 5">
        <h2 class="mb-3 text-xl">Overview</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton
            name="Update Schedule"
            :loading="loadingUpdate"
            type="submit"
          />
        </div>

        <div
          class="m-auto flex w-1/3 flex-col gap-3 rounded-2xl bg-gray-200 p-6"
        >
          <div class="flex gap-3">
            <CalendarIcon />
            <div>{{ formatDateTime(values.finalDate) }}</div>
          </div>
          <!-- show selected appointments -->
          <div class="flex flex-col">
            <h3 class="mb-1 text-lg">Appointments</h3>
            <ul
              v-if="selectedAppointments.length > 0"
              class="flex flex-col gap-1"
            >
              <li v-for="a of selectedAppointments" :key="a.id">
                <p>{{ a.user.fullname }}</p>
                <p class="text-sm text-gray-900">{{ a.description }}</p>
              </li>
            </ul>
          </div>

          <!-- show selected employees -->
          <div class="flex flex-col gap-1">
            <h3 class="mb-1 text-lg">Employees</h3>
            <ul v-if="selectedEmployees.length > 0" class="flex flex-col gap-1">
              <li
                v-for="user of selectedEmployees"
                :key="user.id"
                class="flex items-center gap-3"
              >
                <img
                  class="w-8 rounded-full bg-gray-400"
                  src="https://picsum.photos/200"
                  alt="random picture"
                />
                <p class="capitalize">{{ user.fullname }}</p>
              </li>
            </ul>
          </div>

          <!-- show selected materials -->
          <div>
            <div
              class="mb-1 flex cursor-pointer justify-between"
              @click="toggleCollapsible()"
            >
              <h3 class="text-lg">Materials</h3>
              <ChevronDown :class="collapsed ? 'transform rotate-180' : ''" />
            </div>
            <ul v-if="selectedMaterials.length > 0 && !collapsed">
              <li v-for="material of selectedMaterials" :key="material.id">
                {{ material.name }}
              </li>
            </ul>

            <!-- no selected materials -->
            <div v-if="selectedMaterials.length < 1">No materials selected</div>
          </div>
        </div>
      </div>
    </form>

    <!-- loading -->
    <div
      v-if="
        scheduleLoading &&
        loadingAppointments &&
        loadingEmployees &&
        loadingMaterials
      "
    >
      <p class="text-6xl font-black">Loading Schedule...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { UPDATE_APPOINTMENT } from '@/graphql/appointment.mutation'
import { GET_ALL_APPOINTMENT_AVAILABLE_BY_DATE } from '@/graphql/appointment.query'
import { GET_MATERIALS_AVAILABLE } from '@/graphql/material.query'
import { UPDATE_SCHEDULE } from '@/graphql/schedule.mutation'
import { GET_SCHEDULE_BY_ID } from '@/graphql/schedule.query'
import { GET_EMPLOYEES_AVAILABLE_BY_DATE } from '@/graphql/user.query'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import type { Material } from '@/interfaces/material.interface'
import { schedulesValidationSchema } from '@/validation/schema'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Star,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// TODO: add steps (next.value) to the url as query params (e.g. /schedules/edit?step=1)
// TODO: use useLazyQuery for materials and (employees or users) to prevent loading all materials and (employees or appointments)

// composables
const { showToast } = useCustomToast()
const { formatDateTime, isOverToday } = useTimeUtilities()
const { currentRoute, go } = useRouter()

// variables
const minDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
const next = ref(0)
const selectedAppointments = ref<Appointment[]>([])
const selectedAppointmentsEdit = ref<Appointment[]>([])
const selectedEmployees = ref<CustomUser[]>([])
const selectedEmployeesEdit = ref<CustomUser[]>([])
const selectedMaterials = ref<Material[]>([])
const selectedMaterialsEdit = ref<Material[]>([])
const loadingUpdate = ref(false)

const collapsed = ref(true)

// error messages of forms
const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  finalDate: '',
  appointmentsIds: '',
  employeesIds: '',
  materialsIds: '',
  prices: '',
})

// update form
const { defineComponentBinds, errors, values, validate, setValues } = useForm({
  validationSchema: schedulesValidationSchema,
})

const finalDate = defineComponentBinds('finalDate')
const appointmentsIds = defineComponentBinds('appointmentsIds')
const employeesIds = defineComponentBinds('employeesIds')
const materialsIds = defineComponentBinds('materialsIds')

// graphql
const { mutate: updateAppointment, error: errorUpdateAppointment } =
  useMutation(UPDATE_APPOINTMENT)

const { mutate: updateschedule, error: errorUpdateschedule } =
  useMutation(UPDATE_SCHEDULE)

const {
  result: schedule,
  loading: scheduleLoading,
  error: scheduleError,
} = useQuery(
  GET_SCHEDULE_BY_ID,
  () => ({
    // get id out of params
    id: currentRoute.value.params.id,
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

const {
  result: appointments,
  loading: loadingAppointments,
  error: errorAppointments,
  refetch: refetchAppointments,
} = useQuery(
  GET_ALL_APPOINTMENT_AVAILABLE_BY_DATE,
  () => ({
    date: values.finalDate ? formatDateTime(values.finalDate) : '',
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

const {
  result: employees,
  loading: loadingEmployees,
  error: errorEmployees,
  refetch: refetchEmployees,
} = useQuery(
  GET_EMPLOYEES_AVAILABLE_BY_DATE,
  () => ({
    date: values.finalDate ? formatDateTime(values.finalDate) : '',
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

const {
  result: materials,
  loading: loadingMaterials,
  error: errorMaterials,
} = useQuery(GET_MATERIALS_AVAILABLE, null, {
  fetchPolicy: 'cache-and-network',
})

// logics
const handleUpdateSchedule = async () => {
  loadingUpdate.value = true
  await validate()
  errorMessages.value = errors.value
  if (Object.keys(errors.value).length === 0) {
    // console.log('no errors', values)
    const { finalDate, appointmentsIds, employeesIds, materialsIds } = values

    // update appointments with price
    for (const a of selectedAppointments.value) {
      await updateAppointment({
        updateAppointmentInput: {
          id: a.id,
          price: a.price,
          isScheduled: true,
          finalDate: formatDateTime(values.finalDate),
        },
      })
    }

    // update appointments that unselected from schedule (isScheduled = false, finalDate = null)
    const unselectedAppointmentsIds = selectedAppointmentsEdit.value
      .map(a => a.id)
      .filter(id => !appointmentsIds.includes(id))
    for (const id of unselectedAppointmentsIds) {
      await updateAppointment({
        updateAppointmentInput: {
          id: id,
          isScheduled: false,
          finalDate: null,
        },
      })
    }

    // update schedule
    await updateschedule({
      updateScheduleInput: {
        id: schedule.value?.schedule.id,
        finalDate: formatDateTime(finalDate),
        appointmentIds: appointmentsIds,
        employeeIds: employeesIds,
        materialIds: materialsIds,
      },
    }).then(() => {
      loadingUpdate.value = false
      showToast('success', 'Success', 'Schedule updated')
      go(-1)
    })
  }

  loadingUpdate.value = false
}

const handleNext = async () => {
  // validate first step (final date)
  if (next.value === 0) {
    await validate()
    errorMessages.value.finalDate = errors.value.finalDate
    if (!errors.value.finalDate) {
      // reset if final date is changed
      if (
        formatDateTime(schedule.value?.schedule.finalDate) !==
        formatDateTime(values.finalDate)
      ) {
        selectedAppointments.value = []
        selectedEmployees.value = []
        selectedMaterials.value = []
        selectedAppointmentsEdit.value = []
        selectedEmployeesEdit.value = []
        selectedMaterialsEdit.value = []

        setValues({
          appointmentsIds: [],
          employeesIds: [],
          materialsIds: [],
        })
      }
      next.value++
    }
  }
  // validate second step (appointments)
  else if (next.value === 1) {
    await validate()
    errorMessages.value.appointmentsIds = errors.value.appointmentsIds
    if (!errors.value.appointmentsIds) {
      next.value++
    }
  }
  // validate third step (fill in price of appointments)
  else if (next.value === 2) {
    errorMessages.value.prices = ''
    let priceError = ''
    for (const a of selectedAppointments.value) {
      if (!a.price) {
        priceError = 'Fill in price of all appointments'
        break
      }
    }
    errorMessages.value.prices = priceError
    if (errorMessages.value.prices === '') {
      next.value++
    }
  }
  // validate fourth step (employees)
  else if (next.value === 3) {
    await validate()
    errorMessages.value.employeesIds = errors.value.employeesIds
    if (!errors.value.employeesIds) {
      next.value++
    }
  }

  // validate fifth step (materials)
  else if (next.value === 4) {
    await validate()
    errorMessages.value.materialsIds = errors.value.materialsIds
    if (!errors.value.materialsIds) {
      next.value++
    }
  }
}

const handleBack = () => {
  if (next.value === 1) {
    // set all values to the original values
    setAllValues()
  }
  // reset errors
  errorMessages.value = {
    finalDate: '',
    appointmentsIds: '',
    employeesIds: '',
    materialsIds: '',
    prices: '',
  }
  next.value--
}

// add appointment id in appointmentsIds array and add appointment in selectedAppointments array
// remove appointment id in appointmentsIds array and remove appointment in selectedAppointments array
const addSelectedAppointment = (appointment: Appointment) => {
  // check if appointment is already selected
  const index = values.appointmentsIds.indexOf(appointment.id!)

  console.log('index', index)

  // if appointment is already selected, remove it
  if (index > -1) {
    const newValues = [...values.appointmentsIds]
    newValues.splice(index, 1)
    setValues({
      appointmentsIds: newValues,
    })
    // remove appointment from selected appointments
    const indexAppointment = selectedAppointments.value.findIndex(
      a => a.id === appointment.id,
    )
    if (indexAppointment > -1)
      selectedAppointments.value.splice(indexAppointment, 1)
  } else {
    // if appointment is not selected, add it
    const newValues = [...values.appointmentsIds]
    newValues.push(appointment.id)
    setValues({
      appointmentsIds: newValues,
    })
    // add appointment in selected appointments
    selectedAppointments.value.push({ ...appointment })
  }
}

const addSelectedEmployee = (user: CustomUser) => {
  console.log('user', user)
  // check if user is already selected
  const index = values.employeesIds.indexOf(user.id)

  console.log(index)

  // if user is already selected, remove it
  if (index > -1) {
    const newValues = [...values.employeesIds]
    newValues.splice(index, 1)
    setValues({
      employeesIds: newValues,
    })
    // remove user from selected employees
    const indexUser = selectedEmployees.value.findIndex(u => u.id === user.id)
    if (indexUser > -1) selectedEmployees.value.splice(indexUser, 1)
  } else {
    // if user is not selected, add it
    const newValues = [...values.employeesIds]
    newValues.push(user.id)
    setValues({
      employeesIds: newValues,
    })

    // add user in selected employees
    selectedEmployees.value.push({ ...user })
  }
}

const addSelectedMaterial = (material: Material) => {
  // check if material is already selected
  const index = values.materialsIds.indexOf(material.id)

  // if material is already selected, remove it
  if (index > -1) {
    const newValues = [...values.materialsIds]
    newValues.splice(index, 1)
    setValues({
      materialsIds: newValues,
    })
    // remove material from selected materials
    const indexMaterial = selectedMaterials.value.findIndex(
      m => m.id === material.id,
    )
    if (indexMaterial > -1) selectedMaterials.value.splice(indexMaterial, 1)
  } else {
    // if material is not selected, add it
    const newValues = [...values.materialsIds]
    newValues.push(material.id)
    setValues({
      materialsIds: newValues,
    })

    // add material in selected materials
    selectedMaterials.value.push({ ...material })
  }
}

// check if item is selected
const isItemSelected = (id: string, itemIds: string[]) => {
  return itemIds.includes(id)
}

// check if there are appointments and employees available for the selected date
const checkAvailability = async () => {
  // reset error messages
  errorMessages.value.finalDate = ''
  let error = ''

  // if final date is changed, reset selected appointments and employees
  if (
    formatDateTime(schedule.value?.schedule.finalDate) !==
    formatDateTime(values.finalDate)
  ) {
    await refetchAppointments()
    await refetchEmployees()
    if (
      appointments.value.appointmentsAvailableByDate.length === 0 &&
      employees.value.usersEmployeesAvailableByDate.length === 0
    ) {
      error = 'No appointments and employees available for this date'
    }
    // check if there are appointments available for the selected date
    else if (appointments.value.appointmentsAvailableByDate.length === 0) {
      error = 'No appointments available for this date'
    }
    // check if there are employees available for the selected date
    else if (employees.value.usersEmployeesAvailableByDate.length === 0) {
      error = 'No employees available for this date'
    }

    errorMessages.value.finalDate = error
  }
}

// set all values for edit
const setAllValues = () => {
  setValues({
    finalDate: schedule.value?.schedule.finalDate,
    appointmentsIds: schedule.value?.schedule.appointments.map(
      (a: Appointment) => a.id,
    ),
    employeesIds: schedule.value?.schedule.employees.map(
      (e: CustomUser) => e.id,
    ),
    materialsIds: schedule.value?.schedule.materials.map((m: Material) => m.id),
  })

  // set selected appointments
  selectedAppointmentsEdit.value = schedule.value?.schedule.appointments.map(
    (a: Appointment) => ({ ...a }),
  )
  selectedAppointments.value = schedule.value?.schedule.appointments.map(
    (a: Appointment) => ({ ...a }),
  )

  // set selected employees
  selectedEmployeesEdit.value = schedule.value?.schedule.employees.map(
    (e: CustomUser) => ({ ...e }),
  )
  selectedEmployees.value = schedule.value?.schedule.employees.map(
    (e: CustomUser) => ({ ...e }),
  )

  // set selected materials
  selectedMaterialsEdit.value = schedule.value?.schedule.materials.map(
    (m: Material) => ({ ...m }),
  )
  selectedMaterials.value = schedule.value?.schedule.materials.map(
    (m: Material) => ({ ...m }),
  )
}

// reset all values back
const reset = () => {
  // reset all values
  setAllValues()

  // reset errors
  errorMessages.value = {
    finalDate: '',
    appointmentsIds: '',
    employeesIds: '',
    materialsIds: '',
    prices: '',
  }

  // reset next
  next.value = 0
}

const toggleCollapsible = () => {
  collapsed.value = !collapsed.value
}

watchEffect(() => {
  // log the queries
  // if (appointments.value) console.log(appointments.value)
  // if (employees.value) console.log(employees.value)
  // if (materials.value) console.log(materials.value)

  // set all values
  if (schedule.value) {
    setAllValues()
    console.log(schedule.value)
  }

  if (appointments.value) {
    console.log(appointments.value.appointmentsAvailableByDate)
  }

  // all errors
  const errors = [
    scheduleError.value,
    errorAppointments.value,
    errorEmployees.value,
    errorMaterials.value,
    errorUpdateAppointment.value,
    errorUpdateschedule.value,
  ]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

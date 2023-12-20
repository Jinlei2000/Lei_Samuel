<template>
  <!-- Loading Data -->
  <div
    v-if="loadingAppointments && loadingEmployees && loadingMaterials"
    class="flex h-screen w-full items-center justify-center"
  >
    <Loader2 class="text-primary-green -mt-24 h-12 w-12 animate-spin" />
  </div>

  <main
    v-else
    class="m-auto mb-6 mt-12 flex max-w-7xl flex-col items-start justify-center gap-3"
  >
    <!-- Title -->
    <h1 class="mt-3 text-2xl">Add Schedule</h1>

    <!-- Form -->
    <form class="w-full" @submit.prevent="handleCreateSchedule">
      <!-- Final Date -->
      <div v-if="next === 0" class="w-full">
        <h2 class="mb-3 text-xl">Final Date</h2>
        <div class="flex w-full justify-end">
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- Validation -->
        <span class="block text-red-500">{{
          errorMessages.finalDate || '&nbsp;'
        }}</span>

        <!-- Calendar -->
        <div class="m-auto flex w-fit flex-col items-center gap-6">
          <p class="text-lg font-semibold text-gray-900">Choose a date</p>

          <!-- Loading Appointments & Employees -->
          <div v-if="loadingAppointments || loadingEmployees">
            <h1 class="flex animate-pulse space-x-4">Loading...</h1>
          </div>

          <!-- Calendar -->
          <Calendar
            id="finalDate"
            v-model="finalDate"
            inline
            :manual-input="false"
            :min-date="minDate"
            date-format="yy-mm-dd"
            @date-select="checkAvailability()"
          />
        </div>
      </div>

      <!-- Appointments -->
      <div v-if="next === 1">
        <h2 class="mb-3 text-xl">Appointments</h2>
        <div class="flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- Validation -->
        <span class="block text-red-500">{{
          errorMessages.appointmentsIds || '&nbsp;'
        }}</span>

        <!-- Appointments -->
        <div
          v-if="appointments && appointments.length > 0"
          class="m-auto mb-4 flex max-w-7xl flex-col gap-3"
        >
          <div v-for="a of appointments" :key="a.id">
            <button
              :class="[
                'relative w-full  overflow-hidden rounded-2xl bg-gray-200 transition-all duration-100 hover:cursor-pointer hover:bg-gray-300',
                isItemSelected(a.id!, appointmentsIds)
                  ? 'outline-primary-green outline'
                  : '',
              ]"
              type="button"
              @click="addSelectedAppointment(a)"
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
            </button>
          </div>
        </div>

        <!-- No Appointments -->
        <div
          v-else-if="appointments.length === 0"
          class="flex h-20 items-center justify-center rounded-2xl bg-gray-200"
        >
          <p class="text-lg">No appointments</p>
        </div>
      </div>

      <!-- Fill in price of appointments -->
      <div v-if="next === 2">
        <h2 class="mb-3 text-xl">Price Appointments</h2>
        <div class="flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- Validation -->
        <span class="block text-red-500">{{
          errorMessages.prices || '&nbsp;'
        }}</span>

        <!-- Show Appointments With Price Input -->
        <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
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

        <!-- Validation -->
        <span class="block text-red-500">{{
          errorMessages.employeesIds || '&nbsp;'
        }}</span>

        <!-- Employees -->
        <div v-if="employees && employees.length > 0">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <button
              v-for="user in employees"
              :key="user.id"
              class="relative overflow-hidden rounded-2xl bg-gray-200 hover:bg-gray-400"
              :class="
                isItemSelected(user.id, employeesIds)
                  ? 'outline outline-primary-green'
                  : ''
              "
              type="button"
              @click="addSelectedEmployee(user)"
            >
              <div class="flex items-center gap-6 p-1">
                <Avatar
                  class="h-12 w-12 overflow-hidden rounded-xl text-sm"
                  :user="user"
                />
                <p class="text-lg">{{ user.firstname }} {{ user.lastname }}</p>
                <div
                  v-if="isItemSelected(user.id, employeesIds)"
                  class="bg-primary-green absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-[2px]"
                >
                  <Check :size="16" class="text-white" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- No Employees -->
        <div
          v-else-if="employees.length === 0"
          class="flex h-20 items-center justify-center rounded-2xl bg-gray-200"
        >
          <p class="text-lg">No employees</p>
        </div>
      </div>

      <!-- Materials -->
      <div v-if="next === 4">
        <h2 class="mb-3 text-xl">Materials</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- Materials -->
        <div
          v-if="materials && materials.length > 0"
          class="grid-rows-auto grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <button
            v-for="material of materials"
            :key="material.id"
            class="relative flex transform items-center gap-3 overflow-hidden rounded-2xl bg-gray-200 p-1 hover:bg-gray-400"
            :class="
              isItemSelected(material.id, materialsIds)
                ? 'outline outline-primary-green'
                : ''
            "
            type="button"
            @click="addSelectedMaterial(material)"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-400"
            >
              <Wrench class="h-6 w-6 stroke-gray-800" />
            </div>
            <h2 class="truncate text-lg">{{ material.name }}</h2>
            <div
              v-if="isItemSelected(material.id, materialsIds)"
              class="bg-primary-green absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-[2px]"
            >
              <Check :size="16" class="text-white" />
            </div>
          </button>
        </div>

        <!-- No Materials -->
        <div
          v-else-if="materials.length === 0"
          class="flex h-20 items-center justify-center rounded-2xl bg-gray-200"
        >
          <p class="text-lg">No materials</p>
        </div>
      </div>

      <!-- See All -->
      <div v-if="next === 5">
        <h2 class="mb-3 text-xl">Overview</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton
            name="Create Schedule"
            :loading="loadingCreate"
            type="submit"
          />
        </div>

        <div
          class="m-auto flex w-full flex-col gap-3 rounded-2xl bg-gray-200 p-6 sm:w-2/3 md:w-1/2 lg:w-1/3"
        >
          <div class="flex gap-3">
            <CalendarIcon />
            <div>{{ formatDateTime(values.finalDate) }}</div>
          </div>
          <!-- Selected Appointments -->
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

          <!-- Selected Employees -->
          <div class="flex flex-col gap-1">
            <h3 class="mb-1 text-lg">Employees</h3>
            <ul v-if="selectedEmployees.length > 0" class="flex flex-col gap-1">
              <li
                v-for="user of selectedEmployees"
                :key="user.id"
                class="flex items-center gap-3"
              >
                <Avatar
                  class="h-8 w-8 overflow-hidden rounded-full text-sm"
                  :user="user"
                />
                <p class="capitalize">{{ user.fullname }}</p>
              </li>
            </ul>
          </div>

          <!-- Selected Materials -->
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

            <!-- No Selected Materials -->
            <div v-if="selectedMaterials.length < 1">No materials selected</div>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import Avatar from '@/components/generic/Avatar.vue'
import CustomButton from '@/components/generic/CustomButton.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { UPDATE_APPOINTMENT } from '@/graphql/appointment.mutation'
import { GET_ALL_APPOINTMENT_AVAILABLE_BY_DATE } from '@/graphql/appointment.query'
import { GET_MATERIALS_AVAILABLE } from '@/graphql/material.query'
import { CREATE_SCHEDULE } from '@/graphql/schedule.mutation'
import { GET_EMPLOYEES_AVAILABLE_BY_DATE } from '@/graphql/user.query'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import type { Material } from '@/interfaces/material.interface'
import { schedulesValidationSchema } from '@/validation/schema'
import { useMutation, useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { Loader2 } from 'lucide-vue-next'
import { Wrench } from 'lucide-vue-next'
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Star,
} from 'lucide-vue-next'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import { useForm } from 'vee-validate'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// composables
const { showToast } = useCustomToast()
const { replace } = useRouter()
const { formatDateTime, isOverToday } = useTimeUtilities()
const { customUser } = useCustomUser()

// variables
// today + 1 day
const minDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
const loadingCreate = ref<boolean>(false)
const appointments = computed(
  () => appointmentsResult.value?.appointmentsAvailableByDate || [],
)
const employees = computed(
  () => employeesResult.value?.usersEmployeesAvailableByDate || [],
)
const materials = computed(() => materialsResult.value?.materials || [])

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

// create form
const { defineField, errors, values, validate, setValues } = useForm({
  validationSchema: schedulesValidationSchema,
})

const [finalDate] = defineField('finalDate')
const [appointmentsIds] = defineField('appointmentsIds')
const [employeesIds] = defineField('employeesIds')
const [materialsIds] = defineField('materialsIds')

const next = ref(0)
const selectedAppointments = ref<Appointment[]>([])
const selectedEmployees = ref<CustomUser[]>([])
const selectedMaterials = ref<Material[]>([])

const collapsed = ref(true)

// graphql
const { mutate: createSchedule } = useMutation(CREATE_SCHEDULE)

const { mutate: updateAppointment } = useMutation(UPDATE_APPOINTMENT)

const {
  result: appointmentsResult,
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
  result: employeesResult,
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
  result: materialsResult,
  loading: loadingMaterials,
  error: errorMaterials,
} = useQuery(GET_MATERIALS_AVAILABLE, null, {
  fetchPolicy: 'cache-and-network',
})

// logics
// create schedule
const handleCreateSchedule = async (): Promise<void> => {
  try {
    loadingCreate.value = true
    await validate()
    errorMessages.value = errors.value
    if (Object.keys(errors.value).length === 0) {
      // console.log('no errors', values)

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
      // create schedule
      await createSchedule({
        createScheduleInput: {
          finalDate: formatDateTime(values.finalDate),
          appointmentIds: values.appointmentsIds,
          employeeIds: values.employeesIds,
          materialIds: values.materialsIds,
          createdBy: customUser.value?.fullname,
        },
      }).then(async ({ data }: any) => {
        loadingCreate.value = false
        showToast('success', 'Success', 'Schedule created')
        // redirect to schedule detail page
        replace(`/admin/schedules`)
      })
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't create schedule")
  } finally {
    loadingCreate.value = false
  }
}

// go to next step
const handleNext = async (): Promise<void> => {
  // validate first step (final date)
  if (next.value === 0) {
    await validate()
    errorMessages.value.finalDate = errors.value.finalDate
    if (!errors.value.finalDate) {
      setValues({
        appointmentsIds: [],
        employeesIds: [],
        materialsIds: [],
      })
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

// go to previous step
const handleBack = async (): Promise<void> => {
  if (next.value === 1) {
    // reset values
    setValues({
      appointmentsIds: [],
      employeesIds: [],
      materialsIds: [],
    })
    selectedAppointments.value = []
  } else if (next.value === 3) {
    // reset values
    setValues({
      employeesIds: [],
    })
    selectedEmployees.value = []
  } else if (next.value === 4) {
    // reset values
    setValues({
      materialsIds: [],
    })
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
const addSelectedAppointment = (appointment: Appointment): void => {
  // check if appointment is already selected
  const index = values.appointmentsIds.indexOf(appointment.id!)

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

const addSelectedEmployee = (user: CustomUser): void => {
  // check if user is already selected
  const index = values.employeesIds.indexOf(user.id)

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

const addSelectedMaterial = (material: Material): void => {
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
const isItemSelected = (id: string, itemIds: string[]): boolean => {
  return itemIds.includes(id)
}

// check if there are appointments and employees available for the selected date
const checkAvailability = async (): Promise<void> => {
  // reset error messages
  errorMessages.value.finalDate = ''
  let error = ''
  await refetchAppointments()
  await refetchEmployees()
  if (appointments.value.length === 0 && employees.value.length === 0) {
    error = 'No appointments and employees available for this date'
  }
  // check if there are appointments available for the selected date
  else if (appointments.value.length === 0) {
    error = 'No appointments available for this date'
  }
  // check if there are employees available for the selected date
  else if (employees.value.length === 0) {
    error = 'No employees available for this date'
  }

  errorMessages.value.finalDate = error
}

const toggleCollapsible = (): void => {
  collapsed.value = !collapsed.value
}

watchEffect(() => {
  // log the queries
  // if (appointments.value) console.log(appointments.value)
  // if (employees.value) console.log(employees.value)
  // if (materials.value) console.log(materials.value)

  // all errors
  if (errorAppointments.value) {
    // console.log(errorAppointments.value)
    LogRocket.captureException(errorAppointments.value)
    showToast('error', 'Error', "Couldn't load appointments")
  }
  if (errorEmployees.value) {
    // console.log(errorEmployees.value)
    LogRocket.captureException(errorEmployees.value)
    showToast('error', 'Error', "Couldn't load employees")
  }
  if (errorMaterials.value) {
    // console.log(errorMaterials.value)
    LogRocket.captureException(errorMaterials.value)
    showToast('error', 'Error', "Couldn't load materials")
  }
})
</script>

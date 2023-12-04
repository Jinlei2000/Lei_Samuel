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
    <h1 class="mt-3 text-2xl">Add Schedule</h1>

    <!-- form -->
    <form class="w-full" @submit.prevent="handleCreateSchedule">
      <!-- Final Date -->
      <div v-if="next === 0" class="w-full">
        <h2 class="mb-3 text-xl">Final Date</h2>
        <div class="flex w-full justify-end">
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- validation -->
        <span id="text-error" class="block text-red-500">{{
          errorMessages.finalDate || '&nbsp;'
        }}</span>

        <div class="m-auto flex w-fit flex-col items-center gap-6">
          <p class="text-lg font-semibold text-gray-900">Choose a date</p>

          <!-- loading appointments & employees -->
          <div v-if="loadingAppointments || loadingEmployees">
            <h1 class="flex animate-pulse space-x-4">Loading...</h1>
          </div>

          <!-- show calendar -->
          <Calendar
            id="finalDate"
            inline
            v-bind="finalDate"
            :manual-input="false"
            :min-date="minDate"
            date-format="yy-mm-dd"
            @date-select="checkAvailability()"
          >
          </Calendar>
        </div>
      </div>

      <!-- Appointments -->
      <div v-if="next === 1">
        <h2 class="mb-3 text-xl">Appointments</h2>
        <div class="flex w-full justify-between">
          <CustomButton name="Back" type="button" @click="handleBack()" />
          <CustomButton name="Next" type="button" @click="handleNext()" />
        </div>

        <!-- validation -->
        <span id="text-error" class="block text-red-500">{{
          errorMessages.appointmentsIds || '&nbsp;'
        }}</span>

        <!-- loading appointments -->
        <div v-if="loadingAppointments">
          <h1 class="flex animate-pulse space-x-4">Loading...</h1>
        </div>

        <!-- show appointments -->
        <div v-else-if="appointments && appointments.length > 0">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="a of appointments" :key="a.id">
              <div
                :class="[
                  'mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md',
                  isItemSelected(a.id, appointmentsIds.modelValue)
                    ? 'border-2 border-green-500'
                    : '',
                ]"
              >
                <div class="p-4">
                  <!-- Add checkbox for selection -->
                  <input
                    type="checkbox"
                    class="mr-2"
                    :checked="isItemSelected(a.id, appointmentsIds.modelValue)"
                    @click="addSelectedAppointment(a)"
                  />
                  <h2 class="mb-2 text-xl font-semibold">{{ a.type }}</h2>
                  <p class="mb-1 text-gray-600">{{ a.description }}</p>
                  <p class="mb-1 text-gray-600">{{ a.id }}</p>
                  <p v-if="a.finalDate" class="text-gray-600">
                    {{ formatDateTime(a.finalDate) }}
                  </p>
                </div>
                <div class="border-t border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500"
                      >{{ formatDateTime(a.startProposedDate) }} -
                      {{ formatDateTime(a.endProposedDate) }}</span
                    >
                    <span v-if="a.isScheduled" class="text-green-500"
                      >Scheduled</span
                    >
                    <span v-else class="text-gray-500">Not Scheduled</span>
                  </div>
                </div>
                <div class="border-t border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <span v-if="a.isDone" class="text-green-500">Done</span>
                    <span v-else class="text-gray-500">Not Done</span>
                    <span class="text-sm text-gray-500"
                      >Priority: {{ a.priority }}</span
                    >
                  </div>
                </div>

                <div
                  class="flex items-center justify-end space-x-4 border-t border-gray-200 p-6"
                >
                  <!-- View More Button -->
                  <!-- TODO: make only if design need it? -->
                  <!-- @click="openModal(a, 'detail')" -->
                  <button class="text-green-500 hover:underline">
                    <Eye />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- no appointments -->
        <div
          v-else-if="appointments.length === 0"
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
        <h1>Fill in price of appointments</h1>
        <CustomButton name="Back" type="button" @click="handleBack()" />
        <CustomButton name="Next" type="button" @click="handleNext()" />

        <!-- validation -->
        <span id="text-error" class="block text-red-500">{{
          errorMessages.prices || '&nbsp;'
        }}</span>

        <!-- show appointments with price input -->
        <div>
          <div v-for="a of selectedAppointments" :key="a.id">
            <div
              class="mx-auto mb-3 max-w-md overflow-hidden rounded-md bg-white shadow-md"
            >
              <div class="p-4">
                <label
                  class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  for="price"
                  >Price</label
                >
                <InputNumber
                  id="price"
                  v-model="a.price"
                  name="price"
                  mode="currency"
                  currency="EUR"
                  locale="de-BE"
                />
              </div>
              <div class="p-4">
                <h2 class="mb-2 text-xl font-semibold">{{ a.type }}</h2>
                <p class="mb-1 text-gray-600">{{ a.description }}</p>
                <p class="mb-1 text-gray-600">{{ a.id }}</p>
                <p v-if="a.finalDate" class="text-gray-600">
                  {{ formatDateTime(a.finalDate.toString()) }}
                </p>
              </div>
              <div class="border-t border-gray-200 p-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500"
                    >{{ formatDateTime(a.startProposedDate!.toString()) }} -
                    {{ formatDateTime(a.endProposedDate!.toString()) }}</span
                  >
                  <span v-if="a.isScheduled" class="text-green-500"
                    >Scheduled</span
                  >
                  <span v-else class="text-gray-500">Not Scheduled</span>
                </div>
              </div>
              <div class="border-t border-gray-200 p-4">
                <div class="flex items-center justify-between">
                  <span v-if="a.isDone" class="text-green-500">Done</span>
                  <span v-else class="text-gray-500">Not Done</span>
                  <span class="text-sm text-gray-500"
                    >Priority: {{ a.priority }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Employees -->
      <div v-if="next === 3">
        <h1>Employees</h1>
        <CustomButton name="Back" type="button" @click="handleBack()" />
        <CustomButton name="Next" type="button" @click="handleNext()" />

        <!-- validation -->
        <span id="text-error" class="block text-red-500">{{
          errorMessages.employeesIds || '&nbsp;'
        }}</span>

        <!-- loading employees -->
        <div v-if="loadingEmployees">
          <h1 class="flex animate-pulse space-x-4">Loading...</h1>
        </div>

        <!-- show employees -->
        <div v-else-if="employees && employees.length > 0">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="user in employees"
              :key="user.id"
              class="transform overflow-hidden rounded-md border border-gray-400 bg-white shadow-md transition-transform hover:scale-105"
              :class="
                isItemSelected(user.id, employeesIds.modelValue)
                  ? 'border border-green-500'
                  : ''
              "
            >
              <!-- Add checkbox for selection -->
              <input
                type="checkbox"
                class="mr-2"
                :checked="isItemSelected(user.id, employeesIds.modelValue)"
                @click="addSelectedEmployee(user)"
              />
              <div class="p-6">
                <h2 class="mb-2 text-2xl font-semibold">
                  {{ user.firstname }} {{ user.lastname }}
                </h2>
                <p class="text-gray-600">{{ user.email }}</p>
                <p class="text-gray-600">{{ user.role }}</p>
                <p class="text-gray-600">{{ user.uid }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- no employees -->
        <div
          v-else-if="employees.length === 0"
          class="mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md"
        >
          <div class="p-4">
            <h2 class="mb-2 text-xl font-semibold">No employees</h2>
            <p class="mb-1 text-gray-600">
              There are no employees available for this date
            </p>
          </div>
        </div>
      </div>

      <!-- Materials -->
      <div v-if="next === 4">
        <h1>Materials</h1>
        <CustomButton name="Back" type="button" @click="handleBack()" />
        <CustomButton name="Next" type="button" @click="handleNext()" />

        <!-- loading -->
        <div v-if="loadingMaterials">
          <h1 class="flex animate-pulse space-x-4">Loading...</h1>
        </div>

        <!-- show materials -->
        <div
          v-else-if="materials && materials.length > 0"
          class="grid-rows-auto grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        >
          <div
            v-for="material of materials"
            :key="material.id"
            class="relative col-span-1 rounded-2xl transition-all hover:scale-105 hover:cursor-pointer"
            :class="
              isItemSelected(material.id, materialsIds.modelValue)
                ? 'border-2 border-green-500'
                : ''
            "
          >
            <!-- Add checkbox for selection -->
            <input
              type="checkbox"
              class="mr-2"
              :checked="isItemSelected(material.id, materialsIds.modelValue)"
              @click="addSelectedMaterial(material)"
            />
            <img
              class="w-full rounded-2xl rounded-b-3xl"
              src="https://picsum.photos/200"
              alt="random picture"
            />
            <div
              class="absolute bottom-0 w-full rounded-2xl rounded-t-none bg-gray-200 px-4 py-2"
            >
              <h2 class="truncate text-lg">{{ material.name }}</h2>
              <p class="m-0">Loanable: {{ material.isLoan }}</p>
            </div>
          </div>
        </div>

        <!-- no materials -->
        <div
          v-else-if="materials.length === 0"
          class="mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md"
        >
          <div class="p-4">
            <h2 class="mb-2 text-xl font-semibold">No materials</h2>
            <p class="mb-1 text-gray-600">
              There are no materials available for this date
            </p>
          </div>
        </div>
      </div>

      <!-- See All -->
      <div v-if="next === 5">
        <h1>See All</h1>
        <CustomButton name="Back" type="button" @click="handleBack()" />
        <CustomButton
          name="Create Schedule"
          :loading="loadingCreate"
          type="submit"
        />

        <!-- show schedule detail -->
        <!-- show selected final date -->
        <div>
          <h1>Final Date</h1>
          <div>{{ formatDateTime(values.finalDate) }}</div>
        </div>
        <!-- show selected appointments -->
        <div>
          <h1>Appointments</h1>
          <div
            v-for="a of selectedAppointments"
            v-if="selectedAppointments.length > 0"
            :key="a.id"
          >
            {{ a.id }}
          </div>
        </div>

        <!-- show selected employees -->
        <div>
          <h1>Employees</h1>
          <div
            v-for="user of selectedEmployees"
            v-if="selectedEmployees.length > 0"
            :key="user.id"
          >
            {{ user.id }}
          </div>
        </div>

        <!-- show selected materials -->
        <div>
          <h1>Materials</h1>
          <div
            v-for="material of selectedMaterials"
            v-if="selectedMaterials.length > 0"
            :key="material.id"
          >
            {{ material.id }}
          </div>

          <!-- no selected materials -->
          <div v-else>No materials selected</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
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
import { ArrowLeft, Eye } from 'lucide-vue-next'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import { useForm } from 'vee-validate'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// TODO: fix when you refresh the page, that you dont go back to the first step

// composables
const { showToast } = useCustomToast()
const { replace } = useRouter()
const { formatDateTime } = useTimeUtilities()
const { customUser } = useCustomUser()

// variables
// today + 1 day
const minDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
const loadingCreate = ref(false)

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
const { defineComponentBinds, errors, values, validate, setValues } = useForm({
  validationSchema: schedulesValidationSchema,
})

const finalDate = defineComponentBinds('finalDate')
const appointmentsIds = defineComponentBinds('appointmentsIds')
const employeesIds = defineComponentBinds('employeesIds')
const materialsIds = defineComponentBinds('materialsIds')

const next = ref(0)
const selectedAppointments = ref<Appointment[]>([])
const selectedEmployees = ref<CustomUser[]>([])
const selectedMaterials = ref<Material[]>([])

// graphql
const { mutate: createSchedule, error: errorCreateSchedule } =
  useMutation(CREATE_SCHEDULE)

const { mutate: updateAppointment, error: errorUpdateAppointment } =
  useMutation(UPDATE_APPOINTMENT)

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
const handleCreateSchedule = async () => {
  loadingCreate.value = true
  await validate()
  errorMessages.value = errors.value
  if (Object.keys(errors.value).length === 0) {
    console.log('no errors', values)

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
      replace(`/admin/schedules/${data?.createSchedule.id}`)
    })
  }
  loadingCreate.value = false
}

// go to next step
const handleNext = async () => {
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
const handleBack = async () => {
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
const addSelectedAppointment = (appointment: Appointment) => {
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

const addSelectedEmployee = (user: CustomUser) => {
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

watchEffect(() => {
  // log the queries
  // if (appointments.value) console.log(appointments.value)
  // if (employees.value) console.log(employees.value)
  // if (materials.value) console.log(materials.value)

  // all errors
  const errors = [
    errorCreateSchedule.value,
    errorAppointments.value,
    errorEmployees.value,
    errorMaterials.value,
    errorUpdateAppointment.value,
  ]
  errors.forEach(error => {
    if (error) {
      loadingCreate.value = false
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

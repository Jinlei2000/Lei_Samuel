<template>
  <!-- go back button -->
  <button class="mt-20 flex" @click="$router.go(-1)" v-bind="$attrs">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Add Schedule
  </h1>

  <!-- form -->
  <form @submit.prevent="handleCreateSchedule">
    <!-- show schedule -->
    <div>
      <div
        v-if="selectedAppointments.length > 0"
        v-for="a of selectedAppointments"
        :key="a.id"
      >
        {{ a.id }}
      </div>
    </div>

    <!-- Final Date -->
    <div v-if="next === 0">
      <h1>Final Date</h1>
      <CustomButton name="Next" type="button" @click="handleNext()" />
      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Choose a date
        </h1>

        <!-- loading appointments & employees -->
        <div v-if="loadingAppointments || loadingEmployees">
          <h1 class="flex animate-pulse space-x-4">Loading...</h1>
        </div>

        <!-- show calendar -->
        <Calendar
          id="finalDate"
          inline
          v-bind="finalDate"
          :manualInput="false"
          :minDate="minDate"
          dateFormat="yy-mm-dd"
          @date-select="checkAvailability()"
        >
        </Calendar>
        <small class="p-error" id="text-error">{{
          errorMessages.finalDate || '&nbsp;'
        }}</small>
      </div>
    </div>

    <!-- Appointments -->
    <div v-if="next === 1">
      <h1>Appointments</h1>
      <CustomButton name="Back" type="button" @click="handleBack()" />
      <CustomButton name="Next" type="button" @click="handleNext()" />

      <!-- loading appointments -->
      <div v-if="loadingAppointments">
        <h1 class="flex animate-pulse space-x-4">Loading...</h1>
      </div>

      <!-- show appointments -->
      <div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-if="
              appointments &&
              appointments.appointmentsAvailableByDate.length > 0
            "
            v-for="a of appointments.appointmentsAvailableByDate"
            :key="a.id"
          >
            <div
              :class="[
                'mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md',
                IsAppointmentSelected(a.id) ? 'border-2 border-green-500' : '',
              ]"
            >
              <div class="p-4">
                <!-- Add checkbox for selection -->
                <input
                  type="checkbox"
                  class="mr-2"
                  @click="addSelectedAppointment(a)"
                  :checked="IsAppointmentSelected(a.id)"
                />
                <h2 class="mb-2 text-xl font-semibold">{{ a.type }}</h2>
                <p class="mb-1 text-gray-600">{{ a.description }}</p>
                <p class="mb-1 text-gray-600">{{ a.id }}</p>
                <p class="text-gray-600" v-if="a.finalDate">
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
                <!-- @click="openModal(a, 'detail')" -->
                <button class="text-green-500 hover:underline">
                  <Eye />
                </button>
              </div>
            </div>
          </div>

          <!-- no appointments -->
          <div
            v-else
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
        <small class="p-error" id="text-error">{{
          errorMessages.appointmentsIds || '&nbsp;'
        }}</small>
      </div>
    </div>

    <!-- Fill in price of appointments -->
    <div v-if="next === 2">
      <h1>Fill in price of appointments</h1>
      <CustomButton name="Back" type="button" @click="handleBack()" />
      <CustomButton name="Next" type="button" @click="handleNext()" />
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
                v-model="a.price"
                id="price"
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
              <p class="text-gray-600" v-if="a.finalDate">
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
        <small class="p-error" id="text-error">{{
          errorMessages.prices || '&nbsp;'
        }}</small>
      </div>
    </div>

    <!-- Employees -->
    <div v-if="next === 3">
      <h1>Employees</h1>
      <CustomButton name="Back" type="button" @click="handleBack()" />
      <CustomButton name="Next" type="button" @click="handleNext()" />

      <!-- loading employees -->
      <div v-if="loadingEmployees">
        <h1 class="flex animate-pulse space-x-4">Loading...</h1>
      </div>

      <!-- show employees -->
      <div
        v-if="employees && employees.usersEmployeesAvailableByDate.length > 0"
      >
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="user in employees.usersEmployeesAvailableByDate"
            :key="user.id"
            class="transform overflow-hidden rounded-md border border-gray-400 bg-white shadow-md transition-transform hover:scale-105"
            :class="IsUserSelected(user.id) ? 'border border-green-500' : ''"
          >
            <!-- Add checkbox for selection -->
            <input
              type="checkbox"
              class="mr-2"
              @click="addSelectedUser(user)"
              :checked="IsUserSelected(user.id)"
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
    </div>

    <!-- <CustomButton
      name="Create Schedule"
      :loading="loadingCreate"
      type="submit"
    /> -->
  </form>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { GET_ALL_APPOINTMENT_AVAILABLE_BY_DATE } from '@/graphql/appointment.query'
import { CREATE_SCHEDULE } from '@/graphql/schedule.mutation'
import { GET_EMPLOYEES_AVAILABLE_BY_DATE } from '@/graphql/user.query'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ArrowLeft, Eye } from 'lucide-vue-next'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import { useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

// composables
const { showToast } = useCustomToast()
const { replace } = useRouter()
const { formatDateTime } = useTimeUtilities()

// variables
// today + 1 day
const minDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
const loadingCreate = ref(false)

// form
const schema = yup.object({
  finalDate: yup.string().required(),
  appointmentsIds: yup.array().required().min(1),
  employeesIds: yup.array().required().min(1),
  materialsIds: yup.array().required(),
})

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
  validationSchema: schema,
})

const finalDate = defineComponentBinds('finalDate')
const appointmentsIds = defineComponentBinds('appointmentsIds')
const employeesIds = defineComponentBinds('employeesIds')
const materialsIds = defineComponentBinds('materialsIds')

const next = ref(0)
const selectedAppointments = ref<Appointment[]>([])
const selectedEmployees = ref<CustomUser[]>([])

// graphql
const { mutate: createSchedule, error: errorCreateSchedule } =
  useMutation(CREATE_SCHEDULE)

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

// logics
// create schedule
const handleCreateSchedule = async () => {
  loadingCreate.value = true
  await validate()
  errorMessages.value = errors.value
  if (Object.keys(errors.value).length === 0) {
    console.log('no errors', values)
    // await createSchedule({
    //   createScheduleInput: {
    //     finalDate: values.finalDate,
    //   },
    // }).then(async () => {
    //   loadingCreate.value = false
    //   showToast('success', 'Success', 'Schedule created')
    //   // redirect to schedule page
    //   replace('/admin/schedules')
    // })
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
  else if (next.value === 2) {
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

// check if appointment is selected
const IsAppointmentSelected = (id: string) => {
  if (values.appointmentsIds.includes(id)) return true
  return false
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

const addSelectedUser = (user: CustomUser) => {
  // check if user is already selected
  const index = values.employeesIds.indexOf(user.id)

  // if user is already selected, remove it
  if (index > -1) {
    const newValues = [...values.employeesIds]
    newValues.splice(index, 1)
    setValues({
      employeesIds: newValues,
    })
  } else {
    // if user is not selected, add it
    const newValues = [...values.employeesIds]
    newValues.push(user.id)
    setValues({
      employeesIds: newValues,
    })
  }
}

const IsUserSelected = (id: string) => {
  if (values.employeesIds.includes(id)) return true
  return false
}

watchEffect(() => {
  // log the queries
  // if (appointments.value) console.log(appointments.value)
  // if (employees.value) console.log(employees.value)

  // all errors
  const errors = [
    errorCreateSchedule.value,
    errorAppointments.value,
    errorEmployees.value,
  ]
  errors.forEach(error => {
    if (error) {
      loadingCreate.value = false
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

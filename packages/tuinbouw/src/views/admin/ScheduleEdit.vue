<template>
  <!-- go back button -->
  <button class="mt-20 flex" v-bind="$attrs" @click="$router.go(-1)">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Schedules Edit
  </h1>

  <!-- reset all values back -->
  <CustomButton type="button" name="Reset" @click="reset()" />

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

  <!-- show schedule -->
  <form v-if="schedule" @submit.prevent="handleUpdateSchedule">
    <!-- Final Date -->
    <div v-if="next === 0">
      <h1>Final Date</h1>
      <CustomButton name="Next" type="button" @click="handleNext()" />

      <!-- validation -->
      <small id="text-error" class="p-error block">{{
        errorMessages.finalDate || '&nbsp;'
      }}</small>

      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Your selected date is: {{ formatDateTime(values.finalDate) }}
          <hr />
          Do you want to change it?
        </h1>

        <!-- loading appointments & employees -->
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
    <div v-if="next === 1">
      <h1>Appointments</h1>
      <CustomButton name="Back" type="button" @click="handleBack()" />
      <CustomButton name="Next" type="button" @click="handleNext()" />

      <!-- validation -->
      <small id="text-error" class="p-error block">{{
        errorMessages.appointmentsIds || '&nbsp;'
      }}</small>

      <!-- loading appointments -->
      <div v-if="loadingAppointments">
        <h1 class="flex animate-pulse space-x-4">Loading...</h1>
      </div>

      <!-- show selected appointments -->
      <h1>Your selected</h1>
      <div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="a of selectedAppointmentsEdit"
            v-if="selectedAppointmentsEdit.length > 0"
            :key="a.id"
          >
            <div
              :class="[
                'mx-auto max-w-md overflow-hidden rounded-md bg-white shadow-md',
                isItemSelected(a.id!, appointmentsIds.modelValue)
                  ? 'border-2 border-green-500'
                  : '',
              ]"
            >
              <div class="p-4">
                <!-- Add checkbox for selection -->
                <input
                  type="checkbox"
                  class="mr-2"
                  :checked="isItemSelected(a.id!, appointmentsIds.modelValue)"
                  @click="addSelectedAppointment(a)"
                />
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

      <!-- show appointments -->
      <h1>Available appointments</h1>
      <div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="a of appointments.appointmentsAvailableByDate"
            v-if="
              appointments &&
              appointments.appointmentsAvailableByDate.length > 0
            "
            :key="a.id"
          >
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
      <h1>Fill in price of appointments</h1>
      <CustomButton name="Back" type="button" @click="handleBack()" />
      <CustomButton name="Next" type="button" @click="handleNext()" />

      <!-- validation -->
      <small id="text-error" class="p-error block">{{
        errorMessages.prices || '&nbsp;'
      }}</small>

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
      <small id="text-error" class="p-error block">{{
        errorMessages.employeesIds || '&nbsp;'
      }}</small>

      <!-- loading employees -->
      <div v-if="loadingEmployees">
        <h1 class="flex animate-pulse space-x-4">Loading...</h1>
      </div>

      <!-- show selected employees -->
      <h1>Your selected</h1>
      <div v-if="selectedEmployeesEdit && selectedEmployeesEdit.length > 0">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="user in selectedEmployeesEdit"
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

      <!-- show employees -->
      <h1>Available employees</h1>
      <div
        v-if="employees && employees.usersEmployeesAvailableByDate.length > 0"
      >
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="user in employees.usersEmployeesAvailableByDate"
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

      <!-- show selected materials -->
      <h1>Your selected</h1>
      <div
        class="grid-rows-auto grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
      >
        <div
          v-for="material of selectedMaterialsEdit"
          v-if="selectedMaterialsEdit && selectedMaterialsEdit.length > 0"
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

      <!-- show materials -->
      <h1>Available materials</h1>
      <div
        class="grid-rows-auto grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
      >
        <div
          v-for="material of materials.materials"
          v-if="materials && materials.materials.length > 0"
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
    </div>

    <!-- See All -->
    <div v-if="next === 5">
      <h1>See All</h1>
      <CustomButton name="Back" type="button" @click="handleBack()" />
      <CustomButton
        name="Update Schedule"
        :loading="loadingUpdate"
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
import { ArrowLeft } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// TODO: add steps (next.value) to the url as query params (e.g. /schedules/edit?step=1)
// TODO: use useLazyQuery for materials and (employees or users) to prevent loading all materials and (employees or appointments)

// composables
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
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

watchEffect(() => {
  // log the queries
  // if (appointments.value) console.log(appointments.value)
  // if (employees.value) console.log(employees.value)
  // if (materials.value) console.log(materials.value)

  // set all values
  if (schedule.value) {
    setAllValues()
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

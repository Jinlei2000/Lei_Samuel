<template>
  <!-- Loading Data -->
  <div
    v-if="
      scheduleLoading &&
      loadingAppointments &&
      loadingEmployees &&
      loadingMaterials
    "
    class="flex h-screen w-full items-center justify-center"
  >
    <Loader2 class="text-primary-green -mt-24 h-12 w-12 animate-spin" />
  </div>

  <main
    v-else
    class="m-auto mb-6 mt-12 flex w-full max-w-7xl flex-col items-start justify-center gap-3"
  >
    <!-- Title -->
    <div class="mt-3 flex w-full items-center justify-between">
      <h1 class="text-2xl">{{ $t('edit.schedule.title') }}</h1>
      <!-- Reset -->
      <CustomButton
        type="button"
        variant="secondary"
        name="edit.schedule.button.reset"
        @click="reset()"
      />
    </div>

    <!-- Form -->
    <form v-if="schedule" class="w-full" @submit.prevent="handleUpdateSchedule">
      <!-- Final Date -->
      <div v-if="next === 0" class="w-full">
        <h2 class="mb-3 text-xl">{{ $t('edit.schedule.sub.final.date') }}</h2>
        <div class="flex w-full justify-end">
          <CustomButton
            name="edit.schedule.button.next"
            type="button"
            @click="handleNext()"
          />
        </div>

        <!-- Validation -->
        <CustomError
          v-if="errorMessages.finalDate"
          class="w-50 my-1 py-2 sm:w-96"
          :error="errorMessages.finalDate"
        />

        <!-- Calendar -->
        <div class="flex w-full flex-col items-center gap-6">
          <p class="text-lg font-semibold text-gray-900">
            {{ $t('edit.schedule.sub.selected.date') }}:
            {{ formatDateTime(values.finalDate) }}
          </p>

          <div v-if="loadingAppointments || loadingEmployees">
            <h1 class="flex animate-pulse space-x-4">
              {{ $t('edit.schedule.loading') }}...
            </h1>
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
          >
          </Calendar>
        </div>
      </div>

      <!-- Appointments -->
      <div v-if="next === 1" class="w-full">
        <h2 class="mb-3 text-xl">{{ $t('edit.schedule.sub.appointments') }}</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton
            name="edit.schedule.button.back"
            type="button"
            @click="handleBack()"
          />
          <CustomButton
            name="edit.schedule.button.next"
            type="button"
            @click="handleNext()"
          />
        </div>

        <!-- Validation -->
        <CustomError
          v-if="errorMessages.appointmentsIds"
          class="w-50 my-1 py-2 sm:w-96"
          :error="errorMessages.appointmentsIds"
        />

        <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
          <!-- Selected Appointments & Available Appointments -->
          <div
            v-for="a of [
              ...selectedAppointmentsEdit,
              ...appointments.appointmentsAvailableByDate,
            ]"
            :key="a.id"
          >
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
          v-if="
            appointments &&
            appointments.appointmentsAvailableByDate.length === 0 &&
            selectedAppointmentsEdit.length === 0
          "
          class="flex h-20 items-center justify-center rounded-2xl bg-gray-200"
        >
          <p class="text-lg">No appointments</p>
        </div>
      </div>

      <!-- Fill in price of appointments -->
      <div v-if="next === 2">
        <h2 class="mb-3 text-xl">{{ $t('edit.schedule.sub.price') }}</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton
            name="edit.schedule.button.back"
            type="button"
            @click="handleBack()"
          />
          <CustomButton
            name="edit.schedule.button.next"
            type="button"
            @click="handleNext()"
          />
        </div>

        <!-- validation -->
        <CustomError
          v-if="errorMessages.prices"
          class="w-50 my-1 py-2 sm:w-96"
          :error="errorMessages.prices"
        />

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
        <h2 class="mb-3 text-xl">{{ $t('edit.schedule.sub.employees') }}</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton
            name="edit.schedule.button.back"
            type="button"
            @click="handleBack()"
          />
          <CustomButton
            name="edit.schedule.button.next"
            type="button"
            @click="handleNext()"
          />
        </div>

        <!-- Validation -->
        <CustomError
          v-if="errorMessages.employeesIds"
          class="w-50 my-1 py-2 sm:w-96"
          :error="errorMessages.employeesIds"
        />

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <!-- Selected Employees & Available Employees -->
          <button
            v-for="user in [
              ...selectedEmployeesEdit,
              ...employees.usersEmployeesAvailableByDate,
            ]"
            v-if="selectedEmployeesEdit && selectedEmployeesEdit.length > 0"
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

      <!-- Materials -->
      <div v-if="next === 4">
        <h2 class="mb-3 text-xl">{{ $t('edit.schedule.sub.materials') }}</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton
            name="edit.schedule.button.back"
            type="button"
            @click="handleBack()"
          />
          <CustomButton
            name="edit.schedule.button.next"
            type="button"
            @click="handleNext()"
          />
        </div>

        <div
          class="grid-rows-auto grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <!-- Selected Materials & Availabe materials -->
          <button
            v-for="material of [
              // ...selectedMaterialsEdit,
              ...materials.materials,
            ]"
            v-if="selectedMaterialsEdit && selectedMaterialsEdit.length > 0"
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
      </div>

      <!-- See All -->
      <div v-if="next === 5">
        <h2 class="mb-3 text-xl">{{ $t('edit.schedule.sub.see.all') }}</h2>
        <div class="mb-6 flex w-full justify-between">
          <CustomButton
            name="edit.schedule.button.back"
            type="button"
            @click="handleBack()"
          />
          <CustomButton
            name="edit.schedule.button.edit"
            :loading="loadingUpdate"
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
          <!-- Selected appointments -->
          <div class="flex flex-col">
            <h3 class="mb-1 text-lg">
              {{ $t('edit.schedule.sub.appointments') }}
            </h3>
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

          <!-- Selected employees -->
          <div class="flex flex-col gap-1">
            <h3 class="mb-1 text-lg">
              {{ $t('edit.schedule.sub.employees') }}
            </h3>
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
              <h3 class="text-lg">
                {{ $t('edit.schedule.sub.materials') }}
              </h3>
              <ChevronDown :class="collapsed ? 'transform rotate-180' : ''" />
            </div>
            <ul v-if="selectedMaterials.length > 0 && !collapsed">
              <li v-for="material of selectedMaterials" :key="material.id">
                {{ material.name }}
              </li>
            </ul>

            <!-- No Selected Materials -->
            <div v-if="selectedMaterials.length < 1">
              {{ $t('edit.schedule.no.material') }}
            </div>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import Avatar from '@/components/generic/Avatar.vue'
import CustomButton from '@/components/generic/CustomButton.vue'
import CustomError from '@/components/generic/CustomError.vue'
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
import LogRocket from 'logrocket'
import { Wrench } from 'lucide-vue-next'
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Loader2,
  Star,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

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
const { defineField, errors, values, validate, setValues } = useForm({
  validationSchema: schedulesValidationSchema,
})

const [finalDate] = defineField('finalDate')
const [appointmentsIds] = defineField('appointmentsIds')
const [employeesIds] = defineField('employeesIds')
const [materialsIds] = defineField('materialsIds')

// graphql
const { mutate: updateAppointment } = useMutation(UPDATE_APPOINTMENT)

const { mutate: updateschedule } = useMutation(UPDATE_SCHEDULE)

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
const handleUpdateSchedule = async (): Promise<void> => {
  try {
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
      })
      showToast('success', 'toast.success', 'edit.schedule.toast.update')
      go(-1)
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'edit.schedule.toast.error.update')
  } finally {
    loadingUpdate.value = false
  }
}

const handleNext = async (): Promise<void> => {
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
        priceError = 'edit.schedule.error.price'
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

const handleBack = (): void => {
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
const addSelectedAppointment = (appointment: Appointment): void => {
  // check if appointment is already selected
  const index = values.appointmentsIds.indexOf(appointment.id!)

  // console.log('index', index)

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
  // console.log('user', user)
  // check if user is already selected
  const index = values.employeesIds.indexOf(user.id)

  // console.log(index)

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
      error = 'edit.schedule.error.no.appointment.employees'
    }
    // check if there are appointments available for the selected date
    else if (appointments.value.appointmentsAvailableByDate.length === 0) {
      error = 'edit.schedule.error.no.appointment'
    }
    // check if there are employees available for the selected date
    else if (employees.value.usersEmployeesAvailableByDate.length === 0) {
      error = 'edit.schedule.error.no.employees'
    }
    errorMessages.value.finalDate = error
  }
}

// set all values for edit
const setAllValues = (): void => {
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
const reset = (): void => {
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

const toggleCollapsible = (): void => {
  collapsed.value = !collapsed.value
}

watchEffect(() => {
  // log the queries
  // if (appointments.value) console.log(appointments.value)
  // if (employees.value) console.log(employees.value)
  // if (materials.value) console.log(materials.value)
  // if (appointments.value)
  //   console.log(appointments.value.appointmentsAvailableByDate)

  // set all values
  if (schedule.value) {
    setAllValues()
    // console.log(schedule.value)
  }

  // all errors
  if (scheduleError.value) {
    // console.log(scheduleError.value)
    LogRocket.captureException(scheduleError.value)
    showToast('error', 'toast.error', 'edit.schedule.toast.error.schedule')
  }
  if (errorAppointments.value) {
    // console.log(errorAppointments.value)
    LogRocket.captureException(errorAppointments.value)
    showToast('error', 'toast.error', 'edit.schedule.toast.error.appointments')
  }
  if (errorEmployees.value) {
    // console.log(errorEmployees.value)
    LogRocket.captureException(errorEmployees.value)
    showToast('error', 'toast.error', 'edit.schedule.toast.error.employees')
  }
  if (errorMaterials.value) {
    // console.log(errorMaterials.value)
    LogRocket.captureException(errorMaterials.value)
    showToast('error', 'toast.error', 'edit.schedule.toast.error.materials')
  }
})
</script>

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
    <!-- Final Date -->
    <div v-if="next === 0">
      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Choose a date
        </h1>
        <Calendar
          id="finalDate"
          inline
          v-bind="finalDate"
          :manualInput="false"
          :minDate="minDate"
          dateFormat="yy-mm-dd"
        >
        </Calendar>
        <small class="p-error" id="text-error">{{
          errorMessages.finalDate || '&nbsp;'
        }}</small>
      </div>
      <!-- next + 1 -->
      <CustomButton name="Next" type="button" @click="handleNext()" />
    </div>

    <!-- Appointments -->
    <div v-if="next === 1">
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
              ]"
            >
              <div class="p-4">
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
          errorMessages.finalDate || '&nbsp;'
        }}</small>
      </div>
      <CustomButton name="Back" type="button" @click="next--" />
      <CustomButton name="Next" type="button" @click="handleNext()" />
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
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ArrowLeft, Eye } from 'lucide-vue-next'
import Calendar from 'primevue/calendar'
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
  appointmentsIds: yup.array().required(),
  employeesIds: yup.array().required(),
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
})

// create form
const { resetForm, defineComponentBinds, errors, values, validate } = useForm({
  validationSchema: schema,
})

const finalDate = defineComponentBinds('finalDate')
const appointmentsIds = defineComponentBinds('appointmentsIds')
const employeesIds = defineComponentBinds('employeesIds')
const materialsIds = defineComponentBinds('materialsIds')

const next = ref(0)

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
  { date: '' },
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
  if (next.value === 0) {
    await validate()
    errorMessages.value.finalDate = errors.value.finalDate
    if (!errors.value.finalDate) {
      console.log('final date', formatDateTime(values.finalDate))
      refetchAppointments({ date: formatDateTime(values.finalDate) })
      next.value++
    }
  } else if (next.value === 1) {
    if (values.appointmentsIds) {
      next.value++
    } else {
      showToast('error', 'Error', 'Please select at least one appointment')
    }
  }
}

watchEffect(() => {
  // log the queries
  if (appointments.value) console.log(appointments.value)

  // all errors
  const errors = [errorCreateSchedule.value, errorAppointments.value]
  errors.forEach(error => {
    if (error) {
      loadingCreate.value = false
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

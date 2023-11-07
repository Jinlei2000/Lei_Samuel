<template>
  <div class="m-auto max-w-7xl">
    <div class="mb-3 mt-12 flex items-center gap-4">
      <!-- go back button -->
      <button @click="$router.go(-1)" v-bind="$attrs">
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="text-2xl">Nieuwe afspraak maken</h1>
    </div>
    <div class="flex gap-3">
      <div class="flex w-1/3 flex-col gap-12">
        <div class="flex w-full flex-col gap-3 rounded-2xl bg-gray-200 p-3">
          <div
            v-if="allLocations && allLocations.locationsByUserId"
            v-for="location of allLocations.locationsByUserId"
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
        <div>
          <h2 class="text-xl opacity-80">Reeds gemaakte afspraken</h2>
        </div>
      </div>
      <div
        class="flex min-h-[300px] w-2/3 flex-col gap-6 rounded-2xl bg-gray-200 px-3 pb-3 pt-6"
      >
        <div class="flex flex-col gap-3">
          <label for="" class="text-xl">Type afspraak</label>
          <select
            v-model="appointmentType"
            class="w-fit rounded bg-gray-400 p-3"
            name=""
            id=""
          >
            <option value="" disabled selected>Selecteer een type</option>
            <option value="Maintenance">Onderhoud</option>
            <option value="Repair">Herstelling</option>
            <option value="Other">Andere</option>
          </select>
        </div>
        <div class="flex flex-col gap-3">
          <label for="" class="text-xl">Omschrijving</label>
          <textarea
            v-model="description"
            class="rounded bg-gray-400 p-3"
            name=""
            id=""
            rows="5"
          ></textarea>
        </div>
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
              showIcon
              :pt="{
                root: { class: 'w-1/3' },
                input: { class: 'h-fit p-3 bg-gray-400' },
              }"
              :minDate="minDate"
              dateFormat="yy-mm-dd"
            >
              <template #dropdownicon>
                <CalendarIcon class="h-5 w-5 text-black" />
              </template>
            </Calendar>
            <img src="../../../public/assets/doubleArrow.svg" />
            <Calendar
              v-model="endProposedDate"
              showIcon
              :pt="{
                root: { class: 'w-1/3' },
                input: { class: 'w-5/6 h-fit p-3 bg-gray-400' },
              }"
              :minDate="startProposedDate"
              dateFormat="yy-mm-dd"
            >
              <template #dropdownicon>
                <CalendarIcon class="h-5 w-5 text-black" />
              </template>
            </Calendar>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            @click="handleFormSubmit"
            class="bg-primary-green hover:outline-primary-green hover:text-primary-green relative rounded px-4 py-2 text-white transition-all hover:cursor-pointer hover:bg-transparent hover:outline"
          >
            <div :class="submitting ? 'invisible' : ''">Afspraak maken</div>
            <div
              v-if="submitting"
              class="rotate absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Loader2 class="animate-spin" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { Check, Loader2 } from 'lucide-vue-next'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import * as yup from 'yup'
import { useMutation } from '@vue/apollo-composable'
import type { Appointment } from '@/interfaces/appointment.user.interface'
import { CREATE_APPOINTMENT } from '@/graphql/appointment.mutation'
import useFirebase from '@/composables/useFirebase'
import useCustomUser from '@/composables/useCustomUser'
import { GET_LOCATIONS_BY_USERID } from '@/graphql/location.query'
import { watch } from 'fs'
import { useForm } from 'vee-validate'
import useTimeUtilities from '@/composables/useTimeUtilities'
import useCustomToast from '@/composables/useCustomToast'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

// composables
const { firebaseUser } = useFirebase()
const { customUser } = useCustomUser()
const { replace } = useRouter()
const { mutate: addAppointment, error: addAppointmentError } =
  useMutation<Appointment>(CREATE_APPOINTMENT)
const { formatDateTime } = useTimeUtilities()
const { showToast } = useCustomToast()

firebaseUser.value?.getIdToken().then(token => {
  console.log(`{"Authorization": "Bearer ${token}"}`)
})

// watch(addAppointmentError, () => {
//   if (!addAppointmentError.value) return
//   errorRegister.value = "Couldn't create appointment."
// })

// const schema = yup.object({
//   startProposedDate: yup.date().required(),
//   endProposedDate: yup.date().required(),
//   description: yup.string(),
//   appointmentType: yup.string().required(),
// })

// const { resetForm, defineComponentBinds, errors, values, validate } = useForm({
//   validationSchema: schema,
// })

// const startProposedDate = defineComponentBinds('startProposedDate')
// const endProposedDate = defineComponentBinds('endProposedDate')
// const description = defineComponentBinds('description')
// const appointmentType = defineComponentBinds('appointmentType')
const errorRegister = ref<string | null>(null)
const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  startProposedDate: '',
  endProposedDate: '',
  description: '',
  appointmentType: '',
})
const createAppointmentLoading = ref(false)

const {
  result: allLocations,
  loading,
  error,
} = useQuery(GET_LOCATIONS_BY_USERID, () => ({
  userId: customUser.value?.id,
}))

// Waiting for query to finish
const submitting = ref(false)

// Form values
const appointmentType = ref<string>('')
const description = ref<any | null>(null)
const startProposedDate = ref<any>(null)
const endProposedDate = ref<any>(null)
const selectedLocation = ref(allLocations.value?.locationsByUserId[0])

// Automatically select first location
watchEffect(() => {
  selectedLocation.value = allLocations.value?.locationsByUserId[0]
})

// Reset form
const resetForm = () => {
  appointmentType.value = ''
  description.value = null
  startProposedDate.value = null
  endProposedDate.value = null
  selectedLocation.value = allLocations.value?.locationsByUserId[0]
}

const handleFormSubmit = async () => {
  submitting.value = true
  // createAppointmentLoading.value = true
  // await validate()
  // errorMessages.value = errors.value
  // errorRegister.value = null
  // console.log(values)
  // if (Object.keys(errors.value).length === 0) {
  await addAppointment({
    input: {
      userId: customUser.value?.id,
      locationId: selectedLocation.value?.id,
      type: appointmentType.value,
      startProposedDate: formatDateTime(startProposedDate.value.toString()),
      endProposedDate: formatDateTime(endProposedDate.value.toString()),
      isDone: false,
      description: description.value,
      priority: false,
    },
  }).then(() => {
    showToast('success', 'Success', 'Afspraak is gemaakt')
    resetForm()
    replace('/client/appointments')
  })
  submitting.value = false
  // await addAppointment(appointment)
}

watchEffect(() => {
  const errors = [addAppointmentError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})

console.log(selectedLocation.value)

const minDate = new Date()
</script>

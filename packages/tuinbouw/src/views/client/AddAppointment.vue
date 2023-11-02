<template>
  <div class="max-w-7xl m-auto">
    <h1 class="mt-12 mb-3 text-2xl">
      Nieuwe afspraak maken
    </h1>
    <div class="flex gap-3">
      <div class="flex flex-col w-1/3 gap-12">
        <div class="bg-gray-200 flex flex-col p-3 rounded-2xl w-full gap-3">
          <div
            v-if="allLocations && allLocations.locationsByUserId"
            v-for="location of allLocations.locationsByUserId"
            class="flex p-3 rounded w-full items-center hover:bg-primary-green hover:outline-primary-green hover:bg-opacity-10 hover:outline hover:cursor-pointer relative"
            :class="{
              'bg-primary-green outline-primary-green bg-opacity-10 outline': selectedLocation === location,
            }"
            @click="selectedLocation = location"
            >
            <h3 class="text-lg w-1/5">Home</h3>
            <p>{{ location.address }}</p>
            <div v-if="selectedLocation == location" class="bg-primary-green rounded-full p-[2px] absolute top-4 right-4">
              <Check :size="16" class="text-white" />
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-xl opacity-80">
            Reeds gemaakte afspraken
          </h2>
        </div>
      </div>
      <div class="flex flex-col min-h-[300px] w-2/3 bg-gray-200 rounded-2xl pt-6 pb-3 px-3 gap-6">
        <div class="flex flex-col gap-3">
          <label for="" class="text-xl">Type afspraak</label>
          <select v-bind="appointmentType" class="bg-gray-400 rounded w-fit p-3" name="" id="">
            <option value="" disabled selected>Selecteer een type</option>
            <option value="Maintenance">Onderhoud</option>
            <option value="Repair">Herstelling</option>
          </select>
        </div>
        <div class="flex flex-col gap-3">
          <label for="" class="text-xl">Omschrijving</label>
          <textarea v-bind="description" class="bg-gray-400 rounded p-3" name="" id="" rows="5"></textarea>
        </div>
        <div class="w-full flex flex-col gap-3">
          <div class="flex flex-col gap-2">
            <label for="" class="text-xl">Kies een moment</label>
            <p class="max-w-xs">We plannen de afspraak in tussen de data die je gekozen hebt</p>
          </div>
          <div class="w-full flex justify-between items-center">
            <!-- TODO: fix styling -->
            <Calendar
              v-bind="startProposedDate"
              showIcon
              :pt="{
                  input: { class: 'w-1/3 h-fit p-3 bg-gray-400' },
                  dropdownButton: {
                      root: { class: 'bg-gray-400 h-fit p-3' }
                  }
              }"
              :minDate="minDate"
              dateFormat="yy-mm-dd"
            />
            <img src="../../../public/assets/doubleArrow.svg">
            <Calendar 
              v-bind="endProposedDate"
              showIcon
              :pt="{
                  input: { class: 'w-1/3 h-fit p-3 bg-gray-400' },
                  dropdownButton: {
                      root: { class: 'bg-gray-400 h-fit p-3' }
                  }
              }"
              :minDate="startProposedDate.value"
              dateFormat="yy-mm-dd"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="handleFormSubmit" class="px-4 py-2 bg-primary-green rounded text-white hover:cursor-pointer hover:outline hover:outline-primary-green hover:bg-transparent hover:text-primary-green transition-all">Afspraak maken</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable'
import { Check } from 'lucide-vue-next'
import * as yup from 'yup'
import { useMutation } from '@vue/apollo-composable'
import type { Appointment } from '@/interfaces/appointment.user.interface';
import { CREATE_APPOINTMENT } from '@/graphql/appointment.mutation'
import useFirebase from '@/composables/useFirebase'
import useCustomUser from '@/composables/useCustomUser'
import {
  GET_LOCATIONS_BY_USERID,
} from '@/graphql/location.query'
import { watch } from 'fs';
import { useForm } from 'vee-validate';
import useTimeUtilities from '@/composables/useTimeUtilities';
import useCustomToast from '@/composables/useCustomToast';


// composables
const { firebaseUser } = useFirebase()
const { customUser } = useCustomUser()
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

const schema = yup.object({
  startProposedDate: yup.date().required(),
  endProposedDate: yup.date().required(),
  description: yup.string(),
  appointmentType: yup.string().required(),
})

const { resetForm, defineComponentBinds, errors, values, validate } = useForm({
  validationSchema: schema,
})

const startProposedDate = defineComponentBinds('startProposedDate')
const endProposedDate = defineComponentBinds('endProposedDate')
const description = defineComponentBinds('description')
const appointmentType = defineComponentBinds('appointmentType')
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
})
)

const selectedLocation = ref(allLocations.value?.locationsByUserId[0])

// Automatically select first location
watchEffect(() => {
  selectedLocation.value = allLocations.value?.locationsByUserId[0]
})

const handleFormSubmit = async () => {
  createAppointmentLoading.value = true
  await validate()
  errorMessages.value = errors.value
  errorRegister.value = null
  console.log(values.value)
  if (Object.keys(errors.value).length === 0) {
    await addAppointment({
      input: {
        userId: customUser.value?.id,
        locationId: selectedLocation.value?.id,
        type: values.appointmentType,
        startProposedDate: formatDateTime(values.startProposedDate.toString()),
        endProposedDate: formatDateTime(values.endProposedDate.toString()),
        isDone: false,
        description: values.description,
        priority: false,
      },
    }).then(() => {
      console.log('register success')
      resetForm()
    })
  }
  loading.value = false
  // await addAppointment(appointment)
}

watchEffect(() => {
  const errors = [
    addAppointmentError.value,
  ]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})





console.log(selectedLocation.value)

const minDate = new Date()


</script>

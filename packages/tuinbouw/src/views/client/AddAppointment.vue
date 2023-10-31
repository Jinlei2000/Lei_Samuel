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
          <select class="bg-gray-400 rounded w-fit p-3" name="" id="">
            <option value="" disabled selected>Selecteer een type</option>
            <option value="">Onderhoud</option>
            <option value="">Herstelling</option>
            <option value="">Nieuwe installatie</option>
          </select>
        </div>
        <div class="flex flex-col gap-3">
          <label for="" class="text-xl">Omschrijving</label>
          <textarea class="bg-gray-400 rounded p-3" name="" id="" rows="5"></textarea>
        </div>
        <div class="w-full flex flex-col gap-3">
          <div class="flex flex-col gap-2">
            <label for="" class="text-xl">Kies een moment</label>
            <p class="max-w-xs">We plannen de afspraak in tussen de data die je gekozen hebt</p>
          </div>
          <div class="w-full flex justify-between items-center">
            <Calendar
              v-model="startDate"
              showIcon
              :pt="{
                  input: { class: 'w-1/3 h-fit p-3 bg-gray-400' },
                  dropdownButton: {
                      root: { class: 'bg-gray-400 h-fit p-3' }
                  }
              }"
            />
            <img src="../../../public/assets/doubleArrow.svg">
            <Calendar 
              v-model="endDate"
              showIcon
              :pt="{
                  input: { class: 'w-1/3 h-fit p-3 bg-gray-400' },
                  dropdownButton: {
                      root: { class: 'bg-gray-400 h-fit p-3' }
                  }
              }"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button class="px-4 py-2 bg-primary-green rounded text-white">Afspraak maken</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable'
import { Check } from 'lucide-vue-next'
import useFirebase from '@/composables/useFirebase'
import useCustomUser from '@/composables/useCustomUser'
import {
  GET_LOCATIONS,
} from '@/graphql/location.query'

const { firebaseUser } = useFirebase()
const { customUser } = useCustomUser()

const startDate = ref(new Date())
const endDate = ref(new Date())

firebaseUser.value?.getIdToken().then(token => {
  console.log(`{"Authorization": "Bearer ${token}"}`)
})

const {
  result: allLocations,
  loading,
  error,
} = useQuery(GET_LOCATIONS, () => ({
  userId: customUser.value?.id,
})
)

const selectedLocation = ref(allLocations.value?.locationsByUserId[0])
watchEffect(() => {
  selectedLocation.value = allLocations.value?.locationsByUserId[0]
})



console.log(selectedLocation.value)


</script>

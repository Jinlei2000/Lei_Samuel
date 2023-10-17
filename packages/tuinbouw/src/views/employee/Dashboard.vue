<template>
  <div class="flex flex-col items-center justify-center">
    <h1
      class="text-transparent text-3xl font-extrabold md:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
    >
      Dashboard
    </h1>
    <div class="grid grid-cols-4 mx-32 gap-3">
      <div class="col-start-1 col-span-1">
        <h2 class="mb-3 text-2xl">Next Client</h2>
        <!-- for each client -->
        <div class="flex flex-col" v-for="(item, index) in clients">
          <AppointmentCard
            v-if="index === 0"
            :title="item.name"
            :description="item.description"
            :type="item.type"
          />
        </div>
        <div class="flex justify-between items-center mb-3 mt-6">
          <h2 class="text-2xl">Schedule</h2>
          <button class="flex text-base text-primary-orange">
            Calendar <ChevronRight stroke-width="1" />
          </button>
        </div>

        <div
          class="bg-gray-500 p-1 flex justify-between items-center rounded-2xl mb-3"
        >
          <button
            class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
          >
            <ArrowLeft @click="prevDay" class="text-white" />
          </button>
          <p class="">{{ dateDisplay }}</p>
          <button
            class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
          >
            <ArrowRight @click="nextDay" class="text-white" />
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <template v-for="(item, index) in clients">
            <AppointmentCard
              v-if="
                index !== 0 &&
                item.date.substring(0, 10) ===
                  myDate.toISOString().substring(0, 10)
              "
              :title="item.name"
              :description="item.description"
              :type="item.type"
            />
          </template>
        </div>
        <!-- <AppointmentCard
          title="Mr. Johnsson"
          description="Dit is een afspraak voor het snoeien van een berk."
          type="inspection"
        /> -->
      </div>
      <div class="col-span-2 col-start-2">
        <h2 class="mb-3 text-2xl">Weather</h2>
        <div class="bg-gray-200 rounded-2xl px-5 py-3">test</div>
      </div>
      <div class="col-span-1 col-start-4">
        <h2 class="mb-3 text-2xl">Tools for the day</h2>
        <ChecklistItem />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import ChecklistItem from '@/components/generic/ChecklistItem.vue'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-vue-next'
import { ref, watch } from 'vue'

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const myDate = ref(new Date())
const dateDisplay = ref('Today')

// nextday function
function nextDay() {
  const currentDate = myDate.value
  const nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1))
  myDate.value = nextDay
}

function prevDay() {
  const currentDate = myDate.value
  const prevDay = new Date(currentDate.setDate(currentDate.getDate() - 1))
  myDate.value = prevDay
}

// @ts-ignore
watch(myDate, () => {
  switch (myDate.value.getDate()) {
    case new Date().getDate():
      dateDisplay.value = 'Today'
      break
    case new Date().getDate() + 1:
      dateDisplay.value = 'Tomorrow'
      break
    case new Date().getDate() - 1:
      dateDisplay.value = 'Yesterday'
      break
    default:
      dateDisplay.value =
        days[myDate.value.getDay()] +
        ' (' +
        myDate.value.getDate() +
        '/' +
        myDate.value.getMonth() +
        ')'
      break
  }
})

const clients = [
  {
    name: 'Appointment 1',
    date: '2023-10-13T00:00:00.000Z',
    location: 'Room A',
    description: '2 berken snoeien',
    type: 'repair',
  },
  {
    name: 'Appointment 2',
    date: '2023-10-13T00:00:00.000Z',
    location: 'Room B',
    description: 'Grasveld maaien',
    type: 'maintenance',
  },
  {
    name: 'Appointment 3',
    date: '2023-10-12T00:00:00.000Z',
    location: 'Room C',
    description: 'Onderhoud aan zwemvijver',
    type: 'maintenance',
  },
  {
    name: 'Appointment 4',
    date: '2023-10-13T00:00:00.000Z',
    location: 'Room D',
    description: 'Beplanting aanleggen',
    type: 'inspection',
  },
  {
    name: 'Appointment 5',
    date: '2023-10-13T00:00:00.000Z',
    location: 'Room D',
    description: 'Beplanting aanleggen',
    type: 'inspection',
  },
]
</script>

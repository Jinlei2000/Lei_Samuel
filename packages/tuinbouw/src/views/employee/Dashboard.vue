<template>
  <div class="flex flex-col items-center justify-center">
    <h1
      class="text-transparent text-3xl font-extrabold md:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
    >
      Dashboard
    </h1>
    <div class="grid grid-cols-4 mx-32">
      <div class="col-start-1 col-span-1">
        <h2 class="mb-3 text-2xl">Next Client</h2>
        <!-- for each client -->
        <div class="flex flex-col gap-3">
          <AppointmentCard
            v-for="item in clients"
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
          class="bg-gray-500 p-1 flex justify-between items-center rounded-2xl"
        >
          <button
            class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
          >
            <ArrowLeft class="text-white" />
          </button>
          <p class="">Today</p>
          <button
            class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
          >
            <ArrowRight class="text-white" />
          </button>
        </div>
        <!-- <AppointmentCard
          title="Mr. Johnsson"
          description="Dit is een afspraak voor het snoeien van een berk."
          type="inspection"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-vue-next'

const clients = [
  {
    name: 'Appointment 1',
    date: '2023-09-27T00:00:00.000Z',
    location: 'Room A',
    description: '2 berken snoeien',
    type: 'repair',
  },
  {
    name: 'Appointment 2',
    date: '2023-09-28T00:00:00.000Z',
    location: 'Room B',
    description: 'Grasveld maaien',
    type: 'maintenance',
  },
  {
    name: 'Appointment 3',
    date: '2023-09-29T00:00:00.000Z',
    location: 'Room C',
    description: 'Onderhoud aan zwemvijver',
    type: 'maintenance',
  },
  {
    name: 'Appointment 4',
    date: '2023-09-30T00:00:00.000Z',
    location: 'Room D',
    description: 'Beplanting aanleggen',
    type: 'inspection',
  },
]
</script>

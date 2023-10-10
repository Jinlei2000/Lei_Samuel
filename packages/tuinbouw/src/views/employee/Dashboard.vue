<template>
  <div class="flex flex-col items-center justify-center">
    <h1
      class="text-transparent text-3xl font-extrabold md:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
    >
      Dashboard
    </h1>
    <AppointmentCard
      title="Mr. Johnsson"
      description="Dit is een afspraak voor het snoeien van een berk."
      type="inspection"
    />
  </div>
</template>

<script setup lang="ts">
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
</script>

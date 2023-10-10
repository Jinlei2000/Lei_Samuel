<template>
  <div class="min-h-screen flex items-center justify-center">
    <h1
      class="text-transparent text-3xl font-extrabold md:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
    >
      Dashboard
    </h1>
    <AppointmentCard />
  </div>
</template>

<script setup lang="ts">
import AppointmentCard from '@/components/generic/AppointmentCard.vue'
</script>

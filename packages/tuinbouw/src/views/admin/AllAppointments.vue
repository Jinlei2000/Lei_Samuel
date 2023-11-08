<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <h1
        class="mb-4 bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
      >
        AllAppointments
      </h1>

      <!-- list of 10 buttons -->
      <RouterLink
        v-for="i in 5"
        class="focus:shadow-outline-red mr-2 mt-4 rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 hover:bg-red-700 focus:outline-none active:bg-red-600"
        :to="`/admin/appointment/${i}`"
      >
        {{ i }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

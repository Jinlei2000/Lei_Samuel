<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1
        class="text-transparent mb-4 text-3xl font-extrabold md:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
      >
        AllAppointments
      </h1>

      <!-- list of 10 buttons -->
      <RouterLink
        v-for="i in 5"
        class="mt-4 mr-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
        :to="`/admin/appointment/${i}`"
      >
        {{ i }}
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    return {}
  },
}
</script>

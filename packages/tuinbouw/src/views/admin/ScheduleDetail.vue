<template>
  <!-- go back button -->
  <button class="mt-20 flex" @click="$router.go(-1)" v-bind="$attrs">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>

  <!-- go to edit page -->
  <!-- TODO: add id of the schedule & show only if finalDate is in future -->
  <Router-link to="/admin/schedules/edit/465">
    <button class="mt-20 flex">
      <Pencil class="h-6 w-6" />
    </button>
  </Router-link>

  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Schedules Detail
  </h1>

  <!-- can only edit if not in the past & today cant not edit -->
</template>

<script setup lang="ts">
import { ArrowLeft, Pencil } from 'lucide-vue-next'
</script>

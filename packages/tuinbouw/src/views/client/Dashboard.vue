<template>
  <div class="flex min-h-full flex-col items-center justify-center">
    <h1
      class="mb-5 bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
    >
      Dashboard
    </h1>
    <!-- make a list of buttons go to the right page -->
    <div class="flex gap-2">
      <Router-link
        v-for="b in ['add-appointment', 'appointments']"
        class="focus:shadow-outline-red mt-4 rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 hover:bg-red-700 focus:outline-none active:bg-red-600"
        :to="`/client/${b}`"
        >{{ b }}</Router-link
      >
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

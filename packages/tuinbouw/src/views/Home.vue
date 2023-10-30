<template>
  <div class="flex min-h-screen flex-col">
    <!-- Header -->
    <header
      class="flex items-center justify-between bg-green-600 p-4 text-white"
    >
      <div>
        <span class="text-xl font-semibold tracking-tight"
          >Your App Name Or Logo</span
        >
      </div>
      <RouterLink to="/auth/login" class="">
        <button
          class="rounded-full bg-white px-4 py-2 font-semibold text-green-600"
        >
          Login
        </button>
      </RouterLink>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4">
      <div class="rounded-lg bg-white p-8 shadow-lg">
        <h1 class="mb-4 text-3xl font-semibold">
          Welcome to your horticultural company🏡🧑‍🌾
        </h1>
        <p class="text-gray-600">Please log in to continue:</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-green-600 p-4 text-center text-white">
      &copy; 2023 Your App Name
    </footer>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    return {}
  },
}
</script>

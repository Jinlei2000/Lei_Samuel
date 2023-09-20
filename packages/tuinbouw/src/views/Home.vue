<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header
      class="bg-green-600 text-white p-4 flex items-center justify-between"
    >
      <div>
        <span class="font-semibold text-xl tracking-tight"
          >Your App Name Or Logo</span
        >
      </div>
      <RouterLink to="/auth/login" class="">
        <button
          class="bg-white text-green-600 font-semibold px-4 py-2 rounded-full"
        >
          Login
        </button>
      </RouterLink>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4">
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-3xl font-semibold mb-4">
          Welcome to your horticultural company🏡🧑‍🌾
        </h1>
        <p class="text-gray-600">Please log in to continue:</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-green-600 text-white p-4 text-center">
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

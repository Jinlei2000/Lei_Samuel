<template>
  <div class="flex max-w-7xl m-auto flex-col">
    

    <!-- Main Content -->
    <main class="flex mt-52 gap-24 items-center">
      <div class="w-3/5">
        <img src="/assets/homepage/hero-image.png" alt="logo" class="rounded-2xl" />
      </div>
      <div class="flex flex-col gap-6 w-2/5">
        <h1 class="mb-4 text-6xl font-light">
          Welkom bij Tuinbouw
        </h1>
        <p class="text-gray-900 max-w-">
          Uw vertrouwde partner in tuinbouw. Ontdek onze hoogwaardige tuinbouwproducten en -diensten, ontworpen om uw groene projecten te laten bloeien. Met onze expertise en focus op duurzaamheid streven we ernaar om uw tuinbouwdoelen te realiseren.
        </p>
        <router-link to="/auth/login" class="bg-primary-orange text-white py-2 px-4 rounded-lg w-fit">
          Begin nu
        </router-link>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    return {}
  },
}
</script>

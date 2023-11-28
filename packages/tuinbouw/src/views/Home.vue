<template>
  <div class="m-auto flex max-w-7xl flex-col">
    <!-- Main Content -->
    <main class="mt-52 flex items-center gap-24">
      <div class="w-3/5">
        <img
          src="/assets/homepage/hero-image.png"
          alt="logo"
          class="rounded-2xl"
        />
      </div>
      <div class="flex w-2/5 flex-col gap-6">
        <h1 class="mb-4 text-6xl font-light">Welkom bij Tuinbouw</h1>
        <p class="max-w- text-gray-900">
          Uw vertrouwde partner in tuinbouw. Ontdek onze hoogwaardige
          tuinbouwproducten en -diensten, ontworpen om uw groene projecten te
          laten bloeien. Met onze expertise en focus op duurzaamheid streven we
          ernaar om uw tuinbouwdoelen te realiseren.
        </p>
        <router-link
          to="/auth/login"
          class="bg-primary-orange w-fit rounded-lg px-4 py-2 text-white"
        >
          Begin nu
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<template>
  <div class="m-auto flex max-w-7xl flex-col">
    <main
      class="mt-24 flex flex-col-reverse items-center gap-6 md:mt-52 md:flex-row md:gap-12 lg:gap-24"
    >
      <div class="w-full md:w-3/5">
        <img
          src="/assets/homepage/hero-image.png"
          alt="logo"
          class="rounded-2xl"
        />
      </div>
      <div class="flex w-4/5 flex-col items-center gap-6 md:w-2/5">
        <h1 class="mb-4 text-center text-6xl font-light md:text-left">
          {{ $t('home.title') }}
        </h1>
        <p class="text-center text-gray-900 md:text-left">
          {{ $t('home.description') }}
        </p>
        <router-link
          to="/auth/login"
          class="bg-primary-orange hidden w-fit rounded-lg px-4 py-2 text-white md:block"
        >
          {{ $t('home.start') }}
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

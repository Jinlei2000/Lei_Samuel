<!-- TODO: make better design -->
<template>
  <div
    class="flex h-screen w-screen flex-col items-center justify-center gap-12 py-8"
  >
    <img class="h-80 w-80" src="/assets/forbidden.svg" alt="Forbidden" />
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-center text-3xl font-medium">You are not authorized</h1>
      <p class="text-center text-xl">
        You tried to access a page you did not have prior authorization for.
      </p>
      <router-link to="/auth/login" class="text-blue-500 underline"
        >Back</router-link
      >
    </div>
  </div>
</template>

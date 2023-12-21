<template>
  <!-- TODO: redesign page -->
  <section class="bg-white dark:bg-gray-900">
    <div class="container mx-auto flex min-h-screen items-center px-6 py-12">
      <div class="mx-auto flex max-w-sm flex-col items-center text-center">
        <img
          class="h-80 w-80"
          src="/assets/not-found.svg"
          alt="Page not found"
        />
        <h1 class="mt-3 text-2xl font-semibold dark:text-white md:text-3xl">
          Page not found
        </h1>
        <p class="mt-4 text-gray-900 dark:text-gray-400">
          The page you are looking for doesn't exist. Here are some helpful
          links:
        </p>

        <div class="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
          <RouterLink
            to="/"
            class="bg-primary-green w-1/2 shrink-0 rounded-lg px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 sm:w-auto"
          >
            Take me home
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

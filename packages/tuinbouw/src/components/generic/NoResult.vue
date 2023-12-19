<template>
  <section class="flex flex-col items-center justify-center gap-5">
    <img
      class="h-80 w-80"
      src="/assets/empty.svg"
      alt="Empty results illustration"
    />
    <h2 class="text-2xl">{{ $t('no.result.text') }}</h2>
  </section>
</template>

<script setup lang="ts"></script>

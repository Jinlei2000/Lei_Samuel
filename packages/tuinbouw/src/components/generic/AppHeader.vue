<template>
  <Container
    class="py-4 w-full bg-white backdrop-blur-2xl bg-opacity-50 fixed left-0"
  >
    <header class="flex items-center justify-between max-w-7xl m-auto">
      <RouterLink
        class="w-1/6 flex items-center space-x-4 focus:outline-none focus-visible:ring-4 ring-blue-400 hover:scale-105 transition-all rounded-lg"
        to="/"
      >
        <Logo />
      </RouterLink>
      <nav>
        <ul class="flex items-center justify-center">
          <li>
            <RouterLink
              class="rounded-full text-primary-green py-3 px-6 hover:text-gray-200 hover:bg-primary-green"
              active-class="text-gray-200! bg-primary-green"
              to="dashboard"
              >Dashboard</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="rounded-full text-primary-green py-3 px-6 hover:text-gray-200 hover:bg-primary-green"
              active-class="text-gray-200! bg-primary-green"
              to="/tuin"
              >Materials</RouterLink
            >
          </li>
        </ul>
      </nav>
      <div>
        <label class="block" for="language">Select Language</label>
        <select
          class="block mb-3"
          name="language"
          id="language"
          @change="setLanguage"
        >
          <option
            v-for="(value, key) in SUPPORTED_LOCALES"
            :key="key"
            :value="key"
            @change="setLanguage"
          >
            {{ value }}
          </option>
        </select>
      </div>
      <div class="w-1/6 flex justify-end">
        <RouterLink class="rounded-full" to="/profile">
          <img
            class="rounded-full w-12 h-12 hover:scale-105 transition-all"
            src="https://i.pravatar.cc/300"
            alt="Profile picture"
        /></RouterLink>
      </div></header
  ></Container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import Container from '../wrapper/Container.vue'
import Logo from '../Logo.vue'
import useLanguage from '@/composables/useLanguage'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
const { setLocale } = useLanguage()

const setLanguage = (e: Event) => {
  const target = e.target as HTMLSelectElement
  setLocale(target.value)
  console.log(target.value)
}

const user = ref<Object | null>(null)
</script>

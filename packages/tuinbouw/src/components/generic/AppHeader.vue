<template>
  <Container
    class="left-0 fixed top-0 z-50 w-full bg-white bg-opacity-50 py-4 backdrop-blur-2xl"
  >
    <header class="m-auto flex max-w-7xl items-center justify-between">
      <RouterLink
        class="flex w-1/6 items-center space-x-4 rounded-lg ring-blue-400 transition-all hover:scale-105 focus:outline-none focus-visible:ring-4"
        to="/"
      >
        <Logo />
      </RouterLink>
      <nav class="flex gap-24">
        <ul class="flex items-center justify-center gap-12">
          <li>
            <RouterLink
              class="hover:text-primary-orange py-1 text-black transition-all"
              active-class="border-b-[1px] border-black"
              :to="`/${role}/dashboard`"
              >Dashboard</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="hover:text-primary-orange py-1 text-black transition-all"
              active-class=" border-b-[1px] border-black"
              :to="`/${role}/materials`"
              >Materials</RouterLink
            >
          </li>
          <li class="border-l-[1px] border-black py-2 pl-12">
            <select
              class="block bg-transparent hover:cursor-pointer"
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
          </li>
        </ul>
        <div class="flex w-1/6 justify-end">
          <RouterLink class="rounded-full" to="/profile">
            <img
              class="h-12 w-12 rounded-full transition-all hover:scale-105"
              src="https://i.pravatar.cc/300"
              alt="Profile picture"
          /></RouterLink>
        </div>
      </nav></header
  ></Container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import Container from '../wrapper/Container.vue'
import Logo from '../Logo.vue'
import useLanguage from '@/composables/useLanguage'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import useCustomUser from '@/composables/useCustomUser'
const { setLocale } = useLanguage()

const { customUser } = useCustomUser()

const role = customUser.value?.role.toLowerCase()

const setLanguage = (e: Event) => {
  const target = e.target as HTMLSelectElement
  setLocale(target.value)
  console.log(target.value)
}

const user = ref<Object | null>(null)
</script>

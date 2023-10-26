<template>
  <Container
    class="py-4 w-full bg-white backdrop-blur-2xl bg-opacity-50 fixed left-0 top-0 z-50"
  >
    <header class="flex items-center justify-between max-w-7xl m-auto">
      <RouterLink
        class="w-1/6 flex items-center space-x-4 focus:outline-none focus-visible:ring-4 ring-blue-400 hover:scale-105 transition-all rounded-lg"
        to="/"
      >
        <Logo />
      </RouterLink>
      <nav class="flex gap-24">
        <ul class="flex items-center justify-center gap-12">
          <li>
            <RouterLink
              class="text-black py-1 hover:text-primary-orange transition-all"
              active-class="border-b-[1px] border-black"
              :to="`/${role}/dashboard`"
              >Dashboard</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="text-black py-1 hover:text-primary-orange transition-all"
              active-class=" border-b-[1px] border-black"
              :to="`/${role}/materials`"
              >Materials</RouterLink
            >
          </li>
          <li class="pl-6 py-2 border-l-[1px] border-black">
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
        <div class="w-1/6 flex justify-end">
          <RouterLink class="rounded-full" to="/profile">
            <img
              class="rounded-full w-12 h-12 hover:scale-105 transition-all"
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

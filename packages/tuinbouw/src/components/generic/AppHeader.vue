<template>
  <div class="h-[80px]">
  </div>
  <Container
    class="fixed left-0 top-0 z-50 w-full bg-white bg-opacity-50 py-4 backdrop-blur-2xl"
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
          <div v-if="user" class="flex items-center justify-center gap-12">
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
                :to="`/${role}/users`"
                >Users</RouterLink>
            </li>
            <li>
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/appointments`"
                >Appointments</RouterLink
              >
            </li>
            <li>
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/schedules`"
                >Schedules</RouterLink
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
          </div>
          <li :class="user ? 'border-l-[1px]' : ''" class="border-black py-2 pl-12">
            <select
              class="block bg-transparent hover:cursor-pointer"
              name="language"
              id="language"
              @change="setLanguage"
              v-model="locale"
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
        <div v-if="user" class="flex w-1/6 justify-end relative">
          <div @click="showProfileDropdown()" class="hover:cursor-pointer">
            <img
              class="h-12 w-12 rounded-full"
              src="https://i.pravatar.cc/300"
              alt="Profile picture"
          /></div>
          <div v-if="profileDropdown" class="absolute -z-10">
            <div class="h-12 w-12 -z-50 rounded-full relative"></div>
            <div class="mt-3 pl-3 pr-6 py-3 border-black border-1 border-opacity-10 rounded-2xl flex flex-col gap-4 bg-gray-200">
              <button class="flex gap-3 hover:text-primary-green"><User /> Profile</button>
              <button @click="handleLogout()" class="flex gap-3 hover:text-primary-green"><LogOut /> Logout</button>
            </div>
          </div>
        </div>
        <button v-else class="px-4 py-2 bg-primary-green text-gray-200 rounded-md flex gap-2 hover:text-primary-green hover:bg-transparent hover:outline-primary-green hover:outline hover:outline-[1px]">Login<LogIn /></button>
      </nav></header
  ></Container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, LogOut, LogIn } from 'lucide-vue-next'
import useFirebase from '@/composables/useFirebase'
import router from '@/router'

import Container from '../wrapper/Container.vue'
import Logo from '../Logo.vue'
import useLanguage from '@/composables/useLanguage'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import useCustomUser from '@/composables/useCustomUser'

const { firebaseUser, logout } = useFirebase()

const { setLocale, locale } = useLanguage()

const { customUser } = useCustomUser()

const role = customUser.value?.role.toLowerCase()

const profileDropdown = ref(false)

const showProfileDropdown = () => {
  profileDropdown.value = !profileDropdown.value
  console.log(profileDropdown.value)
}

const setLanguage = (e: Event) => {
  const target = e.target as HTMLSelectElement
  setLocale(target.value)
  console.log(target.value)
}

const handleLogout = async () => {
  await logout()
  customUser.value = null
  // go to login page
  router.replace('/auth/login')
  console.log('logout')

  showProfileDropdown()
}

const user = ref<Object | null>(null)
</script>

<template>
  <div class="h-[80px]"></div>
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
          <div
            v-if="checkPath()"
            class="flex items-center justify-center gap-12"
          >
            <li v-if="role == 'admin' || role == 'employee'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class="border-b-[1px] border-black"
                :to="`/${role}/dashboard`"
                >Dashboard</RouterLink
              >
            </li>
            <li v-if="role == 'admin'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/users`"
                >Users</RouterLink
              >
            </li>
            <li v-if="role == 'admin'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/appointments`"
                >Appointments</RouterLink
              >
            </li>
            <li v-if="role == 'admin'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/schedules`"
                >Schedules</RouterLink
              >
            </li>
            <li v-if="role == 'admin' || role == 'employee'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/materials`"
                >Materials</RouterLink
              >
            </li>
            <li v-if="role == 'employee'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/calendar`"
                >Calendar</RouterLink
              >
            </li>
          </div>
          <li
            :class="checkPath() ? 'border-l-[1px]' : ''"
            class="border-black py-2 pl-12"
          >
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
        <div v-if="checkPath()" class="relative flex w-1/6 justify-end">
          <div @click="showProfileDropdown()" class="hover:cursor-pointer">
            <img
              class="h-12 w-12 rounded-full"
              src="https://i.pravatar.cc/300"
              alt="Profile picture"
            />
          </div>
          <div v-if="profileDropdown" class="absolute -z-10">
            <div class="relative -z-50 h-12 w-12 rounded-full"></div>
            <div
              class="border-1 mt-3 flex flex-col gap-4 rounded-2xl border-black border-opacity-10 bg-gray-200 py-3 pl-3 pr-6"
            >
              <Router-link :to="`/${role}/profile`">
                <button class="hover:text-primary-green flex gap-3" @click="showProfileDropdown()">
                  <User /> Profile
                </button>
              </Router-link>
              <Router-link
                v-if="role === 'employee' || role === 'admin'"
                :to="goToAbsences()"
              >
                <button class="hover:text-primary-green flex gap-3" @click="showProfileDropdown()">
                  <Hourglass /> Absences
                </button>
              </Router-link>
              <button
                @click="handleLogout()"
                class="hover:text-primary-green flex gap-3"
              >
                <LogOut /> Logout
              </button>
            </div>
          </div>
        </div>

        <RouterLink
          to="auth/login"
          v-if="$route.path === '/'"
          class="hover:text-primary-green bg-primary-green hover:outline-primary-green flex gap-2 rounded-md px-4 py-2 text-gray-200 hover:bg-transparent hover:outline hover:outline-[1px]"
          >Login<LogIn
        /></RouterLink>
      </nav></header
  ></Container>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { User, LogOut, LogIn, Hourglass } from 'lucide-vue-next'
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

const { currentRoute } = router

const role = ref('')

const profileDropdown = ref(false)

const showProfileDropdown = () => {
  profileDropdown.value = !profileDropdown.value
  // console.log(profileDropdown.value)
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

const checkPath = () => {
  const paths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/']
  const routePath = currentRoute.value.path

  if (customUser.value && !paths.includes(routePath)) {
    return true
  }

  return false
}

const goToAbsences = () => {
  let path = ''
  if (role.value === 'employee') path = '/employee/absences'
  else if (role.value === 'admin') path = '/admin/absences-own'

  return path
}

watchEffect(() => {
  if (customUser.value) {
    role.value = customUser.value.role.toLowerCase()
  }
})

const user = ref<Object | null>(null)
</script>

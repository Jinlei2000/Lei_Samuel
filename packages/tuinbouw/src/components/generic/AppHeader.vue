<template>
  <div class="h-[80px]"></div>
  <Container
    class="fixed left-0 top-0 z-50 w-full bg-white bg-opacity-50 px-3 py-4 backdrop-blur-2xl"
  >
    <header
      class="w-[calc(100% - 24px)] m-auto flex max-w-7xl items-center justify-between md:w-auto"
    >
      <RouterLink
        class="relative z-50 mr-6 flex w-fit items-center space-x-4 rounded-lg ring-blue-400 transition-all hover:scale-105 focus:outline-none focus-visible:ring-4"
        to="/"
      >
        <Logo />
      </RouterLink>
      <nav class="hidden w-full gap-12 md:flex xl:gap-24">
        <ul
          class="flex w-full items-center justify-between lg:justify-end lg:gap-12"
        >
          <div
            v-if="checkPath()"
            class="flex w-full items-center justify-end md:gap-6 lg:w-auto lg:justify-center lg:gap-12"
          >
            <li>
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class="border-b-[1px] border-black"
                :to="`/${role}/dashboard`"
                >{{ $t('navbar.dashboard') }}</RouterLink
              >
            </li>
            <li v-if="role == 'admin'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/users`"
                >{{ $t('navbar.users') }}</RouterLink
              >
            </li>
            <li v-if="role == 'admin'" class="relative">
              <div
                v-if="newAppointments > 0"
                class="bg-primary-green absolute -right-4 -top-3 flex h-5 w-5 items-center justify-center rounded-full"
              >
                <p class="text-sm font-normal text-white">
                  {{ newAppointments }}
                </p>
              </div>
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/appointments`"
                @click="newAppointments = 0"
                >{{ $t('navbar.appointments') }}</RouterLink
              >
            </li>
            <li v-if="role == 'admin'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/schedules`"
                >{{ $t('navbar.schedules') }}</RouterLink
              >
            </li>
            <li v-if="role == 'admin' || role == 'employee'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/materials`"
                >{{ $t('navbar.materials') }}</RouterLink
              >
            </li>
            <li v-if="role == 'employee'">
              <RouterLink
                class="hover:text-primary-orange py-1 text-black transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/calendar`"
                >{{ $t('navbar.calendar') }}</RouterLink
              >
            </li>
          </div>
          <li class="hidden border-l-[1px] border-black py-2 pl-12 lg:block">
            <select
              id="language"
              v-model="locale"
              class="block bg-transparent hover:cursor-pointer"
              name="language"
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
        <div v-if="checkPath()" class="relative flex min-w-fit justify-end">
          <button
            class="overflow-hidden rounded-full hover:cursor-pointer"
            @click="showProfileDropdown()"
          >
            <Avatar
              :user="customUser!"
              class="h-10 w-10 overflow-hidden rounded-full lg:h-12 lg:w-12"
            />
          </button>
          <div v-if="profileDropdown" class="absolute -z-10">
            <div class="relative -z-50 h-12 w-12 rounded-full"></div>
            <div
              class="border-1 mt-3 flex flex-col gap-4 rounded-2xl border-black border-opacity-10 bg-gray-200 py-3 pl-3 pr-6"
            >
              <Router-link :to="`/${role}/profile`">
                <button
                  class="hover:text-primary-green flex gap-3"
                  @click="showProfileDropdown()"
                >
                  <User />
                  <p>{{ $t('navbar.avatar.dropdown.profile') }}</p>
                </button>
              </Router-link>
              <button
                class="hover:text-primary-green flex gap-3 text-left"
                @click="handleLogout()"
              >
                <LogOut />
                <p class="whitespace-nowrap">
                  {{ $t('navbar.avatar.dropdown.logout') }}
                </p>
              </button>
            </div>
          </div>
        </div>
        <RouterLink
          v-if="!customUser"
          :to="`/auth/login`"
          class="hover:text-primary-green bg-primary-green hover:outline-primary-green flex gap-2 whitespace-nowrap rounded-md px-4 py-2 text-gray-200 hover:bg-transparent hover:outline hover:outline-[1px]"
          >{{ $t('navbar.login') }}<LogIn
        /></RouterLink>
      </nav>
      <RouterLink
        v-if="!customUser"
        :to="`/auth/login`"
        class="hover:text-primary-green bg-primary-green hover:outline-primary-green flex gap-2 rounded-md px-4 py-2 text-gray-200 hover:bg-transparent hover:outline hover:outline-[1px] md:hidden"
        >{{ $t('navbar.login') }}<LogIn
      /></RouterLink>
      <nav v-if="customUser" class="block md:hidden">
        <button
          class="relative z-50 flex items-center justify-center rounded-md text-black"
          @click="showMenu = !showMenu"
        >
          <Menu v-if="!showMenu" class="h-12 w-12" />
          <X v-else class="h-12 w-12" />
        </button>
        <div
          v-if="showMenu"
          class="absolute left-0 top-0 z-40 h-screen w-screen bg-white"
        >
          <div
            class="relative flex h-full flex-col items-end justify-center gap-12 px-6"
          >
            <div class="flex flex-col items-end justify-center gap-6 text-2xl">
              <RouterLink
                class="hover:text-primary-orange py-1 transition-all"
                active-class="border-b-[1px] border-black"
                :to="`/${role}/dashboard`"
                @click="showMenu = false"
                >{{ $t('navbar.dashboard') }}</RouterLink
              >
              <RouterLink
                v-if="role == 'admin'"
                class="hover:text-primary-orange py-1 transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/users`"
                @click="showMenu = false"
                >{{ $t('navbar.users') }}</RouterLink
              >
              <RouterLink
                v-if="role == 'admin'"
                class="hover:text-primary-orange py-1 transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/appointments`"
                @click="showMenu = false"
                >{{ $t('navbar.appointments') }}</RouterLink
              >
              <RouterLink
                v-if="role == 'admin'"
                class="hover:text-primary-orange py-1transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/schedules`"
                @click="showMenu = false"
                >{{ $t('navbar.schedules') }}</RouterLink
              >
              <RouterLink
                v-if="role == 'admin' || role == 'employee'"
                class="hover:text-primary-orange py-1 transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/materials`"
                @click="showMenu = false"
                >{{ $t('navbar.materials') }}</RouterLink
              >
              <RouterLink
                v-if="role == 'employee'"
                class="hover:text-primary-orange py-1 transition-all"
                active-class=" border-b-[1px] border-black"
                :to="`/${role}/calendar`"
                @click="showMenu = false"
                >{{ $t('navbar.calendar') }}</RouterLink
              >
              <Router-link :to="`/${role}/profile`">
                <button
                  class="hover:text-primary-green flex items-center gap-3"
                  @click="showMenu = false"
                >
                  <User class="h-7 w-7" />
                  {{ $t('navbar.avatar.dropdown.profile') }}
                </button>
              </Router-link>
            </div>
            <div
              class="absolute bottom-3 left-0 flex w-full flex-col items-center justify-center px-3"
            >
              <button
                class="bg-primary-red flex w-full justify-center gap-3 rounded-xl py-3 text-white"
                @click="handleLogout()"
              >
                <LogOut /> {{ $t('navbar.avatar.dropdown.logout') }}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header></Container
  >
</template>

<script setup lang="ts">
import Logo from '../Logo.vue'
import Container from '../wrapper/Container.vue'
import Avatar from './Avatar.vue'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useLanguage from '@/composables/useLanguage'
import { APPOINTMENT_CREATED } from '@/graphql/appointment.subscription'
import router from '@/router'
import { useSubscription } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { LogIn, LogOut, Menu, User, X } from 'lucide-vue-next'
import { ref, watch, watchEffect } from 'vue'

// composable
const { logout } = useFirebase()
const { setLocale, locale } = useLanguage()
const { customUser } = useCustomUser()
const { currentRoute } = router
const { showToast } = useCustomToast()

// variables
const role = ref(customUser.value?.role.toLowerCase())
const profileDropdown = ref(false)
const newAppointments = ref(0)

// Mobile menu
const showMenu = ref(false)

// logics
const showProfileDropdown = (): void => {
  profileDropdown.value = !profileDropdown.value
  // console.log(profileDropdown.value)
}

const setLanguage = (e: Event): void => {
  const target = e.target as HTMLSelectElement
  setLocale(target.value)
  // console.log(target.value)
}

const handleLogout = async (): Promise<void> => {
  try {
    await logout()
    // go to login page
    router.replace('/auth/login')
    customUser.value = null
    // console.log('logout')
    showProfileDropdown()
    showMenu.value = false
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Can't logout")
  }
}

const checkPath = (): boolean => {
  const paths = ['/auth/login', '/auth/register', '/auth/forgot-password']
  const routePath = currentRoute.value.path

  if (customUser.value && !paths.includes(routePath)) {
    return true
  }

  if (routePath === '/admin/dashboard') {
    newAppointments.value = 0
  }

  return false
}

const { result: appointmentCreated } = useSubscription(APPOINTMENT_CREATED)

watch(appointmentCreated, (data: any) => {
  // console.log('New message received:', data)
  newAppointments.value++
})

watch(customUser, () => {
  role.value = customUser.value?.role.toLowerCase()
})
</script>

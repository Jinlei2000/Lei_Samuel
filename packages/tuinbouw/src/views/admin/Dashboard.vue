<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <h1
        class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
      >
        Dashboard
      </h1>
      <p class="mt-2 text-xl text-gray-600 dark:text-gray-400">
        You are logged in as
        <span class="font-semibold">{{ userCredentials.email }}</span>
      </p>
      <button
        class="focus:shadow-outline-red my-4 block rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 hover:bg-red-700 focus:outline-none active:bg-red-600"
        @click="handleLogout"
      >
        logout
      </button>

      <p class="text-lg">
        {{ $t('account.welcome') }}
      </p>

      <label class="block" for="language">Select Language</label>
      <select
        class="mb-3 block"
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

      <!-- make a list of buttons go to the right page -->
      <Router-link
        v-for="b in listButtons"
        class="focus:shadow-outline-red mt-4 rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 hover:bg-red-700 focus:outline-none active:bg-red-600"
        :to="`/admin/${b.toLowerCase()}`"
        >{{ b }}</Router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import { ref } from 'vue'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import useLanguage from '@/composables/useLanguage'
import useCustomUser from '@/composables/useCustomUser'

export default {
  setup() {
    const listButtons = ref([
      'Appointments',
      'Users',
      'Profile',
      'schedule-appointment',
    ])
    const { firebaseUser, logout } = useFirebase()
    const { setLocale, locale } = useLanguage()
    const { customUser } = useCustomUser()

    const handleLogout = async () => {
      await logout()
      customUser.value = null
      // go to login page
      router.replace('/auth/login')
      console.log('logout')
    }

    const userCredentials = ref<{ email: string | null }>({
      email: '',
    })

    if (firebaseUser.value) {
      userCredentials.value.email = firebaseUser.value.email
    }

    // Create brearer token
    firebaseUser.value?.getIdToken().then(token => {
      console.log(`{"Authorization": "Bearer ${token}"}`)
    })

    const setLanguage = (e: Event) => {
      const target = e.target as HTMLSelectElement
      setLocale(target.value)
      console.log(target.value)
    }

    return {
      userCredentials,
      handleLogout,
      listButtons,
      setLanguage,
      SUPPORTED_LOCALES,
      locale,
    }
  },
}
</script>

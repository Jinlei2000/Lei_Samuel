<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1
        class="text-transparent text-3xl font-extrabold md:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
      >
        Dashboard
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400 text-xl">
        You are logged in as
        <span class="font-semibold">{{ UserCredentials.email }}</span>
      </p>
      <button
        class="block my-4 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
        @click="handleLogout"
      >
        logout
      </button>

      <p class="text-lg">
        {{ $t('account.welcome') }}
      </p>

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

      <!-- make a list of buttons go to the right page -->
      <Router-link
        v-for="b in listButtons"
        class="mt-4 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
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
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const listButtons = ref([
      'Appointments',
      'Clients',
      'Employees',
      'Profile',
      'schedule-appointment',
    ])
    const { firebaseUser, logout } = useFirebase()
    const { setLocale } = useLanguage()
    const { locale } = useI18n()

    const handleLogout = async () => {
      await logout()
      // go to login page
      router.replace('/auth/login')
      console.log('logout')
    }

    const UserCredentials = ref<{ email: string | null }>({
      email: '',
    })

    if (firebaseUser.value) {
      UserCredentials.value.email = firebaseUser.value.email
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
      UserCredentials,
      handleLogout,
      listButtons,
      setLanguage,
      SUPPORTED_LOCALES,
      locale,
    }
  },
}
</script>

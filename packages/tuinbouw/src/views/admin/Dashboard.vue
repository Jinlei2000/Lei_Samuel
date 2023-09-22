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
        class="mt-4 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
        @click="handleLogout"
      >
        logout
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import { ref } from 'vue'

export default {
  setup() {
    const { firebaseUser, logout } = useFirebase()

    const handleLogout = async () => {
      await logout()
      // go to login page
      router.push('/auth/login')
      console.log('logout')
    }

    const UserCredentials = ref<{ email: string | null }>({
      email: '',
    })

    if (firebaseUser.value) {
      UserCredentials.value.email = firebaseUser.value.email
    }

    return {
      UserCredentials,
      handleLogout,
    }
  },
}
</script>

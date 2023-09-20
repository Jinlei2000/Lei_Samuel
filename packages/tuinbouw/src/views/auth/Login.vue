<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img class="w-8 h-8 mr-2" src="" alt="logo" />
        Name
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Log in to your account
          </h1>
          <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6">
            <!-- <div v-if="error">
              <p class="text-red-600">{{ error.message }}</p>
            </div>
             -->
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                class="border bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required="true"
                type="email"
                name="email"
                id="email"
                v-model="LoginCredentials.email"
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required="true"
                v-model="LoginCredentials.password"
              />
            </div>
            <div class="flex items-center justify-end">
              <RouterLink
                to="/auth/forgot-password"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Forgot password?</RouterLink>
            </div>
            <button
              type="submit"
              class="w-full text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Login
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?
              <RouterLink
                to="/auth/register"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Register
              </RouterLink>
            </p>
          </form>
        </div>
        <div class="bg-white dark:bg-slate-800 px-3 py-1"></div>
        <!-- to -->
        <div class="bg-white px-3 py-1 dark:bg-slate-800"></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ref } from 'vue'
import useFirebase from '@/composables/useFirebase'

export default {
  setup() {
    // Composables
    const { login, firebaseUser } = useFirebase()

    // Logic
    const LoginCredentials = ref({
      email: '',
      password: '',
    })

    const handleLogin = () => {
      login(LoginCredentials.value.email, LoginCredentials.value.password).then(
        () => {
          console.log('login success')
        },
      )
    }

    return {
      LoginCredentials,

      handleLogin,
    }
  },
}
</script>

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
        class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8"
      >
        <h2
          class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          Reset Password
        </h2>
        <form
          @submit.prevent="handleForgotPassword"
          class="mt-4 space-y-4 lg:mt-5 md:space-y-5"
        >
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Your email</label
            >
            <input
              type="email"
              name="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required="true"
              v-model="email"
            />
          </div>

          <button
            type="submit"
            class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Reset Password
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Know your password?
            <RouterLink
              to="/auth/login"
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >Login here
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import useFirebase from '@/composables/useFirebase'
import { ref } from 'vue'

export default {
  setup() {
    // Composables
    const { forgotPassword } = useFirebase()

    // Logic
    const email = ref<string>('')

    const handleForgotPassword = () : void => {
      forgotPassword(email.value).then(() => {
        console.log('Reset password email sent')
      })
    }

    return {
      email,
      handleForgotPassword,
    }
  },
}
</script>

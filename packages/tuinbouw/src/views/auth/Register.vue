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
            Create an account
          </h1>
          <form @submit.prevent="handleRegister" class="space-y-4 md:space-y-6">
            <InputField
              label="First name"
              type="text"
              placeholder="John"
              :error="errorMessages.firstName"
              v-model="registerCredentials.firstName"
            />
            <InputField
              label="Last name"
              type="text"
              placeholder="Doe"
              :error="errorMessages.lastName"
              v-model="registerCredentials.lastName"
            />

            <!-- make radio buttons to choose role employee or customer -->

            <div class="flex">
              <div class="flex items-center mr-4">
                <input
                  id="inline-radio"
                  type="radio"
                  value=""
                  name="inline-radio-group"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="inline-radio"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Employee</label
                >
              </div>
              <div class="flex items-center mr-4">
                <input
                  id="inline-2-radio"
                  type="radio"
                  value=""
                  name="inline-radio-group"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="inline-2-radio"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Customer</label
                >
              </div>
            </div>

            <InputField
              label="Email"
              type="email"
              placeholder="john@example.com"
              :error="errorMessages.email"
              v-model="registerCredentials.email"
            />
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              :error="errorMessages.password"
              v-model="registerCredentials.password"
            />

            <button
              type="submit"
              class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Create an account
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <RouterLink
                to="/auth/login"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Login here</RouterLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import { ref } from 'vue'
import InputField from '@/components/generic/form/InputField.vue'

export default {
  setup() {
    // Composables
    const { register } = useFirebase()

    // Logic
    const registerCredentials = ref({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    })
    const errorMessages = ref({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    })

    const handleRegister = async () => {
      await register(
        registerCredentials.value.email,
        registerCredentials.value.password,
      )

      console.log('Registered')
      router.push('/auth/login')
    }

    return {
      registerCredentials,
      handleRegister,
      errorMessages,
    }
  },
  components: { InputField },
}
</script>

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
          <span v-if="errorMessages.general" class="text-red-600">{{
            errorMessages.general
          }}</span>
          <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6">
            <div class="flex flex-col space-y-1">
              <label for="email">Username</label>
              <InputText id="email" v-model="loginCredentials.email" />
            </div>

            <!-- <InputField
              label="Email"
              type="email"
              placeholder="john@example.com"
              :error="errorMessages.email"
              v-model="loginCredentials.email"
            />
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              :error="errorMessages.password"
              v-model="loginCredentials.password"
            /> -->
            <div class="flex items-center justify-end">
              <RouterLink
                to="/auth/forgot-password"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Forgot password?</RouterLink
              >
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
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ref } from 'vue'
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import InputField from '@/components/generic/form/InputField.vue'
import { object, string } from 'yup'
import useCustomUser from '@/composables/useCustomUser'
import InputText from 'primevue/inputtext'

export default {
  // TODO: load CustomUser in when login
  setup() {
    // Composables
    const { login } = useFirebase()
    const { getDashboardPathForRole, restoreCustomUser } = useCustomUser()

    // Data
    const loginCredentials = ref({
      email: '',
      password: '',
    })
    const errorMessages = ref<{ [key: string]: string }>({
      email: '',
      password: '',
      general: '',
    })

    // Validation schema
    const loginSchema = object({
      email: string().required('email is required'),
      password: string().required('password is required'),
    })

    // Reset error messages to empty strings
    const resetErrorMessages = () => {
      errorMessages.value = {
        email: '',
        password: '',
        general: '',
      }
    }

    // Handle validation errors
    const handleValidationErrors = (err: any) => {
      // console.log(err)
      err.inner.forEach((e: any) => {
        errorMessages.value[e.path] = e.message
      })
    }

    // Validate and login
    const handleLogin = () => {
      resetErrorMessages()

      // Validate login credentials with yup
      loginSchema
        .validate(loginCredentials.value, {
          abortEarly: false,
        })
        .then(() => {
          console.log('validation success')
          login(loginCredentials.value.email, loginCredentials.value.password)
            .then(() => {
              console.log('login success')
              restoreCustomUser().then(() => {
                // redirect to role based dashboard
                router.replace(getDashboardPathForRole())
              })
            })
            .catch(error => {
              console.log(error.message)
              errorMessages.value.general = error.message
            })
        })
        .catch(err => {
          handleValidationErrors(err)
        })
    }

    return {
      loginCredentials,
      errorMessages,
      handleLogin,
    }
  },
  components: { InputField, InputText },
}
</script>

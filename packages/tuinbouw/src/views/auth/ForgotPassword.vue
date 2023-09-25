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
        <span v-if="errorMessages.general" class="text-red-600">{{
          errorMessages.general
        }}</span>
        <form
          @submit.prevent="handleForgotPassword"
          class="mt-4 space-y-4 lg:mt-5 md:space-y-5"
        >
          <InputField
            label="Email"
            type="email"
            placeholder="john@example.com"
            :error="errorMessages.email"
            v-model="formData.email"
          />
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
import InputField from '@/components/generic/form/InputField.vue'
import { object, string } from 'yup'

export default {
  setup() {
    // Composables
    const { forgotPassword } = useFirebase()

    // Data
    const formData = ref<{ [key: string]: string }>({
      email: '',
    })
    const errorMessages = ref<{ [key: string]: string }>({
      email: '',
      general: '',
    })

    // Validation schema
    const forgotPasswordSchema = object({
      email: string().required('email is required'),
    })

    // Handle validation errors
    const handleValidationErrors = (err: any) => {
      // console.log(err)
      err.inner.forEach((e: { path: string; message: string }) => {
        errorMessages.value[e.path] = e.message
      })
      // console.log(errorMessages.value)
    }

    const handleForgotPassword = (): void => {
      // Reset error messages
      errorMessages.value = {
        email: '',
        general: '',
      }
      // Validate form with yup
      forgotPasswordSchema
        .validate(formData.value, { abortEarly: false })
        .then(() => {
          console.log('validation success')
          forgotPassword(formData.value.email)
            .then(() => {
              console.log('Reset password email sent')
            })
            .catch(error => {
              console.log(error)
              errorMessages.value.general = error.message
            })
        })
        .catch(err => {
          handleValidationErrors(err)
        })
    }

    return {
      formData,
      errorMessages,
      handleForgotPassword,
    }
  },
  components: { InputField },
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Log in to your account
          </h1>
          <span v-if="errorMessages" class="text-red-600">{{
            errorMessages
          }}</span>
          <form @submit.prevent="handleLogin">
            <div class="flex flex-col">
              <label
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                for="email"
                >Email</label
              >
              <InputText
                id="email"
                type="text"
                v-model="email"
                placeholder="john@example.com"
                :class="{
                  'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                    errorEmail,
                }"
                aria-describedby="text-error"
              />
              <small class="p-error" id="text-error">{{
                errorEmail || '&nbsp;'
              }}</small>
            </div>
            <div class="flex flex-col">
              <label
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                for="password"
                >Password</label
              >
              <Password
                id="password"
                type="text"
                v-model="password"
                placeholder="••••••••"
                :feedback="false"
                :class="{
                  'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                    errorPassword,
                }"
                aria-describedby="text-error"
                toggleMask
              >
                <template #hideicon="{ onClick }">
                  <span
                    class="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <EyeOff @click="onClick()" />
                  </span>
                </template>
                <template #showicon="{ onClick }">
                  <span
                    class="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Eye @click="onClick()" />
                  </span>
                </template>
              </Password>

              <small class="p-error" id="text-error">{{
                errorPassword || '&nbsp;'
              }}</small>
            </div>

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
import Password from 'primevue/password'
import { useField, useForm } from 'vee-validate'
import { Eye, EyeOff } from 'lucide-vue-next'

export default {
  // TODO: load CustomUser in when login
  setup() {
    // Composables
    const { login } = useFirebase()
    const { getDashboardPathForRole, restoreCustomUser } = useCustomUser()

    const { handleSubmit, resetForm } = useForm()

    const validateField = (value: string, field: any) => {
      if (!value) {
        return `${field.name} is required`
      }

      if (field.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email'
      }

      // password length 6
      if (field.name === 'password' && value.length < 6) {
        return 'Password must be at least 6 characters'
      }

      return true
    }

    const { value: email, errorMessage: errorEmail } = useField(
      'email',
      validateField,
    )
    const { value: password, errorMessage: errorPassword } = useField(
      'password',
      validateField,
    )

    const errorMessages = ref<string | null>(null)

    const hasFieldError = (fields: any) => {
      let hasError = false
      Object.keys(fields).forEach(key => {
        if (fields[key].errorMessage) {
          hasError = true
        }
      })
      return hasError
    }

    const handleLogin = handleSubmit(async values => {
      console.log(values)
      const fields = {
        email,
        password,
      }

      if (!hasFieldError(fields)) {
        console.log('validation success')
        login(email.value, password.value)
          .then(() => {
            console.log('login success')
            resetForm()
            restoreCustomUser().then(() => {
              // redirect to role based dashboard
              router.replace(getDashboardPathForRole())
            })
          })
          .catch(error => {
            console.log(error.message)
            errorMessages.value = error.message
          })
      }
    })

    // // Data
    // const loginCredentials = ref({
    //   email: '',
    //   password: '',
    // })

    // // Validation schema
    // const loginSchema = object({
    //   email: string().required('email is required'),
    //   password: string().required('password is required'),
    // })

    // // Reset error messages to empty strings
    // const resetErrorMessages = () => {
    //   errorMessages.value = {
    //     email: '',
    //     password: '',
    //     general: '',
    //   }
    // }

    // // Handle validation errors
    // const handleValidationErrors = (err: any) => {
    //   // console.log(err)
    //   err.inner.forEach((e: any) => {
    //     errorMessages.value[e.path] = e.message
    //   })
    // }

    // // Validate and login
    // const handleLogin = () => {
    //   resetErrorMessages()

    //   // Validate login credentials with yup
    //   loginSchema
    //     .validate(loginCredentials.value, {
    //       abortEarly: false,
    //     })
    //     .then(() => {
    //       console.log('validation success')
    //       login(loginCredentials.value.email, loginCredentials.value.password)
    //         .then(() => {
    //           console.log('login success')
    //           restoreCustomUser().then(() => {
    //             // redirect to role based dashboard
    //             router.replace(getDashboardPathForRole())
    //           })
    //         })
    //         .catch(error => {
    //           console.log(error.message)
    //           errorMessages.value.general = error.message
    //         })
    //     })
    //     .catch(err => {
    //       handleValidationErrors(err)
    //     })
    // }

    return {
      errorMessages,
      handleLogin,
      email,
      errorEmail,
      password,
      errorPassword,
    }
  },
  components: { InputField, InputText, Password, Eye, EyeOff },
}
</script>

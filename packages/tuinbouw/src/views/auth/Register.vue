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
          <span v-if="errorMessages.general" class="text-red-600">{{
            errorMessages.general
          }}</span>
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

            <div>
              <p
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Choose your role
              </p>
              <div class="flex">
                <div class="flex items-center mr-4">
                  <input
                    id="radio"
                    type="radio"
                    value="employee"
                    name="radios"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700"
                    v-model="registerCredentials.role"
                  />
                  <label
                    for="radio"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Employee</label
                  >
                </div>
                <div class="flex items-center mr-4">
                  <input
                    id="radio-2"
                    type="radio"
                    value="customer"
                    name="radios"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700"
                    v-model="registerCredentials.role"
                  />
                  <label
                    for="radio-2"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Customer</label
                  >
                </div>
              </div>
              <span v-if="errorMessages.role" class="text-red-600">{{
                errorMessages.role
              }}</span>
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
import { object, string } from 'yup'

export default {
  setup() {
    // Composables
    const { register } = useFirebase()

    // Data
    const registerCredentials = ref({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '',
    })
    const errorMessages = ref<{ [key: string]: string }>({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '',
      general: '',
    })

    // Validation schema
    const registerSchema = object({
      email: string().required('email is required'),
      password: string()
        .required('password is required')
        .min(6, "Password can't be shorter than 6 characters"),
      firstName: string().required('first name is required'),
      lastName: string().required('last name is required'),
      role: string<'employee' | 'customer'>().required('role is required'),
    })

    // Reset error messages to empty strings
    const resetErrorMessages = () => {
      errorMessages.value = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '',
        general: '',
      }
    }

    // Handle validation errors
    const handleValidationErrors = (err: any) => {
      // console.log(err)
      err.inner.forEach((e: { path: string; message: string }) => {
        errorMessages.value[e.path] = e.message
      })
      // console.log(errorMessages.value)
    }

    // Validate and register
    const handleRegister = async () => {
      resetErrorMessages()

      // Validate login credentials with yup
      registerSchema
        .validate(registerCredentials.value, {
          abortEarly: false,
        })
        .then(() => {
          console.log('validation success')
          register(
            registerCredentials.value.email,
            registerCredentials.value.password,
          )
            .then(() => {
              console.log('register success')
              router.push('/auth/login')
            })
            .catch(error => {
              console.log(error.message)
              // TODO: handle error messages better
              errorMessages.value.general = error.message
            })
        })
        .catch(err => {
          handleValidationErrors(err)
        })
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

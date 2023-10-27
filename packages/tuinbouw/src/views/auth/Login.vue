<template>
  <section class="bg-gray-50">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            Welcome back!
          </h1>
          <span v-if="errorLogin" class="text-red-600">{{ errorLogin }}</span>
          <form @submit.prevent="handleLogin">
            <InputText
              name="Email"
              placeholder="john@example.com"
              type="text"
              :errorMessage="errorMessages.email"
              v-bind="email"
            />
            <InputText
              name="Password"
              placeholder="••••••••"
              type="password"
              inputType="password"
              :errorMessage="errorMessages.password"
              v-bind="password"
            />
            <div class="flex items-center justify-end">
              <RouterLink
                to="/auth/forgot-password"
                class="text-sm pb-4 underline font-medium text-primary-600 hover:underline"
                >Forgot password?</RouterLink
              >
            </div>
            <button
              type="submit"
              class="w-full text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login
            </button>
            <p class="text-sm font-light text-gray-500 pt-4">
              Don’t have an account yet?
              <RouterLink
                to="/auth/register"
                class="font-medium text-primary-600 hover:underline"
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

<script setup lang="ts">
import { ref } from 'vue'
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import useCustomUser from '@/composables/useCustomUser'
import InputText from '@/components/generic/form/InputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Composables
const { login } = useFirebase()
const { getDashboardPathForRole, restoreCustomUser } = useCustomUser()

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})
const {
  handleSubmit,
  resetForm,
  defineComponentBinds,
  errors,
  values,
  validate,
} = useForm({
  validationSchema: schema,
})
const email = defineComponentBinds('email')
const password = defineComponentBinds('password')

const errorLogin = ref<string | null>(null)

// const handleLogin = handleSubmit(async values => {
//   errorMessages.value = null
//   console.log(values)
//   login(values.email, values.password)
//     .then(() => {
//       console.log('login success')
//       resetForm()
//       restoreCustomUser().then(() => {
//         // redirect to role based dashboard
//         router.replace(getDashboardPathForRole())
//       })
//     })
//     .catch(error => {
//       console.log(error.message)
//       errorMessages.value = error.message
//     })
// })

const errorMessages = ref<{
  email?: string
  password?: string
}>({
  email: '',
  password: '',
})

const handleLogin = async () => {
  await validate()
  errorMessages.value = errors.value
  errorLogin.value = null
  console.log(values)
  if (Object.keys(errors.value).length === 0) {
    login(values.email, values.password)
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
        errorLogin.value = error.message
      })
  }
}
</script>

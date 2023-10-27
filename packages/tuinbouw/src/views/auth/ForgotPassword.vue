<template>
  <section class="">
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            Reset Password
          </h1>
          <span v-if="errorForgotPwd" class="text-red-600">{{
            errorForgotPwd
          }}</span>
          <form @submit.prevent="handleLogin">
            <InputText
              name="Email"
              placeholder="john@example.com"
              type="text"
              :errorMessage="errorMessages.email"
              v-bind="email"
            />
            <button
              type="submit"
              class="hover:bg-primary-700 focus:ring-primary-300 mt-1 w-full rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              Reset Password
            </button>
            <p class="pt-4 text-sm font-light text-gray-500">
              Know your password?
              <RouterLink
                to="/auth/login"
                class="text-primary-600 font-medium hover:underline"
              >
                Login
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
import InputText from '@/components/generic/form/InputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'

// Composables
const { forgotPassword } = useFirebase()
const toast = useToast()

const schema = yup.object({
  email: yup.string().required().email(),
})

const { resetForm, defineComponentBinds, errors, values, validate } = useForm({
  validationSchema: schema,
})
const email = defineComponentBinds('email')

const errorForgotPwd = ref<string | null>(null)

const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  email: '',
})

const handleLogin = async () => {
  await validate()
  errorMessages.value = errors.value
  errorForgotPwd.value = null
  // console.log(values)
  if (Object.keys(errors.value).length === 0) {
    forgotPassword(values.email)
      .then(() => {
        console.log('Reset password email sent')
        resetForm()
        toast.add({
          severity: 'success',
          summary: 'Email sent',
          detail: 'Check your inbox for the reset password email.',
          life: 10000,
        })
      })
      .catch(error => {
        console.log(error)
        errorMessages.value.general = error.message
      })
  }
}
</script>

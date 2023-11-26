<template>
  <section class="">
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            Reset Password
          </h1>
          <span v-if="errorForgotPwd" class="text-red-600">{{
            errorForgotPwd
          }}</span>
          <DynamicForm
            :schema="formForgotPwd"
            :validation-schema="forgotPasswordValidationSchema"
            :handle-form="handleForgotPwd"
            :loading="loading"
          />
          <p class="text-sm font-light text-gray-500">
            Know your password?
            <RouterLink
              to="/auth/login"
              class="text-primary-600 font-medium hover:underline"
            >
              Login
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/generic/DynamicForm.vue'
import useCustomToast from '@/composables/useCustomToast'
import useFirebase from '@/composables/useFirebase'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { forgotPasswordValidationSchema } from '@/validation/schema'
import { ref } from 'vue'

// composables
const { forgotPassword } = useFirebase()
const { showToast } = useCustomToast()

// variables
const errorForgotPwd = ref<string | null>(null)
const loading = ref(false)

// form
const formForgotPwd = {
  fields: [
    {
      label: 'Email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
  ],

  button: {
    class: 'w-full flex justify-center',
    name: 'Reset Password',
  },
}

const handleForgotPwd = async (values: CustomUser) => {
  loading.value = true
  await forgotPassword(values.email)
    .then(() => {
      console.log('Reset password email sent')
      showToast(
        'success',
        'Success',
        'Check your inbox for the reset password email',
      )
    })
    .catch(error => {
      console.log(error)
      errorForgotPwd.value = error.message
    })
  loading.value = false
}
</script>

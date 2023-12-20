<template>
  <section>
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            {{ $t('auth.forgotpwd.title') }}
          </h1>
          <CustomError v-if="errorForgotPwd" :error="errorForgotPwd" />
          <DynamicForm
            :schema="formForgotPwd"
            :validation-schema="forgotPasswordValidationSchema"
            :handle-form="handleForgotPwd"
            :loading="loading"
          />
          <p class="text-sm font-light text-gray-500">
            {{ $t('auth.forgotpwd.login.text') }}
            <RouterLink
              to="/auth/login"
              class="text-primary-600 font-medium hover:underline"
            >
              {{ $t('auth.forgotpwd.login.link') }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CustomError from '@/components/generic/CustomError.vue'
import DynamicForm from '@/components/generic/DynamicForm.vue'
import useCustomToast from '@/composables/useCustomToast'
import useFirebase from '@/composables/useFirebase'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { forgotPasswordValidationSchema } from '@/validation/schema'
import type { AuthError } from 'firebase/auth'
import LogRocket from 'logrocket'
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
      label: 'auth.forgotpwd.form.email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
  ],

  button: {
    class: 'w-full flex justify-center',
    name: 'auth.forgotpwd.form.submit',
  },
}

const handleForgotPwd = async (values: CustomUser) => {
  try {
    loading.value = true
    await forgotPassword(values.email)
    // console.log('Reset password email sent')
    showToast('success', 'toast.success', 'auth.forgotpwd.toast.succes')
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    // check if error is AuthError
    if ((error as AuthError)?.code !== undefined) {
      errorForgotPwd.value = (error as AuthError).code
    }
  } finally {
    loading.value = false
  }
}
</script>

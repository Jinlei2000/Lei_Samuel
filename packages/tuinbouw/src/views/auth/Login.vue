<template>
  <section>
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8">
          <h1
            class="text-primary-green text-xl font-bold leading-tight tracking-tight md:text-2xl"
          >
            {{ $t('auth.login.title') }}
          </h1>
          <CustomError v-if="errorLogin" :error="errorLogin" />
          <DynamicForm
            :schema="formLogin"
            :validation-schema="loginValidationSchema"
            :handle-form="handleLogin"
            :loading="loading"
          />
          <div>
            <div class="flex items-center justify-end">
              <RouterLink
                to="/auth/forgot-password"
                class="text-primary-600 hover:text-primary-orange text-sm font-medium underline"
              >
                {{ $t('auth.login.forgotPassword') }}
              </RouterLink>
            </div>
            <div class="my-3 border-t border-gray-300" />
            <p class="text-sm font-light text-gray-900">
              {{ $t('auth.login.register.text') }}
              <RouterLink
                to="/auth/register"
                class="text-primary-600 hover:text-primary-orange font-medium underline"
              >
                {{ $t('auth.login.register.link') }}
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CustomError from '@/components/generic/CustomError.vue'
import DynamicForm from '@/components/generic/DynamicForm.vue'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useLanguage from '@/composables/useLanguage'
import router from '@/router'
import { loginValidationSchema } from '@/validation/schema'
import { type AuthError } from 'firebase/auth'
import LogRocket from 'logrocket'
import { type GenericObject } from 'vee-validate'
import { ref } from 'vue'

// composables
const { login } = useFirebase()
const { getDashboardPathForRole, restoreCustomUser, customUser } =
  useCustomUser()
const { setLocale } = useLanguage()

// variables
const errorLogin = ref<string | null>(null)
const loading = ref(false)

// form
const formLogin = {
  fields: [
    {
      label: 'auth.login.form.email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
    {
      label: 'auth.login.form.password',
      name: 'password',
      placeholder: '••••••••',
      as: 'input',
      type: 'password',
    },
  ],

  button: {
    class: 'w-full flex justify-center',
    name: 'auth.login.form.submit',
  },
}

const handleLogin = async (values: GenericObject): Promise<void> => {
  try {
    loading.value = true
    await login(values.email, values.password)
    // Restore custom user
    await restoreCustomUser()
    // Redirect to role-based dashboard
    router.replace(getDashboardPathForRole())

    await setLocale(customUser.value!.locale!)
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    // check if error is AuthError
    if ((error as AuthError)?.code !== undefined) {
      errorLogin.value = (error as AuthError).code
    }
  } finally {
    loading.value = false
  }
}
</script>

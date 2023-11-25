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
            Welcome back!
          </h1>
          <span v-if="errorLogin" class="text-red-600">{{ errorLogin }}</span>
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
                class="text-primary-600 text-sm font-medium underline hover:underline"
              >
                Forgot password?
              </RouterLink>
            </div>
            <div class="my-3 border-t border-gray-300" />
            <p class="text-sm font-light text-gray-500">
              Don’t have an account yet?
              <RouterLink
                to="/auth/register"
                class="text-primary-600 font-medium hover:underline"
              >
                Register
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/generic/DynamicForm.vue'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useLanguage from '@/composables/useLanguage'
import router from '@/router'
import { loginValidationSchema } from '@/validation/schema'
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
      label: 'Email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
    {
      label: 'Password',
      name: 'password',
      placeholder: '••••••••',
      as: 'input',
      type: 'password',
    },
  ],

  button: {
    class: 'w-full flex justify-center',
    name: 'Login',
  },
}

const handleLogin = async (values: GenericObject) => {
  loading.value = true
  try {
    await login(values.email, values.password)
    // Restore custom user
    await restoreCustomUser()
    // Redirect to role-based dashboard
    router.replace(getDashboardPathForRole())

    await setLocale(customUser.value!.locale!)
  } catch (error) {
    console.log(error)
    errorLogin.value = (error as Error).message
  }
  loading.value = false
}
</script>

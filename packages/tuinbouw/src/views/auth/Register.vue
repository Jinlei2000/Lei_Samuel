<template>
  <section class="">
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-primary-green text-xl font-bold leading-tight tracking-tight md:text-2xl"
          >
            {{ $t('auth.register.title') }}
          </h1>
          <CustomError v-if="errorRegister" :error="errorRegister" />
          <DynamicForm
            :schema="formRegister"
            :validation-schema="registerValidationSchema"
            :handle-form="handleRegister"
            :loading="loading"
          />
          <p class="text-sm font-light text-gray-900">
            {{ $t('auth.register.login.text') }}
            <RouterLink
              to="/auth/login"
              class="hover:text-primary-orange font-medium text-gray-900 underline"
            >
              {{ $t('auth.register.login.link') }}
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
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useLanguage from '@/composables/useLanguage'
import { CREATE_CLIENT } from '@/graphql/user.mutation'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import router from '@/router'
import { registerValidationSchema } from '@/validation/schema'
import { useMutation } from '@vue/apollo-composable'
import type { AuthError } from 'firebase/auth'
import LogRocket from 'logrocket'
import { type GenericObject } from 'vee-validate'
import { ref } from 'vue'

// composables
const { register } = useFirebase()
const { mutate: addClient } = useMutation<CustomUser>(CREATE_CLIENT)
const { locale, setLocale } = useLanguage()
const { customUser, restoreCustomUser } = useCustomUser()

// variables
const errorRegister = ref<string | null>(null)
const loading = ref<boolean>(false)
// form
const formRegister = {
  fields: [
    {
      label: 'auth.register.form.firstname',
      name: 'firstName',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'auth.register.form.lastname',
      name: 'lastName',
      placeholder: 'Doe',
      as: 'input',
    },
    {
      label: 'auth.register.form.email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
    {
      label: 'auth.register.form.password',
      name: 'password',
      placeholder: '••••••••',
      as: 'input',
      type: 'password',
    },
  ],

  button: {
    class: 'w-full flex justify-center',
    name: 'auth.register.form.submit',
  },
}

const handleRegister = async (values: GenericObject) => {
  try {
    loading.value = true
    const userData = await register(values.email, values.password)

    // Add user to the database
    await addClient({
      createClientInput: {
        uid: userData.uid,
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        // Add the user's locale language to the database
        locale: locale.value,
      },
    })

    // console.log('Register success')
    await restoreCustomUser()
    await setLocale(customUser.value!.locale!)
    router.replace('/auth/login')
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    // check if error is AuthError
    if ((error as AuthError)?.code !== undefined) {
      errorRegister.value = (error as AuthError).code
    } else {
      errorRegister.value = 'auth.register.error'
    }
  } finally {
    loading.value = false
  }
}
</script>

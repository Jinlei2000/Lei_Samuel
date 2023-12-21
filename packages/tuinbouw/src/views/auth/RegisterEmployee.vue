<template>
  <section>
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            {{ $t('auth.register.employee.title') }}
          </h1>
          <CustomError v-if="errorRegister" :error="errorRegister" />
          <DynamicForm
            :schema="formRegister"
            :validation-schema="registerValidationSchema"
            :handle-form="handleRegister"
            :loading="loading"
          />
          <p class="text-sm font-light text-gray-500">
            {{ $t('auth.register.employee.login.text') }}
            <RouterLink
              to="/auth/login"
              class="text-primary-600 font-medium hover:underline"
            >
              {{ $t('auth.register.employee.login.link') }}
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
import { DELETE_ALL_MAILTOKENS_BY_USERID } from '@/graphql/mail.token.mutation'
import { GET_MAILTOKEN_BY_TOKEN } from '@/graphql/mail.token.query'
import { UPDATE_EMPLOYEE_REGISTER } from '@/graphql/user.mutation'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import router from '@/router'
import { registerValidationSchema } from '@/validation/schema'
import { useMutation, useQuery } from '@vue/apollo-composable'
import type { AuthError } from 'firebase/auth'
import LogRocket from 'logrocket'
import { type GenericObject } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// composables
const { register } = useFirebase()
const { restoreCustomUser, customUser } = useCustomUser()
const { replace } = useRouter()
const { locale } = useI18n()

// variables
customUser.value = null
const errorRegister = ref<string | null>(null)
const loading = ref(false)
// form
const formRegister = {
  fields: [
    {
      label: 'auth.register.employee.form.firstname',
      name: 'firstName',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'auth.register.employee.form.lastname',
      name: 'lastName',
      placeholder: 'Doe',
      as: 'input',
    },
    {
      label: 'auth.register.employee.form.email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
    {
      label: 'auth.register.employee.form.password',
      name: 'password',
      placeholder: '••••••••',
      as: 'input',
      type: 'password',
    },
  ],

  button: {
    class: 'w-full flex justify-center',
    name: 'auth.register.employee.form.submit',
  },
}

// graphQL
const { mutate: updateEmployee } = useMutation<CustomUser>(
  UPDATE_EMPLOYEE_REGISTER,
)

const { mutate: deleteAllMailTokensByUserId } = useMutation(
  DELETE_ALL_MAILTOKENS_BY_USERID,
)

const { result: mailTokenResult, error: mailTokenError } = useQuery(
  GET_MAILTOKEN_BY_TOKEN,
  () => ({
    token: router.currentRoute.value.params.token,
  }),
)

const handleRegister = async (values: GenericObject) => {
  try {
    // console.log('handleRegister')
    loading.value = true
    if (mailTokenResult.value) {
      const userId = mailTokenResult.value.getMailTokenByToken.userId

      const userData = await register(values.email, values.password)

      // Update employee in the database
      await updateEmployee({
        updateUserInput: {
          id: userId,
          uid: userData.uid,
          firstname: values.firstName.toLowerCase(),
          lastname: values.lastName.toLowerCase(),
          email: values.email,
          // Add the user's locale language to the database
          locale: locale.value,
        },
      })

      await restoreCustomUser()

      // Remove all tokens with this userId
      await deleteAllMailTokensByUserId({
        userId: userId,
      })

      // console.log('Register success')
      replace('/auth/login')
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    // check if error is AuthError
    if ((error as AuthError)?.code !== undefined) {
      errorRegister.value = (error as AuthError).code
    } else {
      errorRegister.value = 'auth.register.employee.error'
    }
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  // all errors
  if (mailTokenError.value) {
    // console.log(mailTokenError.value)
    LogRocket.captureException(mailTokenError.value)
    errorRegister.value = 'auth.register.employee.error.token'
  }
})
</script>

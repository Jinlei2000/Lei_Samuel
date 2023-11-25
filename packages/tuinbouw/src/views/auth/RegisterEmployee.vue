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
            Create an employee account
          </h1>
          <span v-if="errorRegister" class="text-red-600">{{
            errorRegister
          }}</span>
          <DynamicForm
            :schema="formRegister"
            :validation-schema="registerValidationSchema"
            :handle-form="handleRegister"
            :loading="loading"
          />
          <p class="text-sm font-light text-gray-500">
            Already have an account?
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
import { ref, watchEffect } from 'vue'
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import { type GenericObject } from 'vee-validate'
import { UPDATE_EMPLOYEE_REGISTER } from '@/graphql/user.mutation'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { GET_MAILTOKEN_BY_TOKEN } from '@/graphql/mail.token.query'
import useCustomUser from '@/composables/useCustomUser'
import { DELETE_ALL_MAILTOKENS_BY_USERID } from '@/graphql/mail.token.mutation'
import { useRouter } from 'vue-router'
import DynamicForm from '@/components/generic/DynamicForm.vue'
import { registerValidationSchema } from '@/validation/schema'

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
      label: 'First name',
      name: 'firstName',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'Last name',
      name: 'lastName',
      placeholder: 'Doe',
      as: 'input',
    },
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
    name: 'Create an account',
  },
}

// graphQL
const { mutate: updateEmployee, error: addEmployeeError } =
  useMutation<CustomUser>(UPDATE_EMPLOYEE_REGISTER)

const {
  mutate: deleteAllMailTokensByUserId,
  error: deleteAllMailTokensByUserIdError,
} = useMutation(DELETE_ALL_MAILTOKENS_BY_USERID)

const { result: mailTokenResult, error: mailTokenError } = useQuery(
  GET_MAILTOKEN_BY_TOKEN,
  () => ({
    token: router.currentRoute.value.params.token,
  }),
)

const handleRegister = async (values: GenericObject) => {
  console.log('handleRegister')
  loading.value = true

  try {
    if (mailTokenResult.value) {
      const userId = mailTokenResult.value.getMailTokenByToken.userId

      const userData = await register(values.email, values.password)

      // Update employee in the database
      await updateEmployee({
        updateUserInput: {
          id: userId,
          uid: userData.uid,
          firstname: values.firstName,
          lastname: values.lastName,
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

      console.log('Register success')
      replace('/auth/login')
    }
  } catch (error) {
    console.log(error)
    errorRegister.value = (error as Error).message
  }
  loading.value = false
}

watchEffect(() => {
  // all errors
  const errors = [
    addEmployeeError.value,
    mailTokenError.value,
    deleteAllMailTokensByUserIdError.value,
  ]
  errors.forEach(error => {
    if (error) {
      errorRegister.value = error.message
    }
  })
})
</script>

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
          <form @submit.prevent="handleRegister">
            <InputText
              name="First name"
              placeholder="John"
              type="text"
              :errorMessage="errorMessages.firstName"
              v-bind="firstName"
            />
            <InputText
              name="Last name"
              placeholder="Doe"
              type="text"
              :errorMessage="errorMessages.lastName"
              v-bind="lastName"
            />
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
            <button
              type="submit"
              class="hover:bg-primary-700 focus:ring-primary-300 mt-1 w-full rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              <span v-if="!loading"> Create an account </span>
              <span v-else>
                <svg
                  aria-hidden="true"
                  role="status"
                  class="mr-3 inline h-4 w-4 animate-spin text-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </button>
            <p class="pt-4 text-sm font-light text-gray-500">
              Already have an account?
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
import { ref, watch, type Ref } from 'vue'
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import InputText from '@/components/generic/form/InputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { UPDATE_EMPLOYEE_REGISTER } from '@/graphql/user.mutation'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { GET_MAILTOKEN_BY_TOKEN } from '@/graphql/mail.token.query'
import useCustomUser from '@/composables/useCustomUser'
import { DELETE_ALL_MAILTOKENS_BY_USERID } from '@/graphql/mail.token.mutation'

// Composables
const { register } = useFirebase()
const { restoreCustomUser } = useCustomUser()
const { mutate: updateEmployee, error: addEmployeeError } =
  useMutation<CustomUser>(UPDATE_EMPLOYEE_REGISTER)
const {
  mutate: deleteAllMailTokensByUserId,
  error: deleteAllMailTokensByUserIdError,
} = useMutation(DELETE_ALL_MAILTOKENS_BY_USERID)
const { result: mailTokenResult, error: mailTokenError } = useQuery(
  GET_MAILTOKEN_BY_TOKEN,
  () => ({
    token: router.currentRoute.value.query.token,
  }),
)
const { locale } = useI18n()

const setError = (
  watchedValue: Ref<any | null>,
  errorMessage: string,
): void => {
  watch(watchedValue, () => {
    if (watchedValue.value) {
      errorRegister.value = errorMessage
    }
  })
}

setError(addEmployeeError, "Couldn't create an account.")
setError(mailTokenError, 'Invalid token.')
setError(deleteAllMailTokensByUserIdError, 'Delete token failed.')

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
})
const { resetForm, defineComponentBinds, errors, values, validate } = useForm({
  validationSchema: schema,
})
const email = defineComponentBinds('email')
const password = defineComponentBinds('password')
const firstName = defineComponentBinds('firstName')
const lastName = defineComponentBinds('lastName')
const errorRegister = ref<string | null>(null)
const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  await validate()
  errorMessages.value = errors.value
  errorRegister.value = null
  // console.log(values)
  if (Object.keys(errors.value).length === 0) {
    // console.log('token:', router.currentRoute.value.query.token)
    if (mailTokenResult.value) {
      const userId = mailTokenResult.value.getMailTokenByToken.userId
      await register(values.email, values.password)
        .then(async userData => {
          // Update employee in database
          await updateEmployee({
            updateUserInput: {
              id: userId,
              uid: userData.uid,
              firstname: values.firstName,
              lastname: values.lastName,
              email: values.email,
              // add the user's locale language to the database
              locale: locale.value,
            },
          })
          await restoreCustomUser()
          // remove all token with this userid
          await deleteAllMailTokensByUserId({
            userId: userId,
          })
          console.log('register success')
          resetForm()
          router.replace('/auth/login')
        })
        .catch(error => {
          console.log(error.message)
          errorRegister.value = error.message
        })
    }
  }
  loading.value = false
}
</script>

<template>
  <section class="">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0"
    >
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            Create an account
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
              class="w-full mt-1 text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create an account
            </button>
            <p class="text-sm font-light text-gray-500 pt-4">
              Already have an account?
              <RouterLink
                to="/auth/login"
                class="font-medium text-primary-600 hover:underline"
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
import { ref, watch } from 'vue'
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import InputText from '@/components/generic/form/InputText.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { CREATE_CLIENT } from '@/graphql/user.mutation'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'

// Composables
const { register } = useFirebase()
const { mutate: addClient, error: addClientError } =
  useMutation<CustomUser>(CREATE_CLIENT)
const { locale } = useI18n()

watch(addClientError, () => {
  if (!addClientError.value) return
  errorRegister.value = "Couldn't create user."
})

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

const handleRegister = async () => {
  await validate()
  errorMessages.value = errors.value
  errorRegister.value = null
  console.log(values)
  if (Object.keys(errors.value).length === 0) {
    register(values.email, values.password)
      .then(async userData => {
        // Add user to database
        await addClient({
          createClientInput: {
            uid: userData.uid,
            firstname: values.firstName,
            lastname: values.lastName,
            email: values.email,
            // add the user's locale language to the database
            locale: locale.value,
          },
        }).then(() => {
          console.log('register success')
          resetForm()
          router.replace('/auth/login')
        })
      })
      .catch(error => {
        console.log(error.message)
        errorRegister.value = error.message
      })
  }
}
</script>

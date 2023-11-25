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
            Create an account
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
import { ref, watch } from 'vue'
import useFirebase from '@/composables/useFirebase'
import router from '@/router'
import { type GenericObject } from 'vee-validate'
import { CREATE_CLIENT } from '@/graphql/user.mutation'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation } from '@vue/apollo-composable'
import useLanguage from '@/composables/useLanguage'
import useCustomUser from '@/composables/useCustomUser'
import DynamicForm from '@/components/generic/DynamicForm.vue'
import { registerValidationSchema } from '@/validation/schema'

// composables
const { register } = useFirebase()
const { mutate: addClient, error: addClientError } =
  useMutation<CustomUser>(CREATE_CLIENT)
const { locale, setLocale } = useLanguage()
const { customUser } = useCustomUser()

watch(addClientError, () => {
  if (!addClientError.value) return
  errorRegister.value = "Couldn't create user."
})

// variables
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

const handleRegister = async (values: GenericObject) => {
  loading.value = true
  try {
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

    console.log('Register success')
    setLocale(customUser.value!.locale!)
    router.replace('/auth/login')
  } catch (error) {
    console.log(error)
    errorRegister.value = (error as Error).message
  }
  loading.value = false
}
</script>

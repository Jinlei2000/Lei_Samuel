<template>
  <!-- go back button -->
  <button class="mt-20 flex" @click="$router.go(-1)" v-bind="$attrs">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Users
  </h1>

  <!-- add employee button -->
  <button
    class="bg-primary-green my-4 rounded px-4 py-2 font-bold text-white"
    @click="openModal(null, 'create')"
  >
    Add Employee
  </button>

  <!-- TODO: filters & orders -->

  <!-- TODO: search bar -->

  <!-- show loading -->
  <div v-if="usersLoading">
    <p class="text-6xl font-black">Loading Users...</p>
  </div>

  <!-- show users -->
  <div v-if="users && users.users.length > 0">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="user in users.users"
        :key="user.id"
        class="transform overflow-hidden rounded-md border border-gray-400 bg-white shadow-md transition-transform hover:scale-105"
        :class="user.uid === null ?? 'border-red-500'"
      >
        <div class="p-6">
          <h2 class="mb-2 text-2xl font-semibold">
            {{ user.firstname }} {{ user.lastname }}
          </h2>
          <p class="text-gray-600">{{ user.email }}</p>
          <p class="text-gray-600">{{ user.role }}</p>
          <p class="text-gray-600">{{ user.uid }}</p>
          <!-- send email button -->
          <CustomButton
            v-if="user.uid === null"
            name="Send email to create account"
            @click="handleSendMailToEmployee(user)"
            :loading="
              sendMailCurrentUserId === user.id && sendMailToEmployeeLoading
            "
            ownClass="block w-full"
          />
          <!-- Add other user information as needed -->
        </div>
        <div
          class="flex items-center justify-end space-x-4 border-t border-gray-200 p-6"
        >
          <!-- View More Button -->
          <button
            @click="openModal(user, 'detail')"
            class="text-green-500 hover:underline"
          >
            <Eye />
          </button>
          <!-- Edit Button -->
          <button
            v-if="user.role === 'EMPLOYEE'"
            @click="openModal(user, 'edit')"
            class="text-blue-500 hover:underline"
          >
            <Pencil />
          </button>
          <!-- Delete Button -->
          <button
            v-if="user.role === 'EMPLOYEE'"
            @click="handleDelete(user)"
            class="text-red-500 hover:underline"
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    maximizable
    header="User Details"
    :style="{ width: '50vw' }"
    v-if="selectedUser"
    @click:close="closeModal"
    class="max-w-lg"
  >
    <h2 class="mb-2 text-xl font-semibold">
      {{ selectedUser.fullname }}
    </h2>
    <p class="text-gray-600">
      {{ selectedUser.email }}
    </p>
    <!-- upgrade to admin button -->
    <CustomButton
      v-if="selectedUser.role === 'EMPLOYEE'"
      name="Upgrade to Admin"
      @click="handleUpgradeToAdmin(selectedUser)"
      :loading="upgradeToAdminLoading"
      ownClass="block w-full"
    />
  </Dialog>

  <!-- Edit Modal -->
  <Dialog
    v-model:visible="visible.edit"
    modal
    maximizable
    header="Edit User"
    :style="{ width: '50vw' }"
    @click:close="closeModal"
    class="max-w-lg"
  >
    <form @submit.prevent="handleUpdate">
      <!-- First Name -->
      <InputText
        name="First Name"
        placeholder="John"
        type="text"
        :errorMessage="errorMessages.firstname"
        v-bind="firstnameUpdate"
      />

      <!-- Last Name -->
      <InputText
        name="Last Name"
        placeholder="Doe"
        type="text"
        :errorMessage="errorMessages.lastname"
        v-bind="lastnameUpdate"
      />

      <!-- Email -->
      <InputText
        v-if="selectedUser?.uid === null"
        name="Email"
        placeholder="john@example.com"
        type="text"
        :errorMessage="errorMessages.email"
        v-bind="emailUpdate"
      />

      <!-- Telephone -->
      <InputText
        name="Telephone (optional)"
        placeholder="0412345678"
        type="text"
        :errorMessage="errorMessages.telephone"
        v-bind="telephoneUpdate"
      />

      <!-- Locale -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="locale"
          >Language
        </label>
        <Dropdown
          id="locale"
          v-model="localeUpdate"
          :options="getLocales()"
          optionLabel="name"
          optionValue="value"
          class="w-full"
        >
          <template #dropdownicon>
            <ChevronDownIcon />
          </template>
        </Dropdown>
      </div>

      <CustomButton
        type="submit"
        name="Create Employee"
        :loading="loadingUpdate"
      />
    </form>
  </Dialog>

  <!-- Create Employee Modal -->
  <Dialog
    v-model:visible="visible.create"
    modal
    maximizable
    header="Create Employee"
    :style="{ width: '50vw' }"
    @click:close="closeModal"
    class="max-w-lg"
  >
    <form @submit.prevent="handleCreateEmployee">
      <!-- First Name -->
      <InputText
        name="First Name"
        placeholder="John"
        type="text"
        :errorMessage="errorMessages.firstname"
        v-bind="firstname"
      />

      <!-- Last Name -->
      <InputText
        name="Last Name"
        placeholder="Doe"
        type="text"
        :errorMessage="errorMessages.lastname"
        v-bind="lastname"
      />

      <!-- Email -->
      <InputText
        name="Email"
        placeholder="john@example.com"
        type="text"
        :errorMessage="errorMessages.email"
        v-bind="email"
      />

      <!-- Telephone -->
      <InputText
        name="Telephone (optional)"
        placeholder="0412345678"
        type="text"
        :errorMessage="errorMessages.telephone"
        v-bind="telephone"
      />

      <!-- Locale -->
      <div>
        <label
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          for="locale"
          >Language
        </label>
        <Dropdown
          id="locale"
          v-model="locale"
          :options="getLocales()"
          optionLabel="name"
          optionValue="value"
          class="w-full"
        >
          <template #dropdownicon>
            <ChevronDownIcon />
          </template>
        </Dropdown>
      </div>

      <CustomButton
        type="submit"
        name="Create Employee"
        :loading="loadingCreateEmployee"
      />
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { GET_USERS } from '@/graphql/user.query'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, watchEffect } from 'vue'
import { ArrowLeft, Trash2, Pencil, Eye } from 'lucide-vue-next'
import useCustomToast from '@/composables/useCustomToast'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import {
  DELETE_USER,
  CREATE_EMPLOYEE,
  UPDATE_USER,
  UPDATE_USER_TO_ADMIN,
} from '@/graphql/user.mutation'
import { SEND_MAIL_TO_EMPLOYEE } from '@/graphql/mail.token.mutation'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import InputText from '@/components/generic/form/InputText.vue'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import { ChevronDownIcon } from 'lucide-vue-next'
import CustomButton from '@/components/generic/CustomButton.vue'

// composables
const { showToast } = useCustomToast()

// variables
const variables = ref<{
  filters: string[]
  order: {
    field: string
    direction: string
  }
  searchString: string
}>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: 'DESC',
  },
  searchString: '',
})
const visible = ref({
  detail: false,
  edit: false,
  create: false,
})
const selectedUser = ref<CustomUser | null>(null)
const sendMailCurrentUserId = ref<string | null>(null)

// form
const schema = yup.object({
  email: yup.string().required().email(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  telephone: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10)
    .max(10)
    .optional()
    .nullable(),
})

// error messages of forms
const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  firstname: '',
  lastname: '',
  email: '',
  telephone: '',
})

// create form
const { resetForm, defineComponentBinds, errors, values, validate } = useForm({
  validationSchema: schema,
})

const firstname = defineComponentBinds('firstname')
const lastname = defineComponentBinds('lastname')
const email = defineComponentBinds('email')
const telephone = defineComponentBinds('telephone')
const locale = ref('en')
const loadingCreateEmployee = ref(false)

// update form
const {
  defineComponentBinds: defineComponentBindsUpdate,
  errors: errorsUpdate,
  values: valuesUpdate,
  validate: validateUpdate,
  setValues: setValuesUpdate,
} = useForm({
  validationSchema: schema,
})

const firstnameUpdate = defineComponentBindsUpdate('firstname')
const lastnameUpdate = defineComponentBindsUpdate('lastname')
const emailUpdate = defineComponentBindsUpdate('email')
const telephoneUpdate = defineComponentBindsUpdate('telephone')
const localeUpdate = ref('en')
const loadingUpdate = ref(false)

// graphql
const {
  result: users,
  error: usersError,
  loading: usersLoading,
  refetch: refetchUsers,
} = useQuery(GET_USERS, variables, {
  fetchPolicy: 'cache-and-network',
})

const {
  mutate: sendMailToEmployee,
  loading: sendMailToEmployeeLoading,
  error: sendMailToEmployeeError,
} = useMutation(SEND_MAIL_TO_EMPLOYEE)

const { mutate: createEmployee, error: createEmployeeError } =
  useMutation(CREATE_EMPLOYEE)

const {
  mutate: deleteUser,
  loading: deleteUserLoading,
  error: deleteUserError,
} = useMutation(DELETE_USER)

const { mutate: updateUser, error: updateUserError } = useMutation(UPDATE_USER)

const {
  mutate: upgradeToAdmin,
  loading: upgradeToAdminLoading,
  error: upgradeToAdminError,
} = useMutation(UPDATE_USER_TO_ADMIN)

// logics
// handle edit
const handleUpdate = async () => {
  loadingUpdate.value = true
  await validateUpdate()
  errorMessages.value = errorsUpdate.value
  if (Object.keys(errorsUpdate.value).length === 0) {
    console.log('no errors', valuesUpdate)
    await updateUser({
      updateUserInput: {
        id: selectedUser.value?.id!,
        firstname: valuesUpdate.firstname,
        lastname: valuesUpdate.lastname,
        email: valuesUpdate.email,
        telephone: valuesUpdate.telephone,
        locale: localeUpdate.value,
      },
    }).then(async () => {
      loadingUpdate.value = false
      showToast('success', 'Success', 'User has been updated')
      await refetchUsers()
      closeModal()
      resetForm()
    })
  }
  loadingUpdate.value = false
}

// handle delete
const handleDelete = async (user: CustomUser) => {
  const email = user.email
  await deleteUser({
    id: user.id,
  }).then(() => {
    showToast('success', 'Success', `User ${email} has been deleted`)
    refetchUsers()
  })
}

// handle create employee
const handleCreateEmployee = async () => {
  loadingCreateEmployee.value = true
  await validate()
  errorMessages.value = errors.value
  if (Object.keys(errors.value).length === 0) {
    console.log('no errors', values)
    await createEmployee({
      createStaffInput: {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        telephone: values.telephone,
        locale: locale.value,
      },
    }).then(async () => {
      loadingCreateEmployee.value = false
      showToast('success', 'Success', 'Employee has been created')
      await refetchUsers()
      closeModal()
      resetForm()
    })
  }
  loadingCreateEmployee.value = false
}

// handle send email to employee
const handleSendMailToEmployee = async (user: CustomUser) => {
  sendMailCurrentUserId.value = user.id
  await sendMailToEmployee({
    userId: user.id,
  }).then(() => {
    showToast(
      'success',
      'Success',
      `Email has been sent to ${user.email} to create an account`,
    )
  })
}

// handle upgrade to admin
const handleUpgradeToAdmin = async (user: CustomUser) => {
  await upgradeToAdmin({
    id: user.id,
  }).then(() => {
    showToast(
      'success',
      'Success',
      `User ${user.email} has been upgraded to admin`,
    )
    refetchUsers()
    closeModal()
  })
}

const openModal = (user: CustomUser | null = null, type: string) => {
  if (type === 'detail' && user) {
    selectedUser.value = { ...user }
    visible.value.detail = true
  } else if (type === 'edit' && user) {
    selectedUser.value = { ...user }
    setValuesUpdate({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      telephone: user.telephone,
    })
    localeUpdate.value = user.locale!
    visible.value.edit = true
  } else if (type === 'create') {
    visible.value.create = true
  }
}

const closeModal = () => {
  visible.value = {
    detail: false,
    edit: false,
    create: false,
  }
}

// get locales
const getLocales = (): { name: string; value: string }[] => {
  let locales = []
  for (const [key, value] of Object.entries(SUPPORTED_LOCALES)) {
    locales.push({
      name: value,
      value: key,
    })
  }
  return locales
}

watchEffect(() => {
  // log the queries
  if (users.value) console.log(users.value)

  // all errors
  const errors = [
    usersError.value,
    deleteUserError.value,
    createEmployeeError.value,
    sendMailToEmployeeError.value,
    updateUserError.value,
    upgradeToAdminError.value,
  ]
  errors.forEach(error => {
    if (error) {
      loadingCreateEmployee.value = false
      loadingUpdate.value = false

      showToast('error', 'Error', error.message)
    }
  })
})
</script>

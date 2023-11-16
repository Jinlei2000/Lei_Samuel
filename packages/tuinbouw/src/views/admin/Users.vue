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
    @click="toggleModal(null, 'create')"
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
            @click="toggleModal(user, 'detail')"
            class="text-green-500 hover:underline"
          >
            <Eye />
          </button>
          <!-- Edit Button -->
          <button
            v-if="user.role === 'EMPLOYEE'"
            @click="toggleModal(user, 'edit')"
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
    header="User Details"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <div v-if="selectedUser">
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
    </div>
  </Dialog>

  <!-- Edit Modal -->
  <Dialog
    v-model:visible="visible.edit"
    modal
    header="Edit User"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <DynamicForm
      :schema="formUpdateEmployee"
      :validationSchema="userUpdateAdminValidationSchema"
      :handleForm="handleUpdateEmployee"
      :loading="loading.updateEmployee"
      :initial-values="{
        firstname: selectedUser?.firstname,
        lastname: selectedUser?.lastname,
        email: selectedUser?.email,
        telephone: selectedUser?.telephone,
      }"
    />
  </Dialog>

  <!-- Create Employee Modal -->
  <Dialog
    v-model:visible="visible.create"
    modal
    header="Create Employee"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <DynamicForm
      :schema="formCreateEmployee"
      :validationSchema="userCreateEmployeeValidationSchema"
      :handleForm="handleCreateEmployee"
      :loading="loading.createEmployee"
    />
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
import CustomButton from '@/components/generic/CustomButton.vue'
import DynamicForm from '@/components/generic/DynamicForm.vue'
import {
  userUpdateAdminValidationSchema,
  userCreateEmployeeValidationSchema,
} from '@/validation/schema'
import { SUPPORTED_LOCALES_TYPES } from '@/helpers/constants'

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
// form update employee
const formUpdateEmployee = {
  fields: [
    {
      label: 'First name',
      name: 'firstname',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'Last name',
      name: 'lastname',
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
      label: 'Telephone (optional)',
      name: 'telephone',
      placeholder: '0412345678',
      as: 'input',
    },
  ],

  button: {
    name: 'Update User',
  },
}
// form create employee
const formCreateEmployee = {
  fields: [
    {
      label: 'First name',
      name: 'firstname',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'Last name',
      name: 'lastname',
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
      label: 'Telephone (optional)',
      name: 'telephone',
      placeholder: '0412345678',
      as: 'input',
    },
    {
      label: 'Select Language',
      name: 'locale',
      as: 'select',
      type: 'select',
      options: SUPPORTED_LOCALES_TYPES(),
      optionValue: 'value',
      placeholder: 'Select a language',
    },
  ],

  button: {
    name: 'Create Employee',
  },
}

const loading = ref({
  createEmployee: false,
  updateEmployee: false,
})

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

const { mutate: deleteUser, error: deleteUserError } = useMutation(DELETE_USER)

const { mutate: updateUser, error: updateUserError } = useMutation(UPDATE_USER)

const {
  mutate: upgradeToAdmin,
  loading: upgradeToAdminLoading,
  error: upgradeToAdminError,
} = useMutation(UPDATE_USER_TO_ADMIN)

// logics
// handle edit employee
const handleUpdateEmployee = async (values: CustomUser) => {
  loading.value.updateEmployee = true
  await updateUser({
    updateUserInput: {
      id: selectedUser.value?.id!,
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      telephone: values.telephone,
    },
  })
  loading.value.updateEmployee = false
  showToast('success', 'Success', 'User has been updated')
  await refetchUsers()
  toggleModal()
}

// handle delete user
const handleDelete = async (user: CustomUser) => {
  const email = user.email
  await deleteUser({
    id: user.id,
  })
  showToast('success', 'Success', `User ${email} has been deleted`)
  refetchUsers()
}

// handle create employee
const handleCreateEmployee = async (values: CustomUser) => {
  console.log(values)
  loading.value.createEmployee = true
  await createEmployee({
    createStaffInput: {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      telephone: values.telephone,
      locale: values.locale,
    },
  })
  loading.value.createEmployee = false
  showToast('success', 'Success', 'Employee has been created')
  await refetchUsers()
  toggleModal()
}

// handle send email to employee
const handleSendMailToEmployee = async (user: CustomUser) => {
  sendMailCurrentUserId.value = user.id
  await sendMailToEmployee({
    userId: user.id,
  })
  showToast(
    'success',
    'Success',
    `Email has been sent to ${user.email} to create an account`,
  )
}

// handle upgrade to admin
const handleUpgradeToAdmin = async (user: CustomUser) => {
  await upgradeToAdmin({
    id: user.id,
  })
  showToast(
    'success',
    'Success',
    `User ${user.email} has been upgraded to admin`,
  )
  await refetchUsers()
  toggleModal()
}

// open or close modal
const toggleModal = (
  user: CustomUser | null = null,
  type: string = 'close',
) => {
  selectedUser.value = user ? { ...user } : null
  visible.value = {
    detail: type === 'detail',
    edit: type === 'edit',
    create: type === 'create',
  }
}

watchEffect(() => {
  // log the queries
  // if (users.value) console.log(users.value)

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
      loading.value = {
        createEmployee: false,
        updateEmployee: false,
      }

      showToast('error', 'Error', error.message)
    }
  })
})
</script>

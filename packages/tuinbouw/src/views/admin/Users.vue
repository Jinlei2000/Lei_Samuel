<template>
  <div
    class="m-auto mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
  >
    <div class="flex w-full flex-col gap-3">
      <!-- Filters + Searchbar -->
      <section :class="['relative flex w-full items-center justify-between']">
        <!-- Filter -->
        <Filter v-model="variables.filters" :options="FILTER_OPTIONS_USERS" />

        <!-- Searchbar -->
        <Search v-model="variables.searchString" />
      </section>

      <!-- Title + Sort -->
      <header class="flex w-full items-center justify-between">
        <!-- Title -->
        <h1 class="text-2xl">Users</h1>
        <div class="flex gap-3">
          <!-- Sort -->
          <Sort v-model="variables.order" :options="SORT_OPTIONS_USERS" />
          <!-- add employee button -->
          <button
            class="bg-primary-green my-4 rounded px-4 py-2 text-white"
            @click="toggleModal(null, 'create')"
          >
            Add Employee
          </button>
        </div>
      </header>
    </div>
  </div>

  <!-- Skeleton -->
  <div v-if="loading.data" class="m-auto flex max-w-7xl flex-col gap-3">
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
    <div class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"></div>
  </div>

  <!-- Users -->
  <div v-else-if="users && users.length > 0">
    <div class="m-auto mb-4 flex max-w-7xl flex-col gap-3">
      <button
        v-for="user in users"
        :key="user.id"
        class="hover:scale-101 rounded-2xl bg-gray-200 p-1 transition-all duration-100 hover:cursor-pointer"
        :class="user.uid === null ?? 'border-red-500'"
        @click="toggleModal(user, 'detail')"
      >
        <div class="flex h-16 items-center gap-3 sm:h-11">
          <!-- Profile Picture -->
          <div>
            <Avatar
              :user="user"
              class="h-16 w-16 overflow-hidden rounded-2xl sm:h-11 sm:w-11"
            />
          </div>

          <!-- Name + Email -->
          <div class="flex w-full items-center">
            <h2 class="w-1/3 text-left text-xl sm:text-lg md:w-1/4 lg:w-1/5">
              {{ user.firstname }} {{ user.lastname }}
            </h2>
            <p class="hidden text-gray-600 sm:block">
              {{ user.email }}
            </p>
          </div>

          <!-- Role -->
          <div class="flex w-1/4 justify-end p-3 md:w-1/6">
            <p
              class="rounded-full px-3 py-1 text-lg lowercase text-white sm:text-base"
              :class="
                user.role === 'EMPLOYEE'
                  ? 'bg-primary-green'
                  : user.role === 'CLIENT'
                    ? 'bg-primary-blue'
                    : user.role === 'ADMIN'
                      ? 'bg-primary-orange'
                      : ''
              "
            >
              {{ user.role }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </div>

  <!-- No Users -->
  <div v-else-if="users.length === 0">
    <p class="text-6xl font-black">Loading Users...</p>
  </div>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.openModal"
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
    <div v-if="selectedUser && visible.detail">
      <h2 class="mb-2 text-xl font-semibold">
        {{ selectedUser.fullname }}
      </h2>
      <p class="text-gray-600">
        {{ selectedUser.email }}
      </p>
      <p class="text-gray-600">
        {{ selectedUser.telephone }}
      </p>
      <div class="flex justify-between">
        <CustomButton
          name="Delete"
          :loading="deleteUserLoading"
          variant="warning"
          @click="handleDelete(selectedUser)"
        />
        <div class="flex gap-3">
          <!-- upgrade to admin button -->
          <CustomButton
            v-if="selectedUser.role === 'EMPLOYEE'"
            name="Upgrade to Admin"
            :loading="upgradeToAdminLoading"
            @click="handleUpgradeToAdmin(selectedUser)"
          />
          <!-- edit button -->
          <CustomButton
            name="Edit"
            :loading="upgradeToAdminLoading"
            @click="toggleModal(selectedUser, 'edit')"
          />
        </div>
      </div>
    </div>
    <DynamicForm
      v-if="selectedUser && visible.edit"
      :schema="formUpdateEmployee"
      :validation-schema="userUpdateAdminValidationSchema"
      :handle-form="handleUpdateEmployee"
      :loading="loading.updateEmployee"
      :cancel="cancelUserEdit"
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
      :validation-schema="userCreateEmployeeValidationSchema"
      :handle-form="handleCreateEmployee"
      :loading="loading.createEmployee"
    />
  </Dialog>
</template>

<script setup lang="ts">
import Avatar from '@/components/generic/Avatar.vue'
import CustomButton from '@/components/generic/CustomButton.vue'
import DynamicForm from '@/components/generic/DynamicForm.vue'
import Filter from '@/components/generic/Filter.vue'
import Search from '@/components/generic/Search.vue'
import Sort from '@/components/generic/Sort.vue'
import useCustomToast from '@/composables/useCustomToast'
import { SEND_MAIL_TO_EMPLOYEE } from '@/graphql/mail.token.mutation'
import {
  CREATE_EMPLOYEE,
  DELETE_USER,
  UPDATE_USER,
  UPDATE_USER_TO_ADMIN,
} from '@/graphql/user.mutation'
import { GET_USERS } from '@/graphql/user.query'
import {
  FILTER_OPTIONS_USERS,
  ORDER_DIRECTION,
  SORT_OPTIONS_USERS,
  SUPPORTED_LOCALES_TYPES,
} from '@/helpers/constants'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import {
  userCreateEmployeeValidationSchema,
  userUpdateAdminValidationSchema,
} from '@/validation/schema'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { computed, ref, watchEffect } from 'vue'

// composables
const { showToast } = useCustomToast()

// variables
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
  searchString: '',
})
const visible = ref({
  openModal: false,
  detail: false,
  edit: false,
  create: false,
})
const selectedUser = ref<CustomUser | null>(null)
const sendMailCurrentUserId = ref<string | null>(null)
const users = computed(() => usersResult.value?.users || [])
const loading = ref({
  createEmployee: false,
  updateEmployee: false,
  data: computed(() => usersLoading.value),
})
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

// graphql
const {
  result: usersResult,
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
  toggleModal()
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

  // switch case for type
  switch (type) {
    case 'edit':
      visible.value = {
        openModal: true,
        detail: false,
        edit: true,
        create: false,
      }
      break
    case 'detail':
      visible.value = {
        openModal: true,
        detail: true,
        edit: false,
        create: false,
      }
      break
    case 'create':
      visible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: true,
      }
      break
    case 'close':
      visible.value = {
        openModal: false,
        detail: false,
        edit: false,
        create: false,
      }
      break
    default:
      break
  }
}

const cancelUserEdit = () => {
  toggleModal(selectedUser.value, 'detail')
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
        ...loading.value,
        createEmployee: false,
        updateEmployee: false,
      }

      showToast('error', 'Error', error.message)
    }
  })
})
</script>

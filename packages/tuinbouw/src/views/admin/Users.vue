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

  <!-- filters & orders -->

  <!-- search bar -->

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
            :loading="sendMailToEmployeeLoading"
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
  </Dialog>

  <!-- Edit Modal -->
  <Dialog
    v-model:visible="visible.edit"
    modal
    maximizable
    header="Edit User"
    :style="{ width: '50vw' }"
    v-if="selectedUser"
    @click:close="closeModal"
    class="max-w-lg"
  >
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

      <button
        type="submit"
        class="bg-primary-green mt-4 rounded-md px-4 py-2 text-white"
      >
        <span v-if="!loadingCreateEmployee">Create Employee</span>
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
import { DELETE_USER, CREATE_EMPLOYEE } from '@/graphql/user.mutation'
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
    direction: 'ASC',
  },
  searchString: '',
})
const visible = ref({
  detail: false,
  edit: false,
  create: false,
})
const selectedUser = ref<CustomUser | null>(null)

const schema = yup.object({
  email: yup.string().required().email(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  telephone: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10)
    .max(10)
    .optional(),
})

const errorMessages = ref<{
  [key: string]: string | undefined
}>({
  firstname: '',
  lastname: '',
  email: '',
  telephone: '',
})
const {
  handleSubmit,
  resetForm,
  defineComponentBinds,
  errors,
  values,
  validate,
} = useForm({
  validationSchema: schema,
})

const firstname = defineComponentBinds('firstname')
const lastname = defineComponentBinds('lastname')
const email = defineComponentBinds('email')
const telephone = defineComponentBinds('telephone')
const locale = ref('en')

const loadingCreateEmployee = ref(false)

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

// logics
// handle edit
const handleEdit = () => {
  console.log('edit user with id: ')
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
  console.log(`send email to employee with id: ${user.id}`)
}

const openModal = (user: CustomUser | null = null, type: string) => {
  selectedUser.value = user
  if (type === 'detail') {
    visible.value.detail = true
  } else if (type === 'edit') {
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
  ]
  errors.forEach(error => {
    if (error) {
      loadingCreateEmployee.value = false

      showToast('error', 'Error', error.message)
    }
  })
})
</script>

<template>
  <section
    class="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center justify-center gap-5"
  >
    <div class="mb-4 flex w-full flex-col gap-3">
      <!-- Filters + Searchbar -->
      <section
        class="relative flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-between"
      >
        <!-- Filter -->
        <Filter v-model="variables.filters" :options="FILTER_OPTIONS_USERS" />

        <!-- Searchbar -->
        <Search
          v-model="variables.searchString"
          class="w-full sm:w-auto"
          placeholder="Search for users"
        />
      </section>

      <!-- Title + Sort -->
      <header class="flex w-full items-center justify-between">
        <!-- Title -->
        <h1 class="text-2xl">{{ $t('users.title') }}</h1>
        <!-- Sort -->
        <Sort v-model="variables.order" :options="SORT_OPTIONS_USERS" />
      </header>
    </div>
  </section>

  <!-- Skeleton -->
  <section
    v-if="loading.data"
    class="mx-auto flex w-full max-w-7xl flex-col gap-3"
  >
    <div
      v-for="i in 10"
      :key="i"
      class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"
    />
  </section>

  <!-- Users -->
  <section v-else-if="users && users.length > 0">
    <div class="mx-auto mb-4 flex max-w-7xl flex-col gap-3">
      <!-- Add Employee -->
      <button
        class="border-primary-green text-primary-green flex h-14 w-full items-center justify-center rounded-2xl border-[1px]"
        @click="toggleModal(null, 'create')"
      >
        <PlusCircle class="mr-2" />
        {{ $t('users.button.add') }}
      </button>
      <!-- Users -->
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
              {{ $t(user.role) }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </section>

  <!-- No Users -->
  <NoResult v-else-if="users.length === 0" />

  <!-- Detail Modal -->
  <Dialog
    v-if="selectedUser"
    v-model:visible="visible.detail"
    modal
    :header="$t('users.modal.detail.title')"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <!-- Show Detail -->
    <div v-if="!isEditing">
      <div class="mb-2 flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <Avatar
            :user="selectedUser"
            class="h-14 w-14 overflow-hidden rounded-full"
          />
          <div>
            <h2 class="text-xl font-semibold capitalize">
              {{ selectedUser.fullname }}
            </h2>
            <p class="text-gray-600">
              {{ selectedUser.email }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Phone class="h-5 w-5" />
          <p v-if="selectedUser.telephone">
            {{ selectedUser.telephone }}
          </p>
          <p v-else class="text-gray-600">{{ $t('users.unknown') }}</p>
        </div>
        <div
          v-if="selectedUser.locations.length > 0"
          class="flex flex-col gap-3"
        >
          <div
            v-for="location in selectedUser.locations"
            :key="location.id"
            class="flex items-center justify-between overflow-hidden rounded-2xl bg-gray-200 text-left"
          >
            <div class="flex w-2/3 flex-col gap-2 py-3 pl-6 sm:w-1/2">
              <!-- location or nothing -->
              <h3 class="text-lg">{{ location.title }}</h3>
              <div>
                <p class="opacity-70">
                  {{ location.address.split(',')[0] }}
                </p>
                <p class="opacity-70">{{ location.address.split(',')[1] }}</p>
              </div>
            </div>
            <div
              class="h-28 w-1/3 overflow-auto rounded-3xl rounded-t-none rounded-bl-none sm:w-1/2"
            >
              <Map class="h-full w-full" :locations="[location]" />
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center rounded-2xl bg-gray-200 p-6"
        >
          <p class="text-gray-900">
            {{ $t('users.modal.detail.no.location') }}
          </p>
        </div>
        <div v-if="selectedUser.role == 'EMPLOYEE'" class="mb-3">
          <p>
            {{ $t('users.modal.detail.absences') }}:
            {{ selectedUser.absentCount }}
          </p>
        </div>
      </div>

      <div class="mb-2 flex flex-col gap-2">
        <!-- Upgrade to Admin -->
        <CustomButton
          v-if="selectedUser.role === 'EMPLOYEE'"
          class="block w-full"
          name="users.modal.detail.button.upgrade"
          :loading="loading.upgradeToAdmin"
          @click="handleUpgradeToAdmin(selectedUser)"
        />
        <!-- Send Email to Employee (Create Account) -->
        <CustomButton
          v-if="selectedUser.uid === null"
          name="users.modal.detail.button.account"
          :loading="loading.sendMailToEmployee"
          class="block w-full"
          @click="handleSendMailToEmployee(selectedUser)"
        />
      </div>

      <!-- Delete & Edit -->
      <div v-if="selectedUser.role === 'EMPLOYEE'" class="flex justify-between">
        <!-- Delete -->
        <CustomButton
          name="users.modal.detail.button.delete"
          variant="warning"
          :loading="loading.deleteEmployee"
          @click="handleDelete(selectedUser)"
        />
        <!-- Edit -->
        <CustomButton
          name="users.modal.detail.button.edit"
          @click="isEditing = true"
        />
      </div>
    </div>
    <!-- Edit Form -->
    <div v-if="isEditing">
      <DynamicForm
        :schema="formUpdateEmployee"
        :validation-schema="userUpdateAdminValidationSchema"
        :handle-form="handleUpdateEmployee"
        :loading="loading.updateEmployee"
        :cancel="cancelUserEdit"
        :initial-values="{
          firstname: selectedUser.firstname,
          lastname: selectedUser.lastname,
          email: selectedUser.email,
          telephone: selectedUser.telephone,
        }"
      />
    </div>
  </Dialog>

  <!-- Create Employee Modal -->
  <Dialog
    v-model:visible="visible.create"
    modal
    :header="$t('users.modal.create.title')"
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
import NoResult from '@/components/generic/NoResult.vue'
import Search from '@/components/generic/Search.vue'
import Sort from '@/components/generic/Sort.vue'
import Map from '@/components/Map.vue'
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
import LogRocket from 'logrocket'
import { Phone, PlusCircle } from 'lucide-vue-next'
import type { ComputedRef } from 'vue'
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
const visible = ref<{
  detail: boolean
  create: boolean
}>({
  detail: false,
  create: false,
})
const selectedUser = ref<CustomUser | null>(null)
const users = computed(() => usersResult.value?.users || [])
const loading = ref<{
  createEmployee: boolean
  updateEmployee: boolean
  deleteEmployee: boolean
  upgradeToAdmin: boolean
  sendMailToEmployee: boolean
  data: ComputedRef<boolean>
}>({
  createEmployee: false,
  updateEmployee: false,
  deleteEmployee: false,
  upgradeToAdmin: false,
  sendMailToEmployee: false,
  data: computed(() => usersLoading.value),
})
const isEditing = ref<boolean>(false)
// form update employee
const formUpdateEmployee = {
  fields: [
    {
      label: 'users.form.firstname',
      name: 'firstname',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'users.form.lastname',
      name: 'lastname',
      placeholder: 'Doe',
      as: 'input',
    },
    {
      label: 'users.form.email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
    {
      label: 'users.form.telephone',
      name: 'telephone',
      placeholder: '0412345678',
      as: 'input',
    },
  ],

  button: {
    name: 'users.form.update.submit',
  },
}
// form create employee
const formCreateEmployee = {
  fields: [
    {
      label: 'users.form.firstname',
      name: 'firstname',
      placeholder: 'John',
      as: 'input',
    },
    {
      label: 'users.form.lastname',
      name: 'lastname',
      placeholder: 'Doe',
      as: 'input',
    },
    {
      label: 'users.form.email',
      name: 'email',
      placeholder: 'john@gmail.com',
      as: 'input',
    },
    {
      label: 'users.form.telephone',
      name: 'telephone',
      placeholder: '0412345678',
      as: 'input',
    },
    {
      label: 'users.form.locale',
      name: 'locale',
      as: 'select',
      type: 'select',
      options: SUPPORTED_LOCALES_TYPES(),
      optionValue: 'value',
      placeholder: 'users.form.locale.placeholder',
    },
  ],

  button: {
    name: 'users.form.create.submit',
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

const { mutate: sendMailToEmployee } = useMutation(SEND_MAIL_TO_EMPLOYEE)

const { mutate: createEmployee } = useMutation(CREATE_EMPLOYEE)

const { mutate: deleteUser } = useMutation(DELETE_USER)

const { mutate: updateUser } = useMutation(UPDATE_USER)

const { mutate: upgradeToAdmin } = useMutation(UPDATE_USER_TO_ADMIN)

// logics
// handle edit employee
const handleUpdateEmployee = async (values: CustomUser) => {
  try {
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
    showToast('success', 'toast.success', 'users.toast.update')
    await refetchUsers()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'users.toast.error.update')
  } finally {
    loading.value.updateEmployee = false
  }
}

// handle delete user
const handleDelete = async (user: CustomUser) => {
  try {
    loading.value.deleteEmployee = true
    const email = user.email
    await deleteUser({
      id: user.id,
    })
    showToast('success', 'toast.success', `users.toast.delete`)
    refetchUsers()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'users.toast.error.delete')
  } finally {
    loading.value.deleteEmployee = false
  }
}

// handle create employee
const handleCreateEmployee = async (values: CustomUser) => {
  try {
    // console.log(values)
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
    showToast('success', 'toast.success', 'users.toast.create')
    await refetchUsers()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'users.toast.error.create')
  } finally {
    loading.value.createEmployee = false
  }
}

// handle send email to employee
const handleSendMailToEmployee = async (user: CustomUser) => {
  try {
    loading.value.sendMailToEmployee = true
    await sendMailToEmployee({
      userId: user.id,
    })
    showToast('success', 'toast.success', `users.toast.email ${user.email}`)
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'users.toast.error.email')
  } finally {
    loading.value.sendMailToEmployee = false
  }
}

// handle upgrade to admin
const handleUpgradeToAdmin = async (user: CustomUser) => {
  try {
    loading.value.upgradeToAdmin = true
    await upgradeToAdmin({
      id: user.id,
    })
    showToast('success', 'toast.success', `users.toast.upgrade`)
    await refetchUsers()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'users.toast.error.upgrade')
  } finally {
    loading.value.upgradeToAdmin = false
  }
}

// open or close modal
const toggleModal = (
  user: CustomUser | null = null,
  type: string = 'close',
) => {
  selectedUser.value = user ? { ...user } : null
  isEditing.value = false

  visible.value = {
    detail: type === 'detail',
    create: type === 'create',
  }
}

const cancelUserEdit = () => {
  toggleModal(selectedUser.value, 'detail')
}

watchEffect(() => {
  // log the queries
  // if (users.value) console.log(users.value)

  // all errors
  if (usersError.value) {
    // console.log(usersError.value)
    LogRocket.captureException(usersError.value as Error)
    showToast('error', 'toast.error', 'users.toast.user')
  }
})
</script>

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
      >
        <div class="p-6">
          <h2 class="mb-2 text-2xl font-semibold">
            {{ user.firstname }} {{ user.lastname }}
          </h2>
          <p class="text-gray-600">{{ user.email }}</p>
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
  </Dialog>
</template>

<script setup lang="ts">
import { GET_USERS } from '@/graphql/user.query'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, watchEffect } from 'vue'
import { ArrowLeft, Trash2, Pencil, Eye } from 'lucide-vue-next'
import useCustomToast from '@/composables/useCustomToast'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { DELETE_USER } from '@/graphql/user.mutation'

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
  mutate: deleteUserMutation,
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
  await deleteUserMutation({
    id: user.id,
  }).then(() => {
    showToast('success', 'Success', `User ${email} has been deleted`)
    refetchUsers()
  })
}

const openModal = (user: CustomUser | null = null, type: string) => {
  console.log(type)
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

watchEffect(() => {
  // log the queries
  if (users.value) console.log(users.value)

  // all errors
  const errors = [usersError.value, deleteUserError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

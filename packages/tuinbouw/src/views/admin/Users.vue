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
        class="transform overflow-hidden rounded-md bg-white shadow-md transition-transform hover:scale-105"
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
          <button @click="" class="text-green-500 hover:underline">
            <Eye />
          </button>
          <!-- Edit Button -->
          <button @click="" class="text-blue-500 hover:underline">
            <Pencil />
          </button>
          <!-- Delete Button -->
          <button
            @click="handleDelete(user.id)"
            class="text-red-500 hover:underline"
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GET_USERS } from '@/graphql/user.query'
import { useQuery } from '@vue/apollo-composable'
import { ref, watchEffect } from 'vue'
import { ArrowLeft, Trash2, Pencil, Eye } from 'lucide-vue-next'

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

const {
  result: users,
  error: usersError,
  loading: usersLoading,
} = useQuery(GET_USERS, variables, {
  fetchPolicy: 'cache-and-network',
})

// handle edit
const handleEdit = () => {
  console.log('edit user with id: ')
}

// handle delete
const handleDelete = (id: string) => {
  console.log('delete user with id: ', id)
}

// log the queries
watchEffect(() => {
  if (users.value) console.log(users.value)

  // all errors
  if (usersError.value) console.log(usersError.value)
})
</script>

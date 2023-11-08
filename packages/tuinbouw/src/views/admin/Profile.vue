<template>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Profile
  </h1>

  <!-- loading -->
  <div v-if="userLoading">
    <p class="text-6xl font-black">Loading User...</p>
  </div>

  <div v-if="!isEditing">
    <!-- edit button -->
    <button class="flex" @click="isEditing = true">
      <Pencil class="h-6 w-6" />
    </button>

    <!-- show user -->
    <div v-if="user">
      <div class="overflow-hidden rounded-lg bg-white p-6 shadow">
        <h2 class="text-2xl font-semibold text-gray-900">
          {{ user.fullname }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">{{ user.email }}</p>
        <p class="mt-2 text-sm font-medium text-gray-600">
          Role: {{ user.role }}
        </p>
        <p
          v-if="user.role !== Role.CLIENT"
          class="mt-2 text-sm font-medium text-gray-600"
        >
          Absent Count: {{ user.absentCount }}
        </p>
        <p class="mt-2 text-sm font-medium text-gray-600">
          Telephone: {{ user.telephone }}
        </p>
        <div v-if="user.role == Role.CLIENT && user.company">
          <p class="mt-2 text-sm font-medium text-gray-600">
            Company: {{ user.company }}
          </p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            Invoice Option: {{ user.invoiceOption }}
          </p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            VAT Number: {{ user.btwNumber }}
          </p>
        </div>
        <!-- Locations -->
        <div v-if="user.locations && user.locations.length > 0" class="mt-4">
          <h3 class="text-lg font-semibold text-gray-900">Locations</h3>
          <!-- Button for adding a new location -->
          <!-- v-if="user.locations.length === 0 || user.role === Role.CLIENT" -->
          <CustomButton
            name="Add New Location"
            :loading="loadingCreateLocation"
            @click="addNewLocation()"
          />

          <!-- show all locations -->
          <div v-for="location in user.locations" :key="location.id">
            <div class="mt-4 overflow-hidden rounded-lg bg-white p-4 shadow">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ location.id }}
              </h3>
              <p class="mt-2 text-sm font-medium text-gray-600">
                Address: {{ location.address }}
              </p>
              <!-- Edit and Delete buttons -->
              <div class="mt-2 flex">
                <button
                  @click="editLocation(location.id)"
                  class="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  <Pencil />
                </button>
                <button
                  @click="deleteLocation(location.id)"
                  class="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          </div>
        </div>
        <CustomButton
          name="Delete Account"
          :loading="deleteUserLoading"
          @click="handleDeleteUser()"
        />
      </div>
    </div>
  </div>

  <div v-if="isEditing">
    <!-- go back button -->
    <button class="flex" @click="isEditing = false">
      <ArrowLeft class="h-6 w-6" />
      Go back
    </button>
    <form @submit.prevent="handleUpdateUser">
      <CustomButton
        type="submit"
        name="Update User"
        :loading="updateUserLoading"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import useFirebase from '@/composables/useFirebase'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { DELETE_USER, UPDATE_USER } from '@/graphql/user.mutation'
import { GET_USER_BY_ID } from '@/graphql/user.query'
import { Role, type CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Pencil, Trash2, ArrowLeft } from 'lucide-vue-next'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// composables
const { customUser } = useCustomUser()
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()
const { firebaseUser } = useFirebase()
const { replace } = useRouter()

// variables
const isEditing = ref(false)
const user = computed<CustomUser | null>(() => userResult.value?.user || null)
const loadingCreateLocation = ref(false)

// graphql
const {
  result: userResult,
  loading: userLoading,
  error: userError,
  refetch: refetchUser,
} = useQuery(
  GET_USER_BY_ID,
  () => ({
    id: customUser.value?.id,
  }),
  {
    fetchPolicy: 'cache-and-network',
  },
)

const {
  mutate: updateUser,
  loading: updateUserLoading,
  error: updateUserError,
} = useMutation(UPDATE_USER)

const {
  mutate: deleteUser,
  loading: deleteUserLoading,
  error: deleteUserError,
} = useMutation(DELETE_USER)

// logics
// handle delete user
const handleDeleteUser = async () => {
  await deleteUser({
    id: customUser.value?.id,
  }).then(() => {
    showToast('success', 'Success', `You have deleted your account`)
    customUser.value = null
    firebaseUser.value = null
    replace('/')
  })
}
// handle update user
const handleUpdateUser = async () => {}

// add new location
const addNewLocation = async () => {}
// edit location
const editLocation = async (id: string) => {}
// delete location
const deleteLocation = async (id: string) => {}

watchEffect(() => {
  // log the queries
  // if (userResult.value) console.log(userResult.value)

  // all errors
  const errors = [userError.value, updateUserError.value, deleteUserError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

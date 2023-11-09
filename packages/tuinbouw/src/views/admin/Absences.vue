<template>
  <!-- go back button -->
  <button class="flex" @click="$router.go(-1)" v-bind="$attrs">
    <ArrowLeft class="h-6 w-6" />
    Go back
  </button>
  <h1
    class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
  >
    Absences
  </h1>

  <!-- TODO: filters & orders -->

  <!-- show loading -->
  <div v-if="absencesLoading">
    <p class="text-6xl font-black">Loading Absences...</p>
  </div>

  <!-- show absences -->
  <div v-if="absences && absences.absences.length > 0">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="a in absences.absences"
        :key="a.id"
        class="overflow-hidden rounded-lg bg-white shadow"
      >
        <div class="px-4 py-5 sm:p-6">
          <!-- Absence details go here -->
          <h3 class="text-lg font-semibold text-gray-900">{{ a.user.id }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ a.description }}</p>
          <!-- Add more details as needed -->
          <p class="mt-2 text-sm font-medium text-indigo-600">{{ a.type }}</p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            {{ formatDateTime(a.startDate) }} - {{ formatDateTime(a.endDate) }}
          </p>
          <p class="mt-2 text-sm font-medium text-gray-600">
            Total Days: {{ a.totalDays }}
          </p>
          <p class="mt-2 text-sm text-gray-500">
            Created At: {{ formatDateTime(a.createdAt) }}
          </p>
        </div>
        <div
          class="flex items-center justify-end space-x-4 border-t border-gray-200 p-6"
        >
          <!-- View More Button -->
          <button
            @click="openModal(a, 'detail')"
            class="text-green-500 hover:underline"
          >
            <Eye />
          </button>

          <!-- Delete Button -->
          <button @click="handleDelete(a)" class="text-red-500 hover:underline">
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
    header="Absence Details"
    :style="{ width: '50vw' }"
    @click:close="closeModal"
    class="max-w-lg"
  >
    <div v-if="selectedAbsence">
      <h2 class="mb-2 text-xl font-semibold">
        user id:
        {{ selectedAbsence.user?.id }}
      </h2>
      <p class="text-gray-600">
        {{ selectedAbsence.description }}
      </p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { DELETE_ABSENCE } from '@/graphql/absence.mutation'
import { GET_ALL_ABSENCES } from '@/graphql/absence.query'
import type { Absence } from '@/interfaces/absence.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Eye, ArrowLeft, Trash2 } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'

// composables
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()

// variables
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: 'DESC',
  },
  searchString: '',
})
const visible = ref({
  detail: false,
})
const selectedAbsence = ref<Absence | null>(null)

// graphql
const {
  result: absences,
  loading: absencesLoading,
  error: absencesError,
  refetch: refetchAbsences,
} = useQuery(GET_ALL_ABSENCES, variables, {
  fetchPolicy: 'cache-and-network',
})

const { mutate: deleteAbsence, error: deleteAbsenceError } =
  useMutation(DELETE_ABSENCE)

// logics
// handle delete
const handleDelete = async (absence: Absence) => {
  await deleteAbsence({
    id: absence.id,
  }).then(() => {
    showToast(
      'success',
      'Success',
      `Absence of ${absence.user?.firstname} has been deleted`,
    )
    refetchAbsences()
  })
}

const openModal = (absence: Absence | null = null, type: string) => {
  if (type === 'detail' && absence) {
    selectedAbsence.value = { ...absence }
    visible.value.detail = true
  }
}

const closeModal = () => {
  visible.value = {
    detail: false,
  }
}

watchEffect(() => {
  // log the queries
  if (absences.value) console.log(absences.value)

  // all errors
  const errors = [absencesError.value, deleteAbsenceError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

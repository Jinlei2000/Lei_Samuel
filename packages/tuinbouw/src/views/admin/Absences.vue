<template>
  <main>
    <!-- Filters -->
    <section
      class="m-auto mb-6 mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
    >
      <!-- Filters -->
      <section class="relative flex w-full items-center">
        <Filter
          v-model="variables.filters"
          :options="FILTER_OPTIONS_ABSENCES"
        />
      </section>

      <!-- Title + Sort -->
      <header class="flex w-full items-center justify-between">
        <!-- Title -->
        <h1 class="text-2xl">Absences</h1>
        <!-- Sort -->
        <Sort v-model="variables.order" :options="SORT_OPTIONS_ABSENCES" />
      </header>
    </section>

    <!-- Skeleton -->
    <section v-if="loading.data" class="m-auto flex max-w-7xl flex-col gap-3">
      <div
        v-for="i in 10"
        :key="i"
        class="h-12 w-full animate-pulse rounded-2xl bg-gray-200"
      />
    </section>

    <!-- Absences -->
    <section
      v-else-if="absences && absences.length > 0"
      class="m-auto max-w-7xl"
    >
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="a in absences"
          :key="a.id"
          class="overflow-hidden rounded-lg bg-white text-left shadow"
          @click="toggleModal(a, 'detail')"
        >
          <div class="px-4 py-5 sm:p-6">
            <!-- Absence details go here -->
            <h3 class="text-lg font-semibold text-gray-900">
              {{ a.user.id }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">{{ a.description }}</p>
            <!-- Add more details as needed -->
            <p class="mt-2 text-sm font-medium text-indigo-600">{{ a.type }}</p>
            <p class="mt-2 text-sm font-medium text-gray-600">
              {{ formatDateTime(a.startDate) }} -
              {{ formatDateTime(a.endDate) }}
            </p>
            <p class="mt-2 text-sm font-medium text-gray-600">
              Total Days: {{ a.totalDays }}
            </p>
            <p class="mt-2 text-sm text-gray-500">
              Created At: {{ formatDateTime(a.createdAt) }}
            </p>
          </div>
        </button>
      </div>
    </section>

    <!-- No Absences -->
    <NoResult v-else-if="absences.length === 0" />
  </main>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    header="Absence Details"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <!-- Show Detail -->
    <div>
      <h2 class="mb-2 text-xl font-semibold">
        user id:
        {{ selectedAbsence?.user?.id }}
      </h2>
      <p class="text-gray-600">
        {{ selectedAbsence?.description }}
      </p>
      <!-- Delete button -->
      <CustomButton
        name="Delete"
        :loading="loading.delete"
        variant="warning"
        @click="handleDelete(selectedAbsence!)"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import Filter from '@/components/generic/Filter.vue'
import NoResult from '@/components/generic/NoResult.vue'
import Sort from '@/components/generic/Sort.vue'
import useCustomToast from '@/composables/useCustomToast'
import useTimeUtilities from '@/composables/useTimeUtilities'
import { DELETE_ABSENCE } from '@/graphql/absence.mutation'
import { GET_ALL_ABSENCES } from '@/graphql/absence.query'
import {
  FILTER_OPTIONS_ABSENCES,
  ORDER_DIRECTION,
  SORT_OPTIONS_ABSENCES,
} from '@/helpers/constants'
import type { Absence } from '@/interfaces/absence.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useMutation, useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { computed, type ComputedRef, ref, watchEffect } from 'vue'

// composables
const { showToast } = useCustomToast()
const { formatDateTime } = useTimeUtilities()

// variables
const selectedAbsence = ref<Absence | null>(null)
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
})
const visible = ref<{
  detail: boolean
}>({
  detail: false,
})
const loading = ref<{
  delete: boolean
  data: ComputedRef<boolean>
}>({
  delete: false,
  data: computed(() => absencesLoading.value),
})
const absences = computed<Absence[]>(() => absencesResult.value?.absences || [])

// graphql
const {
  result: absencesResult,
  error: absencesError,
  loading: absencesLoading,
  refetch: refetchAbsences,
} = useQuery(GET_ALL_ABSENCES, variables, {
  fetchPolicy: 'cache-and-network',
})

const { mutate: deleteAbsence } = useMutation(DELETE_ABSENCE)

// logics

// handle delete absence
const handleDelete = async (absence: Absence): Promise<void> => {
  try {
    loading.value.delete = true
    await deleteAbsence({
      id: absence.id,
    })
    showToast(
      'success',
      'Success',
      `Absence of ${absence.user.firstname} has been deleted`,
    )
    await refetchAbsences()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't delete absence")
  } finally {
    loading.value.delete = false
  }
}

// open or close modal
const toggleModal = (
  absence: Absence | null = null,
  type: string = 'close',
): void => {
  selectedAbsence.value = absence ? { ...absence } : null
  visible.value = {
    detail: type === 'detail',
  }
}

watchEffect(() => {
  // log the queries
  // if (absences.value) console.log(absences.value)
  // if (absencesResult.value) console.log(absencesResult.value)

  // all errors
  if (absencesError.value) {
    // console.log(absencesError.value)
    LogRocket.captureException(absencesError.value)
    showToast('error', 'Error', "Couldn't load absences")
  }
})
</script>

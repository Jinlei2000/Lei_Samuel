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
        <h1 class="text-2xl">{{ $t('absences.title') }}</h1>
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
      <div class="flex w-full flex-col gap-3">
        <button
          v-for="absence in absences"
          :key="absence.id"
          class="flex items-center justify-between rounded-2xl bg-gray-200 p-3 pl-6 text-left"
          @click="toggleModal(absence, 'detail')"
        >
          <div class="flex w-1/2 gap-3 sm:gap-0">
            <p class="min-w-1/3">
              {{ formatAbsenceDate(absence.startDate) }}
            </p>
            <p class="opacity-70">
              {{ absence.totalDays }} {{ $t('absences.days') }}
            </p>
          </div>
          <p
            class="bg-primary-orange rounded-full px-3 py-1 capitalize text-white"
          >
            {{ $t(absence.type) }}
          </p>
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
    :header="$t('material.modal.detail.title')"
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
        name="absences.modal.detail.button.delete"
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
    showToast('success', 'toast.success', `absences.toast.delete`)
    await refetchAbsences()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'toast.error', 'absences.toast.error.delete')
  } finally {
    loading.value.delete = false
  }
}

// Change date to mm/dd/yyyy
const formatAbsenceDate = (date: string): string => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
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
    showToast('error', 'toast.error', 'absences.toast.absences')
  }
})
</script>

<template>
  <main
    class="m-auto mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
  >
    <div class="flex w-full flex-col gap-10">
      <!-- Filters + Searchbar -->
      <section
        :class="[
          'relative flex w-full items-center',
          props.showAllOverview ? 'justify-between' : 'justify-end',
        ]"
      >
        <!-- Filter -->
        <Filter
          v-if="props.showAllOverview"
          v-model="variables.filters"
          :options="FILTER_OPTIONS_MATERIALS"
        />

        <!-- Searchbar -->
        <Search v-model="variables.searchString" />
      </section>

      <!-- Title + Sort -->
      <header class="flex w-full items-center justify-between">
        <!-- Title -->
        <h1 class="text-2xl">Materials</h1>
        <!-- Sort -->
        <Sort v-model="variables.order" :options="SORT_OPTIONS_MATERIALS" />
      </header>
    </div>

    <!-- Loading -->
    <template v-if="loading.data">
      <div
        class="grid-rows-auto grid w-full gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
      >
        <div
          v-for="skeleton in skeletons"
          :key="skeleton"
          class="flex animate-pulse items-center gap-6"
        >
          <div class="h-48 w-full rounded-2xl bg-neutral-200"></div>
        </div>
      </div>
    </template>

    <!-- Materials -->
    <template v-else-if="materials && materials.length > 0">
      <div
        class="grid-rows-auto grid w-full gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
      >
        <!-- Add material -->
        <button
          v-if="props.showAllOverview"
          class="border-primary-green col-span-1 flex h-48 w-full items-center justify-center rounded-2xl border transition-all hover:scale-105 hover:cursor-pointer"
          @click="toggleModal(null, 'create')"
        >
          <div class="text-primary-green flex items-center gap-3">
            <PlusCircle class="h-6 w-6" />
            <p class="text-lg">Add New Material</p>
          </div>
        </button>
        <!-- Material cards -->
        <button
          v-for="material of materials"
          :key="material.id"
          class="col-span-1 flex h-48 w-full flex-col items-center rounded-2xl rounded-b-3xl bg-gray-400 transition-all hover:scale-105 hover:cursor-pointer"
          @click="toggleModal(material, 'detail')"
        >
          <div class="flex h-full w-full items-center justify-center">
            <Wrench class="h-10 w-10 stroke-gray-800" />
          </div>
          <div
            class="w-full rounded-2xl rounded-t-none bg-gray-200 px-4 py-2 text-left"
          >
            <h2 class="truncate text-lg">{{ material.name }}</h2>
            <div v-if="showAllOverview">
              <p v-if="material.user?.id" class="text-primary-orange m-0">
                Not available
              </p>
              <p v-else class="text-primary-green text-base">Available</p>
            </div>
          </div>
        </button>
      </div>
    </template>

    <!-- TODO: design better -->
    <!-- No results found -->
    <template v-else-if="materials.length === 0">
      <section class="flex flex-col items-center justify-center gap-5">
        <img
          class="h-80 w-80"
          src="/assets/empty.svg"
          alt="Empty results illustration"
        />
        <h2 class="text-2xl">Oops! No results found.</h2>
      </section>
    </template>
  </main>

  <!-- Create Modal -->
  <Dialog
    v-model:visible="visible.create"
    modal
    header="Create Material"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <DynamicForm
      :schema="formCreateMaterial"
      :validation-schema="materialValidationSchema"
      :handle-form="handleCreateMaterial"
      :loading="loading.create"
      :initial-values="{
        isLoan: false,
      }"
      :reverse-switch="true"
    />
  </Dialog>

  <!-- Detail Modal -->
  <Dialog
    v-model:visible="visible.detail"
    modal
    header="Detail Material"
    :draggable="false"
    :close-on-escape="true"
    :pt="{
      root: {
        class: 'max-w-lg',
      },
    }"
  >
    <!-- Show detail or edit form -->
    <div v-if="!isEditing">
      <!-- edit -->
      <Pencil v-if="props.showAllOverview" @click="isEditing = true" />
      <!-- delete -->
      <Trash2
        v-if="props.showAllOverview"
        class="stroke-primary-red transition-all hover:cursor-pointer"
        @click="handleDeleteMaterial(selectedMaterial!)"
      />
      <p>{{ selectedMaterial?.serialNumber }}</p>
      <p>{{ selectedMaterial?.name }}</p>
    </div>
    <div v-if="isEditing">
      <!-- Edit form -->
      <ArrowLeft @click="isEditing = false" />
      <DynamicForm
        :schema="formUpdateMaterial"
        :validation-schema="materialValidationSchema"
        :handle-form="handleUpdatematerial"
        :loading="loading.update"
        :initial-values="{
          name: selectedMaterial?.name,
          serialNumber: selectedMaterial?.serialNumber,
          isLoan: selectedMaterial?.isLoan,
          userId: selectedMaterial?.user?.id,
        }"
        :reverse-switch="true"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import DynamicForm from './DynamicForm.vue'
import Filter from './Filter.vue'
import Search from './Search.vue'
import Sort from './Sort.vue'
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import {
  CREATE_MATERIAL,
  DELETE_MATERIAL,
  UPDATE_MATERIAL,
} from '@/graphql/material.mutation'
import {
  GET_MATERIALS,
  GET_MATERIALS_BY_USERID,
} from '@/graphql/material.query'
import { GET_USERS } from '@/graphql/user.query'
import {
  FILTER_OPTIONS_MATERIALS,
  ORDER_DIRECTION,
  SORT_OPTIONS_MATERIALS,
} from '@/helpers/constants'
import type { Material } from '@/interfaces/material.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { materialValidationSchema } from '@/validation/schema'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ArrowLeft, Pencil, PlusCircle, Trash2, Wrench } from 'lucide-vue-next'
import { type GenericObject } from 'vee-validate'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'

// props
const props = defineProps({
  showAllOverview: {
    type: Boolean,
    default: false,
  },
})

// composables
const { showToast } = useCustomToast()
const { customUser } = useCustomUser()

// variables
const availability = ref('all')

// skeletons
const skeletons = ref<number[]>(new Array(24))
const selectedMaterial = ref<Material | null>(null)
const visible = ref({
  detail: false,
  create: false,
})
const loading = ref({
  update: false,
  create: false,
  data: computed(
    () =>
      materialsLoading.value ||
      materialsByUserIdLoading.value ||
      usersLoading.value,
  ),
})
const variables = ref<VariablesProps>({
  filters: [],
  order: {
    field: 'createdAt',
    direction: ORDER_DIRECTION.DESC,
  },
  searchString: '',
})
const materials = computed<Material[]>(() =>
  props.showAllOverview
    ? materialsResult.value?.materials || []
    : materialsByUserIdResult.value?.materialsByUserId || [],
)
const users = computed(() => usersResult.value?.users || [])
const isEditing = ref(false)

// form update material
const formUpdateMaterial = ref({
  fields: [
    {
      label: 'Name',
      name: 'name',
      placeholder: 'Forklift',
      as: 'input',
    },
    {
      label: 'Serial Number',
      name: 'serialNumber',
      placeholder: '123456789',
      as: 'input',
    },
    {
      label: 'Is Loan',
      name: 'isLoan',
      as: 'switch',
      type: 'switch',
    },
    {
      label: 'User',
      name: 'userId',
      placeholder: 'Select a user',
      as: 'select',
      type: 'select',
      options: users,
      optionLabel: 'fullname',
      optionValue: 'id',
      displayIf: 'isLoan',
      editable: true,
    },
  ],

  button: {
    name: 'Update Material',
  },
})

// form create material
const formCreateMaterial = ref({
  fields: [
    {
      label: 'Name',
      name: 'name',
      placeholder: 'Forklift',
      as: 'input',
    },
    {
      label: 'Serial Number',
      name: 'serialNumber',
      placeholder: '123456789',
      as: 'input',
    },
    {
      label: 'Is Loan',
      name: 'isLoan',
      as: 'switch',
      type: 'switch',
    },
    {
      label: 'User',
      name: 'userId',
      placeholder: 'Select a user',
      as: 'select',
      type: 'select',
      options: users,
      optionLabel: 'fullname',
      optionValue: 'id',
      displayIf: 'isLoan',
      editable: true,
    },
  ],

  button: {
    name: 'Create Material',
  },
})

// graphql
const {
  result: materialsResult,
  loading: materialsLoading,
  error: materialsError,
  load: loadMaterials,
  refetch,
} = useLazyQuery(GET_MATERIALS, variables, {
  fetchPolicy: 'cache-and-network',
})

const {
  result: materialsByUserIdResult,
  loading: materialsByUserIdLoading,
  error: materialsByUserIdError,
  load: loadMaterialsByUserId,
} = useLazyQuery(GET_MATERIALS_BY_USERID, variables, {
  fetchPolicy: 'cache-and-network',
})

const { mutate: createMaterial, error: createMaterialError } =
  useMutation(CREATE_MATERIAL)

const { mutate: updateMaterial, error: updateMaterialError } =
  useMutation(UPDATE_MATERIAL)

const { mutate: deleteMaterial, error: deleteMaterialError } =
  useMutation(DELETE_MATERIAL)

const {
  result: usersResult,
  loading: usersLoading,
  error: usersError,
  load: loadUsers,
} = useLazyQuery(
  GET_USERS,
  {
    filters: ['E'],
  },
  {
    fetchPolicy: 'cache-and-network',
  },
)

// logics
// on mounted
onMounted(() => {
  if (props.showAllOverview) {
    loadMaterials()
    loadUsers()
  } else {
    variables.value.userId = customUser.value?.id
    loadMaterialsByUserId()
  }
})

// handle create material
const handleCreateMaterial = async (values: GenericObject) => {
  try {
    loading.value.create = true
    await createMaterial({
      createMaterialInput: {
        name: values.name,
        serialNumber: parseInt(values.serialNumber),
        isLoan: values.isLoan,
        userId: values.userId,
      },
    })
    loading.value.create = false
    showToast('success', 'Success', 'Material has been created')
    await refetch()
    toggleModal()
  } catch (error) {
    LogRocket.captureException(error as Error)
    console.log(error)
  }
}

// handle update material
const handleUpdatematerial = async (values: GenericObject) => {
  try {
    // console.log(values)
    loading.value.update = true
    await updateMaterial({
      updateMaterialInput: {
        id: selectedMaterial.value?.id,
        ...values,
      },
    })
    loading.value.update = false
    showToast('success', 'Success', 'Material has been updated')
    await refetch()
    toggleModal()
  } catch (error) {
    LogRocket.captureException(error as Error)
    console.log(error)
  }
}

// handle delete material
const handleDeleteMaterial = async (material: Material) => {
  try {
    // console.log(material.id)
    await deleteMaterial({
      id: material.id,
    })
    showToast('success', 'Success', 'Material has been deleted')
    await refetch()
  } catch (error) {
    LogRocket.captureException(error as Error)
    console.log(error)
  }
}

const toggleModal = (
  material: Material | null = null,
  type: string = 'close',
) => {
  selectedMaterial.value = material ? { ...material } : null
  isEditing.value = false
  visible.value = {
    detail: type === 'detail',
    create: type === 'create',
  }
}

watchEffect(() => {
  // log the queries
  // if (materials.value) console.log(materials.value)
  // if (materialsByUserIdResult.value) console.log(materialsByUserIdResult.value)
  // if (materialsResult.value) console.log(materialsResult.value)
  // if (usersResult.value) console.log(usersResult.value)
  // if (users.value) console.log(users.value)

  // all errors
  const errors = [
    createMaterialError.value,
    deleteMaterialError.value,
    materialsByUserIdError.value,
    materialsError.value,
    updateMaterialError.value,
    usersError.value,
  ]
  errors.forEach(error => {
    if (error) {
      loading.value = {
        ...loading.value,
        update: false,
        create: false,
      }

      LogRocket.captureException(error)
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

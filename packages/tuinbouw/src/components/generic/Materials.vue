<template>
  <main
    class="m-auto mt-12 flex max-w-7xl flex-col items-center justify-center gap-5"
  >
    <!-- Filters + Searchbar -->
    <section class="flex w-full flex-col gap-10">
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
    </section>

    <!-- Skeleton -->
    <section v-if="loading.data">
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
    </section>

    <!-- Materials -->
    <section v-else-if="materials && materials.length > 0">
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
    </section>

    <!-- No results found -->
    <NoResult v-else-if="materials.length === 0" />
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
    <!-- Show Detail -->
    <div v-if="!isEditing">
      <p>{{ selectedMaterial?.serialNumber }}</p>
      <p>{{ selectedMaterial?.name }}</p>

      <div class="flex justify-between">
        <!-- Delete -->
        <button
          class="bg-primary-red rounded-[4px] px-3 py-1 text-white"
          @click="handleDeleteMaterial(selectedMaterial!)"
        >
          Delete
        </button>
        <!-- Edit -->
        <button
          v-if="props.showAllOverview"
          class="border-primary-blue text-primary-blue rounded-[4px] border px-3 py-1"
          @click="isEditing = true"
        >
          Edit
        </button>
      </div>
    </div>
    <!-- Edit Form -->
    <div v-if="isEditing">
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
import CustomButton from './CustomButton.vue'
import DynamicForm from './DynamicForm.vue'
import Filter from './Filter.vue'
import NoResult from './NoResult.vue'
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
import type { CustomUser } from '@/interfaces/custom.user.interface'
import type { Material } from '@/interfaces/material.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { materialValidationSchema } from '@/validation/schema'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ArrowLeft, Pencil, PlusCircle, Trash2, Wrench } from 'lucide-vue-next'
import { type GenericObject } from 'vee-validate'
import type { ComputedRef } from 'vue'
import { computed, onMounted, ref, watchEffect } from 'vue'

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

// skeletons
const skeletons = ref<number[]>(new Array(24))
const selectedMaterial = ref<Material | null>(null)
const visible = ref<{
  detail: boolean
  create: boolean
}>({
  detail: false,
  create: false,
})
const loading = ref<{
  update: boolean
  create: boolean
  data: ComputedRef<boolean>
}>({
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
const users = computed<CustomUser[]>(() => usersResult.value?.users || [])
const isEditing = ref<boolean>(false)

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

const { mutate: createMaterial } = useMutation(CREATE_MATERIAL)

const { mutate: updateMaterial } = useMutation(UPDATE_MATERIAL)

const { mutate: deleteMaterial } = useMutation(DELETE_MATERIAL)

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
const handleCreateMaterial = async (values: GenericObject): Promise<void> => {
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
    showToast('success', 'Success', 'Material has been created')
    await refetch()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't create material")
  } finally {
    loading.value.create = false
  }
}

// handle update material
const handleUpdatematerial = async (values: GenericObject): Promise<void> => {
  try {
    // console.log(values)
    loading.value.update = true
    await updateMaterial({
      updateMaterialInput: {
        id: selectedMaterial.value?.id,
        ...values,
      },
    })
    showToast('success', 'Success', 'Material has been updated')
    await refetch()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't update material")
  } finally {
    loading.value.update = false
  }
}

// handle delete material
const handleDeleteMaterial = async (material: Material): Promise<void> => {
  try {
    // console.log(material.id)
    await deleteMaterial({
      id: material.id,
    })
    showToast('success', 'Success', 'Material has been deleted')
    await refetch()
    toggleModal()
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
    showToast('error', 'Error', "Couldn't delete material")
  }
}

const toggleModal = (
  material: Material | null = null,
  type: string = 'close',
): void => {
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
  if (usersError.value) {
    // console.log(usersError.value)
    LogRocket.captureException(usersError.value)
    showToast('error', 'Error', "Couldn't load users")
  }
  if (materialsError.value) {
    // console.log(materialsError.value)
    LogRocket.captureException(materialsError.value)
    showToast('error', 'Error', "Couldn't load materials")
  }
  if (materialsByUserIdError.value) {
    // console.log(materialsByUserIdError.value)
    LogRocket.captureException(materialsByUserIdError.value)
    showToast('error', 'Error', "Couldn't load materials")
  }
})
</script>

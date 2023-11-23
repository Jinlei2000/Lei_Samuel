<template>
  <div
    class="flex flex-col items-center justify-center mt-12 gap-5 max-w-7xl m-auto"
  >
    <div class="w-full flex flex-col gap-10">
      <!-- Filters + Searchbar -->
      <div class="flex items-center justify-between w-full relative">
        <div class="flex items-center gap-3">
          <button
            class="group bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
            @click="filter = !filter"
          >
            <Filter class="h-5 w-5" />
            <p class="m-0 text-lg">Filter</p>
            <ChevronDown
              :class="[
                'h-[22px] w-[22px] transition-all',
                filter ? 'rotate-180' : '',
              ]"
            />
          </button>
        </div>
        <!-- Filter dropdown -->
        <div
          :class="[
            'absolute flex gap-12 top-16 z-50 bg-gray-200 rounded-2xl border-1 border-black py-6 px-12',
            'transition-all duration-200',
            filter ? 'opacity-100' : 'opacity-0 pointer-events-none ',
          ]"
          v-show="filter"
        >
          <div class="flex flex-col gap-3">
            <h2 class="text-lg">Availability</h2>
            <div class="flex flex-col gap-3">
              <div class="flex gap-2 items-center relative">
                <input
                  class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green hover:before:opacity-10"
                  type="radio"
                  v-model="availability"
                  value="all"
                  name="availability"
                />
                <div
                  class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                >
                  <Check class="h-3 w-3" />
                </div>
                <label for="">All</label>
              </div>
              <div class="flex gap-2 items-center">
                <input
                  class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green hover:before:opacity-10"
                  type="radio"
                  v-model="availability"
                  value="available"
                  name="availability"
                />
                <div
                  class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                >
                  <Check class="h-3 w-3" />
                </div>
                <label for="">Available</label>
              </div>
              <div class="flex gap-2 items-center">
                <input
                  class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green hover:before:opacity-10"
                  type="radio"
                  v-model="availability"
                  value="not available"
                  name="availability"
                />
                <div
                  class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                >
                  <Check class="h-3 w-3" />
                </div>
                <label for="">Not available</label>
              </div>
            </div>
          </div>
        </div>
        <!-- End filter dropdown -->

        <!-- Searchbar -->
        <Search v-model="variables.searchString" />
      </div>

      <!-- Title + Sort -->
      <div class="flex items-center justify-between w-full">
        <!-- Title -->
        <h1 class="text-2xl">Materials</h1>
        <!-- Sort -->
        <Sort
          v-model="variables.order"
          :options="SORT_OPTIONS_MATERIALS"
        />
      </div>
    </div>

    <!-- loading -->
    <template v-if="loading.data">
      <div
        class="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-rows-auto gap-3 w-full"
      >
        <div v-for="skeleton in skeletons">
          <div class="animate-pulse flex items-center gap-6">
            <div class="w-full h-48 bg-neutral-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- materials -->
    <template v-else-if="materials && materials.length > 0">
      <div
        class="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-rows-auto gap-3 w-full"
      >
        <!-- add material -->
        <button
          v-if="props.showAllOverview"
          @click="toggleModal(null, 'create')"
          class="flex items-center justify-center border border-primary-green rounded-2xl w-full h-48 col-span-1 hover:scale-105 hover:cursor-pointer transition-all"
        >
          <div class="flex items-center gap-3 text-primary-green">
            <PlusCircle class="h-6 w-6" />
            <p class="text-lg">Add New Material</p>
          </div>
        </button>
        <button
          v-for="material of materials"
          @click="toggleModal(material, 'detail')"
          class="flex flex-col items-center rounded-2xl rounded-b-3xl w-full h-48 bg-gray-400 col-span-1 hover:scale-105 hover:cursor-pointer transition-all"
        >
          <div class="flex w-full h-full items-center justify-center">
            <Wrench class="stroke-gray-800 h-10 w-10" />
          </div>
          <div
            class="text-left bg-gray-200 rounded-2xl rounded-t-none w-full px-4 py-2"
          >
            <h2 class="truncate text-lg">{{ material.name }}</h2>
            <div v-if="showAllOverview">
              <p v-if="material.user?.id" class="text-primary-orange m-0">
                Not available
              </p>
              <p v-else class="text-base text-primary-green">Available</p>
            </div>
          </div>
        </button>
      </div>
    </template>

    <!-- TODO: design better -->
    <!-- no results found -->
    <template v-else-if="materials.length === 0">
      <div class="flex flex-col items-center justify-center gap-5">
        <img class="h-80 w-80" src="/assets/empty.svg" />
        <h2 class="text-2xl">Ups!... no results found</h2>
      </div>
    </template>
  </div>

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
      :validationSchema="materialValidationSchema"
      :handleForm="handleCreateMaterial"
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
    <!-- show detail -->
    <div v-if="!isEditing">
      <!-- edit -->
      <Pencil v-if="props.showAllOverview" @click="isEditing = true" />
      <!-- delete -->
      <Trash2
        v-if="props.showAllOverview"
        @click="handleDeleteMaterial(selectedMaterial!)"
        class="stroke-primary-red hover:cursor-pointer transition-all"
      />
      <p>{{ selectedMaterial?.serialNumber }}</p>
      <p>{{ selectedMaterial?.name }}</p>
    </div>

    <!-- edit form -->
    <div v-if="isEditing">
      <ArrowLeft @click="isEditing = false" />
      <DynamicForm
        :schema="formUpdateMaterial"
        :validationSchema="materialValidationSchema"
        :handleForm="handleUpdatematerial"
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
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import {
  GET_MATERIALS,
  GET_MATERIALS_BY_USERID,
} from '@/graphql/material.query'
import { ORDER_DIRECTION, SORT_OPTIONS_MATERIALS } from '@/helpers/constants'
import type { Material } from '@/interfaces/material.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { ArrowUpWideNarrow } from 'lucide-vue-next'
import { ArrowDownWideNarrow } from 'lucide-vue-next'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { materialValidationSchema } from '@/validation/schema'
import { type GenericObject } from 'vee-validate'
import { GET_USERS } from '@/graphql/user.query'
import {
  CREATE_MATERIAL,
  DELETE_MATERIAL,
  UPDATE_MATERIAL,
} from '@/graphql/material.mutation'
import {
  Pencil,
  Trash2,
  ArrowLeft,
  ListFilter,
  PlusCircle,
  Check,
  ChevronDown,
  Wrench,
  Filter,
} from 'lucide-vue-next'
import DynamicForm from './DynamicForm.vue'
import Search from './Search.vue'
import Sort from './Sort.vue'

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
// display filter dropdown
const filter = ref(false)

const availability = ref('all')

// display sort dropdown
const sort = ref(false)

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
}

// handle update material
const handleUpdatematerial = async (values: GenericObject) => {
  console.log(values)
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
  loading.value.update = false
}

// handle delete material
const handleDeleteMaterial = async (material: Material) => {
  console.log(material.id)
  await deleteMaterial({
    id: material.id,
  })
  showToast('success', 'Success', 'Material has been deleted')
  await refetch()
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

// watch availability
watch(availability, () => {
  if (availability.value === 'all') {
    variables.value.filters = []
  } else if (availability.value === 'available') {
    variables.value.filters = ['A']
  } else if (availability.value === 'not available') {
    variables.value.filters = ['NA']
  }
})

watchEffect(() => {
  // log the queries
  // if (materials.value) console.log(materials.value)
  // if (materialsByUserIdResult.value) console.log(materialsByUserIdResult.value)
  // if (materialsResult.value) console.log(materialsResult.value)
  // if (usersResult.value) console.log(usersResult.value)
  // if (users.value) console.log(users.value)

  // all errors
  const errors = [
    materialsError.value,
    materialsByUserIdError.value,
    usersError.value,
    createMaterialError.value,
  ]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

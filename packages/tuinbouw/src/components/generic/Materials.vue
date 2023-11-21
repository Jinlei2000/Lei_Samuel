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
        <div class="flex items-center justify-center gap-3 relative w-1/3">
          <button
            class="bg-transparent p-2 rounded-full hover:scale-110 transition-all absolute left-2"
          >
            <Search class="h-[22px] w-[22px]" />
          </button>
          <input
            v-model="variables.searchString"
            class="bg-gray-200 rounded-full h-12 py-3 pl-11 w-full text-lg"
            type="text"
            placeholder="Search for materials"
          />
        </div>
      </div>

      <!-- Title + Sort -->
      <div class="flex items-center justify-between w-full">
        <h1 class="text-2xl">Materials</h1>
        <div class="flex items-center gap-3 relative">
          <div class="flex flex-row-reverse items-center justify-center gap-1">
            <p>
              {{
                variables.order!.field.charAt(0).toUpperCase() +
                variables.order!.field.slice(1)
              }}
            </p>
            <div>
              <ArrowDownWideNarrow
                v-if="variables.order!.direction === ORDER_DIRECTION.DESC"
                @click="variables.order!.direction = ORDER_DIRECTION.ASC"
                class="h-6 w-6"
              />
              <ArrowUpWideNarrow
                v-else-if="variables.order!.direction === ORDER_DIRECTION.ASC"
                @click="variables.order!.direction = ORDER_DIRECTION.DESC"
                class="h-6 w-6"
              />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
              @click="sort = !sort"
            >
              <ListFilter class="h-5 w-5 m-1" />
              <p class="m-0 text-lg">Sort</p>
              <ChevronDown
                :class="[
                  'h-[22px] w-[22px] transition-all',
                  sort ? 'rotate-180' : '',
                ]"
              />
            </button>
          </div>
          <!-- Sort dropdown -->
          <div
            :class="[
              'absolute flex gap-12 top-16 right-0 z-50 bg-gray-200 rounded-2xl border-1 border-black py-6 px-12',
              'transition-all duration-200',
              sort ? 'opacity-100' : 'opacity-0 pointer-events-none ',
            ]"
            v-show="sort"
          >
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-3">
                <div class="flex gap-2 items-center">
                  <input
                    class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green hover:before:opacity-10"
                    type="radio"
                    v-model="variables.order!.field"
                    value="createdAt"
                    id="createdAt"
                    name="sort"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="createdAt">Created At</label>
                </div>
                <div class="flex gap-2 items-center">
                  <input
                    class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green hover:before:opacity-10"
                    type="radio"
                    v-model="variables.order!.field"
                    value="name"
                    id="name"
                    name="sort"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="name">Name</label>
                </div>
              </div>
            </div>
          </div>
          <!-- End sort dropdown -->
        </div>
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
    <Form
      @submit="handleCreateMaterial($event.values)"
      v-slot="{ errors }"
      :validation-schema="materialValidationSchema"
      novalidate
    >
      <ul class="space-y-4">
        <!-- name -->
        <li>
          <label class="block mb-2 text-sm font-medium text-gray-900" for="name"
            >Name</label
          >
          <Field
            class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
            :class="{
              'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                errors['name'],
            }"
            as="input"
            id="name"
            name="name"
            type="text"
            placeholder="Forklift"
          >
          </Field>
          <ErrorMessage class="text-red-500 block text-sm" name="name" />
        </li>
        <!-- user -->
        <!-- isLoan -->
        <!-- serialNumber -->
        <li>
          <label
            class="block mb-2 text-sm font-medium text-gray-900"
            for="serialNumber"
            >Serial Number</label
          >
          <Field
            class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
            :class="{
              'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                errors['serialNumber'],
            }"
            as="input"
            id="serialNumber"
            name="serialNumber"
            type="text"
            placeholder="123456789"
          >
          </Field>
          <ErrorMessage
            class="text-red-500 block text-sm"
            name="serialNumber"
          />
        </li>
      </ul>

      <CustomButton
        class=""
        :loading="loading.create"
        type="submit"
        name="Create Material"
      />
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import useCustomToast from '@/composables/useCustomToast'
import useCustomUser from '@/composables/useCustomUser'
import {
  GET_MATERIALS,
  GET_MATERIALS_BY_USERID,
} from '@/graphql/material.query'
import { ORDER_DIRECTION } from '@/helpers/constants'
import { Role } from '@/interfaces/custom.user.interface'
import type { Material } from '@/interfaces/material.interface'
import type { VariablesProps } from '@/interfaces/variablesProps.interface'
import { useLazyQuery } from '@vue/apollo-composable'
import { ListFilter } from 'lucide-vue-next'
import { PlusCircle } from 'lucide-vue-next'
import { ArrowUpWideNarrow } from 'lucide-vue-next'
import { ArrowDownWideNarrow } from 'lucide-vue-next'
import { Check, ChevronDown, Wrench, Filter, Search } from 'lucide-vue-next'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { materialValidationSchema } from '@/validation/schema'
import { ErrorMessage, Form } from 'vee-validate'
import CustomButton from './CustomButton.vue'

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
  edit: false,
  create: false,
})
const loading = ref({
  update: false,
  create: false,
  data: computed(
    () => materialsLoading.value || materialsByUserIdLoading.value,
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

// graphql
const {
  result: materialsResult,
  loading: materialsLoading,
  error: materialsError,
  load: loadMaterials,
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

// logics
// on mounted
onMounted(() => {
  if (customUser.value?.role == Role.ADMIN) {
    loadMaterials()
  } else {
    variables.value.userId = customUser.value?.id
    loadMaterialsByUserId()
  }
})

// handle create material
const handleCreateMaterial = async (values: Material) => {
  console.log(values)
  loading.value.create = true
  // await createAbsence({
  //   createAbsenceInput: {
  //     userId: customUser.value?.id,
  //     type: values.type,
  //     startDate: formatDateTime(values.startDate),
  //     endDate: formatDateTime(values.endDate),
  //     description: values.description,
  //   },
  // })
  loading.value.create = false
  showToast('success', 'Success', 'Absence has been created')
  // await refetch()
  toggleModal()
}

const toggleModal = (
  material: Material | null = null,
  type: string = 'close',
) => {
  selectedMaterial.value = material ? { ...material } : null
  visible.value = {
    detail: type === 'detail',
    edit: type === 'edit',
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

  // all errors
  const errors = [materialsError.value, materialsByUserIdError.value]
  errors.forEach(error => {
    if (error) {
      showToast('error', 'Error', error.message)
    }
  })
})
</script>

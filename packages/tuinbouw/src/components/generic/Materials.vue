<template>
  <div
    class="flex flex-col items-center justify-center mt-12 gap-5 max-w-7xl m-auto"
  >
    <div class="w-full flex flex-col gap-10">
      <!-- filters + searchbar -->
      <!-- <div class="flex items-center justify-between w-full relative">
        <div class="flex items-center gap-3">
          <button
            class="group bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
            v-on:click="filter = !filter"
          >
            <Filter class="h-5 w-5" />
            <p class="m-0 text-lg">Filter</p>
            <ChevronDown
              :class="filter ? 'rotate-180 transition-all' : 'transition-all'"
              class="h-[22px] w-[22px]transition-all"
            />
          </button>
        </div> -->
      <!-- Filter dropdown -->
      <!-- <div
          :class="
            filter
              ? 'opacity-100 transition-all duration-200'
              : 'opacity-0 transition-all duration-200'
          "
          class="absolute flex gap-12 top-16 z-50 bg-gray-200 rounded-2xl border-1 border-black py-6 px-12"
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
          <div class="flex flex-col gap-3">
            <h2 class="text-lg">Type</h2>
            <div class="flex gap-12">
              <div class="flex flex-col gap-3">
                <div class="flex gap-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    v-model="machinery"
                    className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="checkbox">Machinery</label>
                </div>
                <div class="flex gap-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    v-model="screwdrivers"
                    className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="checkbox">Screwdrivers</label>
                </div>
                <div class="flex gap-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    v-model="cuttingTools"
                    className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="checkbox">Cutting tools</label>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div class="flex gap-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    v-model="machinery"
                    className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="checkbox">Machinery</label>
                </div>
                <div class="flex gap-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    v-model="screwdrivers"
                    className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="checkbox">Screwdrivers</label>
                </div>
                <div class="flex gap-2">
                  <input
                    type="checkbox"
                    id="some_id"
                    v-model="cuttingTools"
                    className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent mt-1 checked:bg-primary-green checked:border-0"
                  />
                  <div
                    class="pointer-events-none absolute translate-x-0.5 translate-y-1.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <Check class="h-3 w-3" />
                  </div>
                  <label for="checkbox">Cutting tools</label>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      <!-- End filter dropdown -->
      <!-- Searchbar -->
      <!-- <div class="flex items-center justify-center gap-3 relative w-1/3">
          <button
            class="bg-transparent p-2 rounded-full hover:scale-110 transition-all absolute left-2"
          >
            <Search class="h-[22px] w-[22px]" />
          </button>
          <input
            v-model="search"
            class="bg-gray-200 rounded-full h-12 py-3 pl-11 w-full text-lg"
            type="text"
            placeholder="Search for materials"
          />
        </div> -->
    </div>
    <!-- title + sort -->
    <div class="flex items-center justify-between w-full">
      <h1 class="text-2xl">Materials</h1>
      <div class="flex items-center gap-3 relative">
        <div><p>Alphabetical</p></div>
        <div class="flex items-center gap-3">
          <button
            class="bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
            :click="(sort = !sort)"
          >
            <img class="h-3 w-4 m-1" src="/icons/sort.svg" />
            <p class="m-0 text-lg">Sort</p>
            <ChevronDown class="h-[22px] w-[22px]" />
          </button>
        </div>
        <!-- Sort dropdown -->
        <div
          class="absolute flex gap-12 top-16 right-0 z-50 bg-gray-200 rounded-2xl border-1 border-black py-6 px-12"
          :class="
            sort
              ? 'transition-all duration-200'
              : 'hidden transition-all duration-200'
          "
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
    <!-- </div> -->

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
        <div
          v-for="material of materials"
          class="flex flex-col items-center justify-end rounded-2xl rounded-b-3xl w-full h-48 bg-gray-400 col-span-1 hover:scale-105 hover:cursor-pointer transition-all"
        >
          <div class="flex w-full h-full items-center justify-center">
            <Wrench class="stroke-gray-800 h-10 w-10" />
          </div>
          <div class="bg-gray-200 rounded-2xl rounded-t-none w-full px-4 py-2">
            <h2 class="truncate text-lg">{{ material.name }}</h2>
            <div v-if="showAllOverview">
              <p v-if="material.user.id" class="text-primary-orange m-0">
                Not available
              </p>
              <p v-else class="text-base text-primary-green">Available</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- TODO: design better -->
    <!-- no results found -->
    <template v-else-if="materials.length == 0">
      <div class="flex flex-col items-center justify-center gap-5">
        <img class="h-80 w-80" src="/assets/empty.svg" />
        <h2 class="text-2xl">Ups!... no results found</h2>
      </div>
    </template>
  </div>
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
import { Check, ChevronDown, Wrench, Filter, Search } from 'lucide-vue-next'
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

// // search
// const search = ref('')

// // availability radio buttons
// const availability = ref('all')

// // sort radio buttons
// const sorting = ref('all')

// // type checkboxes
// const machinery = ref(false)
// const screwdrivers = ref(false)
// const cuttingTools = ref(false)

// display filter dropdown
const filter = ref(false)

// display sort dropdown
const sort = ref(false)

// skeletons
const skeletons = ref<number[]>(new Array(24))

const loading = ref({
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

watchEffect(() => {
  // log the queries
  if (materials.value) console.log(materials.value)
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

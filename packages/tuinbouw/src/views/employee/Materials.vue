<template>
  <div class="flex flex-col items-center justify-center mt-12 mx-32 gap-5">
    <div class="w-full flex flex-col gap-10">
      <!-- filters + searchbar -->
      <div class="flex items-center justify-between w-full relative">
        <div class="flex items-center gap-3">
          <button
            class="group bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
          >
            <Filter class="h-5 w-5" />
            <p class="m-0 text-lg">Filter</p>
            <ChevronDown
              class="h-[22px] w-[22px] group-hover:translate-y-1 transition-all"
            />
          </button>
        </div>
        <div
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
        </div>
        <div class="flex items-center justify-center gap-3 relative w-1/3">
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
        </div>
      </div>
      <!-- title + sort -->
      <div class="flex items-center justify-between w-full">
        <h1 class="text-2xl">Materials</h1>
        <div class="flex items-center gap-3">
          <div><p>Alphabetical</p></div>
          <div class="flex items-center gap-3">
            <button
              class="bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
            >
              <img class="h-3 w-4 m-1" src="../../../public/icons/sort.svg" />
              <p class="m-0 text-lg">Sort</p>
              <ChevronDown class="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <template v-if="search" class="grid grid-cols-4 gap-3">
      <div v-if="search.length > 0" class="grid grid-cols-4 gap-3">
        <div
          v-if="
            searchMaterials &&
            searchMaterials.materialsBySearchString.length > 0
          "
          v-for="material of searchMaterials.materialsBySearchString"
          class="col-span-1 rounded-2xl relative hover:scale-110 transition-all"
        >
          <img
            class="rounded-2xl rounded-b-3xl w-full"
            src="https://picsum.photos/400"
            alt="random picture"
          />
          <div
            class="bg-gray-200 rounded-2xl rounded-t-none w-full absolute bottom-0 px-3 py-2"
          >
            <h2 class="truncate">{{ material.name }}</h2>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-6 gap-3">
        <div
          v-if="allMaterials && allMaterials.materials.length > 0"
          v-for="material of allMaterials.materials"
          class="col-span-1 rounded-2xl relative hover:scale-105 hover:cursor-pointer transition-all"
        >
          <img
            class="rounded-2xl rounded-b-3xl w-full"
            src="https://picsum.photos/200"
            alt="random picture"
          />
          <div
            class="bg-gray-200 rounded-2xl rounded-t-none w-full absolute bottom-0 px-4 py-2"
          >
            <h2 class="truncate text-lg">{{ material.name }}</h2>
            <p v-if="material.personId" class="text-primary-orange m-0">
              Not available
            </p>
            <p v-else class="text-base text-primary-green">Available</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import {
  GET_MATERIALS,
  FIND_MATERIALS_BY_SEARCH_STRING,
} from '@/graphql/material.query'
import { watch, ref } from 'vue'
import { Filter, Search, ChevronDown } from 'lucide-vue-next'
import { Check } from 'lucide-vue-next'

const search = ref('')
const availability = ref('all')

const machinery = ref(false)
const screwdrivers = ref(false)
const cuttingTools = ref(false)

const { result: allMaterials, loading, error } = useQuery(GET_MATERIALS)
const {
  document,
  result: searchMaterials,
  load,
} = useLazyQuery(FIND_MATERIALS_BY_SEARCH_STRING, () => ({
  searchString: search.value,
}))

watch(search, () => {
  load(document.value, {
    searchString: search.value,
  })
})

console.log('all materials', allMaterials)
</script>

<template>
  <div class="flex flex-col items-center justify-center mt-12 mx-32 gap-5">
    <div class="w-full flex flex-col gap-10">
      <!-- filters + searchbar -->
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <button
            class="bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
          >
            <Filter class="h-5 w-5" />
            <p class="m-0 text-lg">Filter</p>
            <ChevronDown class="h-[22px] w-[22px]" />
          </button>
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
            src="https://picsum.photos/200"
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

const search = ref('')

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

<template>
  <div class="flex flex-col items-center justify-center mt-12 mx-32 gap-12">
    <div class="flex items-center justify-between w-full">
      <!-- filters + searchbar -->
      <div class="flex items-center gap-3">
        <button
          class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
        >
          <Filter />
        </button>
        <button
          class="bg-primary-orange p-1 rounded-xl hover:scale-110 transition-all"
        >
          <Sort />
        </button>
      </div>
      <div class="flex items-center justify-center gap-3 relative">
        <input
          v-model="search"
          class="bg-gray-200 rounded-full px-3 py-2 w-96"
          type="text"
          placeholder="Search for materials"
        />
        <button
          class="bg-transparent p-2 rounded-full hover:scale-110 transition-all absolute right-1"
        >
          <Search class="h-5 w-5" />
        </button>
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
          class="col-span-1 rounded-2xl relative"
        >
          <img
            class="rounded-2xl w-full"
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
      <div class="grid grid-cols-4 gap-3">
        <div
          v-if="allMaterials.materials.length > 0"
          v-for="material of allMaterials.materials"
          class="col-span-1 rounded-2xl relative"
        >
          <img
            class="rounded-2xl w-full"
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
  </div>
</template>

<script setup lang="ts">
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import {
  GET_MATERIALS,
  FIND_MATERIALS_BY_SEARCH_STRING,
} from '@/graphql/material.query'
import { watch, ref } from 'vue'
import { Filter, Search } from 'lucide-vue-next'

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

<template>
  <div class="flex flex-col items-center justify-center mt-12 gap-12">
    <div>search</div>
    <div class="grid grid-cols-4 mx-32 gap-3">
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
          <!-- <p>{{ material.isLoan ? 'To loan' : '' }}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import {
  GET_MATERIALS,
  FIND_MATERIALS_BY_SEARCH_STRING,
} from '@/graphql/material.query'
import { watch, ref } from 'vue'

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

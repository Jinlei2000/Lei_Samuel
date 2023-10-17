<template>
  <h1>Materials</h1>
  <div class="flex flex-col items-center justify-center mt-12">
    <div class="grid grid-cols-4 mx-32 gap-3">
      <div v-for="material of allMaterials.materials">
        <h2>{{ material.name }}</h2>
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

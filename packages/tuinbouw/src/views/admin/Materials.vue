<template>
  <Container>
    <h1>Materials</h1>
    <div v-if="materialsError">{{ materialsError }}</div>

    <div v-if="materialsLoading">Loading...</div>

    <div v-else>
      <div v-for="material of materials.getMaterials" :key="material.id">
        <p>{{ material.name }}</p>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import Container from '@/components/wrapper/Container.vue'

import { useQuery } from '@vue/apollo-composable'
import { GET_MATERIALS } from '@/graphql/material.query'

// import Material from '@/interfaces/material'

export default {
  components: {
    Container,
  },

  setup() {
    const {
      result: materials,
      loading: materialsLoading,
      error: materialsError,
    } = useQuery(GET_MATERIALS)

    return {
      materials: materials,
      materialsLoading,
      materialsError,
    }
  },
}
</script>

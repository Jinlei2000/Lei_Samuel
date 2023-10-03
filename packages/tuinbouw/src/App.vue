<template>
  <div>
    <AppHeader />
    <RouterView />
  </div>
</template>

<script lang="ts">
import { provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import useGraphql from './composables/useGraphql'

export default {
  components: {
    AppHeader,
  },

  setup() {
    const { apolloClient } = useGraphql()

    provide(DefaultApolloClient, apolloClient)

    return {}
  },
}
// import type AppHeaderVue from '../components/generic/AppHeader.vue'
import AppHeader from './components/generic/AppHeader.vue'
</script>

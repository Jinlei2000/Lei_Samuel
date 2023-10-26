<template>
  <Toast />
  <div class="text-black mx-4">
    <AppHeader />
    <RouterView />
  </div>
</template>

<script lang="ts">
import { provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import useGraphql from './composables/useGraphql'
import { useI18n } from 'vue-i18n'
import useLanguage from './composables/useLanguage'

export default {
  components: {
    AppHeader,
  },

  setup() {
    const { apolloClient } = useGraphql()
    const { setLocale } = useLanguage()
    const { locale } = useI18n()
    const { customUser } = useCustomUser()

    provide(DefaultApolloClient, apolloClient)

    // set locale from user or default
    setLocale(customUser.value?.locale || locale.value)

    return {}
  },
}
// import type AppHeaderVue from '../components/generic/AppHeader.vue'
import AppHeader from './components/generic/AppHeader.vue'
import useCustomUser from './composables/useCustomUser'
</script>

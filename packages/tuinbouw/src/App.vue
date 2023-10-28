<template>
  <Toast position="bottom-right" />
  <div class="mx-4 text-black">
    <AppHeader />
    <RouterView class="pt-12" />
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

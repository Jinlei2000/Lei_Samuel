<template>
  <Toast position="bottom-right">
    <!-- <template #container="slotProps">
      {{ slotProps.message }}
    </template> -->
    <template #closeicon="slotProps">
      <X :class="slotProps.class" />
    </template>
  </Toast>
  <div class="mx-4 text-black">
    <AppHeader />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import useGraphql from './composables/useGraphql'
import { useI18n } from 'vue-i18n'
import useLanguage from './composables/useLanguage'
// import type AppHeaderVue from '../components/generic/AppHeader.vue'
import AppHeader from './components/generic/AppHeader.vue'
import useCustomUser from './composables/useCustomUser'
import { XCircle, Info, AlertTriangle, Check, X } from 'lucide-vue-next'

const { apolloClient } = useGraphql()
const { setLocale } = useLanguage()
const { locale } = useI18n()
const { customUser } = useCustomUser()

provide(DefaultApolloClient, apolloClient)

// set locale from user or default
setLocale(customUser.value?.locale || locale.value)
</script>

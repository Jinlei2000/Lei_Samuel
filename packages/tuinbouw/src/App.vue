<template>
  <Toast position="bottom-right">
    <template #message="slotProps">
      <div class="flex w-full items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center">
          <Info v-if="slotProps.message.severity === 'info'" />
          <Check v-else-if="slotProps.message.severity === 'success'" />
          <AlertTriangle v-else-if="slotProps.message.severity === 'warning'" />
          <XCircle v-else-if="slotProps.message.severity === 'error'" />
        </div>
        <div class="flex w-full flex-col justify-between pr-2">
          <div class="text-lg font-medium">
            {{ $t(slotProps.message.summary) }}
          </div>
          <div>
            {{ $t(slotProps.message.detail) }}
          </div>
        </div>
      </div>
    </template>
    <template #closeicon="slotProps">
      <X :class="slotProps.class" />
    </template>
  </Toast>
  <div class="mx-4 text-black">
    <Appheader />
    <RouterView />
    <AppFooter class="mt-48" />
  </div>
</template>

<script setup lang="ts">
// import type AppHeaderVue from '../components/generic/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import Appheader from './components/generic/AppHeader.vue'
import useCustomUser from './composables/useCustomUser'
import useGraphql from './composables/useGraphql'
import useLanguage from './composables/useLanguage'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { AlertTriangle, Check, Info, X, XCircle } from 'lucide-vue-next'
import { provide } from 'vue'
import { useI18n } from 'vue-i18n'

const { apolloClient } = useGraphql()
const { setLocale } = useLanguage()
const { locale } = useI18n()
const { customUser } = useCustomUser()

provide(DefaultApolloClient, apolloClient)

// set locale from user or default
setLocale(customUser.value?.locale || locale.value)
</script>

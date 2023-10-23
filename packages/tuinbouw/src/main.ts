import { createApp } from 'vue'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'

import useFirebase from '@/composables/useFirebase'
import { i18n } from './bootstrap/i18n'
import useCustomUser from './composables/useCustomUser'

// PrimeVue
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primevue/resources/primevue.min.css' // core css

import Button from 'primevue/button'

const app = createApp(App)
const { restoreUser, firebaseUser } = useFirebase()
const { restoreCustomUser, customUser } = useCustomUser()

app.use(PrimeVue)
app.component('Button', Button)

app.use(i18n) // ALTIJD VOOR DE ROUTER!
;(async () => {
  // Restore user session before mounting the app
  await restoreUser()
  console.log('firebaseUser', firebaseUser.value)
  // Restore custom user session before mounting the app if firebaseUser is set
  if (firebaseUser.value) await restoreCustomUser()

  //BUG: waarom krijg ik geen error als mijn graphql query niet klopt? uid was string

  app.use(router)
  app.mount('#app')
})()

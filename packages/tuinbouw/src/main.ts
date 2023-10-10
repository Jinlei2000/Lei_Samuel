import { createApp } from 'vue'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'

import useFirebase from '@/composables/useFirebase'
import { i18n } from './bootstrap/i18n'
import useCustomUser from './composables/useCustomUser'

const app = createApp(App)
const { restoreUser, firebaseUser } = useFirebase()
const { restoreCustomUser } = useCustomUser()

app.use(i18n) // ALTIJD VOOR DE ROUTER!
;(async () => {
  // Restore user session before mounting the app
  await restoreUser()
  // Restore custom user session before mounting the app if firebaseUser is set
  if (firebaseUser.value) await restoreCustomUser()

  app.use(router)
  app.mount('#app')
})()

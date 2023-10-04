import { createApp } from 'vue'
import useFirebase from '@/composables/useFirebase'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'
import { i18n } from './bootstrap/i18n'

const app = createApp(App)
const { restoreUser } = useFirebase()

app.use(i18n) // ALTIJD VOOR DE ROUTER!
;(async () => {
  // Restore user session before mounting the app
  await restoreUser()

  app.use(router)
  app.mount('#app')
})()

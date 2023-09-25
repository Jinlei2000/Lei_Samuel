import { createApp } from 'vue'
import useFirebase from '@/composables/useFirebase'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const { restoreUser } = useFirebase()

;(async () => {
  // Restore user session before mounting the app
  await restoreUser()

  app.use(router)
  app.mount('#app')
})()

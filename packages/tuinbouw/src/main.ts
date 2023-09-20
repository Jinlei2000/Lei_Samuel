import { createApp } from 'vue'
import useFirebase from '@/composables/useFirebase'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const { restoreUser } = useFirebase()

;(async () => {
  await restoreUser()

  app.use(router)
  app.mount('#app')
})()

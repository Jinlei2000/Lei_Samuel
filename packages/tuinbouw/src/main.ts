import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import App from './App.vue'
import { i18n } from './bootstrap/i18n'
import useCustomUser from './composables/useCustomUser'
import MyDesignSystem from './presets/MyDesignSystem'
import router from './router'
import useFirebase from '@/composables/useFirebase'
import LogRocket from 'logrocket'
// PrimeVue
import Calendar from 'primevue/calendar'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'

const app = createApp(App)
const { restoreUser, firebaseUser } = useFirebase()
const { restoreCustomUser } = useCustomUser()

app.use(PrimeVue, {
  pt: MyDesignSystem,
  ptOptions: {
    mergeProps: true,
  },
})

app.component('Toast', Toast)
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)
app.component('Calendar', Calendar)
app.component('Dropdown', Dropdown)
app.component('InputNumber', InputNumber)
app.component('InputSwitch', InputSwitch)

app.use(ToastService)

app.use(i18n) // ALTIJD VOOR DE ROUTER!
;(async () => {
  // LogRocket
  LogRocket.init(import.meta.env.VITE_LOGROCKET_ID)

  // Restore user session before mounting the app (firebaseUser)
  await restoreUser()

  // Restore custom user session before mounting the app if firebaseUser is set
  if (firebaseUser.value) await restoreCustomUser()

  app.use(router)
  app.mount('#app')
})()

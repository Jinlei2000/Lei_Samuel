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
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

// import 'primevue/resources/primevue.min.css' // core css
// import 'primevue/resources/themes/lara-light-teal/theme.css'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'

import MyDesignSystem from './presets/MyDesignSystem'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'

const app = createApp(App)
const { restoreUser, firebaseUser } = useFirebase()
const { restoreCustomUser } = useCustomUser()

app.use(PrimeVue, {
  pt: MyDesignSystem,
  ptOptions: {
    mergeProps: true,
  },
})

app.component('Button', Button)
app.component('Toast', Toast)
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)
app.component('Calendar', Calendar)
app.component('Dropdown', Dropdown)
app.component('InputNumber', InputNumber)
app.component('InputSwitch', InputSwitch)

app.use(ToastService)

app.use(i18n) // ALTIJD VOOR DE ROUTER!
  ; (async () => {
    // Restore user session before mounting the app
    await restoreUser()
    // console.log('firebaseUser', firebaseUser.value)
    // Restore custom user session before mounting the app if firebaseUser is set
    if (firebaseUser.value) await restoreCustomUser()

    app.use(router)
    app.mount('#app')
  })()

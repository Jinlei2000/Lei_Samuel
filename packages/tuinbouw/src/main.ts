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

import 'primevue/resources/primevue.min.css' // core css
import 'primevue/resources/themes/lara-light-teal/theme.css'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const app = createApp(App)
const { restoreUser, firebaseUser } = useFirebase()
const { restoreCustomUser } = useCustomUser()

app.use(PrimeVue, {
  ptOptions: {
    mergeProps: true,
  },
  pt: {
    toast: {
      closeButton: {
        class: ['hover:bg-white/30', 'focus:shadow-none'],
      },
      closeIcon: 'w-6 h-6',
      buttonContainer: {
        class: ['self-start'],
      },
      container: ({ props }: any) => ({
        class: [
          'my-4 rounded-md w-full',
          {
            'bg-blue-100 border-solid border-0 border-l-4 border-blue-500 text-blue-700':
              props.message.severity == 'info',
            'bg-green-100 border-solid border-0 border-l-4 border-green-500 text-green-700':
              props.message.severity == 'success',
            'bg-orange-100 border-solid border-0 border-l-4 border-orange-500 text-orange-700':
              props.message.severity == 'warn',
            'bg-red-100 border-solid border-0 border-l-4 border-red-500 text-red-700':
              props.message.severity == 'error',
          },
        ],
      }),
      content: 'flex items-center p-5',
      icon: {
        class: ['w-8 h-8', 'text-lg mr-2'],
      },
    },
    inputtext: {
      root: () => ({
        class: [
          'm-0',
          'border bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 appearance-none',
          'focus:ring-primary-green-400/40 focus:ring-2',
          'hover:border-primary-green-400 hover:border-primary-green-400',
        ],
      }),
    },
  },
})

app.component('Button', Button)
app.component('Toast', Toast)
app.component('InputText', InputText)

app.use(ToastService)

app.use(i18n) // ALTIJD VOOR DE ROUTER!
;(async () => {
  // Restore user session before mounting the app
  await restoreUser()
  console.log('firebaseUser', firebaseUser.value)
  // Restore custom user session before mounting the app if firebaseUser is set
  if (firebaseUser.value) await restoreCustomUser()

  app.use(router)
  app.mount('#app')
})()

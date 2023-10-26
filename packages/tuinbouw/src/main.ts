import { createApp } from 'vue'

import '@unocss/reset/tailwind.css'
// import '@unocss/reset/eric-meyer.css'
// import '@unocss/reset/tailwind-compat.css'
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
    },
    inputtext: {
      root: ({ props, context }: any) => ({
        class: [
          'm-0',
          'font-sans text-gray-600 dark:text-white/80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-blue-900/40 transition-colors duration-200 appearance-none rounded-lg',
          {
            'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]':
              !context.disabled,
            'opacity-60 select-none pointer-events-none cursor-default':
              context.disabled,
          },
          {
            'text-lg px-4 py-4': props.size == 'large',
            'text-xs px-2 py-2': props.size == 'small',
            'p-3 text-base': props.size == null,
          },
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

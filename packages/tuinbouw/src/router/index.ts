import { createRouter, createWebHistory } from 'vue-router'
import useFirebase from '@/composables/useFirebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue'),
    },

    {
      path: '/auth',
      component: () => import('../components/wrapper/Auth.vue'),
      children: [
        {
          path: 'login',
          component: () => import('../views/auth/Login.vue'),
          meta: { preventLoggedIn: true },
        },
        {
          path: 'register',
          component: () => import('../views/auth/Register.vue'),
        },
        {
          path: 'forgot-password',
          component: () => import('../views/auth/ForgotPassword.vue'),
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const { firebaseUser } = useFirebase()

  if (to.meta.shouldBeAuthenticated && !firebaseUser.value) {
    console.log('HACKER')
    next({ path: '/auth/login' })
  }
  // Prevent logged in users from accessing login and register pages
  // if (to.meta.preventLoggedIn && firebaseUser.value) {
  //   next({ path: '/' })
  // } 
  else {
    next()
  }
})

export default router

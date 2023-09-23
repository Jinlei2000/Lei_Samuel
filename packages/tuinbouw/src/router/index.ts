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
      component: () => import('../components/wrapper/AuthWrapper.vue'),
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
      path: '/employee',
      component: () => import('../components/wrapper/EmployeeWrapper.vue'),
      meta: { shouldBeAuthenticated: true },
      // role: ['employee'],
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/employee/Dashboard.vue'),
        },
        {
          path: 'profile',
          component: () => import('../views/employee/Profile.vue'),
        },
        {
          path: 'appointments',
          component: () => import('../views/employee/AllAppointments.vue'),
        },
        {
          path: 'appointment/:id',
          component: () => import('../views/employee/AppointmentDetail.vue'),
        },
      ],
    },

    {
      path: '/admin',
      component: () => import('../components/wrapper/AdminWrapper.vue'),
      meta: { shouldBeAuthenticated: true },
      // role: ['admin'],
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/admin/Dashboard.vue'),
        },
        {
          path: 'profile',
          component: () => import('../views/admin/Profile.vue'),
        },
        {
          path: 'appointments',
          component: () => import('../views/admin/AllAppointments.vue'),
        },
        {
          path: 'appointment/:id',
          component: () => import('../views/admin/AppointmentDetail.vue'),
        },
        {
          path: 'schedule-appointment',
          component: () => import('../views/admin/ScheduleAppointment.vue'),
        },
        {
          path: 'employees',
          component: () => import('../views/admin/Employees.vue'),
        },
        {
          path: 'employee/:id',
          component: () => import('../views/admin/Employee.vue'),
        },
        {
          path: 'clients',
          component: () => import('../views/admin/Clients.vue'),
        },
        {
          path: 'clients/:id',
          component: () => import('../views/admin/Client.vue'),
        },
      ],
    },

    {
      path: '/client',
      component: () => import('../components/wrapper/ClientWrapper.vue'),
      meta: { shouldBeAuthenticated: true },
      // role: ['client'],
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/client/Dashboard.vue'),
        },
        {
          path: 'profile',
          component: () => import('../views/client/Profile.vue'),
        },
        {
          path: 'make-appointment',
          component: () => import('../views/client/AddAppointment.vue'),
        },
        {
          path: 'appointments',
          component: () => import('../views/client/AllAppointments.vue'),
        },
        {
          path: 'appointment/:id',
          component: () => import('../views/client/AppointmentDetail.vue'),
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

// check if route requires auth
router.beforeEach(async (to, from, next) => {
  const { firebaseUser } = useFirebase()
  // Redirect to login page if not logged in and trying to access a restricted page
  if (to.meta.shouldBeAuthenticated && !firebaseUser.value) {
    next({ path: '/auth/login' })
  }
  // Prevent logged in users from accessing login and register pages
  if (to.meta.preventLoggedIn && firebaseUser.value) {
    next({ path: '/admin/dashboard' })
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import useFirebase from '@/composables/useFirebase'
import useCustomUser from '@/composables/useCustomUser'
import { Role } from '@/interfaces/custom.user.interface'

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
        {
          path: 'register-employee/:token',
          component: () => import('../views/auth/RegisterEmployee.vue'),
        },
      ],
    },

    {
      path: '/employee',
      component: () => import('../components/wrapper/EmployeeWrapper.vue'),
      meta: { shouldBeAuthenticated: true, role: Role.EMPLOYEE },
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/employee/Dashboard.vue'),
        },
        {
          path: 'materials',
          component: () => import('../views/employee/Materials.vue'),
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
      meta: { shouldBeAuthenticated: true, role: Role.ADMIN },
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
        {
          path: 'materials',
          component: () => import('../views/admin/Materials.vue'),
        },
        // {
        //   path: 'materials/:id',
        //   component: () => import('../views/admin/Material.vue'),
        // },
      ],
    },

    {
      path: '/client',
      component: () => import('../components/wrapper/ClientWrapper.vue'),
      meta: { shouldBeAuthenticated: true, role: Role.CLIENT },
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
      path: '/no-access',
      component: () => import('../views/NoAccess.vue'),
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
  const { customUser, getDashboardPathForRole } = useCustomUser()
  // Redirect to login page if not logged in and trying to access a restricted page
  if (to.meta.shouldBeAuthenticated && !firebaseUser.value) {
    next({ path: '/auth/login' })
  }

  // Check if user has role to access page
  if (to.meta.role && customUser.value?.role !== to.meta.role) {
    next({ path: '/no-access' })
  }

  // Prevent logged in users from accessing login and register pages
  if (to.meta.preventLoggedIn && firebaseUser.value) {
    // redirect to dashboard of user role
    next({ path: getDashboardPathForRole() })
  } else {
    next()
  }
})

export default router

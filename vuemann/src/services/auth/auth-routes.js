import Login from '@brugmann/vuemann/src/services/auth/views/LoginComponent.vue'

export const authRoutes =  [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      sidebar: false
    }
  }
]

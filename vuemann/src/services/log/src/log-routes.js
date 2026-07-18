import LogTest from '@brugmann/vuemann/src/services/log/views/LogTestComponent.vue'

export const logRoutes = [
  {
    path: '/log-test',
    name: 'log.test',
    component: LogTest,
    meta: {
      sidebar: false,
    },
  },
]

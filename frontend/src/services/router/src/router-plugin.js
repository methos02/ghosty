import { inject, hasInjectionContext } from 'vue'
import { ConfigLoader } from '@/config/config-loader.js'
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { routerFunctions } from '@/services/router/src/router-functions.js'
import { getAllRegisteredRoutes } from '@/services/services-routes-registry.js'
import { STATUS } from '@/constants/ajax-constants.js'

export const ROUTER_KEY = Symbol('router')

const state = {
  router: undefined,
}

const createAppRouter = ({ ssr = false } = {}) => {
  const router = createRouter({
    history: ssr ? createMemoryHistory() : createWebHistory(),
    routes: routerPluginInternal.buildRoutes(),
    scrollBehavior: routerPluginInternal.scrollBehavior,
  })

  router.afterEach(routerFunctions.afterEach)
  router.beforeEach(routerFunctions.beforeEach)

  state.router = router
  return router
}

const getRouter = () => {
  if (hasInjectionContext()) {
    return inject(ROUTER_KEY, state.router)
  }

  return state.router
}

export const routerPlugin = {
  createAppRouter,
  getRouter,
}

const buildRoutes = () => [
  ...ConfigLoader.find('routes', []),
  ...getAllRegisteredRoutes(),
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { statusCode: STATUS.NOT_FOUND },
  },
]

const scrollBehavior = (targetRoute, _previousRoute, savedPosition) => {
  if (targetRoute.hash) {
    return { el: targetRoute.hash, behavior: 'smooth' }
  }

  if (savedPosition) {
    return savedPosition
  }

  return { top: 0 }
}

export const routerPluginInternal = {
  buildRoutes,
  scrollBehavior,
}

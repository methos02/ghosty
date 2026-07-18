import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { createRouter, createWebHistory } from 'vue-router'
import { routerFunctions } from '@brugmann/vuemann/src/services/router/src/router-functions.js'
import { getAllRegisteredRoutes } from '@brugmann/vuemann/src/services/services-routes-registry.js'
import { flash } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

const state = {
  router: undefined,
}

export const routerPlugin = () => {
  if (state.router !== undefined) {
    return state.router
  }

  const routes = [
    ...ConfigLoader.find('routes', []),
    ...getAllRegisteredRoutes(),
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: failedRoute => {
        flash.errorT('error_url_unknown', { url: failedRoute.fullPath })
        return '/'
      },
    },
  ]

  state.router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(targetRoute, _previousRoute, savedPosition) {
      if (targetRoute.hash) {
        return { el: targetRoute.hash, behavior: 'smooth' }
      }

      if (savedPosition) {
        return savedPosition
      }

      return { top: 0 }
    },
  })

  state.router.afterEach(routerFunctions.afterEach)
  state.router.beforeEach(routerFunctions.beforeEach)

  return {
    install(app) {
      app.use(state.router)
    },
  }
}

export const getRouter = () => state.router

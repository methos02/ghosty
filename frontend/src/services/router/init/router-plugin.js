import { ConfigLoader } from '@/config/config-loader.js'
import { createRouter, createWebHistory } from "vue-router";
import { routerFunctions } from '@/services/router/src/router-functions.js';

let router
export const routerPlugin = () => {
    if(router !== undefined) { return router }
    
    const routes = [...ConfigLoader.get('routes', [])]

    router = createRouter({
        history: createWebHistory(),
        routes: routes,
        scrollBehavior (to, _from, savedPosition) {
          if (to.hash) {
            return { el: to.hash, behavior: 'smooth' }
          }

          if (savedPosition) { return savedPosition }

          return { top: 0 }
        }
    })

    router.afterEach(routerFunctions.afterEach)
    router.beforeEach(routerFunctions.beforeEach)

    return {
        install(app) {
            app.use(router)
        }
    }
}

export const getRouter = () => router

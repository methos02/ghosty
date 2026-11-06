import { createSSRApp } from 'vue'
import App from '@/App.vue'
import '@/assets/scss/app.scss'

import { servicesBoot } from '@/ssr/services-boot.js'
import { storeRegistry } from '@/ssr/store-registry.js'
import { localePlugin } from '@/services/locale/src/locale-plugin.js'
import { routerPlugin, ROUTER_KEY } from '@/services/router/src/router-plugin.js'
import { flashPlugin } from '@/services/flash/src/flash-plugin.js'
import { setClientAuthStore } from '@/services/auth/src/auth-store.js'

export const createApp = async ({ ssr = false, initialState } = {}) => {
  servicesBoot.bootServicesOnce()

  const app = createSSRApp(App)

  const stores = storeRegistry.createStores()
  storeRegistry.hydrateStores(stores, initialState)

  if (!ssr) {
    setClientAuthStore(stores.auth)
  }

  const router = routerPlugin.createAppRouter({ ssr })
  app.use(router)
  app.provide(ROUTER_KEY, router)

  storeRegistry.provideStores(app, stores)

  app.use(await localePlugin())
  app.use(flashPlugin())

  return {
    app,
    router,
    stores,
  }
}

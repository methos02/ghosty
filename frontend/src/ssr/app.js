import { createSSRApp } from 'vue'
import App from '@/App.vue'
import '@/assets/scss/app.scss'

import { servicesBoot } from '@/ssr/services-boot.js'
import { localePlugin } from '@/services/locale/src/locale-plugin.js'
import { routerPlugin, ROUTER_KEY } from '@/services/router/src/router-plugin.js'
import { flashPlugin } from '@/services/flash/src/flash-plugin.js'

import {
  createAuthStore,
  setClientAuthStore,
  AUTH_STORE_KEY,
} from '@/services/auth/src/auth-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createChapterStore, CHAPTER_STORE_KEY } from '@/apis/chapters/stores/chapter-store.js'
import {
  createNovelFilterStore,
  NOVEL_FILTER_STORE_KEY,
} from '@/apis/novels/stores/novel-filter-store.js'

export const createApp = async ({ ssr = false } = {}) => {
  servicesBoot.bootServicesOnce()

  const app = createSSRApp(App)

  const stores = {
    auth: createAuthStore(),
    novel: createNovelStore(),
    chapter: createChapterStore(),
    filter: createNovelFilterStore(),
  }

  if (!ssr) {
    setClientAuthStore(stores.auth)
  }

  const router = routerPlugin.createAppRouter({ ssr })
  app.use(router)
  app.provide(ROUTER_KEY, router)

  app.provide(AUTH_STORE_KEY, stores.auth)
  app.provide(NOVEL_STORE_KEY, stores.novel)
  app.provide(CHAPTER_STORE_KEY, stores.chapter)
  app.provide(NOVEL_FILTER_STORE_KEY, stores.filter)

  app.use(await localePlugin())
  app.use(flashPlugin())

  return {
    app,
    router,
    stores,
  }
}

export const serializeStores = stores => ({
  auth: stores.auth.serialize(),
  novel: stores.novel.serialize(),
  chapter: stores.chapter.serialize(),
  filter: stores.filter.serialize(),
})

export const hydrateStores = (stores, snapshot) => {
  if (!snapshot) {
    return
  }
  stores.auth.hydrate(snapshot.auth)
  stores.novel.hydrate(snapshot.novel)
  stores.chapter.hydrate(snapshot.chapter)
  stores.filter.hydrate(snapshot.filter)
}

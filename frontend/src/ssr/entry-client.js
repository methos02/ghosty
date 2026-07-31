import { createHead } from '@unhead/vue/client'
import { createApp, hydrateStores } from '@/ssr/app.js'
import { auth } from '@/services/shortcuts/services-shortcut.js'

const { app, router, stores } = await createApp()

const head = createHead()
app.use(head)

hydrateStores(stores, globalThis.__INITIAL_STATE__)

await router.isReady()
app.mount('#app')

// @see backend/memory-bank/decisions/ADR-06-rendu-ssr-authentifie.md
if (!stores.auth.isAuthenticated.value) {
  await auth.fetchCurrentUser()
}

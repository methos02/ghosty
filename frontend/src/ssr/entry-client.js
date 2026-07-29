import { createHead } from '@unhead/vue/client'
import { createApp, hydrateStores } from '@/ssr/app.js'

const { app, router, stores } = await createApp()

const head = createHead()
app.use(head)

hydrateStores(stores, globalThis.__INITIAL_STATE__)

await router.isReady()
app.mount('#app')

import { createHead } from '@unhead/vue/client'
import { createApp } from '@/ssr/app.js'
import { auth } from '@/services/shortcuts/services-shortcut.js'

const { app, router, stores } = await createApp({ initialState: globalThis.__INITIAL_STATE__ })

const head = createHead()
app.use(head)

await router.isReady()
app.mount('#app')

if (!stores.auth.isAuthenticated.value) {
  await auth.fetchCurrentUser()
}

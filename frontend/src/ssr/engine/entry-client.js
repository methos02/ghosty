import { createHead } from '@unhead/vue/client'
import { clientApp } from '@/ssr/client-app.js'

const { app, stores } = await clientApp.prepare(globalThis.__INITIAL_STATE__)

app.use(createHead())
app.mount('#app')

await clientApp.restoreSession(stores)

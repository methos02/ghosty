import { createApp } from '@/ssr/app.js'
import { auth } from '@/services/shortcuts/services-shortcut.js'

const prepare = async initialState => {
  const { app, router, stores } = await createApp({ initialState })

  await router.isReady()

  return {
    app,
    stores,
  }
}

const restoreSession = async stores => {
  if (stores.auth.isAuthenticated.value) {
    return
  }

  await auth.fetchCurrentUser()
}

export const clientApp = {
  prepare,
  restoreSession,
}

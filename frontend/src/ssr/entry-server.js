import { createHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer'
import { createApp, serializeStores } from '@/ssr/app.js'
import { authFunctions } from '@/services/auth/src/auth-functions.js'
import { log } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'

const runRestoreSession = async (stores, cookie) => {
  const { status } = await authFunctions.restoreSession(stores.auth, cookie)

  if (status >= STATUS.ERROR_SERVER) {
    log.error('[SSR] restoreSession', status)
  }
}

const runRecordAsyncData = async (record, route, stores) => {
  const asyncData = record.meta?.asyncData
  if (typeof asyncData !== 'function') {
    return {}
  }

  try {
    return (await asyncData({ stores, route })) ?? {}
  } catch (error) {
    if (import.meta.env.DEV) {
      throw error
    }

    log.error(`[SSR] asyncData a échoué (${route.fullPath}) :`, error)
    return {}
  }
}

const runAsyncData = async (route, stores) => {
  let statusCode = route.meta?.statusCode ?? STATUS.SUCCESS

  for (const record of route.matched) {
    const { statusCode: recordStatus } = await runRecordAsyncData(record, route, stores)
    if (!recordStatus) {
      continue
    }

    if (recordStatus >= STATUS.ERROR_SERVER) {
      log.error('[SSR] asyncData', route.fullPath, recordStatus)
      continue
    }

    statusCode = recordStatus
  }

  return statusCode
}

export const render = async (url, { cookie } = {}) => {
  const { app, router, stores } = await createApp({ ssr: true })

  const head = createHead()
  app.use(head)

  await runRestoreSession(stores, cookie)

  await router.push(url)
  await router.isReady()

  const route = router.currentRoute.value

  const statusCode = await runAsyncData(route, stores)

  try {
    const html = await renderToString(app)
    return {
      html,
      head,
      state: serializeStores(stores),
      statusCode,
    }
  } catch (error) {
    log.error('[SSR] renderToString a échoué, fallback client :', error)
    return {
      html: '',
      head,
      state: serializeStores(stores),
      statusCode: STATUS.SUCCESS,
    }
  }
}

import { createApp } from '@/ssr/app.js'
import { authFunctions } from '@/services/auth/src/auth-functions.js'
import { log } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'

const restoreSession = async (stores, cookie) => {
  const { status } = await authFunctions.restoreSession(stores.auth, cookie)

  if (status >= STATUS.ERROR_SERVER) {
    log.error('[SSR] restoreSession', status)
  }
}

const runAsyncData = async context => {
  const { route } = context
  let statusCode = route.meta?.statusCode ?? STATUS.SUCCESS

  for (const record of route.matched) {
    const { statusCode: recordStatus } = await runRecordAsyncData(record, context)
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

const runRecordAsyncData = async (record, context) => {
  const asyncData = record.meta?.asyncData
  if (typeof asyncData !== 'function') {
    return {}
  }

  try {
    return (await asyncData(context)) ?? {}
  } catch (error) {
    if (import.meta.env.DEV) {
      throw error
    }

    log.error(`[SSR] asyncData a échoué (${context.route.fullPath}) :`, error)
    return {}
  }
}

const prepare = async (url, { cookie } = {}) => {
  const { app, router, stores } = await createApp({ ssr: true })

  await restoreSession(stores, cookie)

  await router.push(url)
  await router.isReady()

  const route = router.currentRoute.value
  if (route.redirectedFrom) {
    return { redirect: route.fullPath }
  }

  const statusCode = await runAsyncData({
    stores,
    route,
    cookie,
  })

  return {
    app,
    stores,
    statusCode,
  }
}

export const serverApp = {
  prepare,
}

import { createHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer'
import { serverApp } from '@/ssr/server-app.js'
import { storeRegistry } from '@/ssr/store-registry.js'
import { log } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'

export const render = async (url, { cookie } = {}) => {
  const prepared = await serverApp.prepare(url, { cookie })
  if (prepared.redirect) {
    return { redirect: prepared.redirect }
  }

  const head = createHead()
  prepared.app.use(head)

  try {
    const html = await renderToString(prepared.app)
    return {
      html,
      head,
      state: storeRegistry.serializeStores(prepared.stores),
      statusCode: prepared.statusCode,
    }
  } catch (error) {
    log.error('[SSR] renderToString a échoué, fallback client :', error)
    return {
      html: '',
      head,
      state: storeRegistry.serializeStores(prepared.stores),
      statusCode: STATUS.SUCCESS,
    }
  }
}

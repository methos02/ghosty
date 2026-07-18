import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { auth } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { tabsHelper } from '@brugmann/vuemann/src/helpers/tabs-helper.js'

const toCreate = (error, context = {}) => {
  const dto = {
    date: new Date().toISOString(),
    app: ConfigLoader.get('app.name'),
    version: ConfigLoader.get('app.version'),
    user: auth.username(),
  }

  const currentTabSessionId = tabsHelper.tabSessionId()
  if (currentTabSessionId) {
    dto.tabSessionId = currentTabSessionId
  }

  dto.message = typeof error === 'string' ? error : error.message || JSON.stringify(error)
  Object.assign(dto, context)
  dto.stack = error && error.stack ? error.stack : undefined

  return dto
}

export const LogDto = {
  toCreate,
}

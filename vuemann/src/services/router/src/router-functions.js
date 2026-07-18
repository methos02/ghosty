import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { auth, flash, t } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { utilsH } from '@brugmann/vuemann/src/helpers/utils-helper.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'

const DOCUMENTATION_PREFIX = '/documentation'

const afterEach = to => {
  const appTitle = t(ConfigLoader.get('app.title'))
  const routeTitle = to.meta?.title

  document.title = routeTitle ? `${t(routeTitle)} - ${appTitle}` : appTitle
}

const beforeEach = async (to, _from) => {
  if (to.name === 'error') {
    return true
  }

  if (routerFunctionsInternal.isDocumentationBlocked(to)) {
    servicesM.service('router:setUrlIntented', [to.fullPath])
    await servicesM.service('auth:login')
    return false
  }

  if (to.meta?.roles === undefined || to.meta.roles.length === 0) {
    return true
  }

  await servicesM.service('auth:routesAuthCheck')

  const hasAccess = to.meta.roles.some(role => auth.hasRole(role))
  if (!hasAccess) {
    flash.warningT('access_denied')
    return '/'
  }

  return true
}

export const routerFunctions = {
  afterEach,
  beforeEach,
}

const isDocumentationBlocked = to => {
  return (
    to.path.startsWith(DOCUMENTATION_PREFIX) &&
    auth.requiresAuth() &&
    !utilsH.isVuemann() &&
    !auth.isAuthenticated()
  )
}

export const routerFunctionsInternal = { isDocumentationBlocked }

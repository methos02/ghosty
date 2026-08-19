import { servicesM } from '@/services/services-manager.js'
import { auth, flash, t } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { utilsH } from '@/core/helpers/utils-helper.js'
import { useAuth } from '@/services/auth/src/use-auth.js'

const DOCUMENTATION_PREFIX = '/documentation'

const afterEach = to => {
  if (utilsH.isSsr()) {
    return
  }

  const appTitle = ConfigLoader.get('app.title')
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

  if (routerFunctionsInternal.isAuthBlocked(to)) {
    return routerFunctionsInternal.askForLogin(to)
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
  return to.path.startsWith(DOCUMENTATION_PREFIX) && auth.requiresAuth() && !auth.isAuthenticated()
}

const isAuthBlocked = to => {
  return to.meta?.requiresAuth === true && !auth.isAuthenticated()
}

const askForLogin = to => {
  if (utilsH.isSsr()) {
    return '/'
  }

  servicesM.service('router:setUrlIntented', [to.fullPath])
  useAuth().openLoginDialog()

  return false
}

export const routerFunctionsInternal = {
  isDocumentationBlocked,
  isAuthBlocked,
  askForLogin,
}

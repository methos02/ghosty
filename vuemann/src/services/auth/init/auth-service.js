import { authRepository } from '@brugmann/vuemann/src/services/auth/src/repositories/auth-repository.js'
import { authFunctions } from '@brugmann/vuemann/src/services/auth/src/auth-functions.js'
import { router } from '@brugmann/vuemann/src/services/services-helper.js'
import { flash } from '@brugmann/vuemann/src/services/services-helper.js'
import { currentUser } from '@brugmann/vuemann/src/services/auth/src/models/current-user.js'
import { apiToken } from '@brugmann/vuemann/src/services/auth/src/models/api-token.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { rolesManager } from '@brugmann/vuemann/src/services/auth/src/models/roles-manager.js'

const routesAuthCheck = async apis => {
  for(const api of apisDefine(apis)) {
    if(!await routeAuthCheck(api)) { return false }
  }

  return true
}

const routeAuthCheck = async api => {
  if(ConfigLoader.get('app.auth') === false) { return true }
  if(ConfigLoader.get(`app.apis.${api}`) === undefined) { return authFunctions.generateError(`unknown_api:api=${api}`) }
  if(apiToken.getAccessToken(api) === null || !currentUser.has()) { return authFunctions.generateError('access_error') }

  const response_verify = await authRepository.verifyToken(api)
  if(response_verify.status === STATUS.SUCCESS) {
    currentUser.init() 
    await rolesManager.initUserRoles(currentUser.get())
    return true
  }
  
  if(response_verify.status !== STATUS.UNAUTHORIZED) { return false }

  const response_refresh = await refreshToken(api, response_verify)
  return response_refresh.status === STATUS.SUCCESS ? true : authFunctions.generateError('refresh_error')  
}

const refreshToken = async (api, response) => {
  if (! authFunctions.canRefreshToken(response) || apiToken.getRefreshToken(api) === null) { return { status : response.status }}

  const response_refresh = await authRepository.refreshToken(apiToken.getRefreshToken(api), api)
  if (response_refresh.status !== STATUS.SUCCESS) { return response_refresh }

  apiToken.setAccessToken(api, response_refresh.data.access_token)
  currentUser.init()
  return { status: response_refresh.status, access_token: response_refresh.data.access_token }
}

const logout = () => {
  apiToken.removeApisTokens()
  currentUser.remove()
  rolesManager.remove()
  router.push({ name: 'login' })
  
  document.dispatchEvent( new CustomEvent('logout'));

  flash.successT('logout')
}

export const authService = { 
  refreshToken, 
  routesAuthCheck, 
  routeAuthCheck,
  logout, 
  currentUser : currentUser.get,
  hasRole : rolesManager.hasUserRole,
  getAccessToken : apiToken.getAccessToken
}

const apisDefine = apis => {
  if(Array.isArray(apis)) { return apis }
  if(apis.includes('|')) { return apis.split('|') }
  return [apis]
}
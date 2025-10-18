
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { authRepository } from '@brugmann/vuemann/src/services/auth/src/repositories/auth-repository.js'
import { useAuthStore } from '@brugmann/vuemann/src/services/auth/auth-store.js'
import { currentUser } from './models/current-user.js'
import { apiToken } from './models/api-token.js'
import { STATUS } from '../../ajax/ajax-constants.js'
import { rolesManager } from './models/roles-manager.js'

const login = async (username, password) => {
    if (!username || !password) { return authFunctionsInternal.generateError('login_error_credentials') }
    
    const apis = Object.entries(ConfigLoader.get('app.apis'))
    .filter(api => api[1].auth === true)
    .map(([api_name, api]) => { return { ...api, name : api_name }})

    for (const api of apis) { 
        if(api.auth === undefined) { continue }
        if(!await authFunctionsInternal.loginApi(api, username, password)) { return false }
    }

    currentUser.set(username)
    await rolesManager.initUserRoles(username)
    
    document.dispatchEvent(new CustomEvent('login-success', {  bubbles: true }))
    
    return true
}

const canRefreshToken = response => {
    return response.status === STATUS.UNAUTHORIZED 
    && response.data?.detail !== undefined 
    && typeof response.data.detail === "string" 
    && response.data.detail.includes('expired')
}

const generateError = error_key => {
    const authStore = useAuthStore()
    authStore.errorAuth = error_key
    apiToken.removeApisTokens()
    currentUser.remove()
    rolesManager.remove()
    return false
}

export const authFunctions = { login, generateError, canRefreshToken }

const loginApi = async (api, username, password) => {
    if((!api.username && api.password) || (api.username && !api.password)) { return authFunctionsInternal.generateError(`login_error_api_credentials|api_name:${api.name}`) }

    const response = await authRepository.getToken(api.username ?? username, api.password ?? password, api.name)
    if (response.status !== STATUS.SUCCESS){ return authFunctionsInternal.generateError('login_error_token')}

    apiToken.setTokens(api.name, response.data.access_token, response.data.refresh_token)
    return true
}

export const authFunctionsInternal = { loginApi, generateError }

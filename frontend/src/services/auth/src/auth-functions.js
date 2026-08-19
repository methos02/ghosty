import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { AUTH_SESSION_COOKIE } from '@/constants/auth-constants.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { cookieHelper } from '@/core/helpers/cookie-helper.js'
import { useAuthStore } from './auth-store.js'

const login = async datas => {
  const response = await AuthController.login(datas)

  if (response.status !== STATUS.SUCCESS) {
    return { status: STATUS.ERROR, error: response.error }
  }

  useAuthStore().setUser(response.user)
  return { status: STATUS.SUCCESS, user: response.user }
}

const register = async datas => {
  const response = await AuthController.register(datas)

  if (response.status !== STATUS.SUCCESS) {
    return { status: STATUS.ERROR, error: response.error }
  }

  useAuthStore().setUser(response.user)
  return { status: STATUS.SUCCESS, user: response.user }
}

const logout = async () => {
  const response = await AuthController.logout()
  useAuthStore().clear()
  return response
}

const fetchCurrentUser = async () => {
  if (!cookieHelper.has(AUTH_SESSION_COOKIE)) {
    return
  }

  const store = useAuthStore()
  const response = await AuthController.me()

  if (response.status !== STATUS.SUCCESS) {
    store.clear()
    return
  }

  store.setUser(response.user)
}

const restoreSession = async (store, cookieHeader) => {
  if (!cookieHeader?.includes(`${AUTH_SESSION_COOKIE}=`)) {
    return { status: STATUS.SUCCESS }
  }

  const response = await AuthController.me({ headers: { Cookie: cookieHeader } })

  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  store.setUser(response.user)
  return { status: STATUS.SUCCESS }
}

const getCurrentUser = () => {
  return useAuthStore().getCurrentUser()
}

const isAuthenticated = () => {
  return useAuthStore().isAuthenticated.value
}

const hasRole = role => {
  return useAuthStore().hasRole(role)
}

export const authFunctions = {
  login,
  register,
  logout,
  fetchCurrentUser,
  restoreSession,
  getCurrentUser,
  isAuthenticated,
  hasRole,
}

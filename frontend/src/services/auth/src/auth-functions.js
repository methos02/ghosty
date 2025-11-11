import { AuthController } from '@/apis/ghosty/controllers/auth-controller.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'
import { authStore } from './auth-store.js'

const login = async (datas) => {
  const response = await AuthController.login(datas)

  if (response.status !== STATUS.SUCCESS) {
    return { status: STATUS.ERROR, error: response.error }
  }

  authStore.setUser(response.user)
  authStore.setToken(response.token)
  return { status: STATUS.SUCCESS, user: response.user }
}

const register = async (datas) => {
  const response = await AuthController.register(datas)

  if (response.status !== STATUS.SUCCESS) {
    return { status: STATUS.ERROR, error: response.error }
  }

  authStore.setUser(response.user)
  authStore.setToken(response.token)
  return { status: STATUS.SUCCESS, user: response.user }
}

const logout = async () => {
  const response = await AuthController.logout()
  authStore.clear()
  return response
}

const fetchCurrentUser = async () => {
  if (!authStore.token.value) {
    return
  }

  const response = await AuthController.me()

  if (response.status !== STATUS.SUCCESS) {
    authStore.clear()
    return
  }

  authStore.setUser(response.user)
}

const getCurrentUser = () => {
  return authStore.user.value
}

const isAuthenticated = () => {
  return authStore.isAuthenticated.value
}

const hasRole = (role) => {
  return authStore.hasRole(role)
}

export const authFunctions = {
  login,
  register,
  logout,
  fetchCurrentUser,
  getCurrentUser,
  isAuthenticated,
  hasRole
}

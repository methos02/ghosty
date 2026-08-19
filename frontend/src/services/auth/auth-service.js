import { authFunctions } from '@/services/auth/src/auth-functions.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { STATUS } from '@/constants/ajax-constants.js'

const authDialogs = useAuth()

const isApiSkipped = () => false
const refreshToken = async () => ({ status: STATUS.UNAUTHORIZED })

const routesAuthCheck = async () => {
  if (!authFunctions.isAuthenticated()) {
    await authFunctions.fetchCurrentUser()
  }

  return { status: STATUS.SUCCESS }
}

export const authService = {
  login: authFunctions.login,
  register: authFunctions.register,
  logout: authFunctions.logout,
  getCurrentUser: authFunctions.getCurrentUser,
  isAuthenticated: authFunctions.isAuthenticated,
  hasRole: authFunctions.hasRole,
  fetchCurrentUser: authFunctions.fetchCurrentUser,
  isApiSkipped,
  refreshToken,
  routesAuthCheck,
  showLoginDialog: authDialogs.openLoginDialog,
  showRegisterDialog: authDialogs.openRegisterDialog,
  openLoginDialog: authDialogs.openLoginDialog,
  openRegisterDialog: authDialogs.openRegisterDialog,
  closeDialogs: authDialogs.closeDialogs,
}

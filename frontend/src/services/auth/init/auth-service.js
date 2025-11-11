import { authFunctions } from '../src/auth-functions.js'
import { authStore } from '../src/auth-store.js'

export const authService = {
  login: authFunctions.login,
  register: authFunctions.register,
  logout: authFunctions.logout,
  getCurrentUser: authFunctions.getCurrentUser,
  isAuthenticated: authFunctions.isAuthenticated,
  hasRole: authFunctions.hasRole,
  fetchCurrentUser: authFunctions.fetchCurrentUser,
  showLoginDialog: authStore.showLoginDialog,
  showRegisterDialog: authStore.showRegisterDialog,
  openLoginDialog: authStore.openLoginDialog,
  openRegisterDialog: authStore.openRegisterDialog,
  closeDialogs: authStore.closeDialogs
}

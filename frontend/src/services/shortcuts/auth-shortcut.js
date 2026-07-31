import { servicesM } from '@/services/services-manager.js'

export const auth = {
  user: () => servicesM.service('auth:getCurrentUser'),
  isAuthenticated: () => servicesM.service('auth:isAuthenticated'),
  isApiSkipped: apiName => servicesM.service('auth:isApiSkipped', apiName),
  hasRole: roleName => servicesM.service('auth:hasRole', roleName),
  login: datas => servicesM.service('auth:login', [datas]),
  register: datas => servicesM.service('auth:register', [datas]),
  logout: () => servicesM.service('auth:logout'),
  fetchCurrentUser: () => servicesM.service('auth:fetchCurrentUser'),
  showLoginDialog: () => servicesM.service('auth:showLoginDialog'),
  showRegisterDialog: () => servicesM.service('auth:showRegisterDialog'),
  openLoginDialog: () => servicesM.service('auth:openLoginDialog'),
  openRegisterDialog: () => servicesM.service('auth:openRegisterDialog'),
  closeDialogs: () => servicesM.service('auth:closeDialogs'),
}

export { useAuthStore } from '@/services/auth/src/auth-store.js'

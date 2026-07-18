import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'

const _store = () => servicesStores.get('auth')

export const authStore = {
  // refs
  get username() {
    return _store().username
  },
  get password() {
    return _store().password
  },
  get errorAuth() {
    return _store().errorAuth
  },
  get currentUser() {
    return _store().currentUser
  },
  get currentUserRoles() {
    return _store().currentUserRoles
  },
  get currentUserGroups() {
    return _store().currentUserGroups
  },
  get isAuthenticated() {
    return _store().isAuthenticated
  },
  // methods
  get setCurrentUser() {
    return _store().authStore.setCurrentUser
  },
  get getCurrentUser() {
    return _store().authStore.getCurrentUser
  },
  get removeCurrentUser() {
    return _store().authStore.removeCurrentUser
  },
  get setCurrentUserRoles() {
    return _store().authStore.setCurrentUserRoles
  },
  get getCurrentUserRoles() {
    return _store().authStore.getCurrentUserRoles
  },
  get setCurrentUserGroups() {
    return _store().authStore.setCurrentUserGroups
  },
  get getCurrentUserGroups() {
    return _store().authStore.getCurrentUserGroups
  },
  get hasRole() {
    return _store().authStore.hasRole
  },
  get setAuthenticated() {
    return _store().authStore.setAuthenticated
  },
}

export const auth = {
  currentUserGroups: () => _store().authStore.getCurrentUserGroups(),
  hasRole: roleName => _store().authStore.hasRole(roleName),
  isApiSkipped: apiName => servicesM.service('auth:isApiSkipped', apiName),
  isAuthenticated: () => _store().authStore.isAuthenticated(),
  requiresAuth: () => servicesM.service('auth:requiresAuth'),
  username: () => _store().authStore.getCurrentUser(),
}
